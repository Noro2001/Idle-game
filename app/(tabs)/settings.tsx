import React from 'react';
import { StyleSheet, View, Text, Pressable, Alert, ScrollView, SafeAreaView, Platform } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { useStats } from '@/contexts/StatsContext';
import Colors from '@/constants/colors';
import { Trash2, Info, Github } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const { resetGame } = useGame();
  const { resetStats } = useStats();
  
  const handleResetGame = () => {
    if (Platform.OS === 'web') {
      if (confirm("Are you sure you want to reset your game? All progress will be lost!")) {
        resetGame();
        resetStats();
      }
    } else {
      Alert.alert(
        "Reset Game",
        "Are you sure you want to reset your game? All progress will be lost!",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          { 
            text: "Reset", 
            onPress: () => {
              resetGame();
              resetStats();
              
              // Provide haptic feedback
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            },
            style: "destructive"
          }
        ]
      );
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Options</Text>
          
          <Pressable style={styles.button} onPress={handleResetGame}>
            <Trash2 size={20} color={Colors.dark.error} />
            <Text style={[styles.buttonText, styles.dangerText]}>Reset Game</Text>
          </Pressable>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.infoCard}>
            <Info size={20} color={Colors.dark.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Idle Game</Text>
              <Text style={styles.infoText}>
                A simple idle game where you can earn coins, buy generators, and upgrade your production.
              </Text>
            </View>
          </View>
          
          <View style={styles.infoCard}>
            <Github size={20} color={Colors.dark.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Version</Text>
              <Text style={styles.infoText}>1.0.0</Text>
            </View>
          </View>
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 10,
  },
  dangerText: {
    color: Colors.dark.error,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  infoContent: {
    marginLeft: 10,
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: Colors.dark.subtext,
  },
});