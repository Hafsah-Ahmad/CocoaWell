import { Stack, useRouter, useSegments } from 'expo-router';
import { useColorScheme, ActivityIndicator, View } from 'react-native';
import React, { useEffect } from 'react';
import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider, useAuth } from '@/context/auth-context';

function NavigationGuard() {
  const { user, isLoading, guestMode } = useAuth();
  const segments = useSegments() as string[];
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const inProfileSetup = segments[0] === 'profile-setup';

    if (!user && !guestMode) {
      // If not logged in and not in guest mode, protect tab routes and profile setup
      if (inAuthGroup || inProfileSetup) {
        router.replace('/onboarding');
      }
    } else {
      // Redirect authenticated/guest users away from entry screens
      const isEntryScreen = 
        segments[0] === 'login' || 
        segments[0] === 'signup' || 
        segments[0] === 'onboarding' || 
        segments[0] === 'index' ||
        segments.length === 0;

      if (isEntryScreen) {
        router.replace('/(tabs)/home');
      }
    }
  }, [user, isLoading, guestMode, segments, router]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F9F8' }}>
        <ActivityIndicator size="large" color="#1A6B5A" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="profile-setup" />
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="mood-tracker" />
      <Stack.Screen name="cycle-predictions" />
      <Stack.Screen name="vitamin-recommendations" />
      <Stack.Screen name="wellness-insights" />
      <Stack.Screen name="notifications-reminders" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AnimatedSplashOverlay />
      <NavigationGuard />
    </AuthProvider>
  );
}
