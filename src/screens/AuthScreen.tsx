import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import { UserData } from '../interfaces/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../types';

type AuthScreenNavigationProp = StackNavigationProp<RootParamList, 'Auth'>;

export default function AuthScreen() {
  const navigation = useNavigation<AuthScreenNavigationProp>();
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthSuccess = (user: UserData) => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Route Logic</Text>
      </View>
      
      {isLogin ? (
        <LoginForm onLoginSuccess={handleAuthSuccess} />
      ) : (
        <SignupForm onSignupSuccess={handleAuthSuccess} />
      )}

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsLogin(!isLogin)}
      >
        <Text style={styles.switchText}>
          {isLogin ? 'Create Account' : 'Back to Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0f172a' 
},
  header: {
    padding: 16, 
    alignItems: 'center', 
    backgroundColor: '#660000' 
},
  title: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: 'bold' 
},
  switchButton: { 
    padding: 16, 
    alignItems: 'center' 
},
  switchText: { 
    color: '#94a3b8', 
    fontSize: 14 },
});