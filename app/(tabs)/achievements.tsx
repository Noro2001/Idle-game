import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import Colors from '@/constants/colors';
import AchievementItem from '@/components/AchievementItem';

export default function AchievementsScreen() {
  const { state } = useGame();
  
  // Add a check to make sure state and achievements are defined
  if (!state || !state.achievements) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.dark.primary} />
        <Text style={styles.loadingText}>Loading achievements...</Text>
      </SafeAreaView>
    );
  }
  
  const achievements = state.achievements;
  
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Achievements</Text>
          <Text style={styles.subtitle}>
            {unlockedAchievements.length} / {achievements.length} unlocked
          </Text>
        </View>
        
        {unlockedAchievements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Unlocked</Text>
            {unlockedAchievements.map((achievement) => (
              <AchievementItem key={achievement.id} achievement={achievement} />
            ))}
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Locked</Text>
          {lockedAchievements.length > 0 ? (
            lockedAchievements.map((achievement) => (
              <AchievementItem key={achievement.id} achievement={achievement} />
            ))
          ) : (
            <Text style={styles.emptyText}>You've unlocked all achievements!</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.dark.text,
    marginTop: 16,
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.subtext,
    marginTop: 4,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 10,
  },
  emptyText: {
    color: Colors.dark.subtext,
    textAlign: 'center',
    marginVertical: 20,
  },
});