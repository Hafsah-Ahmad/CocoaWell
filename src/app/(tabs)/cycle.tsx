import React, { useState, useEffect } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { DBService, CycleLog } from '@/lib/db-service';

const COLORS = {
  primary: '#1B4D3E',
  primaryLight: '#E8F0EE',
  white: '#FFFFFF',
  background: '#F5F7F6',
  border: '#E0E7E5',
  textDark: '#1A1A1A',
  textMid: '#4A4A4A',
  textLight: '#888888',
  insightBg: '#EAF1EE',
};

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Build calendar grid for a given year/month
function buildCalendarGrid(year: number, month: number): (number | null)[][] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid: (number | null)[][] = [];
  let week: (number | null)[] = Array(firstDay).fill(null);

  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d);
    if (week.length === 7) {
      grid.push(week);
      week = [];
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    grid.push(week);
  }
  return grid;
}

function toDateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function formatDisplay(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${MONTH_NAMES[m - 1]} ${d}, ${y}`;
}

// Custom month/year date picker modal
function DatePickerModal({
  visible,
  title,
  initialDate,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  title: string;
  initialDate: Date;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}) {
  const [year, setYear] = useState(initialDate.getFullYear());
  const [month, setMonth] = useState(initialDate.getMonth());
  const [day, setDay] = useState(initialDate.getDate());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const clampedDay = Math.min(day, daysInMonth);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const grid = buildCalendarGrid(year, month);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={pickerStyles.overlay}>
        <View style={pickerStyles.container}>
          <Text style={pickerStyles.title}>{title}</Text>

          {/* Month Navigation */}
          <View style={pickerStyles.monthNav}>
            <TouchableOpacity onPress={prevMonth} style={pickerStyles.navBtn}>
              <Text style={pickerStyles.navText}>‹</Text>
            </TouchableOpacity>
            <Text style={pickerStyles.monthText}>
              {MONTH_NAMES[month]} {year}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={pickerStyles.navBtn}>
              <Text style={pickerStyles.navText}>›</Text>
            </TouchableOpacity>
          </View>

          {/* Day Headers */}
          <View style={pickerStyles.daysRow}>
            {DAYS_OF_WEEK.map((d, i) => (
              <Text key={i} style={pickerStyles.dayHeader}>{d}</Text>
            ))}
          </View>

          {/* Day Grid */}
          {grid.map((week, wi) => (
            <View key={wi} style={pickerStyles.weekRow}>
              {week.map((d, di) => {
                if (d === null) return <View key={di} style={pickerStyles.dayCell} />;
                const selected = d === clampedDay;
                const today = new Date();
                const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                return (
                  <TouchableOpacity
                    key={di}
                    style={pickerStyles.dayCell}
                    onPress={() => setDay(d)}
                  >
                    <View style={[
                      pickerStyles.dayCircle,
                      selected && pickerStyles.selectedCircle,
                      !selected && isToday && pickerStyles.todayCircle,
                    ]}>
                      <Text style={[
                        pickerStyles.dayText,
                        selected && pickerStyles.selectedDayText,
                        !selected && isToday && pickerStyles.todayText,
                      ]}>{d}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}

          {/* Buttons */}
          <View style={pickerStyles.buttons}>
            <TouchableOpacity style={pickerStyles.cancelBtn} onPress={onClose}>
              <Text style={pickerStyles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={pickerStyles.confirmBtn}
              onPress={() => onConfirm(new Date(year, month, clampedDay))}
            >
              <Text style={pickerStyles.confirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function CycleTrackerScreen() {
  const router = useRouter();
  const today = new Date();

  // Calendar view state
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  // Selected cycle dates
  const [startDate, setStartDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 5)
  );

  // Picker modals
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Past cycle logs from DB
  const [cycleLogs, setCycleLogs] = useState<CycleLog[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    DBService.getCycleLogs().then(setCycleLogs);
  }, []);

  // Navigate the calendar view
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const calGrid = buildCalendarGrid(viewYear, viewMonth);

  const isPeriodDay = (d: number) => {
    const dateStr = toDateStr(viewYear, viewMonth, d);
    return cycleLogs.some((c) => dateStr >= c.start_date && dateStr <= c.end_date);
  };
  const isPeriodStart = (d: number) =>
    cycleLogs.some((c) => toDateStr(viewYear, viewMonth, d) === c.start_date);
  const isPeriodEnd = (d: number) =>
    cycleLogs.some((c) => toDateStr(viewYear, viewMonth, d) === c.end_date);
  const isPeriodMiddle = (d: number) => {
    const dateStr = toDateStr(viewYear, viewMonth, d);
    return cycleLogs.some((c) => dateStr > c.start_date && dateStr < c.end_date);
  };
  const isToday = (d: number) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear();

  // Selected dates as strings
  const startStr = startDate.toISOString().split('T')[0];
  const endStr = endDate.toISOString().split('T')[0];
  const periodLength = Math.max(
    1,
    Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)) + 1
  );

  // Wellness insight based on period length
  const wellnessInsight = periodLength <= 3
    ? 'Short periods are common. Stay hydrated and track consistently for better insights.'
    : periodLength <= 7
      ? 'Increasing iron intake during your period can help maintain energy. Consider herbal teas for comfort.'
      : 'Longer periods can increase fatigue. Consider speaking with a healthcare provider and focus on iron-rich foods.';

  const handleSave = async () => {
    if (endDate < startDate) {
      alert('End date must be after start date.');
      return;
    }
    setSaving(true);
    try {
      await DBService.saveCycleLog(startStr, endStr);
      const updated = await DBService.getCycleLogs();
      setCycleLogs(updated);
      alert('Cycle information saved successfully!');
    } catch (e) {
      console.warn(e);
      alert('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar} />
            <Text style={styles.brandName}>Cocoa Well</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications-reminders' as any)}>
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Tag */}
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Cycle Wellness</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Cycle Tracker</Text>
            <TouchableOpacity
              style={styles.historyBtn}
              onPress={() => router.push('/cycle-predictions' as any)}
            >
              <Text style={styles.historyIcon}>🔮</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Track and manage your cycle information.</Text>
        </View>

        {/* Calendar Card */}
        <View style={styles.card}>
          {/* Month Navigation */}
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
              <Text style={styles.navArrow}>{'‹'}</Text>
            </TouchableOpacity>
            <Text style={styles.monthTitle}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </Text>
            <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
              <Text style={styles.navArrow}>{'›'}</Text>
            </TouchableOpacity>
          </View>

          {/* Day Labels */}
          <View style={styles.daysRow}>
            {DAYS_OF_WEEK.map((d, i) => (
              <View key={i} style={styles.dayLabelCell}>
                <Text style={styles.dayLabel}>{d}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Grid */}
          {calGrid.map((week, wi) => (
            <View key={wi} style={styles.weekRow}>
              {week.map((day, di) => {
                if (day === null) return <View key={di} style={styles.dayCell} />;

                const period = isPeriodDay(day);
                const todayDay = isToday(day);
                const first = isPeriodStart(day);
                const last = isPeriodEnd(day);
                const middle = isPeriodMiddle(day);

                return (
                  <View key={di} style={styles.dayCell}>
                    {period && (
                      <View style={[
                        styles.periodBg,
                        first && styles.periodBgFirst,
                        last && styles.periodBgLast,
                        middle && styles.periodBgMiddle,
                      ]} />
                    )}
                    <View style={[styles.dayCircle, todayDay && styles.todayCircle]}>
                      <Text style={[
                        styles.dayText,
                        period && styles.periodDayText,
                        todayDay && !period && styles.todayTextOnly,
                      ]}>
                        {day}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ))}

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={styles.legendDot} />
              <Text style={styles.legendText}>Period Days</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendCircle} />
              <Text style={styles.legendText}>Today</Text>
            </View>
          </View>
        </View>

        {/* Cycle Details Card — interactive date pickers */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Log New Period</Text>

          <Text style={styles.fieldLabel}>Start Date</Text>
          <TouchableOpacity
            style={styles.dateField}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={styles.dateValue}>{formatDisplay(startStr)}</Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>

          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>End Date</Text>
          <TouchableOpacity
            style={styles.dateField}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={styles.dateValue}>{formatDisplay(endStr)}</Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>
        </View>

        {/* Cycle Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cycle Summary</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Period Length</Text>
              <Text style={styles.summaryValue}>{periodLength} {periodLength === 1 ? 'Day' : 'Days'}</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Status</Text>
              <Text style={styles.summaryValue}>
                {periodLength >= 2 && periodLength <= 7 ? 'Regular' : 'Irregular'}
              </Text>
            </View>
          </View>

          <Text style={styles.selectedDatesLabel}>Selected Dates</Text>
          <Text style={styles.selectedDatesValue}>
            {formatDisplay(startStr)} – {formatDisplay(endStr)}
          </Text>

          {/* Wellness Insight */}
          <View style={styles.insightBox}>
            <Text style={styles.insightTitle}>Wellness Insight</Text>
            <Text style={styles.insightText}>{wellnessInsight}</Text>
          </View>
        </View>

        {/* Past Cycle History */}
        {cycleLogs.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Recent History</Text>
            {cycleLogs.slice(0, 3).map((log, i) => (
              <View key={i} style={[styles.historyRow, i > 0 && styles.historyRowBorder]}>
                <Text style={styles.historyDate}>
                  {formatDisplay(log.start_date)} – {formatDisplay(log.end_date)}
                </Text>
                <Text style={styles.historyLength}>{log.period_length} days</Text>
              </View>
            ))}
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          activeOpacity={0.85}
          disabled={saving}
          onPress={handleSave}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save Cycle'}</Text>
        </TouchableOpacity>

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* Date Picker Modals */}
      <DatePickerModal
        visible={showStartPicker}
        title="Select Start Date"
        initialDate={startDate}
        onClose={() => setShowStartPicker(false)}
        onConfirm={(date) => {
          setStartDate(date);
          if (date > endDate) setEndDate(date);
          setShowStartPicker(false);
        }}
      />
      <DatePickerModal
        visible={showEndPicker}
        title="Select End Date"
        initialDate={endDate}
        onClose={() => setShowEndPicker(false)}
        onConfirm={(date) => {
          setEndDate(date);
          setShowEndPicker(false);
        }}
      />
    </SafeAreaView>
  );
}

const pickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 16,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  navBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  navText: {
    fontSize: 24,
    color: '#1B4D3E',
    fontWeight: '600',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  daysRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#888888',
    paddingVertical: 4,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  dayCell: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCircle: {
    backgroundColor: '#1B4D3E',
  },
  todayCircle: {
    borderWidth: 1.5,
    borderColor: '#1B4D3E',
  },
  dayText: {
    fontSize: 14,
    color: '#1A1A1A',
  },
  selectedDayText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  todayText: {
    color: '#1B4D3E',
    fontWeight: '700',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E0E7E5',
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A4A4A',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#1B4D3E',
    alignItems: 'center',
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    opacity: 0.7,
  },
  brandName: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  bellIcon: {
    fontSize: 20,
  },
  tagRow: {
    marginBottom: 10,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primaryLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  titleSection: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  historyBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  historyIcon: {
    fontSize: 16,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMid,
    marginTop: 4,
    fontWeight: '500',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 14,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  navBtn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  navArrow: {
    fontSize: 24,
    color: COLORS.textMid,
    fontWeight: '500',
  },
  monthTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  daysRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dayLabelCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  dayCell: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  periodBg: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary,
  },
  periodBgFirst: {
    left: 4,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  periodBgLast: {
    right: 4,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  periodBgMiddle: {},
  dayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  todayCircle: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  dayText: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: '400',
  },
  periodDayText: {
    color: COLORS.white,
    fontWeight: '600',
  },
  todayTextOnly: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  legend: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  legendCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  legendText: {
    fontSize: 12,
    color: COLORS.textMid,
  },
  fieldLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 6,
    fontWeight: '500',
  },
  dateField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: COLORS.background,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  calendarIcon: {
    fontSize: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  selectedDatesLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  selectedDatesValue: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '500',
    marginBottom: 14,
  },
  insightBox: {
    backgroundColor: COLORS.insightBg,
    borderRadius: 12,
    padding: 14,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
  },
  insightText: {
    fontSize: 13,
    color: COLORS.textMid,
    lineHeight: 19,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  historyRowBorder: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  historyDate: {
    fontSize: 13,
    color: COLORS.textMid,
  },
  historyLength: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    marginHorizontal: 4,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
