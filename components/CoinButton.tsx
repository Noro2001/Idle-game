import React, { useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, Animated } from 'react-native';
import { useGame } from '@/contexts/GameContext';
import { useStats } from '@/contexts/StatsContext';
import { Coins } from 'lucide-react-native';
import Colors from '@/constants/colors';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function CoinButton() {
  // Get actions from contexts
  const { incrementCoins } = useGame();
  const { incrementClicks } = useStats();
  
  const animatedScale = new Animated.Value(1);
  
  // Use useCallback to prevent recreation of this function on every render
  const handlePress = useCallback(() => {
    // Add 1 coin per click
    incrementCoins(1);
    incrementClicks();
    
    // Provide haptic feedback on mobile
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // Animate the button
    Animated.sequence([
      Animated.timing(animatedScale, {
        toValue: 0.9,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animatedScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [incrementCoins, incrementClicks, animatedScale]);
  
  return (
    <View style={styles.container}>
      <Pressable onPress={handlePress}>
        <Animated.View 
          style={[
            styles.button,
            { transform: [{ scale: animatedScale }] }
          ]}
        >
          <Coins size={60} color={Colors.dark.accent} />
          <Text style={styles.text}>Tap to earn coins</Text>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  button: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.dark.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.dark.accent,
    shadowColor: Colors.dark.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    color: Colors.dark.text,
    marginTop: 10,
    fontSize: 14,
  },
});