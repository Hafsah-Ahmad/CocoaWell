import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const COLORS = {
  primary: '#16443E',
  primaryLight: '#1F5C54',
  mint: '#DCEAE5',
  background: '#F4F5F4',
  card: '#FFFFFF',
  textDark: '#1B1F1D',
  textGray: '#6B7280',
  border: '#ECEDEC',
};

interface Reminder {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  iconType: 'feather' | 'ionicons' | 'material';
  enabled: boolean;
}

const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'vitamin',
    title: 'Vitamin Reminder',
    subtitle: 'Daily • 8:00 AM',
    iconName: 'pill',
    iconType: 'material',
    enabled: true,
  },
  {
    id: 'water',
    title: 'Water Intake Reminder',
    subtitle: 'Every 2 Hours',
    iconName: 'water-outline',
    iconType: 'ionicons',
    enabled: true,
  },
  {
    id: 'period',
    title: 'Period Reminder',
    subtitle: '3 Days Before',
    iconName: 'calendar-outline',
    iconType: 'ionicons',
    enabled: true,
  },
  {
    id: 'exercise',
    title: 'Exercise Reminder',
    subtitle: 'Daily • 6:00 PM',
    iconName: 'walk',
    iconType: 'material',
    enabled: false,
  },
];

export default function NotificationsRemindersScreen() {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>(INITIAL_REMINDERS);

  const activeCount = reminders.filter((r) => r.enabled).length;

  const toggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleSave = () => {
    console.log('Saved preferences:', reminders);
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top App Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          <Text style={styles.headerTitleBold}>Cocoa Well</Text>
        </Text>
        <Image
          source={{ uri: 'https://i.pravatar.cc/100?img=47' }}
          style={styles.avatar}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Row */}
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.screenTitle}>Notifications & Reminders</Text>
            <Text style={styles.screenSubtitle}>
              Manage your wellness reminders and alerts.
            </Text>
          </View>
          <TouchableOpacity style={styles.bellButton}>
            <Ionicons name="notifications-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>Reminder Settings</Text>
          </View>
          <Text style={styles.heroTitle}>
            Stay consistent with your wellness habits
          </Text>
          <Text style={styles.heroSubtitleText}>
            Enable reminders for the wellness activities that matter most to
            you.
          </Text>
          <View style={styles.heroFooter}>
            <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" />
            <Text style={styles.heroFooterText}>
              {activeCount} Active Reminders
            </Text>
          </View>
        </View>

        {/* Reminder Preferences */}
        <Text style={styles.sectionTitle}>Reminder Preferences</Text>
        <Text style={styles.sectionSubtitle}>
          Choose which wellness reminders you would like to receive.
        </Text>

        {reminders.map((reminder) => (
          <View key={reminder.id} style={styles.reminderCard}>
            <View style={styles.reminderIconWrap}>
              {reminder.iconType === 'material' ? (
                <MaterialCommunityIcons name={reminder.iconName as any} size={20} color={COLORS.primary} />
              ) : (
                <Ionicons name={reminder.iconName as any} size={20} color={COLORS.primary} />
              )}
            </View>
            <View style={styles.reminderTextWrap}>
              <Text style={styles.reminderTitle}>{reminder.title}</Text>
              <Text style={styles.reminderSubtitle}>{reminder.subtitle}</Text>
            </View>
            <Switch
              value={reminder.enabled}
              onValueChange={() => toggleReminder(reminder.id)}
              trackColor={{ false: '#E2E4E3', true: COLORS.primary }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#E2E4E3"
            />
          </View>
        ))}

        {/* Wellness Tip */}
        <View style={styles.tipCard}>
          <Ionicons
            name="leaf-outline"
            size={18}
            color={COLORS.primary}
            style={styles.tipIcon}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.tipTitle}>Wellness Tip</Text>
            <Text style={styles.tipText}>
              Gentle reminders can help build healthy routines without
              overwhelming your day.
            </Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.85}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Preferences</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: COLORS.primary,
  },
  headerTitleBold: {
    fontWeight: '700',
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
  },
  screenSubtitle: {
    fontSize: 13.5,
    color: COLORS.textGray,
    lineHeight: 19,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  heroCard: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 22,
    marginBottom: 28,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  heroBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 21,
    fontWeight: '700',
    lineHeight: 27,
    marginBottom: 10,
  },
  heroSubtitleText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13.5,
    lineHeight: 19,
    marginBottom: 18,
  },
  heroFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroFooterText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13.5,
    color: COLORS.textGray,
    lineHeight: 19,
    marginBottom: 16,
  },
  reminderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  reminderIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: COLORS.mint,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  reminderTextWrap: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 3,
  },
  reminderSubtitle: {
    fontSize: 12.5,
    color: COLORS.textGray,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  tipIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  tipTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 13,
    color: COLORS.textGray,
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
  },
});
