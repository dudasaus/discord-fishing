import "dotenv/config";
import express from "express";
import { VerifyDiscordRequest, getDiscordRequestInfo } from "./discord_utils";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import { getSecrets } from "./secrets";
import { logInfo } from "./logging";
import { timeUntilTomorrow, today } from "./date_utils";
import { advancedFishingCommand } from "./commands/advanced_fishing";
import { firestore, CATCHES_COLLECTION, canYouFishRightNow } from "./firestore";

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
        const canFish = await canYouFishRightNow(discordInfo.username);
        if (!canFish.allowed) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: canFish.message,
            },
          });
        }

        const fish = getFish();
        const content = `${discordInfo.displayName} went fishing and caught... ${fish}`;
        logInfo({
          action: "fishing",
          username: discordInfo.username,
          fish,
        });

        recordCatch(discordInfo.username, fish).catch((err) => {
          console.error("Error recording catch in db", err);
        });

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content,
          },
        });
      }

      if (matchName(discordInfo.commandName, "catches")) {
        return getCatches(discordInfo.username, req, res);
      }

      if (matchName(discordInfo.commandName, "advanced-fish")) {
        return advancedFishingCommand(req, res, discordInfo);
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

function getFish() {
  const fish = ["🐟", "🐠", "🐡", "🦈", "🦐", "🦀", "🦞", "🐬", "🐋"];
  return fish[Math.floor(Math.random() * fish.length)];
}

async function recordCatch(username: string, fish: string) {
  const doc = firestore.collection(CATCHES_COLLECTION).doc();
  await doc.set({
    username,
    fish,
    timestamp: Date.now(),
  });
}

async function getCatches(
  username: string,
  _req: express.Request,
  res: express.Response
) {
  const snapshot = await firestore
    .collection(CATCHES_COLLECTION)
    .where("username", "==", username)
    .orderBy("timestamp", "asc")
    .get();

  // No fish!
  if (snapshot.size == 0) {
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "You don't have any fish! Try `/fish`.",
      },
    });
  } else {
    let catches: Array<{ fish: string; timestamp: string }> = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const date = new Date(data.timestamp);
      catches.push({
        fish: data.fish,
        timestamp: date.toLocaleString(),
      });
    });
    let content = `Your catches:`;
    for (let i = catches.length - 1; i >= 0; i--) {
      const myCatch = catches[i];
      content += `\n${myCatch.fish} - ${myCatch.timestamp}`;
    }
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content,
      },
    });
  }
}

startApp();
