import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

export default function Screen14() {
  return (
    <View>
      <Text>Screen 14</Text>
    </View>
  );
}

const MOCK_USER = {
  name: 'Fatima Ahmed',
  membershipLabel: 'Wellness Member',
  memberSince: 'Member since January 2026',
  avatar: 'https://i.pravatar.cc/150?img=47',
  age: '29 Years',
  email: 'fatima@example.com',
  height: '165 cm',
  weight: '62 kg',
  activityLevel: 'Moderately Active',
  primaryGoal: 'Improve Energy & Balance',
};

const PreferenceRow = ({ icon, iconBg, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.rowItem} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.rowIconWrap, { backgroundColor: iconBg }]}>{icon}</View>
    <View style={styles.rowTextWrap}>
      <Text style={styles.rowTitle}>{title}</Text>
      <Text style={styles.rowSubtitle}>{subtitle}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#A0AAB2" />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Profile</Text>
            <Text style={styles.headerSubtitle}>
              Manage your personal wellness information.
            </Text>
          </View>
          <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
            <Ionicons name="settings-outline" size={22} color="#1B4D43" />
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: MOCK_USER.avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.avatarEditBadge} activeOpacity={0.7}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{MOCK_USER.name}</Text>
          <View style={styles.membershipBadge}>
            <View style={styles.membershipDot} />
            <Text style={styles.membershipText}>{MOCK_USER.membershipLabel}</Text>
          </View>
          <Text style={styles.memberSince}>{MOCK_USER.memberSince}</Text>
        </View>

        {/* Personal Details */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Ionicons name="person-outline" size={18} color="#1B4D43" />
            <Text style={styles.cardHeaderTitle}>Personal Details</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>{MOCK_USER.name}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Age</Text>
            <Text style={styles.detailValue}>{MOCK_USER.age}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Email</Text>
            <Text style={styles.detailValue}>{MOCK_USER.email}</Text>
          </View>
        </View>

        {/* Wellness Profile */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <MaterialCommunityIcons name="chart-box-outline" size={18} color="#1B4D43" />
            <Text style={styles.cardHeaderTitle}>Wellness Profile</Text>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Height</Text>
              <Text style={styles.statValue}>{MOCK_USER.height}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Weight</Text>
              <Text style={styles.statValue}>{MOCK_USER.weight}</Text>
            </View>
          </View>

          <View style={styles.fullStatBox}>
            <Text style={styles.statLabel}>Activity Level</Text>
            <Text style={styles.statValue}>{MOCK_USER.activityLevel}</Text>
          </View>

          <View style={styles.goalBox}>
            <Text style={styles.goalLabel}>Primary Wellness Goal</Text>
            <Text style={styles.goalValue}>{MOCK_USER.primaryGoal}</Text>
          </View>
        </View>

        {/* Account Preferences */}
        <Text style={styles.sectionTitle}>Account Preferences</Text>
        <View style={styles.card}>
          <PreferenceRow
            icon={<Ionicons name="pricetag-outline" size={18} color="#5B6CC4" />}
            iconBg="#EDEFFB"
            title="Notifications"
            subtitle="Manage wellness reminders"
          />
          <View style={styles.divider} />
          <PreferenceRow
            icon={<Ionicons name="phone-portrait-outline" size={18} color="#5B6CC4" />}
            iconBg="#EDEFFB"
            title="App Preferences"
            subtitle="Customize your experience"
          />
        </View>

        {/* Privacy & Security */}
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        <View style={styles.card}>
          <PreferenceRow
            icon={<Ionicons name="shield-outline" size={18} color="#5B6670" />}
            iconBg="#EEF0F1"
            title="Privacy Settings"
            subtitle="Control personal information visibility"
          />
          <View style={styles.divider} />
          <PreferenceRow
            icon={<Ionicons name="lock-closed-outline" size={18} color="#5B6670" />}
            iconBg="#EEF0F1"
            title="Change Password"
            subtitle="Update account security"
          />
          <View style={styles.divider} />
          <PreferenceRow
            icon={<Ionicons name="server-outline" size={18} color="#5B6670" />}
            iconBg="#EEF0F1"
            title="Data Permissions"
            subtitle="Manage wellness data access"
          />
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.editProfileButton} activeOpacity={0.85}>
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.privacyButton} activeOpacity={0.85}>
          <Text style={styles.privacyButtonText}>Privacy Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signOutButton} activeOpacity={0.7}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F7',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1B4D43',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#7C8790',
    marginTop: 4,
    maxWidth: 240,
  },
  settingsButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  profileCard: {
    backgroundColor: '#1B4D43',
    borderRadius: 22,
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 18,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#3FBFAE',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1B4D43',
  },
  profileName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  membershipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 8,
  },
  membershipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7EE8C8',
    marginRight: 6,
  },
  membershipText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  memberSince: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B4D43',
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8A949C',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEF0F1',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#F4F6F7',
    borderRadius: 14,
    padding: 14,
  },
  fullStatBox: {
    backgroundColor: '#F4F6F7',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 12,
    color: '#8A949C',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  goalBox: {
    backgroundColor: '#E4F2EE',
    borderRadius: 14,
    padding: 14,
  },
  goalLabel: {
    fontSize: 12,
    color: '#4C8579',
    marginBottom: 6,
  },
  goalValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1B4D43',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1B4D43',
    marginBottom: 12,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowTextWrap: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  rowSubtitle: {
    fontSize: 12,
    color: '#8A949C',
    marginTop: 2,
  },
  editProfileButton: {
    backgroundColor: '#1B4D43',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  editProfileButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  privacyButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#1B4D43',
  },
  privacyButtonText: {
    color: '#1B4D43',
    fontSize: 15,
    fontWeight: '700',
  },
  signOutButton: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  signOutText: {
    color: '#E0524C',
    fontSize: 14,
    fontWeight: '600',
  },
});