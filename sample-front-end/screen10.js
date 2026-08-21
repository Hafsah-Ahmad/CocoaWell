import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

export default function Screen10() {
  return (
    <View>
      <Text>Screen 10</Text>
    </View>
  );
}

const COLORS = {
  primary: '#1B4D3E',
  primaryLight: '#E8F0EE',
  white: '#FFFFFF',
  background: '#F5F7F6',
  border: '#E0E7E5',
  textDark: '#1A1A1A',
  textMid: '#4A4A4A',
  textLight: '#888888',
  todayRing: '#1B4D3E',
  periodDot: '#1B4D3E',
  insightBg: '#EAF1EE',
};

const DAYS_OF_WEEK = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const CALENDAR_DAYS = [
  [null, null, null, 1, 2, 3, 4],
  [5, 6, 7, 8, 9, 10, 11],
  [12, 13, 14, 15, 16, 17, 18],
  [19, 20, 21, 22, 23, 24, 25],
  [26, 27, 28, 29, 30, null, null],
];

// June 2026: today = 10, period = 12–16
const TODAY = 10;
const PERIOD_START = 12;
const PERIOD_END = 16;

export default function CycleTrackerScreen() {
  const [month] = useState('June 2026');

  const isPeriodDay = (d) => d >= PERIOD_START && d <= PERIOD_END;
  const isToday = (d) => d === TODAY;
  const isPeriodStart = (d) => d === PERIOD_START;
  const isPeriodEnd = (d) => d === PERIOD_END;
  const isPeriodMiddle = (d) => d > PERIOD_START && d < PERIOD_END;

  const getDayStyle = (day) => {
    if (!day) return {};
    if (isPeriodDay(day)) return styles.periodDay;
    return {};
  };

  const getDayTextStyle = (day) => {
    if (!day) return {};
    if (isPeriodDay(day)) return styles.periodDayText;
    if (isToday(day)) return styles.todayText;
    return styles.dayText;
  };

  const getDayContainerExtra = (day, col) => {
    if (!day || !isPeriodDay(day)) return {};
    const isFirst = isPeriodStart(day);
    const isLast = isPeriodEnd(day);
    if (isFirst) return styles.periodFirst;
    if (isLast) return styles.periodLast;
    return styles.periodMiddle;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar} />
            <Text style={styles.brandName}>Cocoa Well</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.bellIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Section Tag */}
        <View style={styles.tagRow}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Cycle Wellness</Text>
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Cycle Tracker</Text>
            <TouchableOpacity style={styles.historyBtn}>
              <Text style={styles.historyIcon}>🕐</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subtitle}>Track and manage your cycle information.</Text>
          <Text style={styles.description}>
            Record your menstrual cycle to receive personalized wellness insights and health
            predictions tailored to your body.
          </Text>
        </View>

        {/* Calendar Card */}
        <View style={styles.card}>
          {/* Month Navigation */}
          <View style={styles.monthNav}>
            <TouchableOpacity>
              <Text style={styles.navArrow}>{'‹'}</Text>
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{month}</Text>
            <TouchableOpacity>
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
          {CALENDAR_DAYS.map((week, wi) => (
            <View key={wi} style={styles.weekRow}>
              {week.map((day, di) => {
                if (!day) {
                  return <View key={di} style={styles.dayCell} />;
                }

                const period = isPeriodDay(day);
                const today = isToday(day);
                const first = isPeriodStart(day);
                const last = isPeriodEnd(day);
                const middle = isPeriodMiddle(day);

                return (
                  <View key={di} style={styles.dayCell}>
                    {/* Period background pill segments */}
                    {period && (
                      <View
                        style={[
                          styles.periodBg,
                          first && styles.periodBgFirst,
                          last && styles.periodBgLast,
                          middle && styles.periodBgMiddle,
                        ]}
                      />
                    )}

                    {/* Day circle */}
                    <View
                      style={[
                        styles.dayCircle,
                        today && styles.todayCircle,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          period && styles.periodDayText,
                          today && !period && styles.todayTextOnly,
                        ]}
                      >
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

        {/* Cycle Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cycle Details</Text>

          <Text style={styles.fieldLabel}>Start Date</Text>
          <View style={styles.dateField}>
            <Text style={styles.dateValue}>June 12, 2026</Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </View>

          <Text style={[styles.fieldLabel, { marginTop: 14 }]}>End Date</Text>
          <View style={styles.dateField}>
            <Text style={styles.dateValue}>June 16, 2026</Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </View>
        </View>

        {/* Cycle Summary Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cycle Summary</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Period Length</Text>
              <Text style={styles.summaryValue}>5 Days</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Status</Text>
              <Text style={styles.summaryValue}>Regular</Text>
            </View>
          </View>

          <Text style={styles.selectedDatesLabel}>Selected Dates</Text>
          <Text style={styles.selectedDatesValue}>June 12 – June 16, 2026</Text>

          {/* Wellness Insight */}
          <View style={styles.insightBox}>
            <Text style={styles.insightTitle}>Wellness Insight</Text>
            <Text style={styles.insightText}>
              Increasing iron intake during these days can help maintain energy levels. Consider
              herbal teas for comfort.
            </Text>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveBtn}>
          <Text style={styles.saveBtnText}>Save Cycle</Text>
        </TouchableOpacity>

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🏠', label: 'Home' },
          { icon: '🩺', label: 'Symptoms' },
          { icon: '📅', label: 'Cycle', active: true },
          { icon: '🌿', label: 'Wellness' },
          { icon: '👤', label: 'Profile' },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.navItem}>
            <Text style={styles.navIcon}>{item.icon}</Text>
            <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>
              {item.label}
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
  container: {
    flex: 1,
    paddingHorizontal: 16,
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
    padding: 6,
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
  description: {
    fontSize: 13,
    color: COLORS.textMid,
    marginTop: 6,
    lineHeight: 20,
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
  navArrow: {
    fontSize: 22,
    color: COLORS.textMid,
    paddingHorizontal: 8,
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
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.background,
  },
  dateValue: {
    fontSize: 14,
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
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    marginHorizontal: 4,
  },
  saveBtnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 16,
    paddingTop: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  navIcon: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});