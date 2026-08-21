import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  guestMode: boolean;
  setGuestMode: (enabled: boolean) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  guestMode: false,
  setGuestMode: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [guestMode, _setGuestMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setGuestMode = async (enabled: boolean) => {
    _setGuestMode(enabled);
    if (enabled) {
      await AsyncStorage.setItem('COCOA_GUEST_MODE', 'true');
      setUser(null);
      setSession(null);
    } else {
      await AsyncStorage.removeItem('COCOA_GUEST_MODE');
    }
  };

  useEffect(() => {
    // 1. Check local guest mode flag first
    const checkGuestMode = async () => {
      try {
        const guestFlag = await AsyncStorage.getItem('COCOA_GUEST_MODE');
        if (guestFlag === 'true') {
          _setGuestMode(true);
        }
      } catch (e) {
        console.warn('Error checking guest mode:', e);
      }
    };

    // 2. Fetch current Supabase session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        if (session) {
          // If we have a valid Supabase session, turn off guest mode
          await setGuestMode(false);
        }
      } catch (e) {
        console.warn('Error checking Supabase session:', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkGuestMode().then(() => checkSession());

    // 3. Listen to Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session) {
        _setGuestMode(false);
        await AsyncStorage.removeItem('COCOA_GUEST_MODE');
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    await setGuestMode(false);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, guestMode, setGuestMode, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
