import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { Colors } from '../../constants/Colors';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../stores/authStore';
import { authService } from '../../services/auth/authService';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform as RNPlatform } from 'react-native';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { t } = useTranslation();
  const { setUser } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    if (!isLogin && (!firstName || !lastName)) {
      Alert.alert('Error', 'Please enter your first and last name');
      return;
    }

    setLoading(true);
    try {
      if (!auth) {
        Alert.alert('Error', 'Firebase not configured');
        return;
      }

      let user;
      if (isLogin) {
        // Sign in
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
      } else {
        // Sign up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        user = userCredential.user;
        
        // Create user profile
        await authService.createUserProfile(user.uid, {
          firstName,
          lastName,
          isHelper: false,
        });
      }

      setUser(user);
      // Navigation will handle routing to onboarding or home
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    if (RNPlatform.OS !== 'ios') {
      Alert.alert('Error', 'Apple Sign-In is only available on iOS');
      return;
    }

    setLoading(true);
    try {
      const result = await authService.signInWithApple();
      if (result) {
        setUser(result);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Apple Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    Alert.alert('Coming Soon', 'Google Sign-In will be available soon');
    // TODO: Implement Google Sign-In
  };

  const handlePhoneSignIn = () => {
    Alert.alert('Coming Soon', 'Phone Sign-In will be available soon');
    // TODO: Navigate to phone auth screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Logo/Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>🛡️</Text>
              </View>
            </View>

            {/* Title */}
            <Text style={styles.title}>
              {isLogin ? t('auth.login.title') : t('auth.signup.title')}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin ? t('auth.login.subtitle') : t('auth.signup.subtitle')}
            </Text>

            {/* Email/Password Form */}
            {!isLogin && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.firstName')}
                  placeholderTextColor={Colors.textSecondary}
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                />
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.lastName')}
                  placeholderTextColor={Colors.textSecondary}
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                />
              </>
            )}

            <TextInput
              style={styles.input}
              placeholder={t('auth.email')}
              placeholderTextColor={Colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <TextInput
              style={styles.input}
              placeholder={t('auth.password')}
              placeholderTextColor={Colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
            />

            <TouchableOpacity
              style={[styles.primaryButton, loading && styles.buttonDisabled]}
              onPress={handleEmailAuth}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isLogin ? t('auth.login.button') : t('auth.signup.button')}
                </Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{t('auth.or')}</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Auth Buttons */}
            {RNPlatform.OS === 'ios' && (
              <TouchableOpacity
                style={[styles.socialButton, styles.appleButton]}
                onPress={handleAppleSignIn}
                disabled={loading}
              >
                <Text style={[styles.socialButtonText, styles.appleButtonText]}>🍎 {t('auth.apple')}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Text style={styles.socialButtonText}>🔵 {t('auth.google')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.socialButton, styles.phoneButton]}
              onPress={handlePhoneSignIn}
              disabled={loading}
            >
              <Text style={styles.socialButtonText}>📱 {t('auth.phone')}</Text>
            </TouchableOpacity>

            {/* Toggle Login/Signup */}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.toggleText}>
                {isLogin ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
                <Text style={styles.toggleLink}>
                  {isLogin ? t('auth.signup.link') : t('auth.login.link')}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: Colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: Colors.textSecondary,
    fontSize: 14,
  },
  socialButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
  },
  appleButton: {
    backgroundColor: '#000000',
    borderColor: '#000000',
  },
  appleButtonText: {
    color: '#FFFFFF', // White text for black background
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.border,
  },
  phoneButton: {
    backgroundColor: Colors.backgroundLight,
    borderColor: Colors.border,
  },
  socialButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  toggleButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  toggleLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

