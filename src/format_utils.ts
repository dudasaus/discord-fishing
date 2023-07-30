import { Fish } from "./fish";

/** Rounds a number to the nearest 2 decimal places. */
function round(input: number) {
  return Math.round(input * 100) / 100;
}

/** Formats a weight (g) to grams/kilograms. */
function formatWeight(weight: number) {
  if (weight > 1000) {
    return round(weight / 1000) + " kg";
  } else {
    return round(weight) + " g";
  }
}

/** Formats a length (in) to feet/inches. */
function formatLength(length: number) {
  const feet = Math.floor(length / 12);
  const inches = round(length % 12);
  if (feet) {
    return `${feet} ft ${inches} in`;
  }
  return `${inches} in`;
}

/** Formats a fish into a message. */
export function formatFish(fish: Fish): string {
  let message = fish.emoji;
  message += `\nSize: ${formatLength(fish.size)}`;
  message += `\nWeight: ${formatWeight(fish.weight)}`;
  return message;
}
