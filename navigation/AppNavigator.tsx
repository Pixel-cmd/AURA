import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuthStore } from '../stores/authStore';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { isOnboardingComplete } from '../utils/onboardingStorage';

// Screens
import LoginScreen from '../app/auth/LoginScreen';
import IntroScreen from '../app/onboarding/IntroScreen';
import HowItWorksScreen from '../app/onboarding/HowItWorksScreen';
import PrivacyScreen from '../app/onboarding/PrivacyScreen';
import PermissionsScreen from '../app/onboarding/PermissionsScreen';
import HomeScreen from '../app/home/HomeScreen';
import SOSActiveScreen from '../app/home/SOSActiveScreen';
import HelperAlertScreen from '../app/home/HelperAlertScreen';
import HelperOnWayScreen from '../app/home/HelperOnWayScreen';
import ClosureScreen from '../app/home/ClosureScreen';
import ProfileScreen from '../app/profile/ProfileScreen';

export type RootStackParamList = {
  Login: undefined;
  Intro: undefined;
  HowItWorks: undefined;
  Privacy: undefined;
  Permissions: undefined;
  Home: undefined;
  SOSActive: { sosId: string };
  HelperAlert: { sosId: string; distance: number };
  HelperOnWay: { sosId: string; userId: string };
  Closure: { sosId: string; points?: number };
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { setUser, setLoading, isLoading, user } = useAuthStore();
  const [initializing, setInitializing] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  useEffect(() => {
    // Only set up auth listener if Firebase is configured
    if (!auth) {
      console.warn("Firebase auth not available - skipping auth state listener");
      setUser(null);
      setLoading(false);
      setInitializing(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      // Check onboarding status if user is authenticated
      if (user) {
        const complete = await isOnboardingComplete();
        setOnboardingComplete(complete);
      } else {
        setOnboardingComplete(null);
      }
      
      setInitializing(false);
    }, (error) => {
      console.warn("Auth state error:", error);
      setUser(null);
      setLoading(false);
      setOnboardingComplete(null);
      setInitializing(false);
    });

    return unsubscribe;
  }, [setUser, setLoading]);

  // Determine initial route based on auth and onboarding status
  const getInitialRoute = () => {
    if (initializing || isLoading || onboardingComplete === null) {
      return null; // Still loading
    }
    
    if (!user) {
      return 'Login';
    }
    
    if (!onboardingComplete) {
      return 'Intro';
    }
    
    return 'Home';
  };

  if (initializing || isLoading || onboardingComplete === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const initialRoute = getInitialRoute();
  if (!initialRoute) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#FFFFFF' },
        }}
        initialRouteName={initialRoute}
      >
        {/* Authentication */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Onboarding Flow */}
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="HowItWorks" component={HowItWorksScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="Permissions" component={PermissionsScreen} />

        {/* Main App */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SOSActive" component={SOSActiveScreen} />
        <Stack.Screen name="HelperAlert" component={HelperAlertScreen} />
        <Stack.Screen name="HelperOnWay" component={HelperOnWayScreen} />
        <Stack.Screen name="Closure" component={ClosureScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});

