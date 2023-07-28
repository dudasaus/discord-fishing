import "dotenv/config";
import express from "express";
import { VerifyDiscordRequest } from "./utils.js";
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from "discord-interactions";

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/test", (_, res) => {
  res
    .json({
      message: "Ok",
    })
    .send();
});

app.use(
  express.json({ verify: VerifyDiscordRequest(process.env.DISCORD_PUBLIC_KEY) })
);

app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data, member } = req.body;
  const user = member.user;

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

    if (name === "fish") {
      const username = user.global_name;
      const content = `${username} went fishing and caught... ${getFish()}`;
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content,
        },
      });
    }
  }

  return res.status(404).send("Command not found.");
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});

function getFish() {
  const fish = ["🐟", "🐠", "🐡", "🦈", "🦐", "🦀", "🦞", "🐬", "🐋"];
  return fish[Math.floor(Math.random() * fish.length)];
}
