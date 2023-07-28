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
  const { type, id, data } = req.body;

  console.log(req.body);

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

    // "test" command
    if (name === "test") {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: "hello world",
        },
      });
    }
  }

  return res.status(500).send("Sever error");
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
