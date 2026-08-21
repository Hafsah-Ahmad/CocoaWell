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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/auth-context';

interface AccountItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  route: string;
}

const ACCOUNT_ITEMS: AccountItem[] = [
  {
    id: 'account-info',
    icon: 'person-outline',
    title: 'Account Information',
    description: 'View your profile and wellness details.',
    route: '/profile-setup',
  },
  {
    id: 'security',
    icon: 'shield-checkmark-outline',
    title: 'Security',
    description: 'Review privacy and account protection.',
    route: '/forgot-password',
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerIconButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#0F4C46" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Cocoa Well</Text>

        <View style={styles.headerRightGroup}>
          <TouchableOpacity 
            style={styles.headerIconButton}
            onPress={() => router.push('/notifications-reminders' as any)}
          >
            <Ionicons name="notifications-outline" size={20} color="#0F4C46" />
          </TouchableOpacity>
          <Image
            source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
            style={styles.avatar}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <Text style={styles.pageTitle}>Settings</Text>
        <Text style={styles.pageSubtitle}>
          Customize your Cocoa Well experience.
        </Text>

        {/* Hero Card */}
        <LinearGradient
          colors={['#0F4C46', '#1B6B62']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>APPLICATION PREFERENCES</Text>
          </View>
          <Text style={styles.heroTitle}>Make Cocoa Well work your way</Text>
          <Text style={styles.heroDescription}>
            Manage notifications, appearance, language preferences, and
            account settings from one place.
          </Text>
        </LinearGradient>

        {/* Preferences */}
        <Text style={styles.sectionLabel}>PREFERENCES</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <Ionicons name="notifications-outline" size={20} color="#0F4C46" />
            </View>
            <View style={styles.rowTextContainer}>
              <Text style={styles.rowTitle}>Notifications</Text>
              <Text style={styles.rowDescription}>
                Receive wellness reminders and updates.
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#D8DEDD', true: '#0F4C46' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D8DEDD"
            />
          </View>
        </View>

        {/* Appearance */}
        <Text style={styles.sectionLabel}>APPEARANCE</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <Ionicons name="moon-outline" size={20} color="#0F4C46" />
            </View>
            <View style={styles.rowTextContainer}>
              <Text style={styles.rowTitle}>Dark Mode</Text>
              <Text style={styles.rowDescription}>
                Use a darker interface for comfort.
              </Text>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#D8DEDD', true: '#0F4C46' }}
              thumbColor="#FFFFFF"
              ios_backgroundColor="#D8DEDD"
            />
          </View>
        </View>

        {/* Language */}
        <Text style={styles.sectionLabel}>LANGUAGE</Text>
        <TouchableOpacity
          style={styles.card}
          onPress={() => {}}
        >
          <View style={styles.row}>
            <View style={styles.iconCircle}>
              <Ionicons name="globe-outline" size={20} color="#0F4C46" />
            </View>
            <View style={styles.rowTextContainer}>
              <Text style={styles.rowTitle}>Language</Text>
              <Text style={styles.rowDescription}>
                Choose your preferred language.
              </Text>
            </View>
            <View style={styles.valueGroup}>
              <Text style={styles.valueText}>English</Text>
              <Ionicons name="chevron-forward" size={18} color="#9AA6A4" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Account */}
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.card}>
          {ACCOUNT_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.row,
                index !== ACCOUNT_ITEMS.length - 1 && styles.rowDivider,
              ]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.iconCircle}>
                <Ionicons name={item.icon as any} size={20} color="#0F4C46" />
              </View>
              <View style={styles.rowTextContainer}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowDescription}>{item.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9AA6A4" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <View style={styles.logoutCard}>
          <Text style={styles.logoutTitle}>Logout</Text>
          <Text style={styles.logoutDescription}>
            Sign out of your Cocoa Well account on this device.
          </Text>
          <TouchableOpacity 
            style={styles.logoutButton} 
            activeOpacity={0.8}
            onPress={async () => {
              try {
                await signOut();
              } catch (e) {
                console.warn(e);
              }
            }}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F2F5F4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F2F5F4',
  },
  headerIconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F4C46',
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 8,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F4C46',
    marginTop: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6B7674',
    marginTop: 4,
    marginBottom: 16,
  },
  heroCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 14,
  },
  heroBadgeText: {
    color: '#E3EFEC',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    marginBottom: 10,
  },
  heroDescription: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    lineHeight: 19,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8A9491',
    letterSpacing: 0.5,
    marginBottom: 10,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEF1F0',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EAF1EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTextContainer: {
    flex: 1,
    marginRight: 8,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E2A28',
    marginBottom: 2,
  },
  rowDescription: {
    fontSize: 12.5,
    color: '#7C8784',
    lineHeight: 17,
  },
  valueGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 13.5,
    color: '#0F4C46',
    fontWeight: '600',
    marginRight: 4,
  },
  logoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginTop: 4,
  },
  logoutTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F4C46',
    marginBottom: 6,
  },
  logoutDescription: {
    fontSize: 13,
    color: '#7C8784',
    lineHeight: 18,
    marginBottom: 16,
  },
  logoutButton: {
    borderWidth: 1.5,
    borderColor: '#0F4C46',
    borderRadius: 24,
    paddingVertical: 13,
    alignItems: 'center',
  },
  logoutButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F4C46',
  },
});
