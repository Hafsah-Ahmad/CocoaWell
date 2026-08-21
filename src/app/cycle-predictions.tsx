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
import { DBService, CycleLog } from '@/lib/db-service';

const COLORS = {
  primary: '#1A5C5A',
  primaryLight: '#E8F4F3',
  accent: '#2A7D7A',
  fertileLight: '#C8E6E5',
  white: '#FFFFFF',
  background: '#F7FAFA',
  textDark: '#1A2E2E',
  textMid: '#4A6363',
  textLight: '#7A9999',
  border: '#E0EDED',
  insightBg: '#1A5C5A',
  buttonBorder: '#1A5C5A',
};

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

interface Prediction {
  nextPeriodStart: Date;
  nextPeriodEnd: Date;
  ovulationDay: Date;
  fertileStart: Date;
  fertileEnd: Date;
  avgCycleLength: number;
  avgPeriodLength: number;
  daysUntilPeriod: number;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function formatShort(date: Date): string {
  return `${MONTH_NAMES[date.getMonth()].slice(0, 3)} ${date.getDate()}`;
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function computePredictions(cycles: CycleLog[]): Prediction | null {
  if (cycles.length === 0) return null;

  // Average period length
  const avgPeriodLength = Math.round(
    cycles.reduce((sum, c) => sum + c.period_length, 0) / cycles.length
  );

  // Average cycle length: compute gaps between start dates if multiple cycles
  let avgCycleLength = 28; // default
  if (cycles.length >= 2) {
    const sorted = [...cycles].sort((a, b) => a.start_date.localeCompare(b.start_date));
    const gaps: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1].start_date);
      const curr = new Date(sorted[i].start_date);
      const gap = Math.round((curr.getTime() - prev.getTime()) / (1000 * 3600 * 24));
      if (gap > 10 && gap < 60) gaps.push(gap); // sanity filter
    }
    if (gaps.length > 0) {
      avgCycleLength = Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length);
    }
  }

  // Last period start
  const sortedDesc = [...cycles].sort((a, b) => b.start_date.localeCompare(a.start_date));
  const lastStart = new Date(sortedDesc[0].start_date);

  // Next period
  const nextPeriodStart = addDays(lastStart, avgCycleLength);
  const nextPeriodEnd = addDays(nextPeriodStart, avgPeriodLength - 1);

  // Ovulation ~14 days before next period
  const ovulationDay = addDays(nextPeriodStart, -14);

  // Fertile window: 5 days before ovulation + ovulation day
  const fertileStart = addDays(ovulationDay, -5);
  const fertileEnd = addDays(ovulationDay, 1);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysUntilPeriod = Math.round(
    (nextPeriodStart.getTime() - today.getTime()) / (1000 * 3600 * 24)
  );

  return {
    nextPeriodStart,
    nextPeriodEnd,
    ovulationDay,
    fertileStart,
    fertileEnd,
    avgCycleLength,
    avgPeriodLength,
    daysUntilPeriod,
  };
}

export default function CyclePredictionsScreen() {
  const router = useRouter();
  const [cycles, setCycles] = useState<CycleLog[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);

  // Calendar view: default to the month containing next period
  const [viewYear, setViewYear] = useState(new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(new Date().getMonth());

  useEffect(() => {
    DBService.getCycleLogs().then((logs) => {
      setCycles(logs);
      const pred = computePredictions(logs);
      setPrediction(pred);
      if (pred) {
        setViewYear(pred.nextPeriodStart.getFullYear());
        setViewMonth(pred.nextPeriodStart.getMonth());
      }
      setLoading(false);
    });
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const isDayInRange = (d: number, start: Date, end: Date): boolean => {
    const dateStr = toDateStr(viewYear, viewMonth, d);
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    return dateStr >= startStr && dateStr <= endStr;
  };

  const isDayEqual = (d: number, target: Date): boolean => {
    return toDateStr(viewYear, viewMonth, d) === target.toISOString().split('T')[0];
  };

  const isPeriodDay = (d: number) =>
    prediction ? isDayInRange(d, prediction.nextPeriodStart, prediction.nextPeriodEnd) : false;

  const isFertileDay = (d: number) =>
    prediction ? isDayInRange(d, prediction.fertileStart, prediction.fertileEnd) : false;

  const isOvulationDay = (d: number) =>
    prediction ? isDayEqual(d, prediction.ovulationDay) : false;

  const today = new Date();
  const isToday = (d: number) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  // Render the calendar days flat
  const renderCalendarDays = () => {
    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(<View key={`e-${i}`} style={styles.dayCell} />);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const period = isPeriodDay(day);
      const fertile = isFertileDay(day) && !period;
      const ovulation = isOvulationDay(day) && !period;
      const todayDay = isToday(day);

      cells.push(
        <View key={day} style={styles.dayCell}>
          <View style={[
            styles.dayCircle,
            period && styles.periodCircle,
            fertile && styles.fertileCircle,
            ovulation && styles.ovulationCircle,
            !period && !fertile && !ovulation && todayDay && styles.todayCircle,
          ]}>
            <Text style={[
              styles.dayText,
              period && styles.periodDayText,
              ovulation && !period && styles.ovulationDayText,
              !period && !ovulation && todayDay && styles.todayDayText,
            ]}>
              {day}
            </Text>
          </View>
        </View>
      );
    }
    return cells;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cycle Predictions</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Page Title */}
        <View style={styles.pageTitleSection}>
          <Text style={styles.pageTitle}>Cycle Predictions</Text>
          <Text style={styles.pageSubtitle}>
            {cycles.length === 0
              ? 'Log your first period to see personalised predictions.'
              : `Based on ${cycles.length} cycle${cycles.length > 1 ? 's' : ''} tracked.`}
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
        ) : cycles.length === 0 ? (
          /* No data state */
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📅</Text>
            <Text style={styles.emptyTitle}>No cycle data yet</Text>
            <Text style={styles.emptyText}>
              Log your first period on the Cycle tab to unlock personalised predictions, fertile window tracking, and ovulation estimates.
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/(tabs)/cycle' as any)}
            >
              <Text style={styles.emptyBtnText}>Log My First Period</Text>
            </TouchableOpacity>
          </View>
        ) : prediction ? (
          <>
            {/* Badge */}
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  Avg cycle: {prediction.avgCycleLength} days · Avg period: {prediction.avgPeriodLength} days
                </Text>
              </View>
            </View>

            {/* Calendar Card */}
            <View style={styles.calendarCard}>
              <View style={styles.calendarHeader}>
                <Text style={styles.monthTitle}>
                  {MONTH_NAMES[viewMonth]} {viewYear}
                </Text>
                <View style={styles.calendarNav}>
                  <TouchableOpacity style={styles.navBtn} onPress={prevMonth}>
                    <Text style={styles.navBtnText}>{'<'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.navBtn} onPress={nextMonth}>
                    <Text style={styles.navBtnText}>{'>'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Day headers */}
              <View style={styles.weekRow}>
                {DAYS_OF_WEEK.map((d, i) => (
                  <View key={i} style={styles.dayCell}>
                    <Text style={styles.weekDayText}>{d}</Text>
                  </View>
                ))}
              </View>

              {/* Days grid */}
              <View style={styles.daysGrid}>{renderCalendarDays()}</View>

              <View style={styles.calendarDivider} />

              {/* Legend */}
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={styles.legendDotFilled} />
                  <Text style={styles.legendText}>Predicted Period</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={styles.legendDotFertile} />
                  <Text style={styles.legendText}>Fertile Days</Text>
                </View>
              </View>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View style={styles.legendDotOutline} />
                  <Text style={styles.legendText}>Ovulation Day</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={styles.legendDotToday} />
                  <Text style={styles.legendText}>Today</Text>
                </View>
              </View>
            </View>

            {/* Info Cards */}
            <View style={styles.infoCard}>
              <View style={styles.infoIconCircle}>
                <Text style={styles.infoIcon}>📅</Text>
              </View>
              <View style={styles.infoCardText}>
                <Text style={styles.infoCardTitle}>
                  {prediction.daysUntilPeriod <= 0
                    ? 'Period may have started'
                    : `Expected in ${prediction.daysUntilPeriod} Day${prediction.daysUntilPeriod === 1 ? '' : 's'}`}
                </Text>
                <Text style={styles.infoCardSubtitle}>
                  Expected start: {formatDate(prediction.nextPeriodStart)}
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIconCircle}>
                <Text style={styles.infoIcon}>💧</Text>
              </View>
              <View style={styles.infoCardText}>
                <Text style={styles.infoCardTitle}>
                  {formatShort(prediction.fertileStart)} – {formatShort(prediction.fertileEnd)}
                </Text>
                <Text style={styles.infoCardSubtitle}>
                  Predicted ovulation around {formatDate(prediction.ovulationDay)}
                </Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIconCircle}>
                <Text style={styles.infoIcon}>🤍</Text>
              </View>
              <View style={styles.infoCardText}>
                <Text style={styles.infoCardTitle}>
                  {formatShort(prediction.fertileStart)} – {formatShort(prediction.fertileEnd)}
                </Text>
                <Text style={styles.infoCardSubtitle}>
                  {'Estimated fertile window based on\nyour cycle history'}
                </Text>
              </View>
            </View>

            {/* Accuracy insight */}
            <View style={styles.wellnessInsightCard}>
              <View style={styles.wellnessTitleRow}>
                <Text style={styles.wellnessIcon}>🌿</Text>
                <Text style={styles.wellnessTitle}>Prediction Accuracy</Text>
              </View>
              <Text style={styles.wellnessText}>
                {cycles.length < 3
                  ? `Predictions improve with more data. You have ${cycles.length} cycle${cycles.length === 1 ? '' : 's'} logged — aim for at least 3 for more reliable estimates.`
                  : `Based on ${cycles.length} cycles, your predictions are getting more accurate. Keep logging every period for the best results.`}
              </Text>
            </View>

            {/* View History Button */}
            <TouchableOpacity
              style={styles.historyButton}
              activeOpacity={0.8}
              onPress={() => router.push('/wellness-insights' as any)}
            >
              <Text style={styles.historyButtonText}>View Wellness Insights</Text>
            </TouchableOpacity>
          </>
        ) : null}

        <View style={styles.bottomPadding} />
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
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: 4,
    width: 36,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  scrollView: {
    flex: 1,
  },
  pageTitleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 13,
    color: COLORS.textMid,
  },
  badgeRow: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
  },
  calendarCard: {
    marginHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  calendarNav: {
    flexDirection: 'row',
    gap: 8,
  },
  navBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  navBtnText: {
    fontSize: 18,
    color: COLORS.textMid,
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textLight,
    textAlign: 'center',
  },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textDark,
  },
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  periodCircle: {
    backgroundColor: COLORS.primary,
  },
  periodDayText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  fertileCircle: {
    backgroundColor: COLORS.fertileLight,
  },
  ovulationCircle: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  ovulationDayText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  todayCircle: {
    backgroundColor: 'rgba(26,92,90,0.12)',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  todayDayText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  calendarDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDotFilled: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  legendDotFertile: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: COLORS.fertileLight,
    borderWidth: 1, borderColor: COLORS.accent,
  },
  legendDotOutline: {
    width: 10, height: 10, borderRadius: 5,
    borderWidth: 1.5, borderColor: COLORS.primary,
    backgroundColor: 'transparent',
  },
  legendDotToday: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: 'rgba(26,92,90,0.12)',
    borderWidth: 1.5, borderColor: COLORS.primary,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textMid,
  },
  infoCard: {
    marginHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  infoIconCircle: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center', justifyContent: 'center',
  },
  infoIcon: { fontSize: 18 },
  infoCardText: { flex: 1 },
  infoCardTitle: {
    fontSize: 14, fontWeight: '700', color: COLORS.textDark, marginBottom: 2,
  },
  infoCardSubtitle: {
    fontSize: 12, color: COLORS.textMid, lineHeight: 17,
  },
  wellnessInsightCard: {
    marginHorizontal: 20,
    backgroundColor: COLORS.insightBg,
    borderRadius: 16,
    padding: 20,
    marginTop: 6,
    marginBottom: 16,
  },
  wellnessTitleRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10,
  },
  wellnessIcon: { fontSize: 16 },
  wellnessTitle: {
    fontSize: 15, fontWeight: '700', color: COLORS.white,
  },
  wellnessText: {
    fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20,
  },
  historyButton: {
    marginHorizontal: 20,
    borderWidth: 1.5,
    borderColor: COLORS.buttonBorder,
    borderRadius: 50,
    paddingVertical: 15,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  historyButtonText: {
    fontSize: 15, fontWeight: '600', color: COLORS.primary,
  },
  emptyCard: {
    marginHorizontal: 20,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  emptyIcon: { fontSize: 48, marginBottom: 14 },
  emptyTitle: {
    fontSize: 20, fontWeight: '700', color: COLORS.textDark, marginBottom: 10,
  },
  emptyText: {
    fontSize: 14, color: COLORS.textMid, textAlign: 'center', lineHeight: 21, marginBottom: 24,
  },
  emptyBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 28,
  },
  emptyBtnText: {
    color: COLORS.white, fontSize: 15, fontWeight: '700',
  },
  bottomPadding: { height: 32 },
});
