export interface Generator {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseProduction: number;
  owned: number;
  unlocked: boolean;
  icon: string;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  multiplier: number;
  generatorId: string;
  purchased: boolean;
  unlocked: boolean;
  icon: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  requirement: number;
  type: 'coins' | 'generators' | 'upgrades' | 'prestige';
  unlocked: boolean;
  icon: string;
}

export interface GameState {
  coins: number;
  totalCoinsEarned: number;
  lastUpdateTime: number;
  generators: Generator[];
  upgrades: Upgrade[];
  achievements: Achievement[];
  prestigeLevel: number;
  prestigeMultiplier: number;
}

export interface GameStats {
  totalClicks: number;
  totalCoinsEarned: number;
  totalTimeSpent: number;
  totalGeneratorsBought: number;
  totalUpgradesBought: number;
  totalPrestigeCount: number;
  gameStartedAt: number;
}