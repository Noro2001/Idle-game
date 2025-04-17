import React, { createContext, useContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameStats } from '@/types/game';

// Initial state
const initialStats: GameStats = {
  totalClicks: 0,
  totalCoinsEarned: 0,
  totalTimeSpent: 0,
  totalGeneratorsBought: 0,
  totalUpgradesBought: 0,
  totalPrestigeCount: 0,
  gameStartedAt: Date.now(),
};

// Action types
type StatsAction =
  | { type: 'INCREMENT_CLICKS' }
  | { type: 'INCREMENT_COINS_EARNED'; amount: number }
  | { type: 'INCREMENT_TIME_SPENT'; seconds: number }
  | { type: 'INCREMENT_GENERATORS_BOUGHT'; amount: number }
  | { type: 'INCREMENT_UPGRADES_BOUGHT'; amount: number }
  | { type: 'INCREMENT_PRESTIGE_COUNT' }
  | { type: 'RESET_STATS' }
  | { type: 'LOAD_STATS'; stats: GameStats };

// Reducer function
function statsReducer(state: GameStats, action: StatsAction): GameStats {
  switch (action.type) {
    case 'INCREMENT_CLICKS':
      return {
        ...state,
        totalClicks: state.totalClicks + 1,
      };
    
    case 'INCREMENT_COINS_EARNED':
      return {
        ...state,
        totalCoinsEarned: state.totalCoinsEarned + action.amount,
      };
    
    case 'INCREMENT_TIME_SPENT':
      return {
        ...state,
        totalTimeSpent: state.totalTimeSpent + action.seconds,
      };
    
    case 'INCREMENT_GENERATORS_BOUGHT':
      return {
        ...state,
        totalGeneratorsBought: state.totalGeneratorsBought + action.amount,
      };
    
    case 'INCREMENT_UPGRADES_BOUGHT':
      return {
        ...state,
        totalUpgradesBought: state.totalUpgradesBought + action.amount,
      };
    
    case 'INCREMENT_PRESTIGE_COUNT':
      return {
        ...state,
        totalPrestigeCount: state.totalPrestigeCount + 1,
      };
    
    case 'RESET_STATS':
      return {
        ...initialStats,
        gameStartedAt: Date.now(),
      };
    
    case 'LOAD_STATS':
      return action.stats;
    
    default:
      return state;
  }
}

// Create context
interface StatsContextType {
  stats: GameStats;
  incrementClicks: () => void;
  incrementCoinsEarned: (amount: number) => void;
  incrementTimeSpent: (seconds: number) => void;
  incrementGeneratorsBought: (amount: number) => void;
  incrementUpgradesBought: (amount: number) => void;
  incrementPrestigeCount: () => void;
  resetStats: () => void;
}

const StatsContext = createContext<StatsContextType | undefined>(undefined);

// Provider component
export function StatsProvider({ children }: { children: React.ReactNode }) {
  const [stats, dispatch] = useReducer(statsReducer, initialStats);
  
  // Load stats from storage on mount
  useEffect(() => {
    const loadStats = async () => {
      try {
        const savedStats = await AsyncStorage.getItem('idle-game-stats');
        if (savedStats) {
          const parsedStats = JSON.parse(savedStats);
          dispatch({ type: 'LOAD_STATS', stats: parsedStats });
        }
      } catch (error) {
        console.error('Failed to load stats:', error);
      }
    };
    
    loadStats();
  }, []);
  
  // Save stats to storage when they change
  useEffect(() => {
    const saveStats = async () => {
      try {
        await AsyncStorage.setItem('idle-game-stats', JSON.stringify(stats));
      } catch (error) {
        console.error('Failed to save stats:', error);
      }
    };
    
    saveStats();
  }, [stats]);
  
  // Update time spent every minute
  useEffect(() => {
    const timeInterval = setInterval(() => {
      dispatch({ type: 'INCREMENT_TIME_SPENT', seconds: 60 });
    }, 60000);
    
    return () => clearInterval(timeInterval);
  }, []);
  
  // Context value
  const value = {
    stats,
    incrementClicks: () => dispatch({ type: 'INCREMENT_CLICKS' }),
    incrementCoinsEarned: (amount: number) => dispatch({ type: 'INCREMENT_COINS_EARNED', amount }),
    incrementTimeSpent: (seconds: number) => dispatch({ type: 'INCREMENT_TIME_SPENT', seconds }),
    incrementGeneratorsBought: (amount: number) => dispatch({ type: 'INCREMENT_GENERATORS_BOUGHT', amount }),
    incrementUpgradesBought: (amount: number) => dispatch({ type: 'INCREMENT_UPGRADES_BOUGHT', amount }),
    incrementPrestigeCount: () => dispatch({ type: 'INCREMENT_PRESTIGE_COUNT' }),
    resetStats: () => dispatch({ type: 'RESET_STATS' }),
  };
  
  return <StatsContext.Provider value={value}>{children}</StatsContext.Provider>;
}

// Custom hook to use the context
export function useStats() {
  const context = useContext(StatsContext);
  if (context === undefined) {
    throw new Error('useStats must be used within a StatsProvider');
  }
  return context;
}