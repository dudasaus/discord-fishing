import { randomNormal } from "d3";

interface FishConfig {
  emoji: string;
  sizeFn: () => number;
  weightFn: () => number;
  dropRate: number;
  weightedDrop: number;
}

export interface Fish {
  emoji: string;
  size: number;
  weight: number;
}

function createFishConfig(
  emoji: string,
  sizeFn: () => number,
  weightFn: () => number,
  weightedDrop: number
): FishConfig {
  return {
    emoji,
    sizeFn,
    weightFn,
    dropRate: 0,
    weightedDrop,
  };
}

const ALL_THE_FISH: FishConfig[] = [
  createFishConfig("🐟", randomNormal(5, 1), randomNormal(35, 1), 25),
  createFishConfig("🐠", randomNormal(8.8, 1.9), randomNormal(45, 3), 15),
  createFishConfig(
    "🐡",
    randomNormal(12.0, 2.0),
    randomNormal(120, 20),
    15
  ),
  createFishConfig(
    "🦈",
    randomNormal(155.5, 25.0),
    randomNormal(1025000, 20100),
    3
  ),
  createFishConfig(
    "🦐",
    randomNormal(1.0, 0.2),
    randomNormal(5.0, 0.05),
    5
  ),
  createFishConfig(
    "🦀",
    randomNormal(6.0, 1.0),
    randomNormal(3600, 450),
    13
  ),
  createFishConfig(
    "🦞",
    randomNormal(20.0, 4.0),
    randomNormal(5900, 980),
    10
  ),
  createFishConfig(
    "🐬",
    randomNormal(90.0, 8.0),
    randomNormal(17400, 2300),
    7
  ),
  createFishConfig(
    "🐋",
    randomNormal(1176.0, 115.0),
    randomNormal(75000000, 16000000),
    2
  ),
  createFishConfig(
    "🐙",
    randomNormal(100.0, 20.0),
    randomNormal(50000, 10000),
    6
  ),
  createFishConfig(
    "🦑",
    randomNormal(1200.0, 150.0),
    randomNormal(250000, 75000),
    2
  ),
];

computeDropRate(ALL_THE_FISH);
const cumulativeDropRates = [ALL_THE_FISH[0].dropRate];
for (let i = 1; i < ALL_THE_FISH.length; i++) {
  cumulativeDropRates[i] =
    ALL_THE_FISH[i].dropRate + cumulativeDropRates[i - 1];
}

function getFish(config: FishConfig): Fish {
  return {
    emoji: config.emoji,
    size: config.sizeFn(),
    weight: config.weightFn(),
  };
}

/** Gets a random fish. */
export function goFishing(): Fish {
  const draw = Math.random(); // 0-1
  let fishConfigIndex = ALL_THE_FISH.length - 1;
  for (let i = 0; i < ALL_THE_FISH.length; i++) {
    const cdr = cumulativeDropRates[i];
    if (draw < cdr) {
      fishConfigIndex = i;
      break;
    }
  }
  const fishConfig = ALL_THE_FISH[fishConfigIndex];
  return getFish(fishConfig);
}

// Useful for testing/visualizing drop rates.
export function testDropRates(numSims: number): {} {
  const map: Record<string, number> = {};
  for (let i = 0; i < numSims; i++) {
    const f = goFishing();
    if (map[f.emoji]) {
      map[f.emoji]++;
    } else {
      map[f.emoji] = 1;
    }
  }
  return map;
}

/** Has side effects, sets the drop rate on each fish config */
function computeDropRate(fishWithWeights: FishConfig[]) {  
  let total = 0;
  fishWithWeights.forEach((fishConfig) => {
    total += fishConfig.weightedDrop
  });
  
  fishWithWeights.forEach((fishConfig) => {
    fishConfig.dropRate = fishConfig.weightedDrop/total
  });
}
