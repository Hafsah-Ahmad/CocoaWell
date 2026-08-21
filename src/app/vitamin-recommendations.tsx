import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DBService } from '@/lib/db-service';

const COLORS = {
  background: '#F7F7F5',
  white: '#FFFFFF',
  darkGreen: '#1C3A35',
  mediumGreen: '#2D5A4F',
  lightGreen: '#E8F0EE',
  accentGreen: '#4A8C7A',
  tagBlue: '#D6E8F5',
  tagBlueText: '#2A6090',
  tagRed: '#FCE8E8',
  tagRedText: '#C0392B',
  tagPurple: '#EDE8F5',
  tagPurpleText: '#5B3A8C',
  tagPink: '#F5E8EF',
  tagPinkText: '#8C3A62',
  tagOrange: '#FFF0E6',
  tagOrangeText: '#C0621A',
  text: '#1A1A1A',
  subText: '#555555',
  lightText: '#888888',
  border: '#E5E5E0',
  progressBg: '#E5E5E0',
  progressFill: '#1C3A35',
  iconBg: '#F0F5F3',
  checkGreen: '#2D7A5A',
};

interface TagProps {
  label: string;
  color: string;
  textColor: string;
}

const Tag: React.FC<TagProps> = ({ label, color, textColor }) => (
  <View style={[styles.tag, { backgroundColor: color }]}>
    <Text style={[styles.tagText, { color: textColor }]}>{label}</Text>
  </View>
);

interface ProgressBarProps {
  percent: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percent }) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressBg}>
      <View style={[styles.progressFill, { width: `${percent}%` }]} />
    </View>
    <Text style={styles.progressLabel}>{percent}%</Text>
  </View>
);

interface BenefitRowProps {
  text: string;
}

const BenefitRow: React.FC<BenefitRowProps> = ({ text }) => (
  <View style={styles.benefitRow}>
    <View style={styles.checkCircle}>
      <Text style={styles.checkMark}>✓</Text>
    </View>
    <Text style={styles.benefitText}>{text}</Text>
  </View>
);

interface VitaminCardProps {
  name: string;
  tags: TagProps[];
  benefits: string[];
  reason: string;
  matchPercent: number;
}

const VitaminCard: React.FC<VitaminCardProps> = ({ name, tags, benefits, reason, matchPercent }) => (
  <View style={styles.vitaminCard}>
    <View style={styles.vitaminHeader}>
      <Text style={styles.vitaminName}>{name}</Text>
      <View style={styles.tagsRow}>
        {tags.map((t, i) => (
          <Tag key={i} label={t.label} color={t.color} textColor={t.textColor} />
        ))}
      </View>
    </View>
    {benefits.map((b, i) => <BenefitRow key={i} text={b} />)}
    <View style={styles.whyBox}>
      <Text style={styles.whyTitle}>Why this is recommended</Text>
      <Text style={styles.whyText}>{reason}</Text>
    </View>
    <ProgressBar percent={matchPercent} />
  </View>
);

// Vitamin database keyed by symptom/goal
const VITAMIN_DATABASE: Record<string, VitaminCardProps> = {
  fatigue: {
    name: 'Iron',
    tags: [{ label: 'Blood Health', color: COLORS.tagPink, textColor: COLORS.tagPinkText }],
    benefits: ['Reduces tiredness and fatigue', 'Supports oxygen transport in blood'],
    reason: 'Recommended to counteract fatigue — your most logged symptom — and address iron loss during your period.',
    matchPercent: 88,
  },
  headache: {
    name: 'Magnesium',
    tags: [{ label: 'Relaxation', color: COLORS.tagPurple, textColor: COLORS.tagPurpleText }],
    benefits: ['Supports muscle and nerve function', 'Helps with tension headaches'],
    reason: 'Magnesium deficiency is a common trigger for headaches and migraines, which you have logged recently.',
    matchPercent: 83,
  },
  stress: {
    name: 'Vitamin B Complex',
    tags: [{ label: 'Stress Relief', color: COLORS.tagOrange, textColor: COLORS.tagOrangeText }],
    benefits: ['Supports nervous system function', 'Aids in managing stress and anxiety'],
    reason: 'B vitamins are essential for stress regulation and are commonly depleted during high-stress periods.',
    matchPercent: 79,
  },
  cramps: {
    name: 'Magnesium',
    tags: [{ label: 'Relaxation', color: COLORS.tagPurple, textColor: COLORS.tagPurpleText }],
    benefits: ['Relaxes smooth muscle tissue', 'Reduces menstrual cramping'],
    reason: 'Magnesium helps soothe period cramps by relaxing uterine muscles, which aligns with your logged symptoms.',
    matchPercent: 85,
  },
  low_energy: {
    name: 'Vitamin B12',
    tags: [{ label: 'Metabolism', color: COLORS.tagOrange, textColor: COLORS.tagOrangeText }],
    benefits: ['Maintains healthy nerve cells', 'Provides sustained energy throughout the day'],
    reason: 'Provides sustained energy to help manage your reported low energy levels.',
    matchPercent: 81,
  },
  mood_swings: {
    name: 'Vitamin D',
    tags: [{ label: 'Mood Support', color: COLORS.tagBlue, textColor: COLORS.tagBlueText }],
    benefits: ['Supports immune system function', 'Enhances mood and cognitive health'],
    reason: 'Vitamin D plays a key role in serotonin production, which directly affects mood stability.',
    matchPercent: 87,
  },
};

// Always-recommended baseline
const BASELINE_VITAMINS: VitaminCardProps[] = [
  {
    name: 'Vitamin D',
    tags: [{ label: 'Energy Support', color: COLORS.tagBlue, textColor: COLORS.tagBlueText }],
    benefits: ['Supports immune system function', 'Enhances mood and cognitive health'],
    reason: 'Vital for maintaining stable mood during cycle shifts and combating seasonal fatigue.',
    matchPercent: 82,
  },
  {
    name: 'Omega-3 Fatty Acids',
    tags: [{ label: 'Hormone Balance', color: COLORS.tagPink, textColor: COLORS.tagPinkText }],
    benefits: ['Supports hormonal balance', 'Reduces inflammation'],
    reason: 'Omega-3s support overall hormonal health and reduce the inflammatory response associated with your cycle.',
    matchPercent: 78,
  },
];

export default function VitaminRecommendationsScreen() {
  const router = useRouter();
  const [vitamins, setVitamins] = useState<VitaminCardProps[]>([]);
  const [wellnessScore, setWellnessScore] = useState<number>(0);
  const [primarySymptom, setPrimarySymptom] = useState<string>('—');
  const [latestMood, setLatestMood] = useState<string>('—');
  const [cycleStatus, setCycleStatus] = useState<string>('—');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Habits → wellness score
        const habits = await DBService.getHabitsLog(new Date().toISOString().split('T')[0]);
        let completed = 0;
        if (habits.water_completed) completed++;
        if (habits.exercise_completed) completed++;
        if (habits.meditation_completed) completed++;
        if (habits.sleep_completed) completed++;
        setWellnessScore(Math.round((completed / 4) * 100));

        // Moods → latest mood
        const moods = await DBService.getMoodLogs();
        if (moods.length > 0) {
          const m = moods[0].mood_id;
          setLatestMood(m.charAt(0).toUpperCase() + m.slice(1));
        }

        // Symptoms → most frequent
        const symptomLogs = await DBService.getSymptomLogs();
        const counts: Record<string, number> = {};
        symptomLogs.forEach((log) => {
          log.symptoms.forEach((s) => {
            counts[s] = (counts[s] || 0) + 1;
          });
        });
        const sortedSymptoms = Object.entries(counts).sort((a, b) => b[1] - a[1]);
        const topSymptomKey = sortedSymptoms[0]?.[0];
        if (topSymptomKey) {
          setPrimarySymptom(topSymptomKey.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()));
        }

        // Cycle status
        const cycles = await DBService.getCycleLogs();
        if (cycles.length > 0) {
          const sorted = [...cycles].sort((a, b) => b.start_date.localeCompare(a.start_date));
          const lastStart = new Date(sorted[0].start_date);
          let avgCycleLength = 28;
          if (cycles.length >= 2) {
            const asc = [...cycles].sort((a, b) => a.start_date.localeCompare(b.start_date));
            const gaps: number[] = [];
            for (let i = 1; i < asc.length; i++) {
              const gap = Math.round((new Date(asc[i].start_date).getTime() - new Date(asc[i-1].start_date).getTime()) / (1000*3600*24));
              if (gap > 10 && gap < 60) gaps.push(gap);
            }
            if (gaps.length) avgCycleLength = Math.round(gaps.reduce((a,b) => a+b,0) / gaps.length);
          }
          const nextStart = new Date(lastStart);
          nextStart.setDate(nextStart.getDate() + avgCycleLength);
          const daysUntil = Math.round((nextStart.getTime() - Date.now()) / (1000*3600*24));
          if (daysUntil <= 0) setCycleStatus('Period Active');
          else if (daysUntil <= 5) setCycleStatus('Period Soon');
          else if (daysUntil <= 14) setCycleStatus('Luteal Phase');
          else setCycleStatus('Follicular Phase');
        }

        // Build vitamin list from symptoms
        const recommended: VitaminCardProps[] = [];
        const seen = new Set<string>();
        sortedSymptoms.forEach(([symptomKey]) => {
          const vit = VITAMIN_DATABASE[symptomKey];
          if (vit && !seen.has(vit.name)) {
            seen.add(vit.name);
            recommended.push(vit);
          }
        });
        // Add baselines not already included
        BASELINE_VITAMINS.forEach((v) => {
          if (!seen.has(v.name)) {
            seen.add(v.name);
            recommended.push(v);
          }
        });
        setVitamins(recommended.slice(0, 4));
      } catch (e) {
        console.warn(e);
        setVitamins(BASELINE_VITAMINS);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recommendations</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.pageHeader}>
          <View>
            <Text style={styles.pageTitle}>Vitamin Recommendations</Text>
            <Text style={styles.pageSubtitle}>Personalized wellness support designed for you</Text>
          </View>
          <TouchableOpacity style={styles.refreshBtn}>
            <Text style={styles.refreshIcon}>↻</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>PERSONALIZED FOR YOU</Text>
          </View>
          <Text style={styles.heroTitle}>Today's wellness recommendations</Text>
          <Text style={styles.heroSubtext}>
            Based on your recent tracking data and goals, we've curated specific vitamins to support your energy levels and cycle transition.
          </Text>
          <View style={styles.heroFooter}>
            <Text style={styles.heroStar}>✦</Text>
            <Text style={styles.heroFooterText}>4 Recommendations Available</Text>
          </View>
        </View>

        {/* Why Section */}
        <Text style={styles.sectionLabel}>Why these recommendations?</Text>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.darkGreen} style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>{'Wellness\nScore'}</Text>
              <Text style={styles.statValue}>{wellnessScore > 0 ? `${wellnessScore}%` : '—'}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>{'Primary\nSymptom'}</Text>
              <Text style={[styles.statValue, styles.statValueBold]}>{primarySymptom}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>{'Recent\nMood'}</Text>
              <Text style={[styles.statValue, styles.statValueBold]}>{latestMood}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>{'Cycle\nStatus'}</Text>
              <Text style={[styles.statValue, styles.statValueBold]}>{cycleStatus}</Text>
            </View>
          </View>
        )}

        {/* Insight Banner */}
        <View style={styles.insightBanner}>
          <Text style={styles.insightIcon}>📍</Text>
          <Text style={styles.insightText}>
            Your wellness data indicates a higher need for magnesium and iron during your upcoming luteal phase to manage fatigue and maintain stable energy levels.
          </Text>
        </View>

        {/* Vitamins */}
        <View style={styles.vitaminSection}>
          <Text style={styles.sectionTitle}>Recommended Vitamins</Text>
          <Text style={styles.sectionSubtitle}>Selected based on your logged symptoms, mood, and cycle data.</Text>
          {loading
            ? null
            : vitamins.map((v, i) => <VitaminCard key={i} {...v} />)}
        </View>

        {/* Wellness Reminder */}
        <View style={styles.reminderCard}>
          <View style={styles.reminderIconWrap}>
            <Text style={styles.reminderIconText}>✦</Text>
          </View>
          <View style={styles.reminderTextWrap}>
            <Text style={styles.reminderTitle}>Wellness Reminder</Text>
            <Text style={styles.reminderBody}>
              The more consistently you track your symptoms and mood, the more accurate and personalized these recommendations become over time.
            </Text>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={() => router.back()}>
          <Text style={styles.saveIcon}>💾</Text>
          <Text style={styles.saveBtnText}>Save Recommendations</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 10 },

  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
  },
  pageTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text },
  pageSubtitle: { fontSize: 12, color: COLORS.lightText, marginTop: 2, maxWidth: 220 },
  refreshBtn: { padding: 4 },
  refreshIcon: { fontSize: 20, color: COLORS.accentGreen },

  heroCard: {
    backgroundColor: COLORS.darkGreen,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 22,
    marginBottom: 22,
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 14,
  },
  heroBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  heroTitle: { color: COLORS.white, fontSize: 22, fontWeight: '700', lineHeight: 28, marginBottom: 10 },
  heroSubtext: { color: 'rgba(255,255,255,0.75)', fontSize: 13, lineHeight: 19, marginBottom: 16 },
  heroFooter: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  heroStar: { color: COLORS.white, fontSize: 13 },
  heroFooterText: { color: COLORS.white, fontSize: 13, fontWeight: '500' },

  sectionLabel: { fontSize: 14, fontWeight: '600', color: COLORS.text, paddingHorizontal: 20, marginBottom: 10 },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 14,
  },
  statCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    width: '47%',
    alignItems: 'flex-start',
  },
  statLabel: { fontSize: 12, color: COLORS.lightText, marginBottom: 4, lineHeight: 17 },
  statValue: { fontSize: 22, fontWeight: '700', color: COLORS.text },
  statValueBold: { fontSize: 17 },

  insightBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGreen,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    gap: 10,
    alignItems: 'flex-start',
  },
  insightIcon: { fontSize: 16, marginTop: 1 },
  insightText: { fontSize: 13, color: COLORS.mediumGreen, lineHeight: 19, flex: 1 },

  vitaminSection: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  sectionSubtitle: { fontSize: 12, color: COLORS.lightText, marginBottom: 14 },

  vitaminCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  vitaminHeader: { marginBottom: 12 },
  vitaminName: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tag: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 },
  tagText: { fontSize: 11, fontWeight: '600' },

  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  checkCircle: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: COLORS.lightGreen,
    alignItems: 'center', justifyContent: 'center',
  },
  checkMark: { color: COLORS.checkGreen, fontSize: 10, fontWeight: '700' },
  benefitText: { fontSize: 13, color: COLORS.subText },

  whyBox: { marginTop: 12, marginBottom: 10 },
  whyTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  whyText: { fontSize: 12, color: COLORS.subText, lineHeight: 18 },

  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progressBg: {
    flex: 1, height: 6, backgroundColor: COLORS.progressBg,
    borderRadius: 3, overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: COLORS.progressFill, borderRadius: 3 },
  progressLabel: { fontSize: 12, fontWeight: '700', color: COLORS.text, width: 36, textAlign: 'right' },

  reminderCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.darkGreen,
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 18,
    marginTop: 8,
    gap: 14,
    alignItems: 'flex-start',
  },
  reminderIconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  reminderIconText: { color: COLORS.white, fontSize: 18 },
  reminderTextWrap: { flex: 1 },
  reminderTitle: { color: COLORS.white, fontSize: 14, fontWeight: '700', marginBottom: 6 },
  reminderBody: { color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 18 },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: 20, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: COLORS.border,
  },
  saveBtn: {
    backgroundColor: COLORS.darkGreen,
    borderRadius: 14, paddingVertical: 16,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  saveIcon: { fontSize: 16 },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
});
