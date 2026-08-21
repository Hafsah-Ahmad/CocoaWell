import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DBService } from '@/lib/db-service';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Line, Path } from 'react-native-svg';

const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

interface Recommendation {
  title: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  badge: string;
  badgeBg: string;
}

const RECOMMENDATIONS: Recommendation[] = [
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

const COLORS = {
  bg: '#F7F5F1',
  card: '#FFFFFF',
  textDark: '#1A1A1A',
  textMuted: '#8A8A8A',
  teal: '#1B4D4A',
  tealLight: '#E5F0EF',
  border: '#ECEAE5',
};

export default function WellnessInsightsScreen() {
  const router = useRouter();
  const [insights, setInsights] = useState<any>(null);
  const [wellnessScore, setWellnessScore] = useState<number>(0);
  const [symptomCount, setSymptomCount] = useState<number>(0);
  const [cycleHistory, setCycleHistory] = useState<{ month: string; height: number; light: boolean }[]>([]);
  const [moodCount, setMoodCount] = useState<number>(0);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const data = await DBService.fetchWellnessInsights();
        setInsights(data);

        const habits = await DBService.getHabitsLog(new Date().toISOString().split('T')[0]);
        let completed = 0;
        if (habits.water_completed) completed++;
        if (habits.exercise_completed) completed++;
        if (habits.meditation_completed) completed++;
        if (habits.sleep_completed) completed++;
        setWellnessScore(Math.round((completed / 4) * 100));

        const symptoms = await DBService.getSymptomLogs();
        setSymptomCount(symptoms.length);

        const moods = await DBService.getMoodLogs();
        setMoodCount(moods.length);

        // Build cycle history bars from real cycle data
        const cycles = await DBService.getCycleLogs();
        if (cycles.length > 0) {
          const maxLength = Math.max(...cycles.map(c => c.period_length));
          const recent = [...cycles]
            .sort((a, b) => a.start_date.localeCompare(b.start_date))
            .slice(-4);
          setCycleHistory(
            recent.map((c, i) => {
              const d = new Date(c.start_date);
              return {
                month: MONTH_SHORT[d.getMonth()],
                height: maxLength > 0 ? c.period_length / maxLength : 0.7,
                light: i === recent.length - 1,
              };
            })
          );
        }
      } catch (e) {
        console.warn('Error loading insights data:', e);
      }
    };

    loadInsights();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerBarTitle}>Wellness Insights</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            {wellnessScore >= 75
              ? 'Your wellness trends are improving'
              : wellnessScore > 0
                ? 'Keep building your wellness habits'
                : 'Start tracking to see your trends'}
          </Text>
          <Text style={styles.reportBody}>
            {moodCount > 0 || symptomCount > 0
              ? `Based on ${moodCount} mood log${moodCount !== 1 ? 's' : ''} and ${symptomCount} symptom log${symptomCount !== 1 ? 's' : ''}, your wellness data is building up. Keep tracking to see deeper patterns.`
              : 'Start logging your mood and symptoms to unlock personalised wellness trends and insights.'}
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
            <Text style={styles.statValue}>{wellnessScore}%</Text>
            <Text style={styles.statLabel}>Wellness Score</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statTopRow}>
              <Ionicons name="happy-outline" size={18} color="#E0A93B" />
              <Feather name="trending-up" size={14} color="#2F8F7E" />
            </View>
            <Text style={styles.statValue}>{insights?.moodStability || 'High'}</Text>
            <Text style={styles.statLabel}>Mood Stability</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statTopRow}>
              <Feather name="square" size={18} color="#D08A3E" />
              <Feather name="arrow-down" size={14} color="#9A9A9A" />
            </View>
            <Text style={styles.statValue}>
              {symptomCount} <Text style={styles.statValueSuffix}>Logs</Text>
            </Text>
            <Text style={styles.statLabel}>Symptoms</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statTopRow}>
              <Feather name="calendar" size={18} color="#3E6FA8" />
              <Text style={styles.statMutedTag}>3mo</Text>
            </View>
            <Text style={styles.statValue}>
              {insights?.averageCycleLength ? `${insights.averageCycleLength} Days` : 'Regular'}
            </Text>
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

          {(insights?.symptomList || SYMPTOMS).map((item: any) => (
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

          {/* Cycle History */}
          {cycleHistory.length > 0 ? (
            <View style={styles.cycleChartRow}>
              {cycleHistory.map((item, i) => (
                <View key={i} style={styles.cycleBarCol}>
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
          ) : (
            <View style={{ paddingVertical: 16, alignItems: 'center' }}>
              <Text style={{ fontSize: 13, color: COLORS.textMuted, textAlign: 'center' }}>
                Log your first cycle to see history here
              </Text>
            </View>
          )}

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
            onPress={() => router.push('/vitamin-recommendations' as any)}
          >
            <View style={[styles.recoIconCircle, { backgroundColor: item.iconBg }]}>
              <Feather name={item.icon as any} size={16} color={item.iconColor} />
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: 4,
  },
  headerBarTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
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
