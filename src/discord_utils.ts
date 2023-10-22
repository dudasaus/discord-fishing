import axios from "axios";
import { InteractionType, verifyKey } from "discord-interactions";
import express from "express";
import { wait } from "./timing_utils";

export function VerifyDiscordRequest(clientKey: string) {
  return function (
    req: express.Request,
    res: express.Response,
    buf: any,
    _encoding: any
  ) {
    const signature = req.get("X-Signature-Ed25519");
    const timestamp = req.get("X-Signature-Timestamp");

    const isValidRequest = verifyKey(buf, signature!, timestamp!, clientKey);
    if (!isValidRequest) {
      res.status(401).send("Bad request signature");
      throw new Error("Bad request signature");
    }
  };
}

export interface DiscordRequestInfo {
  type: InteractionType;
  commandName: string;
  displayName: string;
  username: string;
  userId: string;
  guildId: string;
  options: Record<string, number | string>;
}

export function getDiscordRequestInfo(
  req: express.Request
): DiscordRequestInfo {
  const { type, data, member, guild } = req.body;
  const commandName = data.name;
  const { user } = member;
  const { username } = user;
  const displayName = member.nick || user.global_name || user.username;
  const guildId = guild.id;
  const userId = user.id;

  const { options } = data;
  const optionsMap: Record<string, number | string> = {};
  if (options) {
    for (let option of options) {
      optionsMap[option.name] = option.value;
    }
  }

  return {
    type,
    commandName,
    displayName,
    username,
    userId,
    guildId,
    options: optionsMap,
  };
}

export async function updateMessage(
  appId: string,
  messageToken: string,
  content: string
) {
  // Retry attempts after N seconds, if needed.
  const retryAfter = [3, 10, 15];
  let numRetries = 0;
  let successfulUpdate = false;
  const updateFn = async () => {
    await axios.patch(
      `https://discord.com/api/webhooks/${appId}/${messageToken}/messages/@original`,
      { content }
    );
  };
  while (!successfulUpdate && numRetries <= retryAfter.length) {
    try {
      await updateFn();
      if (numRetries) {
        console.log("Retry succeeded.");
      }
      successfulUpdate = true;
    } catch (err) {
      if (numRetries < retryAfter.length) {
        console.warn({
          retryMessage: `Retry attempt ${numRetries + 1} in ${
            retryAfter[numRetries]
          }s.`,
          err,
        });
        await wait(1000 * retryAfter[numRetries]);
        numRetries++;
      } else {
        // You retried enough times, give up :(
        console.error({
          retryMessage: `Failed to update message after ${numRetries} retry attempts.`,
          messageToken,
          err,
        });
        break;
      }
    }
  }
}
