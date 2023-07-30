import "dotenv/config";

import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

interface Secrets {
  DISCORD_APP_ID: string;
  DISCORD_PUBLIC_KEY: string;
  DISCORD_TOKEN: string;
}

async function getSecrets(): Promise<Secrets> {
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
    return JSON.parse(payload);
  } else {
    // Otherwise, try the local environment.
    return {
      DISCORD_APP_ID: process.env.DISCORD_APP_ID!,
      DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY!,
      DISCORD_TOKEN: process.env.DISCORD_TOKEN!,
    };
  }
}

export { getSecrets };
