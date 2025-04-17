import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, Alert, Platform, ActivityIndicator } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { useStats } from '@/contexts/StatsContext';
import { formatNumber } from '@/utils/formatters';
import Colors from '@/constants/colors';
import { RefreshCcw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function PrestigeButton() {
  const { state, prestige } = useGame();
  const { incrementPrestigeCount } = useStats();
  
  // Add a check to make sure state is defined
  if (!state) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={Colors.dark.primary} />
      </View>
    );
  }
  
  const { totalCoinsEarned, prestigeLevel } = state;
  
  const prestigeThreshold = 1000000 * Math.pow(10, prestigeLevel);
  const canPrestige = totalCoinsEarned >= prestigeThreshold;
  const nextMultiplier = 1 + ((prestigeLevel + 1) * 0.1);
  
  // Use useCallback to prevent recreation of this function on every render
  const handlePrestige = useCallback(() => {
    if (!canPrestige) return;
    
    if (Platform.OS === 'web') {
      if (confirm("Are you sure you want to prestige? You'll lose all your progress but gain a permanent multiplier.")) {
        prestige();
        incrementPrestigeCount();
      }
    } else {
      Alert.alert(
        "Prestige Confirmation",
        "Are you sure you want to prestige? You'll lose all your progress but gain a permanent multiplier.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Prestige", 
            onPress: () => {
              prestige();
              incrementPrestigeCount();
              
              // Provide haptic feedback
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            },
            style: "destructive"
          }
        ]
      );
    }
  }, [canPrestige, prestige, incrementPrestigeCount]);
  
  return (
    <Pressable
      style={[
        styles.container,
        !canPrestige && styles.disabled
      ]}
      onPress={handlePrestige}
      disabled={!canPrestige}
    >
      <View style={styles.content}>
        <RefreshCcw size={20} color={Colors.dark.text} />
        <Text style={styles.text}>Prestige</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Next multiplier: x{nextMultiplier.toFixed(1)}
        </Text>
        <Text style={styles.progressText}>
          {formatNumber(totalCoinsEarned)} / {formatNumber(prestigeThreshold)}
        </Text>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar,
              { width: `${Math.min(100, (totalCoinsEarned / prestigeThreshold) * 100)}%` }
            ]} 
          />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.dark.secondary,
  },
  loadingContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  disabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginLeft: 8,
  },
  infoContainer: {
    marginTop: 4,
  },
  infoText: {
    fontSize: 14,
    color: Colors.dark.secondary,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: Colors.dark.subtext,
    marginBottom: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: Colors.dark.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.dark.secondary,
  },
});