import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

export default function Screen9() {
  return (
    <View>
      <Text>Screen 9</Text>
    </View>
  );
}

const MOODS = [
  {
    id: 'happy',
    label: 'Happy',
    description: 'Feeling positive and upbeat',
    icon: 'emoticon-happy-outline',
    iconLib: 'material',
  },
  {
    id: 'sad',
    label: 'Sad',
    description: 'Feeling a bit low or reflective',
    icon: 'emoticon-sad-outline',
    iconLib: 'material',
  },
  {
    id: 'anxious',
    label: 'Anxious',
    description: 'Feeling nervous or unsettled',
    icon: 'flower-outline',
    iconLib: 'material',
  },
  {
    id: 'tired',
    label: 'Tired',
    description: 'Low energy and needing rest',
    icon: 'weather-night',
    iconLib: 'material',
  },
  {
    id: 'angry',
    label: 'Angry',
    description: 'Feeling frustrated or upset',
    icon: 'sprout',
    iconLib: 'material',
    wide: true,
  },
];

const MoodIcon = ({ icon, size = 32, color = '#1a6b6b' }) => (
  <MaterialCommunityIcons name={icon} size={size} color={color} />
);

export default function WellnessScreen() {
  const [selectedMood, setSelectedMood] = useState(null);

  const gridMoods = MOODS.filter((m) => !m.wide);
  const wideMoods = MOODS.filter((m) => m.wide);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Mood Tracker</Text>
            <Text style={styles.headerSubtitle}>Track your emotional wellness today.</Text>
          </View>
          <TouchableOpacity style={styles.historyBtn}>
            <Ionicons name="time-outline" size={20} color="#4a4a4a" />
          </TouchableOpacity>
        </View>

        {/* Daily Check-in Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <MaterialCommunityIcons name="star-four-points" size={13} color="#fff" />
            <Text style={styles.badgeText}>DAILY CHECK-IN</Text>
          </View>
        </View>

        {/* Headline */}
        <Text style={styles.headline}>How are you feeling{'\n'}today?</Text>
        <Text style={styles.subtext}>
          Take a moment to check in with yourself and choose the mood that best reflects how
          you're feeling.
        </Text>

        {/* Mood Grid */}
        <View style={styles.moodCard}>
          <View style={styles.moodGrid}>
            {gridMoods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodTile,
                  selectedMood === mood.id && styles.moodTileSelected,
                ]}
                onPress={() => setSelectedMood(mood.id)}
                activeOpacity={0.75}
              >
                <MoodIcon
                  icon={mood.icon}
                  color={selectedMood === mood.id ? '#fff' : '#1a6b6b'}
                />
                <Text
                  style={[
                    styles.moodLabel,
                    selectedMood === mood.id && styles.moodLabelSelected,
                  ]}
                >
                  {mood.label}
                </Text>
                <Text
                  style={[
                    styles.moodDesc,
                    selectedMood === mood.id && styles.moodDescSelected,
                  ]}
                >
                  {mood.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {wideMoods.map((mood) => (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodTileWide,
                selectedMood === mood.id && styles.moodTileSelected,
              ]}
              onPress={() => setSelectedMood(mood.id)}
              activeOpacity={0.75}
            >
              <MoodIcon
                icon={mood.icon}
                color={selectedMood === mood.id ? '#fff' : '#1a6b6b'}
              />
              <View style={styles.moodWideText}>
                <Text
                  style={[
                    styles.moodLabel,
                    styles.moodLabelLeft,
                    selectedMood === mood.id && styles.moodLabelSelected,
                  ]}
                >
                  {mood.label}
                </Text>
                <Text
                  style={[
                    styles.moodDesc,
                    styles.moodDescLeft,
                    selectedMood === mood.id && styles.moodDescSelected,
                  ]}
                >
                  {mood.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveBtn, !selectedMood && styles.saveBtnDisabled]}
          onPress={() => {}}
          activeOpacity={0.85}
          disabled={!selectedMood}
        >
          <Text style={styles.saveBtnText}>Save Mood</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const TEAL = '#1a6b6b';
const TEAL_LIGHT = '#e8f2f2';
const TEAL_MID = '#2d8080';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f6f8',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: TEAL,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#7a8a8a',
    marginTop: 2,
  },
  historyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Badge
  badgeContainer: {
    marginBottom: 14,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: TEAL,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 5,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },

  // Headline
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1a2a2a',
    lineHeight: 36,
    marginBottom: 10,
  },
  subtext: {
    fontSize: 14,
    color: '#6b7a7a',
    lineHeight: 21,
    marginBottom: 22,
  },

  // Mood Card Container
  moodCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },

  // Mood Tile
  moodTile: {
    flex: 1,
    minWidth: '44%',
    backgroundColor: '#f9fafa',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e8eded',
    padding: 16,
    alignItems: 'center',
  },
  moodTileSelected: {
    backgroundColor: TEAL,
    borderColor: TEAL,
  },
  moodLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a2a2a',
    marginTop: 10,
    marginBottom: 4,
    textAlign: 'center',
  },
  moodLabelLeft: {
    textAlign: 'left',
    marginTop: 0,
    marginBottom: 2,
  },
  moodLabelSelected: {
    color: '#fff',
  },
  moodDesc: {
    fontSize: 12,
    color: '#8a9a9a',
    textAlign: 'center',
    lineHeight: 17,
  },
  moodDescLeft: {
    textAlign: 'left',
  },
  moodDescSelected: {
    color: 'rgba(255,255,255,0.8)',
  },

  // Wide tile (Angry)
  moodTileWide: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafa',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e8eded',
    padding: 16,
    gap: 14,
  },
  moodWideText: {
    flex: 1,
  },

  // Footer
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    paddingTop: 10,
    backgroundColor: '#f5f6f8',
  },
  saveBtn: {
    backgroundColor: TEAL_MID,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});