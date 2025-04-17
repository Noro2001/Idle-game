import React, { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialGenerators } from '@/data/generators';
import { initialUpgrades } from '@/data/upgrades';
import { initialAchievements } from '@/data/achievements';
import { GameState, Generator, Upgrade, Achievement } from '@/types/game';

// Initial state
const initialState: GameState = {
  coins: 0,
  totalCoinsEarned: 0,
  lastUpdateTime: Date.now(),
  generators: initialGenerators,
  upgrades: initialUpgrades,
  achievements: initialAchievements,
  prestigeLevel: 0,
  prestigeMultiplier: 1,
};

// Action types
type GameAction =
  | { type: 'INCREMENT_COINS'; amount: number }
  | { type: 'BUY_GENERATOR'; generatorId: string }
  | { type: 'BUY_UPGRADE'; upgradeId: string }
  | { type: 'COLLECT_IDLE_COINS' }
  | { type: 'PRESTIGE' }
  | { type: 'RESET_GAME' }
  | { type: 'TICK' }
  | { type: 'CHECK_ACHIEVEMENTS' }
  | { type: 'LOAD_STATE'; state: GameState };

// Reducer function
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'INCREMENT_COINS':
      return {
        ...state,
        coins: state.coins + action.amount,
        totalCoinsEarned: state.totalCoinsEarned + action.amount,
      };

    case 'BUY_GENERATOR': {
      const generator = state.generators.find((g) => g.id === action.generatorId);
      if (!generator) return state;

      const cost = Math.floor(generator.baseCost * Math.pow(1.15, generator.owned));
      if (state.coins < cost) return state;

      // Create a new generators array with the updated generator
      const updatedGenerators = state.generators.map((g) => {
        if (g.id === action.generatorId) {
          return { ...g, owned: g.owned + 1 };
        }

        // Unlock next generator if applicable
        const currentIndex = state.generators.findIndex((gen) => gen.id === action.generatorId);
        const nextIndex = currentIndex + 1;

        if (
          nextIndex < state.generators.length &&
          g.id === state.generators[nextIndex].id &&
          !g.unlocked &&
          generator.owned >= 0
        ) {
          return { ...g, unlocked: true };
        }

        return g;
      });

      // Create a new upgrades array with any newly unlocked upgrades
      const updatedUpgrades = state.upgrades.map((u) => {
        if (u.generatorId === action.generatorId && !u.unlocked) {
          const generator = updatedGenerators.find((g) => g.id === action.generatorId);
          if (generator && generator.owned >= 5) {
            return { ...u, unlocked: true };
          }
        }
        return u;
      });

      return {
        ...state,
        coins: state.coins - cost,
        generators: updatedGenerators,
        upgrades: updatedUpgrades,
      };
    }

    case 'BUY_UPGRADE': {
      const upgrade = state.upgrades.find((u) => u.id === action.upgradeId);
      if (!upgrade || upgrade.purchased || !upgrade.unlocked || state.coins < upgrade.cost) {
        return state;
      }

      // Create a new upgrades array with the purchased upgrade
      const updatedUpgrades = state.upgrades.map((u) => {
        if (u.id === action.upgradeId) {
          return { ...u, purchased: true };
        }
        return u;
      });

      return {
        ...state,
        coins: state.coins - upgrade.cost,
        upgrades: updatedUpgrades,
      };
    }

    case 'COLLECT_IDLE_COINS': {
      const currentTime = Date.now();
      const elapsedTime = (currentTime - state.lastUpdateTime) / 1000; // in seconds

      if (elapsedTime <= 0) {
        return {
          ...state,
          lastUpdateTime: currentTime,
        };
      }

      // Calculate idle production
      let idleProduction = 0;

      state.generators.forEach((generator) => {
        if (generator.owned > 0) {
          let generatorProduction = generator.baseProduction * generator.owned;

          // Apply upgrades
          state.upgrades.forEach((upgrade) => {
            if (upgrade.purchased && upgrade.generatorId === generator.id) {
              generatorProduction *= upgrade.multiplier;
            }
          });

          // Apply prestige multiplier
          generatorProduction *= state.prestigeMultiplier;

          idleProduction += generatorProduction;
        }
      });

      const idleCoins = Math.floor(idleProduction * elapsedTime);

      return {
        ...state,
        coins: state.coins + idleCoins,
        totalCoinsEarned: state.totalCoinsEarned + idleCoins,
        lastUpdateTime: currentTime,
      };
    }

    case 'PRESTIGE': {
      // Require at least 1,000,000 total coins earned for first prestige
      const prestigeThreshold = 1000000 * Math.pow(10, state.prestigeLevel);

      if (state.totalCoinsEarned < prestigeThreshold) {
        return state;
      }

      const newPrestigeLevel = state.prestigeLevel + 1;
      const newPrestigeMultiplier = 1 + newPrestigeLevel * 0.1; // 10% increase per level

      // Reset generators but keep total coins earned
      const resetGenerators = initialGenerators.map((g, index) => ({
        ...g,
        owned: 0,
        unlocked: index === 0, // Only first generator is unlocked
      }));

      // Reset upgrades
      const resetUpgrades = initialUpgrades.map((u) => ({
        ...u,
        purchased: false,
        unlocked: false,
      }));

      return {
        ...state,
        coins: 0,
        generators: resetGenerators,
        upgrades: resetUpgrades,
        prestigeLevel: newPrestigeLevel,
        prestigeMultiplier: newPrestigeMultiplier,
        lastUpdateTime: Date.now(),
      };
    }

    case 'RESET_GAME':
      return {
        ...initialState,
        lastUpdateTime: Date.now(),
      };

    case 'TICK': {
      const PRODUCTION_INTERVAL = 1000; // 1 second
      let production = 0;

      // Calculate production from all generators
      state.generators.forEach((generator) => {
        if (generator.owned > 0) {
          let generatorProduction = generator.baseProduction * generator.owned;

          // Apply upgrades
          state.upgrades.forEach((upgrade) => {
            if (upgrade.purchased && upgrade.generatorId === generator.id) {
              generatorProduction *= upgrade.multiplier;
            }
          });

          // Apply prestige multiplier
          generatorProduction *= state.prestigeMultiplier;

          production += generatorProduction / (PRODUCTION_INTERVAL / 1000);
        }
      });

      if (production > 0) {
        return {
          ...state,
          coins: state.coins + production,
          totalCoinsEarned: state.totalCoinsEarned + production,
          lastUpdateTime: Date.now(),
        };
      }
      return state;
    }

    case 'CHECK_ACHIEVEMENTS': {
      let hasChanges = false;

      // Create a new achievements array with any newly unlocked achievements
      const updatedAchievements = state.achievements.map((achievement) => {
        if (achievement.unlocked) return achievement;

        let requirement = 0;

        switch (achievement.type) {
          case 'coins':
            requirement = state.totalCoinsEarned;
            break;
          case 'generators':
            requirement = state.generators.reduce((total, g) => total + g.owned, 0);
            break;
          case 'upgrades':
            requirement = state.upgrades.filter((u) => u.purchased).length;
            break;
          case 'prestige':
            requirement = state.prestigeLevel;
            break;
        }

        if (requirement >= achievement.requirement) {
          hasChanges = true;
          return { ...achievement, unlocked: true };
        }

        return achievement;
      });

      // Only update state if there are changes
      if (hasChanges) {
        return {
          ...state,
          achievements: updatedAchievements,
        };
      }
      return state;
    }

    case 'LOAD_STATE':
      return action.state;

    default:
      return state;
  }
}

// Create context
interface GameContextType {
  state: GameState;
  incrementCoins: (amount: number) => void;
  buyGenerator: (generatorId: string) => void;
  buyUpgrade: (upgradeId: string) => void;
  prestige: () => void;
  resetGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
  // Refs for intervals
  const productionIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const achievementCheckRef = useRef<NodeJS.Timeout | null>(null);
  const saveStateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Load state from storage on mount
  useEffect(() => {
    const loadState = async () => {
      try {
        const savedState = await AsyncStorage.getItem('idle-game-storage');
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          // Ensure we have all the required properties
          const validState = {
            ...initialState,
            ...parsedState,
            // Make sure these arrays exist even if they're missing in saved state
            generators: parsedState.generators || initialState.generators,
            upgrades: parsedState.upgrades || initialState.upgrades,
            achievements: parsedState.achievements || initialState.achievements,
          };
          dispatch({ type: 'LOAD_STATE', state: validState });
        }
      } catch (error) {
        console.error('Failed to load state:', error);
        // If loading fails, make sure we have a valid state
        dispatch({ type: 'RESET_GAME' });
      }
    };
    
    loadState();
  }, []);
  
  // Save state to storage when it changes, but debounced
  useEffect(() => {
    if (saveStateTimeoutRef.current) {
      clearTimeout(saveStateTimeoutRef.current);
    }
    
    saveStateTimeoutRef.current = setTimeout(async () => {
      try {
        await AsyncStorage.setItem('idle-game-storage', JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save state:', error);
      }
    }, 1000); // Debounce for 1 second
    
    return () => {
      if (saveStateTimeoutRef.current) {
        clearTimeout(saveStateTimeoutRef.current);
      }
    };
  }, [state]);
  
  // Collect idle coins when app opens
  useEffect(() => {
    dispatch({ type: 'COLLECT_IDLE_COINS' });
  }, []);
  
  // Set up game loop
  useEffect(() => {
    // Initial achievement check
    dispatch({ type: 'CHECK_ACHIEVEMENTS' });
    
    // Set up production interval
    productionIntervalRef.current = setInterval(() => {
      dispatch({ type: 'TICK' });
    }, 1000);
    
    // Set up achievement check interval
    achievementCheckRef.current = setInterval(() => {
      dispatch({ type: 'CHECK_ACHIEVEMENTS' });
    }, 5000);
    
    return () => {
      // Clean up intervals on unmount
      if (productionIntervalRef.current) {
        clearInterval(productionIntervalRef.current);
      }
      if (achievementCheckRef.current) {
        clearInterval(achievementCheckRef.current);
      }
    };
  }, []);
  
  // Context value
  const value = {
    state,
    incrementCoins: (amount: number) => dispatch({ type: 'INCREMENT_COINS', amount }),
    buyGenerator: (generatorId: string) => dispatch({ type: 'BUY_GENERATOR', generatorId }),
    buyUpgrade: (upgradeId: string) => dispatch({ type: 'BUY_UPGRADE', upgradeId }),
    prestige: () => dispatch({ type: 'PRESTIGE' }),
    resetGame: () => dispatch({ type: 'RESET_GAME' }),
  };
  
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

// Custom hook to use the context
export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}