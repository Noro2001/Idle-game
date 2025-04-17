import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { formatNumber } from '@/utils/formatters';
import Colors from '@/constants/colors';
import { Coins } from 'lucide-react-native';

export default function ResourceDisplay() {
  const { state } = useGame();
  
  // Add a check to make sure state and required properties are defined
  if (!state || !state.generators || !state.upgrades) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors.dark.primary} />
      </View>
    );
  }
  
  const { coins, generators, upgrades, prestigeMultiplier } = state;
  
  // Calculate production per second with useMemo to avoid recalculation on every render
  const productionPerSecond = useMemo(() => {
    return generators.reduce((total, generator) => {
      if (generator.owned > 0) {
        let generatorProduction = generator.baseProduction * generator.owned;
        
        // Apply upgrades
        upgrades.forEach((upgrade) => {
          if (upgrade.purchased && upgrade.generatorId === generator.id) {
            generatorProduction *= upgrade.multiplier;
          }
        });
        
        // Apply prestige multiplier
        generatorProduction *= prestigeMultiplier;
        
        return total + generatorProduction;
      }
      return total;
    }, 0);
  }, [generators, upgrades, prestigeMultiplier]);
  
  return (
    <View style={styles.container}>
      <View style={styles.coinsContainer}>
        <Coins size={24} color={Colors.dark.accent} />
        <Text style={styles.coinsText}>{formatNumber(coins)}</Text>
      </View>
      <Text style={styles.productionText}>
        {productionPerSecond > 0 
          ? `+${formatNumber(productionPerSecond)}/sec` 
          : 'No production yet'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  coinsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginLeft: 8,
  },
  productionText: {
    fontSize: 14,
    color: Colors.dark.success,
    marginTop: 4,
  },
});