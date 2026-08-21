import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';
import Svg, { Line, Path } from 'react-native-svg';

export default function Screen13() {
  return (
    <View>
      <Text>Screen 13</Text>
    </View>
  );
}

// ---------- Mock Data ----------

const SYMPTOMS = [
  { label: 'Fatigue', percent: 42 },
  { label: 'Stress', percent: 28 },
  { label: 'Headache', percent: 15 },
  { label: 'Cramps', percent: 10 },
];

const CYCLE_HISTORY = [
  { month: 'Jun', height: 0.78, light: false },
  { month: 'Jul', height: 0.92, light: false },
  { month: 'Aug', height: 0.55, light: true },
];

const RECOMMENDATIONS = [
  {
    title: 'Maintain vitamin routine',
    icon: 'box',
    iconColor: '#7A8B3C',
    iconBg: '#EFF3DD',
    badge: 'HIGH IMPACT',
    badgeBg: '#1B4D4A',
  },
  {
    title: 'Increase hydration consistency',
    icon: 'droplet',
    iconColor: '#3E6FA8',
    iconBg: '#E4EEF7',
    badge: 'RECOMMENDED',
    badgeBg: '#5B6470',
  },
  {
    title: 'Continue mindfulness',
    icon: 'wind',
    iconColor: '#5C7A6B',
    iconBg: '#E7EFE9',
    badge: 'WELLNESS TIP',
    badgeBg: '#1A1A1A',
  },
];

// ---------- Screen ----------

export default function WellnessInsightsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person" size={14} color="#fff" />
            </View>
            <Text style={styles.headerTitle}>Cocoa Well</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={22} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* Page Title */}
        <Text style={styles.pageTitle}>Wellness Insights</Text>
        <Text style={styles.pageSubtitle}>
          Discover patterns in your wellness journey.
        </Text>

        {/* Filter Pill */}
        <TouchableOpacity style={styles.filterPill} activeOpacity={0.8}>
          <Text style={styles.filterText}>Last 30 Days</Text>
          <Ionicons name="chevron-down" size={16} color="#1A1A1A" />
        </TouchableOpacity>

        {/* Wellness Report Card */}
        <LinearGradient
          colors={['#1F5651', '#0D2F2D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.reportCard}
        >
          <View style={styles.reportHeaderRow}>
            <Text style={styles.reportLabel}>WELLNESS REPORT</Text>
            <Ionicons name="sparkles" size={16} color="#fff" />
          </View>
          <Text style={styles.reportTitle}>
            Your wellness trends are improving
          </Text>
          <Text style={styles.reportBody}>
            Based on your recent activity, mood stability has improved and
            symptom frequency has decreased over the past month.
          </Text>
          <View style={styles.reportFooterRow}>
            <Feather name="calendar" size={13} color="rgba(255,255,255,0.65)" />
            <Text style={styles.reportFooterText}>
              Insights for the last 30 days
            </Text>
          </View>
        </LinearGradient>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statTopRow}>
              <MaterialCommunityIcons name="leaf" size={18} color="#2F8F7E" />
              <Text style={styles.statBadgeGreen}>+6%</Text>
            </View>
            <Text style={styles.statValue}>84%</Text>
            <Text style={styles.statLabel}>Wellness Score</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statTopRow}>
              <Ionicons name="happy-outline" size={18} color="#E0A93B" />
              <Feather name="trending-up" size={14} color="#2F8F7E" />
            </View>
            <Text style={styles.statValue}>High</Text>
            <Text style={styles.statLabel}>Mood Stability</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statTopRow}>
              <Feather name="square" size={18} color="#D08A3E" />
              <Feather name="arrow-down" size={14} color="#9A9A9A" />
            </View>
            <Text style={styles.statValue}>
              12 <Text style={styles.statValueSuffix}>Logs</Text>
            </Text>
            <Text style={styles.statLabel}>Symptoms</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statTopRow}>
              <Feather name="calendar" size={18} color="#3E6FA8" />
              <Text style={styles.statMutedTag}>3mo</Text>
            </View>
            <Text style={styles.statValue}>Regular</Text>
            <Text style={styles.statLabel}>Cycle Trend</Text>
          </View>
        </View>

        {/* Mood Trends */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Mood Trends</Text>
            <Feather name="info" size={16} color="#9A9A9A" />
          </View>

          <View style={styles.chartWrap}>
            <Svg width="100%" height={110} viewBox="0 0 300 110">
              <Path
                d="M 10 80 C 40 50, 65 35, 95 58 C 125 80, 155 85, 185 55 C 215 25, 245 15, 285 10"
                stroke="#1B4D4A"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
              />
              <Line x1="292" y1="2" x2="292" y2="55" stroke="#1B4D4A" strokeWidth="2" />
            </Svg>
          </View>

          <View style={styles.daysRow}>
            <Text style={styles.dayLabel}>Mon</Text>
            <Text style={styles.dayLabel}>Wed</Text>
            <Text style={styles.dayLabel}>Fri</Text>
            <Text style={styles.dayLabel}>Sun</Text>
          </View>

          <View style={styles.insightBox}>
            <Text style={styles.insightText}>
              "Your mood trend shows increased positive days and fewer
              low-energy days compared to previous weeks."
            </Text>
          </View>
        </View>

        {/* Symptom Trends */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Symptom Trends</Text>

          {SYMPTOMS.map((item) => (
            <View key={item.label} style={styles.symptomRow}>
              <View style={styles.symptomLabelRow}>
                <Text style={styles.symptomLabel}>{item.label}</Text>
                <Text style={styles.symptomPercent}>{item.percent}%</Text>
              </View>
              <View style={styles.progressTrack}>
                <View
                  style={[styles.progressFill, { width: `${item.percent}%` }]}
                />
              </View>
            </View>
          ))}

          <View style={styles.insightBoxAlt}>
            <Text style={styles.insightTextAlt}>
              "Fatigue remains your most reported symptom, but overall symptom
              frequency is gradually declining."
            </Text>
          </View>
        </View>

        {/* Cycle History */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cycle History</Text>

          <View style={styles.cycleChartRow}>
            {CYCLE_HISTORY.map((item) => (
              <View key={item.month} style={styles.cycleBarCol}>
                <View style={styles.cycleBarTrack}>
                  <View
                    style={[
                      styles.cycleBarFill,
                      {
                        height: `${item.height * 100}%`,
                        backgroundColor: item.light ? '#CFE0DD' : '#1B4D4A',
                      },
                    ]}
                  />
                </View>
                <Text style={styles.cycleMonthLabel}>{item.month}</Text>
              </View>
            ))}
          </View>

          <View style={styles.insightBoxAlt}>
            <Text style={styles.insightTextAlt}>
              "Your cycle history indicates a consistent pattern over recent
              months."
            </Text>
          </View>
        </View>

        {/* Personalized Recommendations */}
        <Text style={styles.sectionTitle}>Personalized Recommendations</Text>

        {RECOMMENDATIONS.map((item) => (
          <TouchableOpacity
            key={item.title}
            style={styles.recommendationRow}
            activeOpacity={0.7}
          >
            <View style={[styles.recoIconCircle, { backgroundColor: item.iconBg }]}>
              <Feather name={item.icon} size={16} color={item.iconColor} />
            </View>
            <Text style={styles.recoTitle}>{item.title}</Text>
            <View style={[styles.recoBadge, { backgroundColor: item.badgeBg }]}>
              <Text style={styles.recoBadgeText}>{item.badge}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------- Styles ----------

const COLORS = {
  bg: '#F7F5F1',
  card: '#FFFFFF',
  textDark: '#1A1A1A',
  textMuted: '#8A8A8A',
  teal: '#1B4D4A',
  tealLight: '#E5F0EF',
  border: '#ECEAE5',
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 32,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
  },

  // Page title
  pageTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.textDark,
    marginTop: 12,
  },
  pageSubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 4,
    marginBottom: 14,
  },

  // Filter
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.card,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 16,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textDark,
    marginRight: 4,
  },

  // Wellness report
  reportCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  reportHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reportLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.8,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  reportBody: {
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 16,
  },
  reportFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportFooterText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.65)',
    marginLeft: 6,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48%',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  statTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statBadgeGreen: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2F8F7E',
  },
  statMutedTag: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMuted,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  statValueSuffix: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textDark,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  // Generic card
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 10,
  },

  // Mood chart
  chartWrap: {
    marginBottom: 4,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  dayLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  insightBox: {
    backgroundColor: COLORS.tealLight,
    borderRadius: 12,
    padding: 12,
  },
  insightText: {
    fontSize: 12.5,
    fontStyle: 'italic',
    color: COLORS.teal,
    lineHeight: 18,
  },
  insightBoxAlt: {
    backgroundColor: '#F2F1ED',
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
  },
  insightTextAlt: {
    fontSize: 12.5,
    fontStyle: 'italic',
    color: '#5A5A5A',
    lineHeight: 18,
  },

  // Symptom trends
  symptomRow: {
    marginBottom: 12,
  },
  symptomLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  symptomLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textDark,
  },
  symptomPercent: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textDark,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E7E5E0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: COLORS.teal,
  },

  // Cycle history
  cycleChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 110,
    marginBottom: 16,
  },
  cycleBarCol: {
    alignItems: 'center',
    width: 60,
  },
  cycleBarTrack: {
    width: 36,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#EFEDE8',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  cycleBarFill: {
    width: '100%',
    borderRadius: 10,
  },
  cycleMonthLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 8,
  },

  // Recommendations
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 12,
  },
  recommendationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  recoIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  recoTitle: {
    flex: 1,
    fontSize: 13.5,
    fontWeight: '500',
    color: COLORS.textDark,
    marginRight: 8,
  },
  recoBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  recoBadgeText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});