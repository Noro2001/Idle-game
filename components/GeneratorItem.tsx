import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { useStats } from '@/contexts/StatsContext';
import { Generator } from '@/types/game';
import { formatNumber } from '@/utils/formatters';
import Colors from '@/constants/colors';
import * as Icons from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface GeneratorItemProps {
  generator: Generator;
}

export default function GeneratorItem({ generator }: GeneratorItemProps) {
  // Get state and actions from contexts
  const { state, buyGenerator } = useGame();
  const { incrementGeneratorsBought } = useStats();
  
  const { upgrades, prestigeMultiplier, coins } = state;
  
  // Calculate cost with useMemo to avoid recalculation on every render
  const cost = useMemo(() => {
    return Math.floor(generator.baseCost * Math.pow(1.15, generator.owned));
  }, [generator.baseCost, generator.owned]);
  
  const canAfford = coins >= cost;
  
  // Calculate production with useMemo to avoid recalculation on every render
  const production = useMemo(() => {
    let totalProduction = generator.baseProduction * generator.owned;
    
    // Apply upgrades
    upgrades.forEach((upgrade) => {
      if (upgrade.purchased && upgrade.generatorId === generator.id) {
        totalProduction *= upgrade.multiplier;
      }
    });
    
    // Apply prestige multiplier
    totalProduction *= prestigeMultiplier;
    
    return totalProduction;
  }, [generator, upgrades, prestigeMultiplier]);
  
  // Use useCallback to prevent recreation of this function on every render
  const handleBuy = useCallback(() => {
    if (canAfford) {
      buyGenerator(generator.id);
      incrementGeneratorsBought(1);
      
      // Provide haptic feedback on mobile
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  }, [canAfford, buyGenerator, generator.id, incrementGeneratorsBought]);
  
  // Dynamically get the icon component
  const IconComponent = (Icons as any)[generator.icon] || Icons.Package;
  
  return (
    <Pressable
      style={[
        styles.container,
        !canAfford && styles.disabled
      ]}
      onPress={handleBuy}
      disabled={!canAfford}
    >
      <View style={styles.iconContainer}>
        <IconComponent size={24} color={Colors.dark.text} />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{generator.name}</Text>
          <Text style={styles.owned}>{generator.owned}</Text>
        </View>
        <Text style={styles.description}>{generator.description}</Text>
        <View style={styles.footer}>
          <Text style={styles.production}>
            {generator.owned > 0 ? `${formatNumber(production)}/sec` : 'No production'}
          </Text>
          <Text style={[styles.cost, !canAfford && styles.costDisabled]}>
            {formatNumber(cost)} coins
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  disabled: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  owned: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.primary,
  },
  description: {
    fontSize: 12,
    color: Colors.dark.subtext,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  production: {
    fontSize: 12,
    color: Colors.dark.success,
  },
  cost: {
    fontSize: 12,
    color: Colors.dark.accent,
  },
  costDisabled: {
    color: Colors.dark.error,
  },
});