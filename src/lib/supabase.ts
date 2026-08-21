import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const isServer = typeof window === 'undefined';

let authStorage: any;
let realtimeTransport: any;

if (!isServer) {
  authStorage = require('@react-native-async-storage/async-storage').default;
}

if (isServer) {
  const ws = require('ws');
  realtimeTransport = ws?.default ?? ws;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: authStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: isServer ? { transport: realtimeTransport } : undefined,
});
