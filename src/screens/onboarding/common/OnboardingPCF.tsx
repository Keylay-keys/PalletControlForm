// src\screens\onboarding\common\OnboardingPCF.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,
  TextInput, 
  StyleSheet, 
  Alert,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootParamList } from '@/types';
import { useTheme } from '@/hooks/useTheme';
import { scan, addListener } from 'modules/scanner';
import { verifyRouteNumber } from 'modules/ocr';
import { PreviewImage } from '@/components/Scanner';
import { ErrorDisplay } from '@/components/common';
import { 
  getAuth, 
  sendEmailVerification 
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { OnboardingStore } from '@/services/OnboardingStore';

type OnboardingPCFProps = {
  navigation: StackNavigationProp<RootParamList, 'OnboardingPCF'>;
  route: RouteProp<RootParamList, 'OnboardingPCF'>;
};

export default function OnboardingPCF({ navigation, route }: OnboardingPCFProps) {
  const { colors } = useTheme();
  const routeNumber = route.params.routeNumber || '';
  const [uri, setUri] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [isOwnerOnly, setIsOwnerOnly] = useState(false);
  const [teamMemberEmail, setTeamMemberEmail] = useState('');

  const handleScan = async () => {
    try {
      setScanning(true);
      setError(null);
      await scan();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scanner error');
      setScanning(false);
    }
  };

  useEffect(() => {
    const subscription = addListener('onChange', (data: any) => {
      if (data.type === 'cancelled') {
        setScanning(false);
        return;
      }
      
      if (data.type === 'error') {
        setError(data.message || 'Scan failed');
        setScanning(false);
        return;
      }

      if (data.value) {
        setUri(data.value);
        setScanning(false);
      }
    });

    return () => subscription.remove();
  }, []);

  const verifyPCF = async () => {
    if (!uri) {
      Alert.alert('Error', 'Please scan a PCF first');
      return;
    }

    setVerifying(true);
    setError(null);

    try {
      const onboardingData = await OnboardingStore.get();
      if (!onboardingData?.email || !onboardingData?.password) {
        throw new Error('Missing onboarding data');
      }

      const isValid = await verifyRouteNumber(uri, routeNumber);
      if (!isValid) {
        setError('Route number not found on PCF.');
        return;
      }

      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), {
        email: onboardingData.email,
        routeNumber,
        isOwnerOnly: false,
        verifiedPCF: true,
        createdAt: serverTimestamp(),
        emailVerified: true,
        hasRoleSelected: false,
        onboardingComplete: false,
        role: null
      });

      await OnboardingStore.clear();

      navigation.navigate('OnboardingRole', {
        email: onboardingData.email,
        routeNumber,
        verifiedPCF: true,
        password: onboardingData.password,
        userId: user.uid
      });

    } catch (error) {
      console.error('Verification error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to verify PCF');
      }
    } finally {
      setVerifying(false);
    }
  };

  const handleOwnerOnlySetup = async () => {
    if (!teamMemberEmail.trim()) {
      Alert.alert('Error', 'Please enter team member email');
      return;
    }

    setVerifying(true);
    try {
      const onboardingData = await OnboardingStore.get();
      if (!onboardingData?.email || !onboardingData?.password) {
        throw new Error('Missing onboarding data');
      }

      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('No authenticated user found');
      }

      const db = getFirestore();
      await setDoc(doc(db, 'users', user.uid), {
        email: onboardingData.email,
        routeNumber,
        isOwnerOnly: true,
        verifiedPCF: false,
        createdAt: serverTimestamp(),
        emailVerified: true,
        hasRoleSelected: false,
        onboardingComplete: false,
        role: null,
        teamMemberPendingVerification: teamMemberEmail
      });

      await OnboardingStore.clear();

      navigation.navigate('OnboardingRole', {
        email: onboardingData.email,
        routeNumber,
        verifiedPCF: false,
        password: onboardingData.password,
        userId: user.uid
      });

    } catch (error) {
      console.error('Owner setup error:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to setup owner account');
      }
    } finally {
      setVerifying(false);
    }
  };

  const resetScan = () => {
    setUri('');
    setError(null);
    handleScan();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Route Verification
        </Text>

        <TouchableOpacity
          style={[styles.toggleButton, { borderColor: colors.border }]}
          onPress={() => {
            setIsOwnerOnly(!isOwnerOnly);
            setError(null);
          }}
        >
          <Text style={[styles.toggleText, { color: colors.textSecondary }]}>
            {isOwnerOnly 
              ? "I have a PCF to upload"
              : "I don't have a PCF (Team member has PCF)"}
          </Text>
        </TouchableOpacity>

        {error && <ErrorDisplay message={error} onDismiss={() => setError(null)} />}

        {isOwnerOnly ? (
          <View style={styles.ownerOnlyContainer}>
            <Text style={[styles.description, { color: colors.textMuted }]}>
              Please provide the email address of a team member who can verify 
              route {routeNumber} by uploading their PCF.
            </Text>

            <TextInput
              style={[styles.input, {
                backgroundColor: colors.cardBg,
                borderColor: colors.border,
                color: colors.textPrimary
              }]}
              placeholder="Team Member Email"
              placeholderTextColor={colors.textSecondary}
              value={teamMemberEmail}
              onChangeText={setTeamMemberEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleOwnerOnlySetup}
              disabled={verifying}
            >
              <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
                {verifying ? 'Setting up...' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={[styles.description, { color: colors.textMuted }]}>
              Please scan a Pallet Control Form for route {routeNumber}.
              {'\n'}Make sure the route number is clearly visible.
            </Text>

            <View style={styles.content}>
              {uri ? (
                <View style={styles.previewContainer}>
                  <PreviewImage uri={uri} />
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: colors.border }]}
                      onPress={resetScan}
                      disabled={verifying}
                    >
                      <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
                        Rescan
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.button, { backgroundColor: colors.primary }]}
                      onPress={verifyPCF}
                      disabled={verifying}
                    >
                      <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
                        {verifying ? 'Verifying...' : 'Verify PCF'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.scanContainer}>
                  <TouchableOpacity
                    style={[styles.scanButton, { backgroundColor: colors.primary }]}
                    onPress={handleScan}
                    disabled={scanning}
                  >
                    <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
                      {scanning ? 'Scanning...' : 'Scan PCF'}
                    </Text>
                  </TouchableOpacity>
                  <Text style={[styles.instruction, { color: colors.textSecondary }]}>
                    Position the PCF within the scanner frame
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
  toggleButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
  },
  ownerOnlyContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  previewContainer: {
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanButton: {
    padding: 16,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  instruction: {
    marginTop: 16,
    fontSize: 14,
  }
});