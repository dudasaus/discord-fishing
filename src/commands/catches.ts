import express from "express";
import { InteractionResponseType } from "discord-interactions";
import { formatLength, formatWeight } from "../format_utils";
import {
  getBiggestCatchesForUser,
  getRecentCatchesForUser,
} from "../firestore";

export async function getCatches(
  userId: string,
  _req: express.Request,
  res: express.Response
) {
  const dbRecentCatchesPromise = getRecentCatchesForUser(userId);
  const dbBiggestCatchesPromise = getBiggestCatchesForUser(userId);
  const [dbRecentCatches, dbBiggestCatches] = await Promise.all([
    dbRecentCatchesPromise,
    dbBiggestCatchesPromise,
  ]);

  // No fish!
  if (dbRecentCatches.length == 0) {
    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "You don't have any fish! Try `/fish`.",
      },
    });
  } else {
    let recentCatches = dataToParsedCatch(dbRecentCatches);
    let content = `Your recent catches:`;
    for (let myCatch of recentCatches) {
      content += `\n${formatParsedCatch(myCatch)}`;
    }

    content += "\n\n Your biggest catches:";
    let biggestCatches = dataToParsedCatch(dbBiggestCatches);
    for (let myCatch of biggestCatches) {
      content += `\n${formatParsedCatch(myCatch)}`;
    }

    return res.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content,
      },
    });
  }
}

type ParsedCatch = {
  fish: string;
  timestamp: string;
  size?: number;
  weight?: number;
};

function dataToParsedCatch(datas: any[]): Array<ParsedCatch> {
  return datas.map((data) => {
    const date = new Date(data.timestamp);
    return {
      fish: data.fish,
      size: data.size,
      weight: data.weight,
      timestamp: date.toLocaleString(),
    };
  });
}

function formatParsedCatch(parsedCatch: ParsedCatch): string {
  let stats = "";
  if (parsedCatch.size || parsedCatch.weight) {
    stats = "(";
    if (parsedCatch.size) stats += formatLength(parsedCatch.size);
    if (parsedCatch.size && parsedCatch.weight) stats += ", ";
    if (parsedCatch.weight) stats += formatWeight(parsedCatch.weight);
    stats += ")";
  }
  if (stats) {
    return `${parsedCatch.fish} ${stats} - ${parsedCatch.timestamp}`;
  } else {
    return `${parsedCatch.fish} - ${parsedCatch.timestamp}`;
  }
}
