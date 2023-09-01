import { Firestore } from "@google-cloud/firestore";
import { Fish } from "./fish";
import { timeUntilTomorrow, today } from "./date_utils";

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
  userId: string,
  guildId: string,
  fish: Fish
) {
  const doc = firestore.collection(CATCHES_COLLECTION).doc();
  await doc.set({
    username,
    userId,
    guildId,
    fish: fish.emoji,
    size: fish.size,
    weight: fish.weight,
    timestamp: Date.now(),
  });
}

/** Checks if the user is allowed to fish right now. */
export async function canYouFishRightNow(userId: string): Promise<{
  allowed: boolean;
  message?: string;
}> {
  const snapshot = await firestore
    .collection(CATCHES_COLLECTION)
    .where("timestamp", ">", today())
    .where("userId", "==", userId)
    .orderBy("timestamp", "desc")
    .count()
    .get();
  if (snapshot.data().count) {
    return {
      allowed: false,
      message: `You already fished today! You can fish again in ${timeUntilTomorrow()}`,
    };
  }
  return {
    allowed: true,
  };
}

/** Grabs global leaderboard. */
export async function getGlobalLeaderboard(size = 10): Promise<Array<any>> {
  const snapshot = await firestore
    .collection(CATCHES_COLLECTION)
    .orderBy("size", "desc")
    .limit(size)
    .get();
  return snapshot.docs.map((doc) => doc.data());
}

export async function getRecentCatchesForUser(
  userId: string,
  limit = 5
): Promise<Array<any>> {
  let query = firestore
    .collection(CATCHES_COLLECTION)
    .where("userId", "==", userId)
    .orderBy("timestamp", "desc");
  if (limit > 1) {
    query = query.limit(Math.floor(limit));
  }
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => doc.data());
}

export async function getBiggestCatchesForUser(
  userId: string,
  limit = 5
): Promise<Array<any>> {
  let query = firestore
    .collection(CATCHES_COLLECTION)
    .where("userId", "==", userId)
    .orderBy("size", "desc");
  if (limit > 1) {
    query = query.limit(Math.floor(limit));
  }
  const snapshot = await query.get();
  return snapshot.docs.map((doc) => doc.data());
}
