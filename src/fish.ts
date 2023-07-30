import { randomNormal } from "d3";

interface FishConfig {
  emoji: string;
  sizeFn: () => number;
  weightFn: () => number;
}

export interface Fish {
  emoji: string;
  size: number;
  weight: number;
}

function createFishConfig(
  emoji: string,
  sizeFn: () => number,
  weightFn: () => number
): FishConfig {
  return {
    emoji,
    sizeFn,
    weightFn,
  };
}

const ALL_THE_FISH: FishConfig[] = [
  createFishConfig("🐟", randomNormal(5, 1), randomNormal(35, 1)),
  createFishConfig("🐠", randomNormal(8.8, 1.9), randomNormal(45, 3)),
  createFishConfig("🐡", randomNormal(12.0, 2.0), randomNormal(120, 20)),
  createFishConfig(
    "🦈",
    randomNormal(155.5, 25.0),
    randomNormal(1025000, 20100)
  ),
  createFishConfig("🦐", randomNormal(1.0, 0.2), randomNormal(5.0, 0.05)),
  createFishConfig("🦀", randomNormal(6.0, 1.0), randomNormal(3600, 450)),
  createFishConfig("🦞", randomNormal(20.0, 4.0), randomNormal(5900, 980)),
  createFishConfig("🐬", randomNormal(90.0, 8.0), randomNormal(17400, 2300)),
  createFishConfig(
    "🐋",
    randomNormal(1176.0, 115.0),
    randomNormal(75000000, 16000000)
  ),
];

function getFish(config: FishConfig): Fish {
  return {
    emoji: config.emoji,
    size: config.sizeFn(),
    weight: config.weightFn(),
  };
}

/** Gets a random fish. */
export function goFishing(): Fish {
  const fishConfig =
    ALL_THE_FISH[Math.floor(Math.random() * ALL_THE_FISH.length)];
  return getFish(fishConfig);
}
