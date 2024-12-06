// src/navigation/index.ts
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootParamList } from '../types';
//import { MainScannerScreen } from '../screens/MainScannerScreen';

// Authentication Screens
import { AuthScreen, LoginScreen } from '../screens';

// Onboarding Screens
import {
  OnboardingStart,
  OnboardingPCF,
  OnboardingBusiness,
  OnboardingVerification,
  OnboardingRole,
} from '../screens/onboarding';

// Additional Routes
import AdditionalRoutes from "../screens/owners/AdditionalRoutes"

// Team Member Screens
import TeamMemberOnboarding from '../screens/onboarding/team-members/TeamMemberOnboarding';
import TeamMemberSetupScreen from '../screens/onboarding/team-members/TeamMemberSetup';
import VerificationPending from '@/screens/owners/VerificationPending';
import { ScanScreen } from '../screens/ScanScreen';

// Main Application Screens
import {
  IntroScreen,
  DashboardScreen,
  SearchScreen,
  SettingsScreen,
} from '../screens';

const Stack = createStackNavigator<RootParamList>();

interface AppNavigatorProps {
  initialRouteName?: keyof RootParamList;
  initialParams?: any; // Added to pass params dynamically
}

const AppNavigator: React.FC<AppNavigatorProps> = ({
  initialRouteName = 'Auth',
  initialParams,
}) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{ headerShown: false }}
      >
        {/* Authentication */}
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Onboarding */}
        <Stack.Screen name="OnboardingStart" component={OnboardingStart} />
        <Stack.Screen name="OnboardingPCF" component={OnboardingPCF} />
        <Stack.Screen name="OnboardingBusiness" component={OnboardingBusiness} />
        <Stack.Screen name="OnboardingVerification" component={OnboardingVerification} />
        <Stack.Screen
          name="OnboardingRole"
          component={OnboardingRole}
          initialParams={{
            email: '',
            routeNumber: '',
            verifiedPCF: false,
            password: '', // Default empty password
            ...initialParams, // Override if provided
          }}
        />
        <Stack.Screen name="AdditionalRoutes" component={AdditionalRoutes}
    options={{ title: 'Additional Routes' }} // Optional customization
  />

        {/* Team Member Onboarding */}
        <Stack.Screen name="TeamMemberOnboarding" component={TeamMemberOnboarding} />
        <Stack.Screen name="TeamMemberSetup" component={TeamMemberSetupScreen} />
        <Stack.Screen name="VerificationPending" component={VerificationPending} />

        {/* Main Application */}
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen name="Scan" component={ScanScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
