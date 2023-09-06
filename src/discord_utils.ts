import axios from "axios";
import { InteractionType, verifyKey } from "discord-interactions";
import express from "express";

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

// curl -X PATCH -H "Content-Type: application/json" -d '{ "content": "hello" }' https://discord.com/api/webhooks/$appId/$token/messages/@original
export function updateMessage(
  appId: string,
  messageToken: string,
  content: string
) {
  axios.patch(
    `https://discord.com/api/webhooks/${appId}/${messageToken}/messages/@original`,
    { content }
  );
}
