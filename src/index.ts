import "dotenv/config";
import express from "express";
import { VerifyDiscordRequest, getDiscordRequestInfo } from "./discord_utils";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import { getSecrets } from "./secrets";
import { logInfo } from "./logging";
import { fishingCommand } from "./commands/fish";
import { getCatches } from "./commands/catches";

const PORT = process.env.PORT || 3000;
const VERSION = process.env.GAE_VERSION || "local";

const app = express();

async function startApp() {
  const secrets = await getSecrets();

  app.get("/test", (_, res) => {
    res
      .json({
        message: "Ok",
        version: VERSION,
      })
      .send();
  });

  app.use(
    express.json({
      verify: VerifyDiscordRequest(secrets.DISCORD_PUBLIC_KEY),
    })
  );

  app.post("/interactions", async function (req, res) {
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
        return getCatches(discordInfo.username, req, res);
      }
    }

    logInfo({ msg: "Bad intreactions requst" });
    return res.status(404).send("Command not found.");
  });

  app.listen(PORT, () => {
    console.log("Version started:", VERSION);
    console.log("Listening on port", PORT);
  });
}

startApp();
