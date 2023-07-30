import { InteractionResponseType } from "discord-interactions";
import express from "express";
import { goFishing } from "../fish";
import { formatFish } from "../format_utils";
import { DiscordRequestInfo } from "../discord_utils";

export function advancedFishingCommand(
  _req: express.Request,
  res: express.Response,
  info: DiscordRequestInfo
) {
  let content = `${info.displayName} went fishing and caught...\n`;
  content += formatFish(goFishing());
  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content,
    },
  });
}
