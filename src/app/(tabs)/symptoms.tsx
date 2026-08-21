import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import { DBService } from '@/lib/db-service';

const SYMPTOMS = [
  { id: 'headache', label: 'Headache', icon: '🔔' },
  { id: 'fatigue', label: 'Fatigue', icon: '🛌' },
  { id: 'stress', label: 'Stress', icon: '☁️' },
  { id: 'cramps', label: 'Cramps', icon: '〰️' },
  { id: 'low_energy', label: 'Low Energy', icon: '🔋' },
];

const PRIMARY = '#1B4F4A';
const BG = '#F5F5F0';
const CARD_BG = '#FFFFFF';
const TEXT_DARK = '#1A1A1A';
const TEXT_MID = '#555';
const TEXT_LIGHT = '#999';
const BORDER = '#E8E8E0';

export default function SymptomTrackerScreen() {
  const router = useRouter();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['fatigue']);
  const [severity, setSeverity] = useState(7);
  const [notes, setNotes] = useState('');

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: undefined,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Symptom Tracker</Text>
          <Text style={styles.headerSub}>Track how you're feeling today</Text>
        </View>
        <TouchableOpacity 
          style={styles.historyBtn} 
          onPress={() => router.push('/wellness-insights' as any)}
        >
          <Text style={styles.historyIcon}>🕐</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Date Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>DATE</Text>
          <View style={styles.dateRow}>
            <Text style={styles.dateText}>Today, {today}</Text>
            <TouchableOpacity style={styles.calIcon}>
              <Text style={styles.calIconText}>📅</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Symptoms */}
        <Text style={styles.sectionTitle}>What symptoms are you experiencing?</Text>
        <View style={styles.symptomsGrid}>
          {SYMPTOMS.map((s) => {
            const active = selectedSymptoms.includes(s.id);
            return (
              <TouchableOpacity
                key={s.id}
                style={[styles.symptomChip, active && styles.symptomChipActive]}
                onPress={() => toggleSymptom(s.id)}
                activeOpacity={0.8}
              >
                <Text style={styles.symptomIcon}>{s.icon}</Text>
                <Text style={[styles.symptomLabel, active && styles.symptomLabelActive]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Severity */}
        <View style={styles.card}>
          <View style={styles.severityHeader}>
            <Text style={styles.severityTitle}>Severity</Text>
            <Text style={styles.severityValue}>{severity} / 10</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={severity}
            onValueChange={setSeverity}
            minimumTrackTintColor={PRIMARY}
            maximumTrackTintColor={BORDER}
            thumbTintColor={PRIMARY}
          />
          <View style={styles.severityLabels}>
            <Text style={styles.severityLabelText}>MILD</Text>
            <Text style={styles.severityLabelText}>MODERATE</Text>
            <Text style={styles.severityLabelText}>SEVERE</Text>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <Text style={styles.notesTitle}>Additional Notes</Text>
          <TextInput
            style={styles.notesInput}
            placeholder="Add anything you'd like to remember about today..."
            placeholderTextColor={TEXT_LIGHT}
            multiline
            value={notes}
            onChangeText={(t) => {
              if (t.length <= 500) setNotes(t);
            }}
            maxLength={500}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{notes.length} / 500</Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity 
          style={styles.saveBtn} 
          activeOpacity={0.85}
          onPress={async () => {
            try {
              await DBService.saveSymptomLog(selectedSymptoms, severity, notes);
              alert('Symptoms saved successfully!');
              router.replace('/(tabs)/home' as any);
            } catch (e) {
              console.warn(e);
            }
          }}
        >
          <Text style={styles.saveBtnText}>Save Symptoms</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BG,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: BG,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: TEXT_DARK,
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 13,
    color: TEXT_MID,
    marginTop: 2,
  },
  historyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  historyIcon: {
    fontSize: 18,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: TEXT_LIGHT,
    letterSpacing: 1,
    marginBottom: 6,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  calIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  calIconText: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 14,
    lineHeight: 22,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  symptomChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: CARD_BG,
    gap: 6,
  },
  symptomChipActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  symptomIcon: {
    fontSize: 14,
  },
  symptomLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: TEXT_DARK,
  },
  symptomLabelActive: {
    color: '#FFFFFF',
  },
  severityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  severityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_DARK,
  },
  severityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_MID,
  },
  slider: {
    width: '100%',
    height: 36,
    marginBottom: 4,
  },
  severityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  severityLabelText: {
    fontSize: 10,
    fontWeight: '600',
    color: TEXT_LIGHT,
    letterSpacing: 0.5,
  },
  notesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_DARK,
    marginBottom: 10,
  },
  notesInput: {
    backgroundColor: BG,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: TEXT_DARK,
    minHeight: 110,
    lineHeight: 20,
  },
  charCount: {
    fontSize: 12,
    color: TEXT_LIGHT,
    textAlign: 'right',
    marginTop: 8,
  },
  saveBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: PRIMARY,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
});
