import "dotenv/config";
import express from "express";
import { VerifyDiscordRequest } from "./utils.js";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import { getSecrets } from "./secrets.js";
import { logInfo } from "./logging.js";

const PORT = process.env.PORT || 3000;

const app = express();

async function startApp() {
  const secrets = await getSecrets();

  app.get("/test", (_, res) => {
    res
      .json({
        message: "Ok",
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
    const { type, id, data, member } = req.body;
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

      if (name === "fish") {
        const username = user.global_name;
        const fish = getFish();
        const content = `${username} went fishing and caught... ${fish}`;
        logInfo({
          action: "fishing",
          username,
          fish,
        });
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content,
          },
        });
      }
    }

    logInfo({ msg: "Bad intreactions requst" });
    return res.status(404).send("Command not found.");
  });

  app.listen(PORT, () => {
    console.log("Listening on port", PORT);
  });
}

function getFish() {
  const fish = ["🐟", "🐠", "🐡", "🦈", "🦐", "🦀", "🦞", "🐬", "🐋"];
  return fish[Math.floor(Math.random() * fish.length)];
}

startApp();
