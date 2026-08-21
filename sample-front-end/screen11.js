import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet, Text, TouchableOpacity, View
} from 'react-native';

export default function Screen11() {
  return (
    <View>
      <Text>Screen 11</Text>
    </View>
  );
}

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

const JULY_2026 = {
  month: 'July 2026',
  startDay: 3, // July 1, 2026 is a Wednesday (0=Sun)
  totalDays: 31,
  periodDays: [2, 3, 4, 5, 6],
  fertileDays: [10, 11, 12, 13, 15],
  ovulationDay: 14,
};

export default function CyclePredictionsScreen() {
  const [currentMonth] = useState(JULY_2026);

  const renderCalendarDays = () => {
    const cells = [];
    // Empty cells before the 1st
    for (let i = 0; i < currentMonth.startDay; i++) {
      cells.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    for (let day = 1; day <= currentMonth.totalDays; day++) {
      const isPeriod = currentMonth.periodDays.includes(day);
      const isFertile = currentMonth.fertileDays.includes(day);
      const isOvulation = currentMonth.ovulationDay === day;

      cells.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isPeriod && styles.periodCell,
            isFertile && styles.fertileCell,
            isOvulation && styles.ovulationCell,
          ]}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.dayText,
              isPeriod && styles.periodDayText,
              isOvulation && styles.ovulationDayText,
            ]}
          >
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return cells;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuIcon}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cocoa Well</Text>
        <TouchableOpacity>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>👤</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Page Title */}
        <View style={styles.pageTitleSection}>
          <View style={styles.pageTitleRow}>
            <Text style={styles.pageTitle}>Cycle Predictions</Text>
            <TouchableOpacity style={styles.infoButton}>
              <Text style={styles.infoButtonText}>ⓘ</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.pageSubtitle}>View upcoming cycle insights and predictions.</Text>
        </View>

        {/* Badge */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Personalized Predictions</Text>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionTitleBlock}>
          <Text style={styles.sectionTitle}>Your upcoming cycle{'\n'}overview</Text>
          <Text style={styles.sectionSubtitle}>
            Based on your recent cycle history, here are your upcoming cycle predictions.
          </Text>
        </View>

        {/* Calendar Card */}
        <View style={styles.calendarCard}>
          {/* Month header */}
          <View style={styles.calendarHeader}>
            <Text style={styles.monthTitle}>{currentMonth.month}</Text>
            <View style={styles.calendarNav}>
              <TouchableOpacity style={styles.navBtn}>
                <Text style={styles.navBtnText}>{'<'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.navBtn}>
                <Text style={styles.navBtnText}>{'>'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Day of week headers */}
          <View style={styles.weekRow}>
            {DAYS_OF_WEEK.map((d, i) => (
              <View key={i} style={styles.dayCell}>
                <Text style={styles.weekDayText}>{d}</Text>
              </View>
            ))}
          </View>

          {/* Days Grid */}
          <View style={styles.daysGrid}>{renderCalendarDays()}</View>

          {/* Divider */}
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
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoCard}>
          <View style={styles.infoIconCircle}>
            <Text style={styles.infoIcon}>📅</Text>
          </View>
          <View style={styles.infoCardText}>
            <Text style={styles.infoCardTitle}>Expected in 8 Days</Text>
            <Text style={styles.infoCardSubtitle}>Expected start: July 2, 2026</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIconCircle}>
            <Text style={styles.infoIcon}>💧</Text>
          </View>
          <View style={styles.infoCardText}>
            <Text style={styles.infoCardTitle}>July 13 – July 15</Text>
            <Text style={styles.infoCardSubtitle}>Predicted ovulation around July 14</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoIconCircle}>
            <Text style={styles.infoIcon}>🤍</Text>
          </View>
          <View style={styles.infoCardText}>
            <Text style={styles.infoCardTitle}>July 10 – July 15</Text>
            <Text style={styles.infoCardSubtitle}>
              Estimated fertile window based on{'\n'}cycle history
            </Text>
          </View>
        </View>

        {/* Wellness Insight */}
        <View style={styles.wellnessInsightCard}>
          <View style={styles.wellnessTitleRow}>
            <Text style={styles.wellnessIcon}>🌿</Text>
            <Text style={styles.wellnessTitle}>Wellness Insight</Text>
          </View>
          <Text style={styles.wellnessText}>
            Regular cycle tracking improves prediction accuracy and helps identify wellness patterns
            over time.
          </Text>
        </View>

        {/* View Prediction History Button */}
        <TouchableOpacity style={styles.historyButton} activeOpacity={0.8}>
          <Text style={styles.historyButtonText}>View Prediction History</Text>
        </TouchableOpacity>

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { icon: '🏠', label: 'Home' },
          { icon: '🩹', label: 'Symptoms' },
          { icon: '🗓️', label: 'Cycle', active: true },
          { icon: '🌸', label: 'Wellness' },
          { icon: '👤', label: 'Profile' },
        ].map((item, i) => (
          <TouchableOpacity key={i} style={styles.navItem} activeOpacity={0.7}>
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

const DAY_SIZE = 40;

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
  menuIcon: {
    gap: 4,
    padding: 4,
  },
  menuLine: {
    width: 20,
    height: 2,
    backgroundColor: COLORS.textDark,
    borderRadius: 1,
    marginVertical: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  pageTitleSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  pageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButtonText: {
    fontSize: 16,
    color: COLORS.textMid,
  },
  pageSubtitle: {
    fontSize: 13,
    color: COLORS.textMid,
    marginTop: 4,
  },
  badgeRow: {
    paddingHorizontal: 20,
    paddingVertical: 8,
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
  sectionTitleBlock: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textDark,
    lineHeight: 32,
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: COLORS.textMid,
    lineHeight: 20,
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
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  navBtnText: {
    fontSize: 16,
    color: COLORS.textMid,
    fontWeight: '600',
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
  },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textDark,
  },
  periodCell: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    margin: 2,
    width: 32,
    height: 32,
    aspectRatio: undefined,
  },
  periodDayText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  fertileCell: {
    backgroundColor: COLORS.fertileLight,
    borderRadius: 20,
    margin: 2,
    width: 32,
    height: 32,
    aspectRatio: undefined,
  },
  ovulationCell: {
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 20,
    margin: 2,
    width: 32,
    height: 32,
    aspectRatio: undefined,
    backgroundColor: 'transparent',
  },
  ovulationDayText: {
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
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  legendDotFertile: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.fertileLight,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  legendDotOutline: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
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
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoIcon: {
    fontSize: 18,
  },
  infoCardText: {
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 2,
  },
  infoCardSubtitle: {
    fontSize: 12,
    color: COLORS.textMid,
    lineHeight: 17,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  wellnessIcon: {
    fontSize: 16,
  },
  wellnessTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  wellnessText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 19,
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
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  bottomPadding: {
    height: 24,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingVertical: 8,
    paddingBottom: 12,
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
    fontWeight: '500',
  },
  navLabelActive: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});