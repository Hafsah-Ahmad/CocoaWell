import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/auth-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const features = [
  {
    id: '1',
    title: 'Vitamin Recommendations',
    description: 'Receive personalized wellness suggestions based on your lifestyle and goals.',
    icon: <MaterialCommunityIcons name="pill" size={24} color="#154d48" />,
    iconBg: '#e9f2ef'
  },
  {
    id: '2',
    title: 'Cycle Tracking',
    description: 'Monitor your menstrual cycle and gain insights into recurring patterns.',
    icon: <Ionicons name="calendar-outline" size={24} color="#154d48" />,
    iconBg: '#e9f2ef'
  },
  {
    id: '3',
    title: 'Mood Tracking',
    description: 'Understand emotional trends and how they connect with your wellness journey.',
    icon: <Ionicons name="heart" size={24} color="#154d48" />,
    iconBg: '#e9f2ef'
  },
  {
    id: '4',
    title: 'Wellness Planning',
    description: 'Build healthy habits with guided wellness plans tailored to you.',
    icon: <Ionicons name="leaf-outline" size={24} color="#154d48" />,
    iconBg: '#e9f2ef'
  }
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { setGuestMode } = useAuth();

  const handleNext = () => {
    router.push('/signup');
  };

  const handleSkip = async () => {
    await setGuestMode(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Welcome to Cocoa Well</Text>
          </View>
          <Text style={styles.title}>Your wellness journey starts here</Text>
          <Text style={styles.subtitle}>
            Track your cycle, understand your mood, receive personalized vitamin recommendations, and build healthier habits with confidence.
          </Text>
        </View>

        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image 
            source={require('@/assets/images/images-for-ui/image-for-screen1.jpeg')} 
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          {features.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                {item.icon}
              </View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Fixed Footer */}
      <View style={styles.footer}>
        <View style={styles.pagination}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fafafc', // Very light grey background matching the UI
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 200, // padding for fixed footer
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    marginBottom: 24,
  },
  badgeText: {
    color: '#154d48',
    fontWeight: '600',
    fontSize: 14,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0c3b31',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    width: '100%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  featuresContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0c3b31',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fafafc',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40, // for bottom inset
    alignItems: 'center',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#cbd5e1',
  },
  activeDot: {
    width: 20,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#154d48',
  },
  nextButton: {
    backgroundColor: '#154d48',
    width: '100%',
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  skipButton: {
    paddingVertical: 8,
  },
  skipButtonText: {
    color: '#154d48',
    fontSize: 16,
    fontWeight: '600',
  },
  loginRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  loginText: {
    color: '#64748b',
    fontSize: 15,
  },
  loginLink: {
    color: '#154d48',
    fontSize: 15,
    fontWeight: '700',
  },
});
