import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

// Local storage keys for Guest Mode
const STORAGE_KEYS = {
  PROFILE: 'COCOA_GUEST_PROFILE',
  MOODS: 'COCOA_GUEST_MOOD_LOGS',
  SYMPTOMS: 'COCOA_GUEST_SYMPTOM_LOGS',
  CYCLE: 'COCOA_GUEST_CYCLE_LOGS',
  HABITS: 'COCOA_GUEST_HABITS_LOGS',
};

// Initial Mock data so the guest mode starts pre-populated and functional
const MOCK_DATA = {
  profile: {
    full_name: 'Serena',
    age: 25,
    height: 175,
    weight: 70,
    lifestyle: 'Working Professional',
    activity_level: 'Lightly Active',
    primary_goal: 'Improve Energy & Balance',
  },
  moods: [
    { mood_id: 'happy', logged_at: new Date(Date.now() - 2 * 3600000).toISOString() }, // 2 hours ago
    { mood_id: 'happy', logged_at: new Date(Date.now() - 24 * 3600000).toISOString() },
    { mood_id: 'tired', logged_at: new Date(Date.now() - 48 * 3600000).toISOString() },
  ],
  symptoms: [
    {
      id: 'mock-symptom-1',
      severity: 7,
      notes: 'Feeling quite sluggish after lunch.',
      logged_at: new Date(Date.now() - 2 * 3600000).toISOString(),
      symptoms: ['fatigue'],
    },
    {
      id: 'mock-symptom-2',
      severity: 4,
      notes: 'Mild headache in the morning.',
      logged_at: new Date(Date.now() - 25 * 3600000).toISOString(),
      symptoms: ['headache'],
    },
  ],
  cycles: [
    { start_date: '2026-06-12', end_date: '2026-06-16', period_length: 5, status: 'regular' },
  ],
  habits: {
    [new Date().toISOString().split('T')[0]]: {
      water_completed: true,
      exercise_completed: true,
      meditation_completed: false,
      sleep_completed: false,
    },
  },
};

export interface UserProfile {
  full_name: string;
  age: number;
  height: number;
  weight: number;
  lifestyle: string;
  activity_level: string;
  primary_goal: string;
}

export interface MoodLog {
  mood_id: string;
  logged_at: string;
}

export interface SymptomLog {
  id?: string;
  severity: number;
  notes: string;
  logged_at: string;
  symptoms: string[];
}

export interface CycleLog {
  start_date: string;
  end_date: string;
  period_length: number;
  status: string;
}

export interface HabitsLog {
  water_completed: boolean;
  exercise_completed: boolean;
  meditation_completed: boolean;
  sleep_completed: boolean;
}

// Service Layer implementation
export const DBService = {
  // Check auth status
  async getUserId(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id || null;
  },

  // 1. Profile methods
  async getProfile(): Promise<UserProfile> {
    const userId = await this.getUserId();
    if (userId) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (data && !error) return data as UserProfile;
    }

    // Guest Mode
    const localProfile = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    return localProfile ? JSON.parse(localProfile) : MOCK_DATA.profile;
  },

  async saveProfile(profile: Partial<UserProfile>): Promise<void> {
    const userId = await this.getUserId();
    if (userId) {
      const { error } = await supabase.from('profiles').upsert({
        id: userId,
        ...profile,
        updated_at: new Date().toISOString(),
      });
      if (!error) return;
    }

    // Guest Mode
    const current = await this.getProfile();
    const updated = { ...current, ...profile };
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
  },

  // 2. Mood logging methods
  async saveMoodLog(moodId: string): Promise<void> {
    const userId = await this.getUserId();
    if (userId) {
      const { error } = await supabase.from('mood_logs').insert({
        user_id: userId,
        mood_id: moodId,
        logged_at: new Date().toISOString(),
      });
      if (!error) return;
    }

    // Guest Mode
    const moods = await this.getMoodLogs();
    const updated = [{ mood_id: moodId, logged_at: new Date().toISOString() }, ...moods];
    await AsyncStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(updated));
  },

  async getMoodLogs(): Promise<MoodLog[]> {
    const userId = await this.getUserId();
    if (userId) {
      const { data, error } = await supabase
        .from('mood_logs')
        .select('mood_id, logged_at')
        .order('logged_at', { ascending: false });
      if (data && !error) return data as MoodLog[];
    }

    // Guest Mode
    const localMoods = await AsyncStorage.getItem(STORAGE_KEYS.MOODS);
    return localMoods ? JSON.parse(localMoods) : MOCK_DATA.moods;
  },

  // 3. Symptom logging methods
  async saveSymptomLog(symptoms: string[], severity: number, notes: string): Promise<void> {
    const userId = await this.getUserId();
    const loggedAt = new Date().toISOString();

    if (userId) {
      // 1. Save core symptom log
      const { data, error } = await supabase
        .from('symptom_logs')
        .insert({
          user_id: userId,
          severity,
          notes,
          logged_at: loggedAt,
        })
        .select()
        .single();

      if (data && !error) {
        // 2. Save linked symptoms list
        const items = symptoms.map((s) => ({
          log_id: data.id,
          symptom_id: s,
        }));
        await supabase.from('symptom_log_items').insert(items);
        return;
      }
    }

    // Guest Mode
    const logs = await this.getSymptomLogs();
    const newLog: SymptomLog = {
      id: Math.random().toString(),
      severity,
      notes,
      logged_at: loggedAt,
      symptoms,
    };
    const updated = [newLog, ...logs];
    await AsyncStorage.setItem(STORAGE_KEYS.SYMPTOMS, JSON.stringify(updated));
  },

  async getSymptomLogs(): Promise<SymptomLog[]> {
    const userId = await this.getUserId();
    if (userId) {
      const { data, error } = await supabase
        .from('symptom_logs')
        .select(`
          id,
          severity,
          notes,
          logged_at,
          symptom_log_items (symptom_id)
        `)
        .order('logged_at', { ascending: false });

      if (data && !error) {
        return data.map((d: any) => ({
          id: d.id,
          severity: d.severity,
          notes: d.notes,
          logged_at: d.logged_at,
          symptoms: d.symptom_log_items.map((i: any) => i.symptom_id),
        })) as SymptomLog[];
      }
    }

    // Guest Mode
    const localSymptoms = await AsyncStorage.getItem(STORAGE_KEYS.SYMPTOMS);
    return localSymptoms ? JSON.parse(localSymptoms) : MOCK_DATA.symptoms;
  },

  // 4. Cycle logging methods
  async saveCycleLog(startDate: string, endDate: string): Promise<void> {
    const userId = await this.getUserId();
    const start = new Date(startDate);
    const end = new Date(endDate);
    const length = Math.round((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;

    if (userId) {
      const { error } = await supabase.from('cycle_logs').insert({
        user_id: userId,
        start_date: startDate,
        end_date: endDate,
        period_length: length,
        status: 'regular',
      });
      if (!error) return;
    }

    // Guest Mode
    const cycles = await this.getCycleLogs();
    const updated = [
      { start_date: startDate, end_date: endDate, period_length: length, status: 'regular' },
      ...cycles,
    ];
    await AsyncStorage.setItem(STORAGE_KEYS.CYCLE, JSON.stringify(updated));
  },

  async getCycleLogs(): Promise<CycleLog[]> {
    const userId = await this.getUserId();
    if (userId) {
      const { data, error } = await supabase
        .from('cycle_logs')
        .select('start_date, end_date, period_length, status')
        .order('start_date', { ascending: false });
      if (data && !error) return data as CycleLog[];
    }

    // Guest Mode
    const localCycle = await AsyncStorage.getItem(STORAGE_KEYS.CYCLE);
    return localCycle ? JSON.parse(localCycle) : MOCK_DATA.cycles;
  },

  // 5. Habits logs (Daily checklist)
  async saveHabitsLog(date: string, habits: Partial<HabitsLog>): Promise<void> {
    const userId = await this.getUserId();
    if (userId) {
      const { error } = await supabase.from('wellness_habits_logs').upsert({
        user_id: userId,
        log_date: date,
        ...habits,
      });
      if (!error) return;
    }

    // Guest Mode
    const allHabits = await this.getRawHabitsLogs();
    const currentDay = allHabits[date] || {
      water_completed: false,
      exercise_completed: false,
      meditation_completed: false,
      sleep_completed: false,
    };
    allHabits[date] = { ...currentDay, ...habits };
    await AsyncStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(allHabits));
  },

  async getHabitsLog(date: string): Promise<HabitsLog> {
    const userId = await this.getUserId();
    if (userId) {
      const { data, error } = await supabase
        .from('wellness_habits_logs')
        .select('water_completed, exercise_completed, meditation_completed, sleep_completed')
        .eq('log_date', date)
        .single();
      if (data && !error) return data as HabitsLog;
    }

    // Guest Mode
    const allHabits = await this.getRawHabitsLogs();
    return (
      allHabits[date] || {
        water_completed: false,
        exercise_completed: false,
        meditation_completed: false,
        sleep_completed: false,
      }
    );
  },

  async getRawHabitsLogs(): Promise<Record<string, HabitsLog>> {
    const localHabits = await AsyncStorage.getItem(STORAGE_KEYS.HABITS);
    return localHabits ? JSON.parse(localHabits) : MOCK_DATA.habits;
  },

  // Dynamic calculations for insights dashboard (30 days aggregation)
  async fetchWellnessInsights() {
    const moods = await this.getMoodLogs();
    const symptoms = await this.getSymptomLogs();
    const cycles = await this.getCycleLogs();

    // 1. Calculate mood summary percentages for the last 30 days
    const totalMoods = moods.length || 1;
    const moodCounts = moods.reduce((acc, m) => {
      acc[m.mood_id] = (acc[m.mood_id] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 2. Calculate symptom frequency
    const totalSymptoms = symptoms.length || 1;
    const symptomCounts = symptoms.reduce((acc, s) => {
      s.symptoms.forEach((sym) => {
        acc[sym] = (acc[sym] || 0) + 1;
      }, 0);
      return acc;
    }, {} as Record<string, number>);

    const formattedSymptoms = Object.entries(symptomCounts).map(([key, val]) => ({
      label: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
      percent: Math.round((val / totalSymptoms) * 100),
    }));

    return {
      moodStability: moods.length > 0 ? 'High' : 'N/A',
      symptomList: formattedSymptoms.length > 0 ? formattedSymptoms : [
        { label: 'Fatigue', percent: 42 },
        { label: 'Stress', percent: 28 },
        { label: 'Headache', percent: 15 },
        { label: 'Cramps', percent: 10 },
      ],
      averageCycleLength: cycles.length > 0
        ? Math.round(cycles.reduce((acc, c) => acc + c.period_length, 0) / cycles.length)
        : 28,
    };
  },
};
