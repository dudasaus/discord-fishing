import express from "express";
import { CATCHES_COLLECTION, firestore } from "../firestore";
import { InteractionResponseType } from "discord-interactions";
import { formatLength } from "../format_utils";
import { DiscordRequestInfo } from "../discord_utils";

export async function globalSizeLeaderboard(
  _req: express.Request,
  res: express.Response,
  _info: DiscordRequestInfo
) {
  const snapshot = await firestore
    .collection(CATCHES_COLLECTION)
    .orderBy("size", "desc")
    .limit(10)
    .get();

  // No fish!
  if (snapshot.size == 0) {
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "There are no fish! Try `/fish`.",
      },
    });
  }

  let content = "Global leaderboard:";
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
