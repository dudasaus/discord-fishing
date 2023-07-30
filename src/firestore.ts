import { Firestore } from "@google-cloud/firestore";
import { Fish } from "./fish";

/** Catches collection, environment dependent. */
export const CATCHES_COLLECTION = process.env.GAE_APPLICATION
  ? "prod-catches"
  : "dev-catches";

/** Firestore database. */
export const firestore = new Firestore({
  projectId: "discord-fishing",
});

/** Saves a catch in the firestore database. */
export async function recordCatch(
  username: string,
  guildId: string,
  fish: Fish
) {
  const doc = firestore.collection(CATCHES_COLLECTION).doc();
  await doc.set({
    username,
    guildId,
    fish: fish.emoji,
    size: fish.size,
    weight: fish.weight,
    timestamp: Date.now(),
  });
}
