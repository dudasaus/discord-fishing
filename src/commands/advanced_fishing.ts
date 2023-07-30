import { InteractionResponseType } from "discord-interactions";
import express from "express";
import { goFishing } from "../fish";
import { formatFish } from "../format_utils";
import { DiscordRequestInfo } from "../discord_utils";
import { recordCatch } from "../firestore";

export function advancedFishingCommand(
  _req: express.Request,
  res: express.Response,
  info: DiscordRequestInfo
) {
  const fish = goFishing();
  let content = `${info.displayName} went fishing and caught...\n`;
  content += formatFish(fish);

  // Save the catch in the database.
  recordCatch(info.username, info.guildId, fish).catch((err) => {
    console.error(err);
  });

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content,
    },
  });
}
