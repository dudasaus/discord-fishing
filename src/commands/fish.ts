import { InteractionResponseType } from "discord-interactions";
import express from "express";
import { goFishing } from "../fish";
import { formatFish } from "../format_utils";
import { DiscordRequestInfo } from "../discord_utils";
import { canYouFishRightNow, recordCatch } from "../firestore";

export async function fishingCommand(
  _req: express.Request,
  res: express.Response,
  info: DiscordRequestInfo
) {
  // Check if the player is allowed to fish.
  const wellCanYou = await canYouFishRightNow(info.userId);
  if (!wellCanYou.allowed) {
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: wellCanYou.message,
      },
    });
  }

  // Go fishing.
  const fish = goFishing();
  let content = `${info.displayName} went fishing and caught...\n`;
  content += formatFish(fish);

  // Save the catch in the database.
  recordCatch(info.username, info.userId, info.guildId, fish).catch((err) => {
    console.error(err);
  });

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content,
    },
  });
}
