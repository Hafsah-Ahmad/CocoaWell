import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { DBService } from '@/lib/db-service';

const COLORS = {
  primary: '#1B5E52',
  primaryLight: '#EAF2F0',
  background: '#F4F4F0',
  white: '#FFFFFF',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  border: '#E2E2DC',
  chipBg: '#EFEFEB',
  inputBg: '#F4F4F0',
};

const LIFESTYLE_OPTIONS = [
  'Student',
  'Working Professional',
  'Stay-at-Home',
  'Entrepreneur',
  'Shift Worker',
  'Other',
];

interface ActivityLevel {
  label: string;
  description: string;
}

const ACTIVITY_LEVELS: ActivityLevel[] = [
  { label: 'Sedentary', description: 'Little to no exercise, desk job' },
  { label: 'Lightly Active', description: 'Light exercise 1–3 days / week' },
  { label: 'Moderately Active', description: 'Moderate exercise 3–5 days / week' },
  { label: 'Very Active', description: 'Hard exercise 6–7 days / week' },
  { label: 'Highly Active', description: 'Physical job or training 2x/day' },
];

const TOTAL_STEPS = 5;
const CURRENT_STEP = 2;

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [age, setAge] = useState('25');
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('70');
  const [selectedLifestyle, setSelectedLifestyle] = useState('Working Professional');
  const [selectedActivity, setSelectedActivity] = useState('Lightly Active');

  const handleContinue = async () => {
    try {
      await DBService.saveProfile({
        age: parseInt(age) || 25,
        height: parseFloat(height) || 170,
        weight: parseFloat(weight) || 60,
        lifestyle: selectedLifestyle,
        activity_level: selectedActivity,
      });
    } catch (e) {
      console.warn('Error saving profile questionnaire:', e);
    }
    router.replace('/(tabs)/home' as any);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.7}>
          <Feather name="arrow-left" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wellness Journey</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Progress Row */}
      <View style={styles.progressRow}>
        <Text style={styles.progressLabel}>Profile Setup</Text>
        <Text style={styles.progressStep}>Step {CURRENT_STEP} of {TOTAL_STEPS}</Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${(CURRENT_STEP / TOTAL_STEPS) * 100}%` }]} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Personalized Wellness</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Tell us about yourself</Text>
        <Text style={styles.subtitle}>
          We use this information to tailor your daily routines, nutrition advice, and wellness goals
          specifically to your biological profile.
        </Text>

        {/* Form Card */}
        <View style={styles.card}>

          {/* Age */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Age</Text>
            <View style={styles.inputRow}>
              <Ionicons name="calendar-outline" size={17} color={COLORS.textSecondary} style={styles.inputLeadIcon} />
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>
          </View>

          {/* Height */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Height</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholderTextColor={COLORS.textSecondary}
              />
              <View style={styles.unitBadge}>
                <Text style={styles.unitText}>cm</Text>
              </View>
            </View>
          </View>

          {/* Weight */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Weight</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholderTextColor={COLORS.textSecondary}
              />
              <View style={styles.unitBadge}>
                <Text style={styles.unitText}>kg</Text>
              </View>
            </View>
          </View>

          {/* Lifestyle */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>What best describes your lifestyle?</Text>
            <View style={styles.chipsWrap}>
              {LIFESTYLE_OPTIONS.map((item) => {
                const isSelected = selectedLifestyle === item;
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => setSelectedLifestyle(item)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Activity Level */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Physical Activity Level</Text>
            {ACTIVITY_LEVELS.map((item) => {
              const isSelected = selectedActivity === item.label;
              return (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.activityRow, isSelected && styles.activityRowSelected]}
                  onPress={() => setSelectedActivity(item.label)}
                  activeOpacity={0.8}
                >
                  <View style={styles.activityTextBlock}>
                    <Text style={[styles.activityLabel, isSelected && styles.activityLabelSelected]}>
                      {item.label}
                    </Text>
                    <Text style={styles.activityDesc}>{item.description}</Text>
                  </View>
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={handleContinue}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
        <Text style={styles.footerNote}>
          Your profile helps us create a more{'\n'}personalized wellness experience.
        </Text>

        {/* Onboarding Step Dots */}
        <View style={styles.dotsRow}>
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i + 1 === CURRENT_STEP && styles.dotActive]}
            />
          ))}
        </View>

        {/* Home Indicator Bar */}
        <View style={styles.homeIndicator} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 10,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    letterSpacing: 0.1,
  },

  /* Progress */
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
  },
  progressStep: {
    fontSize: 11.5,
    color: COLORS.primary,
    fontWeight: '500',
  },
  progressTrack: {
    height: 3,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
    borderRadius: 2,
    marginBottom: 6,
  },
  progressFill: {
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },

  /* Scroll */
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
  },

  /* Badge */
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 5,
    marginBottom: 14,
    backgroundColor: COLORS.white,
  },
  badgeText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
  },

  /* Title */
  title: {
    fontSize: 25,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 9,
    lineHeight: 31,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13.5,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 22,
  },

  /* Card */
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
    gap: 18,
  },

  /* Field */
  fieldGroup: { gap: 7 },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.text,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputLeadIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 0,
  },
  unitBadge: {
    backgroundColor: COLORS.white,
    borderRadius: 7,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  unitText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },

  /* Lifestyle chips */
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: COLORS.chipBg,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: COLORS.white,
  },

  /* Activity rows */
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 7,
    backgroundColor: COLORS.white,
    minHeight: 64,
  },
  activityRowSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  activityTextBlock: {
    flex: 1,
    gap: 3,
  },
  activityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  activityLabelSelected: {
    color: COLORS.primary,
  },
  activityDesc: {
    fontSize: 12,
    color: COLORS.textSecondary,
    lineHeight: 17,
  },
  radio: {
    width: 21,
    height: 21,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  radioDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },

  /* Footer */
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    gap: 8,
  },
  continueBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    height: 52,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  continueBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  footerNote: {
    fontSize: 11.5,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
  },

  /* Step dots */
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },

  /* Home indicator */
  homeIndicator: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.text,
    opacity: 0.15,
    marginTop: 6,
  },
});
