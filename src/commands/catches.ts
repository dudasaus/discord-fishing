import express from "express";
import { InteractionResponseType } from "discord-interactions";
import { formatLength, formatWeight } from "../format_utils";
import { getCatchesForUser } from "../firestore";

export async function getCatches(
  userId: string,
  _req: express.Request,
  res: express.Response
) {
  const dbCatches = await getCatchesForUser(userId);

  // No fish!
  if (dbCatches.length == 0) {
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
    dbCatches.forEach((data) => {
      const date = new Date(data.timestamp);
      catches.push({
        fish: data.fish,
        size: data.size,
        weight: data.weight,
        timestamp: date.toLocaleString(),
      });
    });
    let content = `Your catches:`;
    for (let myCatch of catches) {
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
