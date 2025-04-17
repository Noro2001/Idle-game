import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import Colors from '@/constants/colors';
import UpgradeItem from '@/components/UpgradeItem';
import ResourceDisplay from '@/components/ResourceDisplay';

export default function UpgradesScreen() {
  const { state } = useGame();
  
  // Add a check to make sure state and upgrades are defined
  if (!state || !state.upgrades) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.dark.primary} />
        <Text style={styles.loadingText}>Loading upgrades...</Text>
      </SafeAreaView>
    );
  }
  
  const upgrades = state.upgrades.filter(u => u.unlocked && !u.purchased);
  const purchasedUpgrades = state.upgrades.filter(u => u.purchased);
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ResourceDisplay />
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Upgrades</Text>
          {upgrades.length > 0 ? (
            upgrades.map((upgrade) => (
              <UpgradeItem key={upgrade.id} upgrade={upgrade} />
            ))
          ) : (
            <Text style={styles.emptyText}>No upgrades available yet</Text>
          )}
        </View>
        
        {purchasedUpgrades.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Purchased Upgrades</Text>
            {purchasedUpgrades.map((upgrade) => (
              <UpgradeItem key={upgrade.id} upgrade={upgrade} />
            ))}
          </View>
        )}
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