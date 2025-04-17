import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Achievement } from '@/types/game';
import Colors from '@/constants/colors';
import * as Icons from 'lucide-react-native';

interface AchievementItemProps {
  achievement: Achievement;
}

export default function AchievementItem({ achievement }: AchievementItemProps) {
  // Dynamically get the icon component
  const IconComponent = (Icons as any)[achievement.icon] || Icons.Award;
  
  return (
    <View style={[
      styles.container,
      achievement.unlocked ? styles.unlocked : styles.locked
    ]}>
      <View style={[
        styles.iconContainer,
        achievement.unlocked ? styles.unlockedIcon : styles.lockedIcon
      ]}>
        <IconComponent 
          size={20} 
          color={achievement.unlocked ? Colors.dark.text : Colors.dark.disabled} 
        />
      </View>
      <View style={styles.content}>
        <Text style={[
          styles.name,
          achievement.unlocked ? styles.unlockedText : styles.lockedText
        ]}>
          {achievement.name}
        </Text>
        <Text style={[
          styles.description,
          achievement.unlocked ? styles.unlockedSubtext : styles.lockedSubtext
        ]}>
          {achievement.description}
        </Text>
      </View>
      {achievement.unlocked ? (
        <View style={styles.statusContainer}>
          <Icons.CheckCheck size={16} color={Colors.dark.success} />
        </View>
      ) : (
        <View style={styles.statusContainer}>
          <Icons.Lock size={16} color={Colors.dark.disabled} />
        </View>
      )}
    </View>
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
    alignItems: 'center',
  },
  unlocked: {
    borderColor: Colors.dark.success,
  },
  locked: {
    borderColor: Colors.dark.border,
    opacity: 0.7,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  unlockedIcon: {
    backgroundColor: Colors.dark.success,
  },
  lockedIcon: {
    backgroundColor: Colors.dark.disabled,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  unlockedText: {
    color: Colors.dark.text,
  },
  lockedText: {
    color: Colors.dark.disabled,
  },
  description: {
    fontSize: 12,
  },
  unlockedSubtext: {
    color: Colors.dark.subtext,
  },
  lockedSubtext: {
    color: Colors.dark.disabled,
  },
  statusContainer: {
    paddingHorizontal: 8,
  },
});