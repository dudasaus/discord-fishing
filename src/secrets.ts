import "dotenv/config";

import { SecretManagerServiceClient } from "@google-cloud/secret-manager";
import { logInfo } from "./logging";

interface Secrets {
  DISCORD_APP_ID: string;
  DISCORD_PUBLIC_KEY: string;
  DISCORD_TOKEN: string;
}

let cachedSecrets: Secrets | null = null;

async function getSecrets(): Promise<Secrets> {
  if (cachedSecrets) return Promise.resolve(cachedSecrets);
  if (process.env.GAE_APPLICATION) {
    // If we're in GCP, grab secrets from the secret manager.
    const client = new SecretManagerServiceClient();
    const [version] = await client.accessSecretVersion({
      name: "projects/582436714904/secrets/discord_secrets/versions/1",
    });
    const payload = version.payload?.data?.toString();
    if (!payload) {
      process.exit();
    }
    cachedSecrets = JSON.parse(payload) as Secrets;
    return cachedSecrets;
  } else {
    // Otherwise, try the local environment.
    cachedSecrets = {
      DISCORD_APP_ID: process.env.DISCORD_APP_ID!,
      DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY!,
      DISCORD_TOKEN: process.env.DISCORD_TOKEN!,
    };
    return cachedSecrets;
  }
}

/** Gets the discord public key from the correct environment. */
export async function getDiscordPublicKey(): Promise<string> {
  if (process.env.GAE_APPLICATION) {
    if (process.env.DISCORD_PUBLIC_KEY) {
      return Promise.resolve(process.env.DISCORD_PUBLIC_KEY);
    }
    logInfo("Expected DISCORD_PUBLIC_KEY to be defined.");
  }
  return (await getSecrets()).DISCORD_PUBLIC_KEY;
}

export { getSecrets };
