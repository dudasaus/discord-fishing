import express from "express";
import { CATCHES_COLLECTION, firestore } from "../firestore";
import { InteractionResponseType } from "discord-interactions";
import { formatLength, formatWeight } from "../format_utils";

export async function getCatches(
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
    let catches: Array<{
      fish: string;
      timestamp: string;
      size?: number;
      weight?: number;
    }> = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      const date = new Date(data.timestamp);
      catches.push({
        fish: data.fish,
        size: data.size,
        weight: data.weight,
        timestamp: date.toLocaleString(),
      });
    });
    let content = `Your catches:`;
    for (let i = catches.length - 1; i >= 0; i--) {
      const myCatch = catches[i];
      let stats = "";
      if (myCatch.size || myCatch.weight) {
        stats = "(";
        if (myCatch.size) stats += formatLength(myCatch.size);
        if (myCatch.size && myCatch.weight) stats += ", ";
        if (myCatch.weight) stats += formatWeight(myCatch.weight);
        stats += ")";
      }
      if (stats) {
        content += `\n${myCatch.fish} ${stats} - ${myCatch.timestamp}`;
      } else {
        content += `\n${myCatch.fish} - ${myCatch.timestamp}`;
      }
    }
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content,
      },
    });
  }
}
