import express from "express";
import { CATCHES_COLLECTION, firestore } from "../firestore";
import { InteractionResponseType } from "discord-interactions";
import { formatLength } from "../format_utils";
import { DiscordRequestInfo } from "../discord_utils";

export async function serverSizeLeaderboard(
  _req: express.Request,
  res: express.Response,
  info: DiscordRequestInfo
) {
  const snapshot = await firestore
    .collection(CATCHES_COLLECTION)
    .where("guildId", "==", info.guildId)
    .orderBy("size", "desc")
    .limit(10)
    .get();

  // No fish!
  if (snapshot.size == 0) {
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "This server doesn't have any fish! Try `/fish`.",
      },
    });
  }

  let content = "Server leaderboard:";
  for (let i = 0; i < snapshot.size; i++) {
    const data = snapshot.docs[i].data();
    const date = new Date(data.timestamp).toLocaleDateString();
    content += `\n${i + 1}. ${data.username}: ${data.fish}, ${formatLength(
      data.size
    )} | ${date}`;
  }

  return res.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content,
    },
  });
}
