// src/screens/LoginScreen.tsx
import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LoginForm from '../components/auth/LoginForm';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../types';
import { UserData } from '../interfaces/auth';

type LoginScreenNavigationProp = StackNavigationProp<RootParamList, 'Login'>;

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleLoginSuccess = (userData: UserData) => {
    console.log('User logged in:', userData);

    switch (userData.adminReviewStatus) {
      case 'pending':
        navigation.navigate('PendingReview');
        break;
      case 'approved':
        if (!userData.hasRoleSelected) {
          navigation.navigate('RoleSelection');
        } else {
          // Pass the initialView parameter based on hasTeam
          navigation.navigate('Dashboard', {
            initialView: userData.hasTeam ? 'management' : 'operator',
          });
        }
        break;
      case 'rejected':
        Alert.alert(
          'Account Rejected',
          'Your account verification was unsuccessful. Please contact support.'
        );
        break;
      default:
        navigation.navigate('Auth');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
