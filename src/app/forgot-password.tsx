import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setIsLoading(false);
    
    if (error) {
      alert(error.message);
    } else {
      Alert.alert(
        "Link Sent!",
        "If an account exists for this email, you will receive a secure password reset link shortly.",
        [{ text: "OK", onPress: () => router.push('/login') }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Feather name="arrow-left" size={24} color="#0c3b31" />
            </TouchableOpacity>
          </View>

          {/* Title Area */}
          <View style={styles.titleContainer}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>PASSWORD RECOVERY</Text>
            </View>
            <Text style={styles.title}>Reset your password</Text>
            <Text style={styles.subtitle}>
              Enter the email address associated with your account and we'll send you a secure password reset link.
            </Text>
          </View>

          {/* Center Illustration */}
          <View style={styles.illustrationContainer}>
            {/* Background rotated shape */}
            <View style={styles.illustrationBackShape} />
            {/* Foreground shape */}
            <View style={styles.illustrationFrontShape}>
              <MaterialIcons name="email" size={48} color="#0c3b31" />
              {/* Padlock icon badge */}
              <View style={styles.padlockBadge}>
                <Feather name="lock" size={14} color="#64748b" />
              </View>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Feather name="at-sign" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="example@cocoawell.com"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <Text style={styles.hintText}>We'll send a reset link to this email.</Text>
            </View>
          </View>

          {/* Buttons */}
          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleReset}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Send Reset Link</Text>
                <Feather name="send" size={18} color="#ffffff" style={styles.submitButtonIcon} />
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.backToLoginContainer} onPress={() => router.push('/login')}>
            <Feather name="arrow-left" size={16} color="#0c3b31" style={styles.backToLoginIcon} />
            <Text style={styles.backToLoginText}>Back to Login</Text>
          </TouchableOpacity>

          {/* Footer Area */}
          <View style={styles.footer}>
            <Text style={styles.copyrightText}>
              © Cocoa Well — Personal Wellness Space
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fafafc',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  titleContainer: {
    marginBottom: 40,
    alignItems: 'flex-start',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#dae8e6',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#cadad8',
  },
  badgeText: {
    color: '#165e55',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0c3b31',
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 24,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 160,
    marginBottom: 40,
  },
  illustrationBackShape: {
    position: 'absolute',
    width: 120,
    height: 120,
    backgroundColor: '#e2e8f0',
    borderRadius: 30,
    transform: [{ rotate: '-8deg' }],
  },
  illustrationFrontShape: {
    width: 120,
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 5,
    transform: [{ rotate: '3deg' }],
  },
  padlockBadge: {
    position: 'absolute',
    bottom: -6,
    right: -6,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    transform: [{ rotate: '-3deg' }], // Counteract parent rotation
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 0,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0c3b31',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f4f5',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    color: '#0f172a',
    fontSize: 15,
  },
  hintText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 4,
  },
  submitButton: {
    backgroundColor: '#0c3b31',
    flexDirection: 'row',
    width: '100%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonIcon: {
    marginLeft: 8,
  },
  backToLoginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginBottom: 32,
  },
  backToLoginIcon: {
    marginRight: 8,
  },
  backToLoginText: {
    color: '#0c3b31',
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
  },
  copyrightText: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
