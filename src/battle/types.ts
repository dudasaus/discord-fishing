export interface BattleSide {
  hero: Hero;
  dice: Die[];
}

export interface Hero {
  fish: string;
  health: number;
  description?: string;
}

// TODO: Description, images, selfSide.
type DieSide = (enemySide: BattleSide) => void;

export interface Die {
  fish: string;
  sides: DieSide[];
}

function basicDamage(damage: number): DieSide {
  return (bs) => {
    bs.hero.health = Math.max(bs.hero.health - damage, 0);
  };
}

function emptySide(): DieSide {
  return () => undefined;
}

class BlueFishHero implements Hero {
  readonly fish = "🐟";
  health = 65;
}

class BlueFishDie implements Die {
  readonly fish = "🐟";
  sides = [
    emptySide(),
    basicDamage(10),
    basicDamage(10),
    basicDamage(12),
    basicDamage(12),
    basicDamage(15),
  ];
}

class TropicalFishHero implements Hero {
  readonly fish = "🐠";
  health = 80;
}

class TropicalFishDie implements Die {
  readonly fish = "🐠";
  sides = [
    emptySide(),
    emptySide(),
    basicDamage(15),
    basicDamage(15),
    basicDamage(25),
    basicDamage(25),
  ];
}

// Idea: "missed" die become 25 damage.
class BlowFishHero implements Hero {
  readonly fish = "🐡";
  health = 80;
}

class BlowFishDie implements Die {
  readonly fish = "🐡";
  sides = [
    emptySide(),
    emptySide(),
    emptySide(),
    basicDamage(25),
    basicDamage(25),
    basicDamage(25),
  ];
}

function sharkAttack(damage: number): DieSide {
  return (enemySide) => {
    if (enemySide.hero.fish === "🐋") {
      damage *= 2;
    } else if (enemySide.hero.fish === "🦀") {
      damage /= 2;
    }
    enemySide.hero.health -= damage;
  };
}

class SharkHero implements Hero {
  readonly fish = "🦈";
  health = 125;
}

class SharkDie implements Die {
  readonly fish = "🦈";
  sides = [
    emptySide(),
    sharkAttack(30),
    sharkAttack(30),
    sharkAttack(40),
    sharkAttack(40),
    sharkAttack(50),
  ];
}

class ShrimpHero implements Hero {
  readonly fish = "🦐";
  health = 25;
}

class ShrimpDie implements Die {
  readonly fish = "🦐";
  sides = [
    basicDamage(5),
    basicDamage(5),
    basicDamage(5),
    basicDamage(5),
    basicDamage(5),
    basicDamage(5),
  ];
}

class CrabHero implements Hero {
  readonly fish = "🦀";
  health = 130;
  description = "Takes 50% less damage from sharks.";
}

class CrabDie implements Die {
  readonly fish = "🦀";
  sides = [
    emptySide(),
    emptySide(),
    basicDamage(25),
    basicDamage(25),
    // Crab shell: block all of next damage.
    basicDamage(25),
    // Super crab shell: instead of taking next damage, heal that much.
    basicDamage(25),
  ];
}

class LobsterHero implements Hero {
  readonly fish = "🦞";
  health = 150;
}

class LobsterDie {
  readonly fish = "🦞";
  sides = [
    emptySide(),
    basicDamage(15),
    basicDamage(20),
    basicDamage(25),
    basicDamage(30),
    basicDamage(50),
  ];
}

class DolphinHero implements Hero {
  readonly fish = "🐬";
  health = 150;
}

class DolphinDie implements Die {
  readonly fish = "🐬";
  sides = [
    basicDamage(25),
    basicDamage(25),
    basicDamage(35),
    basicDamage(35),
    basicDamage(45),
    basicDamage(45),
  ];
}

class WhaleHero implements Hero {
  readonly fish = "🐋";
  health = 225;
  description = "Now that's a lot of health.";
}

class WhaleDie implements Die {
  readonly fish = "🐋";
  sides = [
    emptySide(),
    emptySide(),
    basicDamage(50),
    basicDamage(50),
    basicDamage(50),
    basicDamage(50),
  ];
}

class OctopusHero implements Hero {
  readonly fish = "🐙";
  health = 125;
}

class OctopusDie implements Die {
  readonly fish = "🐙";
  sides = [
    emptySide(),
    basicDamage(15),
    basicDamage(15),
    basicDamage(20),
    basicDamage(20),
    basicDamage(35),
  ];
}

class SquidHero implements Hero {
  readonly fish = "🦑";
  health = 175;
}

class SquidDie implements Die {
  readonly fish = "🦑";
  sides = [
    emptySide(),
    emptySide(),
    emptySide(),
    basicDamage(100),
    basicDamage(100),
    basicDamage(100),
  ];
}
