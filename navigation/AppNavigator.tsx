import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuthStore } from '../stores/authStore';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';

// Screens
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
  const { setUser, setLoading, isLoading } = useAuthStore();
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
      setInitializing(false);
    });

    return unsubscribe;
  }, [setUser, setLoading]);

  if (initializing || isLoading) {
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
        initialRouteName="Intro"
      >
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

