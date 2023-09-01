import "dotenv/config";
import express from "express";
import { VerifyDiscordRequest, getDiscordRequestInfo } from "./discord_utils";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import { getSecrets } from "./secrets";
import { logInfo } from "./logging";
import { fishingCommand } from "./commands/fish";
import { getCatches } from "./commands/catches";
import { serverSizeLeaderboard } from "./commands/server_size_leaderboard";
import { globalSizeLeaderboard } from "./commands/global_size_leaderboard";
import { testDropRates } from "./fish";
import { getGlobalLeaderboard } from "./firestore";

const PORT = process.env.PORT || 3000;
const VERSION = process.env.GAE_VERSION || "local";

const app = express();

async function startApp() {
  const secrets = await getSecrets();

  app.get("/test", (_, res) => {
    res.json({
      message: "Ok",
      version: VERSION,
    });
  });

  app.get("/droprates/:numSims", (req, res) => {
    const numSims = Math.floor(Number(req.params.numSims));
    if (isNaN(numSims) || numSims < 1 || numSims > 10000) {
      return res.status(400).send("numSims must be a number in [1, 10000]");
    }
    res.json(testDropRates(numSims));
  });

  app.get("/api/leaderboard", async (req, res) => {
    const querySize = Math.floor(Number(req.query.size));
    const validQuerySize =
      !isNaN(querySize) && querySize > 0 && querySize <= 100;
    const size = validQuerySize ? querySize : 50;
    try {
      const globalLeaderboard = await getGlobalLeaderboard(size);
      return res.json(globalLeaderboard);
    } catch (_err) {
      res.status(500).send("Error loading leaderboard");
    }
  });

  app.use("/", express.static("./serverDist/static"));

  const verifyDiscordRequestMiddleware = express.json({
    verify: VerifyDiscordRequest(secrets.DISCORD_PUBLIC_KEY),
  });

  app.post(
    "/interactions",
    verifyDiscordRequestMiddleware,
    async function (req, res) {
      // Interaction type.
      const { type } = req.body;
      /**
       * Handle verification requests
       */
      if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
      }

      /**
       * Handle slash command requests
       * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
       */
      if (type === InteractionType.APPLICATION_COMMAND) {
        const discordInfo = getDiscordRequestInfo(req);

        // Don't let the homies hit dev.
        if (
          !process.env.GAE_APPLICATION &&
          discordInfo.username != "chillydudas"
        ) {
          console.log(discordInfo.username, "tried to hit dev.");
          return res.status(400).send("Go away");
        }

        const matchName = (actual: string, expected: string) => {
          return actual == expected || actual == `dev-${expected}`;
        };

        if (matchName(discordInfo.commandName, "fish")) {
          return fishingCommand(req, res, discordInfo);
        }

        if (matchName(discordInfo.commandName, "catches")) {
          return getCatches(discordInfo.userId, req, res);
        }

        if (matchName(discordInfo.commandName, "fishing-leaderboard")) {
          const leaderboard = discordInfo.options["leaderboard"];
          if (!leaderboard) {
            return res.status(400).send("Missing leaderboard options");
          }
          if (leaderboard === "server") {
            return serverSizeLeaderboard(req, res, discordInfo);
          }
          if (leaderboard === "global") {
            return globalSizeLeaderboard(req, res, discordInfo);
          }
          return res.status(400).send("Invalid leaderboard option");
        }

        if (matchName(discordInfo.commandName, "server-fishing-leaderboard")) {
          return serverSizeLeaderboard(req, res, discordInfo);
        }

        if (matchName(discordInfo.commandName, "global-fishing-leaderboard")) {
          return globalSizeLeaderboard(req, res, discordInfo);
        }
      }

      logInfo({ msg: "Bad intreactions request" });
      return res.status(404).send("Command not found.");
    }
  );

  app.all("*", (_req, res) => {
    return res.status(404).send("Not found");
  });

  app.listen(PORT, () => {
    console.log("Version started:", VERSION);
    console.log("Listening on port", PORT);
  });
}

startApp();
