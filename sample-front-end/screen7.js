import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

export default function Screen7() {
  return (
    <View>
      <Text>Screen 7</Text>
    </View>
  );
}

const COLORS = {
  primary: '#1A6B5A',
  primaryLight: '#E8F4F1',
  accent: '#2D9B83',
  background: '#F7F9F8',
  white: '#FFFFFF',
  textDark: '#1A1A1A',
  textMedium: '#4A4A4A',
  textLight: '#888888',
  border: '#E8ECEB',
  tipBorder: '#2D9B83',
};

const mockData = {
  userName: 'Serena',
  mood: 'Happy',
  moodLogged: '2 hours ago',
  nextPeriod: 'In 8 Days',
  periodExpected: 'Expected Jul 02',
  vitaminsRemaining: 3,
  vitaminsNote: 'Take before dinner',
  wellnessScore: 82,
  wellnessLabel: 'Great progress',
  wellnessFeedback:
    "You're maintaining strong wellness habits this week. Keep logging moods and symptoms to improve insights.",
  wellnessTip:
    'Staying hydrated throughout the day can improve energy levels, mood, and overall wellness.',
};

const StatCard = ({ icon, label, value, subValue }) => (
  <View style={styles.statCard}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statSub}>{subValue}</Text>
  </View>
);

const QuickActionButton = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.quickActionIcon}>
      <Text style={styles.quickActionEmoji}>{icon}</Text>
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/80?img=47' }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.greeting}>
                Gooé Mornin{'\u0307'},{'\n'}
                <Text style={styles.greetingName}>{mockData.userName}</Text>
              </Text>
              <Text style={styles.greetingSub}>Let's make today a healthy day</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="😊"
            label="Today's Mood"
            value={mockData.mood}
            subValue={`Logged ${mockData.moodLogged}`}
          />
          <StatCard
            icon="📅"
            label="Next Period"
            value={mockData.nextPeriod}
            subValue={mockData.periodExpected}
          />
          <StatCard
            icon="💊"
            label="Today's Vitamins"
            value={`${mockData.vitaminsRemaining}\nRemaining`}
            subValue={mockData.vitaminsNote}
          />
          <StatCard
            icon="🌿"
            label="Wellness Score"
            value={`${mockData.wellnessScore}%`}
            subValue={mockData.wellnessLabel}
          />
        </View>

        {/* Wellness Score Card */}
        <View style={styles.wellnessCard}>
          <Text style={styles.wellnessBigScore}>{mockData.wellnessScore}</Text>
          <Text style={styles.wellnessPercent}>%</Text>
          <View style={styles.wellnessTitleRow}>
            <Text style={styles.wellnessTitle}>Your We</Text>
            <Text style={styles.wellnessTitleAccent}>⚙</Text>
            <Text style={styles.wellnessTitle}>ness Score</Text>
          </View>
          <Text style={styles.wellnessFeedback}>{mockData.wellnessFeedback}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <QuickActionButton icon="📋" label={`Log\nSymptoms`} onPress={() => {}} />
            <QuickActionButton icon="😊" label={`Track\nMood`} onPress={() => {}} />
            <QuickActionButton icon="📆" label={`Add Cycle`} onPress={() => {}} />
          </View>
        </View>

        {/* Wellness Tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipAccent} />
          <View style={styles.tipContent}>
            <View style={styles.tipHeader}>
              <Text style={styles.tipBulb}>💡</Text>
              <Text style={styles.tipTitle}>Today's Wellness Tip</Text>
            </View>
            <Text style={styles.tipText}>{mockData.wellnessTip}</Text>
          </View>
        </View>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🏠', label: 'Home', active: true },
          { icon: '📋', label: 'Symptoms', active: false },
          { icon: '🔄', label: 'Cycle', active: false },
          { icon: '🌿', label: 'Wellness', active: false },
          { icon: '👤', label: 'Profile', active: false },
        ].map((tab) => (
          <TouchableOpacity key={tab.label} style={styles.navTab} activeOpacity={0.7}>
            <View style={[styles.navIconWrap, tab.active && styles.navIconActive]}>
              <Text style={styles.navIcon}>{tab.icon}</Text>
            </View>
            <Text style={[styles.navLabel, tab.active && styles.navLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginRight: 12,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    lineHeight: 26,
  },
  greetingName: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.primary,
  },
  greetingSub: {
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 2,
  },
  bellBtn: {
    padding: 4,
  },
  bellIcon: {
    fontSize: 22,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    width: '47%',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    lineHeight: 24,
  },
  statSub: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 3,
  },

  // Wellness Score Card
  wellnessCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  wellnessBigScore: {
    fontSize: 64,
    fontWeight: '800',
    color: COLORS.primary,
    lineHeight: 72,
  },
  wellnessPercent: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '600',
    marginTop: -6,
    marginBottom: 12,
  },
  wellnessTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  wellnessTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  wellnessTitleAccent: {
    fontSize: 16,
    color: COLORS.accent,
    marginHorizontal: 2,
  },
  wellnessFeedback: {
    fontSize: 14,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 21,
    paddingHorizontal: 8,
  },

  // Quick Actions
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 16,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickAction: {
    alignItems: 'center',
    gap: 8,
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionEmoji: {
    fontSize: 24,
  },
  quickActionLabel: {
    fontSize: 12,
    color: COLORS.textMedium,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 17,
  },

  // Tip Card
  tipCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 8,
  },
  tipAccent: {
    width: 5,
    backgroundColor: COLORS.tipBorder,
  },
  tipContent: {
    flex: 1,
    padding: 16,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  tipBulb: {
    fontSize: 16,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  tipText: {
    fontSize: 13,
    color: COLORS.textMedium,
    lineHeight: 20,
  },

  // Bottom Nav
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  navTab: {
    alignItems: 'center',
    gap: 3,
  },
  navIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconActive: {
    backgroundColor: COLORS.primary,
  },
  navIcon: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});