import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useStats } from '@/contexts/StatsContext';
import { formatNumber, formatTime } from '@/utils/formatters';
import Colors from '@/constants/colors';

export default function StatsDisplay() {
  const { stats } = useStats();
  
  const gameStartedDate = new Date(stats.gameStartedAt).toLocaleDateString();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Statistics</Text>
      
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Total Clicks:</Text>
        <Text style={styles.statValue}>{formatNumber(stats.totalClicks)}</Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Total Coins Earned:</Text>
        <Text style={styles.statValue}>{formatNumber(stats.totalCoinsEarned)}</Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Total Time Played:</Text>
        <Text style={styles.statValue}>{formatTime(stats.totalTimeSpent)}</Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Generators Purchased:</Text>
        <Text style={styles.statValue}>{formatNumber(stats.totalGeneratorsBought)}</Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Upgrades Purchased:</Text>
        <Text style={styles.statValue}>{formatNumber(stats.totalUpgradesBought)}</Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Prestige Count:</Text>
        <Text style={styles.statValue}>{stats.totalPrestigeCount}</Text>
      </View>
      
      <View style={styles.statRow}>
        <Text style={styles.statLabel}>Game Started:</Text>
        <Text style={styles.statValue}>{gameStartedDate}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
  statValue: {
    fontSize: 14,
    color: Colors.dark.text,
    fontWeight: '500',
  },
});