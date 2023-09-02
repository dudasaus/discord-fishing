export interface BattleSide {
  hero: Hero;
  dice: Die[];
}

export interface Hero {
  fish: string;
  health: number;
}

type DieSide = (enemySide: BattleSide) => void;

export interface Die {
  fish: string;
  sides: DieSide[];
}

function basicDamage(damage: number): DieSide {
  return (bs) => {
    bs.hero.health -= damage;
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

class SharkHero {
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
