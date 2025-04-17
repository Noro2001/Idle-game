import React from 'react';
import { StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Colors from '@/constants/colors';
import StatsDisplay from '@/components/StatsDisplay';

export default function StatsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <StatsDisplay />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  scrollContent: {
    padding: 16,
  },
});