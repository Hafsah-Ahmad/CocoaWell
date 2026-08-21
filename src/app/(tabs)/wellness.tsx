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
import { Ionicons } from '@expo/vector-icons';

interface ChecklistItem {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  completed: boolean;
}

const CHECKLIST_DATA: ChecklistItem[] = [
  {
    id: '1',
    title: 'Drink Water',
    subtitle: '8 glasses target',
    icon: 'water',
    completed: true,
  },
  {
    id: '2',
    title: 'Exercise',
    subtitle: '30 min morning flow',
    icon: 'fitness',
    completed: true,
  },
  {
    id: '3',
    title: 'Meditation',
    subtitle: '10 min mindfulness',
    icon: 'body',
    completed: false,
  },
  {
    id: '4',
    title: 'Sleep Tracking',
    subtitle: "Log last night's rest",
    icon: 'moon',
    completed: false,
  },
];

export default function WellnessPlanScreen() {
  const router = useRouter();
  const [checklist, setChecklist] = useState<ChecklistItem[]>(CHECKLIST_DATA);
  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    DBService.getHabitsLog(todayStr).then((log) => {
      setChecklist((prev) =>
        prev.map((item) => {
          let completed = false;
          if (item.id === '1') completed = log.water_completed;
          if (item.id === '2') completed = log.exercise_completed;
          if (item.id === '3') completed = log.meditation_completed;
          if (item.id === '4') completed = log.sleep_completed;
          return { ...item, completed };
        })
      );
    });
  }, []);

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const remainingCount = totalCount - completedCount;
  const allComplete = remainingCount === 0;

  const toggleItem = async (id: string) => {
    const updated = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setChecklist(updated);

    const habitsUpdate: any = {};
    if (id === '1') habitsUpdate.water_completed = !checklist.find((i) => i.id === '1')?.completed;
    if (id === '2') habitsUpdate.exercise_completed = !checklist.find((i) => i.id === '2')?.completed;
    if (id === '3') habitsUpdate.meditation_completed = !checklist.find((i) => i.id === '3')?.completed;
    if (id === '4') habitsUpdate.sleep_completed = !checklist.find((i) => i.id === '4')?.completed;

    try {
      await DBService.saveHabitsLog(todayStr, habitsUpdate);
    } catch (e) {
      console.warn('Error saving checklist item toggle:', e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/settings' as any)}>
          <Ionicons name="menu" size={24} color="#1A4D44" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wellness Plan</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/cycle-predictions' as any)}>
            <Ionicons name="calendar-outline" size={22} color="#1A4D44" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.avatarButton} onPress={() => router.push('/(tabs)/profile' as any)}>
            <Ionicons name="person" size={16} color="#1A4D44" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's Goal Card */}
        <View style={styles.goalCard}>
          <View style={styles.goalBadge}>
            <Text style={styles.goalBadgeText}>TODAY'S GOAL</Text>
          </View>
          <Text style={styles.goalTitle}>
            Build healthy habits one step at a time
          </Text>
          <Text style={styles.goalDescription}>
            Complete your wellness activities today to support energy,
            balance, and overall well-being.
          </Text>
          <View style={styles.goalFooter}>
            <Ionicons name="sparkles" size={14} color="#A9C9C0" />
            <Text style={styles.goalFooterText}>
              Every completed habit contributes to your long-term wellness
              journey.
            </Text>
          </View>
        </View>

        {/* Today's Progress Card */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.progressRow}>
            <View style={styles.progressCircle}>
              <Text style={styles.progressPercentText}>
                {progressPercent}%
              </Text>
            </View>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>
                {completedCount} of {totalCount} tasks completed
              </Text>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${progressPercent}%` },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Today's Checklist */}
        <Text style={styles.checklistTitle}>Today's Checklist</Text>
        <View style={styles.checklistContainer}>
          {checklist.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.checklistItem,
                item.completed && styles.checklistItemCompleted,
              ]}
              onPress={() => toggleItem(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.checklistIconWrapper}>
                <Ionicons name={item.icon as any} size={18} color="#FFFFFF" />
              </View>
              <View style={styles.checklistTextWrapper}>
                <Text style={styles.checklistItemTitle}>{item.title}</Text>
                <Text style={styles.checklistItemSubtitle}>
                  {item.subtitle}
                </Text>
              </View>
              <Ionicons
                name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                size={24}
                color={item.completed ? '#1A4D44' : '#C7CCD1'}
              />
              <Ionicons
                name="chevron-forward"
                size={18}
                color="#B0B6BB"
                style={styles.chevron}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily Wellness Insight */}
        <TouchableOpacity 
          style={styles.insightCard}
          activeOpacity={0.9}
          onPress={() => router.push('/wellness-insights' as any)}
        >
          <View style={styles.insightIconWrapper}>
            <Ionicons name="leaf" size={18} color="#1A4D44" />
          </View>
          <View style={styles.insightTextWrapper}>
            <Text style={styles.insightTitle}>Daily Wellness Insight</Text>
            <Text style={styles.insightDescription}>
              Small actions taken consistently are more powerful than large
              actions taken occasionally. Click to view full insights!
            </Text>
          </View>
        </TouchableOpacity>

        {/* Mark Day Complete Button */}
        <TouchableOpacity
          style={[
            styles.markCompleteButton,
            allComplete && styles.markCompleteButtonActive,
          ]}
          disabled={!allComplete}
          activeOpacity={0.8}
          onPress={() => router.push('/wellness-insights' as any)}
        >
          <Ionicons
            name={allComplete ? 'checkmark-circle' : 'lock-closed'}
            size={18}
            color={allComplete ? '#FFFFFF' : '#9AA1A8'}
          />
          <Text
            style={[
              styles.markCompleteText,
              allComplete && styles.markCompleteTextActive,
            ]}
          >
            Mark Day Complete
          </Text>
        </TouchableOpacity>
        <Text style={styles.markCompleteHint}>
          {allComplete
            ? "You've completed today's plan!"
            : `Complete ${remainingCount} more task${
                remainingCount > 1 ? 's' : ''
              } to finish today's plan`}
        </Text>
        <View style={{ height: 90 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F5F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#F9FAFA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A4D44',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 6,
    marginLeft: 4,
  },
  avatarButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0D9D3',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  goalCard: {
    backgroundColor: '#16453F',
    borderRadius: 20,
    padding: 22,
    marginTop: 8,
  },
  goalBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 14,
  },
  goalBadgeText: {
    color: '#CFE3DD',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  goalTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 31,
    marginBottom: 14,
  },
  goalDescription: {
    color: '#BFD3CC',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 18,
  },
  goalFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  goalFooterText: {
    color: '#A9C9C0',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16453F',
    marginBottom: 18,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 5,
    borderColor: '#16453F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 18,
  },
  progressPercentText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#16453F',
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 14,
    color: '#3A4046',
    fontWeight: '600',
    marginBottom: 10,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DCE3F0',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16453F',
  },
  checklistTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#16453F',
    marginTop: 26,
    marginBottom: 14,
  },
  checklistContainer: {
    gap: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  checklistItemCompleted: {
    backgroundColor: '#ECEEF0',
  },
  checklistIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#16453F',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  checklistTextWrapper: {
    flex: 1,
  },
  checklistItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2933',
    marginBottom: 3,
  },
  checklistItemSubtitle: {
    fontSize: 13,
    color: '#8A9097',
  },
  chevron: {
    marginLeft: 10,
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F2EE',
    borderLeftWidth: 4,
    borderLeftColor: '#16453F',
    borderRadius: 16,
    padding: 18,
    marginTop: 24,
  },
  insightIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#D9E6DD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  insightTextWrapper: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#16453F',
    marginBottom: 6,
  },
  insightDescription: {
    fontSize: 13.5,
    color: '#5B6168',
    lineHeight: 20,
  },
  markCompleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D8DBDE',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 26,
  },
  markCompleteButtonActive: {
    backgroundColor: '#16453F',
  },
  markCompleteText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#9AA1A8',
    marginLeft: 8,
  },
  markCompleteTextActive: {
    color: '#FFFFFF',
  },
  markCompleteHint: {
    textAlign: 'center',
    fontSize: 12.5,
    color: '#9AA1A8',
    marginTop: 10,
  },
});
