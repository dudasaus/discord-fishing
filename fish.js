import { randomNormal } from "d3";

const ALL_THE_FISH = [
  createFish("🐟", randomNormal(5, 1), randomNormal(35, 1)),
  createFish("🐠", randomNormal(8.8, 1.9), randomNormal(45, 3)),
  createFish("🐡", randomNormal(12.0, 2.0), randomNormal(120, 20)),
  createFish("🦈", randomNormal(155.5, 25.0), randomNormal(1025000, 20100)),
  createFish("🦐", randomNormal(1.0, 0.2), randomNormal(5.0, 0.05)),
  createFish("🦀", randomNormal(6.0, 1.0), randomNormal(3600, 450)),
  createFish("🦞", randomNormal(20.0, 4.0), randomNormal(5900, 980)),
  createFish("🐬", randomNormal(90.0, 8.0), randomNormal(17400, 2300)),
  createFish(
    "🐋",
    randomNormal(1176.0, 115.0),
    randomNormal(75000000, 16000000)
  ),
];

function createFish(emoji, sizeFn, weightFn) {
  return {
    emoji,
    sizeFn,
    weightFn,
  };
}

function round(number) {
  return Math.round(number * 100) / 100;
}

function formatWeight(weight) {
  if (weight > 1000) {
    return round(weight / 1000) + " kg";
  } else {
    return round(weight) + " g";
  }
}

function formatLength(length) {
  const feet = Math.floor(length / 12);
  const inches = round(length % 12);
  if (feet) {
    return `${feet} ft ${inches} in`;
  }
  return `${inches} in`;
}
