import React, { useState, useEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DBService } from '@/lib/db-service';

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

const WELLNESS_TIPS = [
  'Staying hydrated throughout the day can improve energy levels, mood, and overall wellness.',
  'A 10-minute walk after meals supports digestion and stabilises blood sugar levels.',
  'Getting 7–9 hours of sleep is one of the most powerful things you can do for hormonal balance.',
  'Deep breathing for just 5 minutes can reduce cortisol and ease feelings of anxiety.',
  'Iron-rich foods like spinach and lentils help replenish what your body loses during your period.',
  'Magnesium-rich foods like dark chocolate and almonds can reduce PMS cramps and improve sleep.',
  'Tracking your mood daily helps identify patterns linked to your menstrual cycle phases.',
  'Exercise during your follicular phase (after period) often feels easier — take advantage of that energy!',
  'Vitamin D supports immune function and mood. Even a short walk outside helps your body produce it.',
  'Reducing caffeine in the days before your period can decrease breast tenderness and irritability.',
];

function getDailyTip(): string {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 3600 * 24));
  return WELLNESS_TIPS[dayOfYear % WELLNESS_TIPS.length];
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning,';
  if (hour < 17) return 'Good Afternoon,';
  return 'Good Evening,';
}

interface StatCardProps {
  icon: string;
  label: string;
  value: string;
  subValue: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, subValue }) => (
  <View style={styles.statCard}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={styles.statLabel}>{label}</Text>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statSub}>{subValue}</Text>
  </View>
);

interface QuickActionButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.quickActionIcon}>
      <Text style={styles.quickActionEmoji}>{icon}</Text>
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [latestMood, setLatestMood] = useState<string | null>(null);
  const [latestMoodTime, setLatestMoodTime] = useState<string>('');
  const [nextPeriod, setNextPeriod] = useState<string>('—');
  const [periodExpected, setPeriodExpected] = useState<string>('');
  const [wellnessScore, setWellnessScore] = useState<number>(0);
  const [habitsCompleted, setHabitsCompleted] = useState<number>(0);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const p = await DBService.getProfile();
        setProfile(p);

        // Mood
        const moods = await DBService.getMoodLogs();
        if (moods.length > 0) {
          const mLabel = moods[0].mood_id;
          setLatestMood(mLabel.charAt(0).toUpperCase() + mLabel.slice(1));
          const diffMs = Date.now() - new Date(moods[0].logged_at).getTime();
          const diffHrs = Math.floor(diffMs / 3600000);
          if (diffHrs === 0) setLatestMoodTime('Just now');
          else if (diffHrs === 1) setLatestMoodTime('1 hour ago');
          else if (diffHrs < 24) setLatestMoodTime(`${diffHrs} hours ago`);
          else setLatestMoodTime(`${Math.floor(diffHrs / 24)} days ago`);
        }

        // Habits
        const habits = await DBService.getHabitsLog(new Date().toISOString().split('T')[0]);
        let completed = 0;
        if (habits.water_completed) completed++;
        if (habits.exercise_completed) completed++;
        if (habits.meditation_completed) completed++;
        if (habits.sleep_completed) completed++;
        setHabitsCompleted(completed);
        setWellnessScore(Math.round((completed / 4) * 100));

        // Next period from cycle logs
        const cycles = await DBService.getCycleLogs();
        if (cycles.length > 0) {
          const sorted = [...cycles].sort((a, b) => b.start_date.localeCompare(a.start_date));
          const lastStart = new Date(sorted[0].start_date);

          let avgCycleLength = 28;
          if (cycles.length >= 2) {
            const ascSorted = [...cycles].sort((a, b) => a.start_date.localeCompare(b.start_date));
            const gaps: number[] = [];
            for (let i = 1; i < ascSorted.length; i++) {
              const prev = new Date(ascSorted[i - 1].start_date);
              const curr = new Date(ascSorted[i].start_date);
              const gap = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));
              if (gap > 10 && gap < 60) gaps.push(gap);
            }
            if (gaps.length > 0) avgCycleLength = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
          }

          const nextStart = new Date(lastStart);
          nextStart.setDate(nextStart.getDate() + avgCycleLength);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const daysUntil = Math.round((nextStart.getTime() - today.getTime()) / (1000 * 3600 * 24));

          if (daysUntil < 0) setNextPeriod('May have started');
          else if (daysUntil === 0) setNextPeriod('Today');
          else if (daysUntil === 1) setNextPeriod('Tomorrow');
          else setNextPeriod(`In ${daysUntil} Days`);

          const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          setPeriodExpected(`Expected ${monthNames[nextStart.getMonth()]} ${nextStart.getDate()}`);
        }
      } catch (e) {
        console.warn(e);
      }
    };

    loadHomeData();
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
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
                {getGreeting()}{'\n'}
                <Text style={styles.greetingName}>{profile?.full_name || 'there'}</Text>
              </Text>
              <Text style={styles.greetingSub}>Let's make today a healthy day</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.bellBtn} 
            activeOpacity={0.7}
            onPress={() => router.push('/notifications-reminders' as any)}
          >
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <StatCard
            icon="😊"
            label="Today's Mood"
            value={latestMood || 'Not logged'}
            subValue={latestMood ? `Logged ${latestMoodTime}` : 'Tap to log mood'}
          />
          <StatCard
            icon="📅"
            label="Next Period"
            value={nextPeriod}
            subValue={periodExpected || 'Log a cycle to predict'}
          />
          <StatCard
            icon="✅"
            label="Today's Habits"
            value={`${habitsCompleted}/4`}
            subValue={habitsCompleted === 4 ? 'All done! 🎉' : `${4 - habitsCompleted} remaining`}
          />
          <StatCard
            icon="🌿"
            label="Wellness Score"
            value={`${wellnessScore}%`}
            subValue={wellnessScore >= 75 ? 'Great progress' : wellnessScore > 0 ? 'Keep tracking!' : 'Log habits to score'}
          />
        </View>

        {/* Wellness Score Card */}
        <TouchableOpacity 
          style={styles.wellnessCard} 
          activeOpacity={0.9}
          onPress={() => router.push('/wellness-insights' as any)}
        >
          <Text style={styles.wellnessBigScore}>{wellnessScore}</Text>
          <Text style={styles.wellnessPercent}>%</Text>
          <View style={styles.wellnessTitleRow}>
            <Text style={styles.wellnessTitle}>Your Wellness Score</Text>
          </View>
          <Text style={styles.wellnessFeedback}>
            {wellnessScore === 100
              ? "Perfect day! You've completed all your wellness habits."
              : wellnessScore >= 75
                ? "You're maintaining strong wellness habits. Keep logging to improve your insights."
                : wellnessScore > 0
                  ? `You've completed ${habitsCompleted} of 4 habits today. Small steps add up!`
                  : "Start logging your daily habits to get personalised wellness insights."}
          </Text>
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <QuickActionButton 
              icon="📋" 
              label={`Log\nSymptoms`} 
              onPress={() => router.push('/(tabs)/symptoms' as any)} 
            />
            <QuickActionButton 
              icon="😊" 
              label={`Track\nMood`} 
              onPress={() => router.push('/mood-tracker' as any)} 
            />
            <QuickActionButton 
              icon="📆" 
              label={`Add Cycle`} 
              onPress={() => router.push('/(tabs)/cycle' as any)} 
            />
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
            <Text style={styles.tipText}>{getDailyTip()}</Text>
          </View>
        </View>

        <View style={{ height: 110 }} />
      </ScrollView>
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
    paddingHorizontal: 20,
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
    width: '48%',
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
});
