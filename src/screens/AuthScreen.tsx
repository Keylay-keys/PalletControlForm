// AuthScreen.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../types';
import CustomAuthUI from '../components/auth/CustomAuthUI';
import { useTheme } from '../hooks/useTheme';

type AuthScreenNavigationProp = StackNavigationProp<RootParamList, 'Auth'>;

export default function AuthScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<AuthScreenNavigationProp>();

  const handleEmailAuth = () => {
    navigation.navigate('Login');
  };

  const handleGoogleAuth = () => {
    console.log('Google sign-in selected (integration pending)');
  };

  const handleCreateAccount = () => {
    navigation.navigate('OnboardingStart');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Route Spark</Text>
      </View>
      <CustomAuthUI
        onEmailAuth={handleEmailAuth}
        onGoogleAuth={handleGoogleAuth}
        onCreateAccount={handleCreateAccount}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
});
