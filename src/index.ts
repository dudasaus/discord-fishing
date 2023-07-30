import "dotenv/config";
import express from "express";
import { VerifyDiscordRequest } from "./discord_utils";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import { getSecrets } from "./secrets";
import { logInfo } from "./logging";
import { Firestore } from "@google-cloud/firestore";
import { timeUntilTomorrow, today } from "./date_utils";

const PORT = process.env.PORT || 3000;
const VERSION = process.env.GAE_VERSION || "local";
const CATCHES_COLLECTION = process.env.GAE_APPLICATION
  ? "prod-catches"
  : "dev-catches";

const app = express();
const firestore = new Firestore({
  projectId: "discord-fishing",
});

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
    // Interaction type and data
    const { type, data, member } = req.body;
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
      const { name } = data;
      const user = member.user;
      const displayName = member.nick || user.global_name || user.username;

      // Don't let the homies hit dev.
      if (!process.env.GAE_APPLICATION && user.username != "chillydudas") {
        return res.status(400).send("Go away");
      }

      const matchName = (actual: string, expected: string) => {
        return actual == expected || actual == `dev-${expected}`;
      };

      if (matchName(name, "fish")) {
        const canFish = await checkLimit(user.username);
        if (!canFish.allowed) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: canFish.message,
            },
          });
        }

        const fish = getFish();
        const content = `${displayName} went fishing and caught... ${fish}`;
        logInfo({
          action: "fishing",
          username: user.username,
          fish,
        });

        recordCatch(user.username, fish).catch((err) => {
          console.error("Error recording catch in db", err);
        });

        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content,
          },
        });
      }

      if (matchName(name, "catches")) {
        return getCatches(user.username, req, res);
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

async function checkLimit(username: string) {
  const snapshot = await firestore
    .collection(CATCHES_COLLECTION)
    .where("timestamp", ">", today())
    .where("username", "==", username)
    .count()
    .get();
  if (snapshot.data().count) {
    return {
      allowed: false,
      message: `You already fished today! You can fish again in ${timeUntilTomorrow()}`,
    };
  }
  return {
    allowed: true,
  };
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