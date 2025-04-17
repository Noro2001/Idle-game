import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { useStats } from '@/contexts/StatsContext';
import { Upgrade } from '@/types/game';
import { formatNumber } from '@/utils/formatters';
import Colors from '@/constants/colors';
import * as Icons from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface UpgradeItemProps {
  upgrade: Upgrade;
}

export default function UpgradeItem({ upgrade }: UpgradeItemProps) {
  const { state, buyUpgrade } = useGame();
  const { incrementUpgradesBought } = useStats();
  
  const canAfford = state.coins >= upgrade.cost && !upgrade.purchased;
  
  const handleBuy = useCallback(() => {
    if (canAfford) {
      buyUpgrade(upgrade.id);
      incrementUpgradesBought(1);
      
      // Provide haptic feedback on mobile
      if (Platform.OS !== 'web') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  }, [canAfford, buyUpgrade, upgrade.id, incrementUpgradesBought]);
  
  // Dynamically get the icon component
  const IconComponent = (Icons as any)[upgrade.icon] || Icons.ArrowUp;
  
  if (upgrade.purchased) {
    return (
      <View style={[styles.container, styles.purchased]}>
        <View style={[styles.iconContainer, styles.purchasedIcon]}>
          <IconComponent size={20} color={Colors.dark.text} />
        </View>
        <View style={styles.content}>
          <Text style={styles.name}>{upgrade.name}</Text>
          <Text style={styles.description}>{upgrade.description}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.purchasedText}>Purchased</Text>
        </View>
      </View>
    );
  }
  
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
        <IconComponent size={20} color={Colors.dark.text} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{upgrade.name}</Text>
        <Text style={styles.description}>{upgrade.description}</Text>
      </View>
      <View style={styles.costContainer}>
        <Text style={[styles.cost, !canAfford && styles.costDisabled]}>
          {formatNumber(upgrade.cost)}
        </Text>
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
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
  purchased: {
    borderColor: Colors.dark.success,
    opacity: 0.8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  purchasedIcon: {
    backgroundColor: Colors.dark.success,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  description: {
    fontSize: 12,
    color: Colors.dark.subtext,
  },
  costContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.dark.primary,
    borderRadius: 12,
  },
  statusContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.dark.success,
    borderRadius: 12,
  },
  cost: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  costDisabled: {
    color: Colors.dark.error,
  },
  purchasedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
});