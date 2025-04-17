import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import Colors from '@/constants/colors';
import CoinButton from '@/components/CoinButton';
import GeneratorItem from '@/components/GeneratorItem';
import ResourceDisplay from '@/components/ResourceDisplay';
import PrestigeButton from '@/components/PrestigeButton';

export default function GameScreen() {
  // Get only the data we need from the context
  const { state } = useGame();
  
  // Add a check to make sure state and generators are defined
  if (!state || !state.generators) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.dark.primary} />
        <Text style={styles.loadingText}>Loading game...</Text>
      </SafeAreaView>
    );
  }
  
  const unlockedGenerators = state.generators.filter(g => g.unlocked);
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ResourceDisplay />
        
        <CoinButton />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Generators</Text>
          {unlockedGenerators.length > 0 ? (
            unlockedGenerators.map((generator) => (
              <GeneratorItem key={generator.id} generator={generator} />
            ))
          ) : (
            <Text style={styles.emptyText}>No generators available yet</Text>
          )}
        </View>
        
        <PrestigeButton />
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