// SignupForm.tsx
import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-picker';
import { UserData } from '../../interfaces/auth';

interface SignupFormProps {
 onSignupSuccess: (userData: UserData) => void;
}

export default function SignupForm({ onSignupSuccess }: SignupFormProps) {
   const [email, setEmail] = useState('');
   const [routeNumber, setRouteNumber] = useState('');
   const [loading, setLoading] = useState(false);
   const [pcfImage, setPcfImage] = useState<string | null>(null);

   const handleImagePick = async () => {
       const result = await ImagePicker.launchImageLibrary({
           mediaType: 'photo',
           quality: 0.8,
           maxWidth: 2000,
           maxHeight: 2000
       });

       if (!result.didCancel && result.assets?.[0].uri) {
           setPcfImage(result.assets[0].uri);
       }
   };

   const handleSignup = async () => {
       if (!email.trim() || !routeNumber.trim()) {
           Alert.alert('Error', 'Please enter both email and route number');
           return;
       }

       if (!pcfImage) {
           Alert.alert('Error', 'Please upload a PCF image for verification');
           return;
       }

       setLoading(true);

       try {
           const result = await auth().createUserWithEmailAndPassword(
               email,
               `route${routeNumber}`
           );

           const imageRef = storage()
               .ref(`verification/${result.user.uid}/pcf.jpg`);
           await imageRef.putFile(pcfImage);
           const imageUrl = await imageRef.getDownloadURL();

           await firestore()
               .collection('users')
               .doc(result.user.uid)
               .set({
                   email,
                   routeNumber,
                   verificationImage: imageUrl,
                   verified: false,
                   createdAt: firestore.FieldValue.serverTimestamp()
               });

           Alert.alert(
               'Account Created',
               'Your account is pending verification. You will be notified when approved.'
           );

           onSignupSuccess({
               uid: result.user.uid,
               email: result.user.email!,
               routeNumber
           });

       } catch (error) {
           console.error('Signup error:', error);
           Alert.alert('Signup Error', 'Unable to create account. Please try again.');
       } finally {
           setLoading(false);
       }
   };

   return (
       <View style={styles.container}>
           <Text style={styles.infoText}>
               Please use your work email address. Your email and route number will be permanently linked.
           </Text>

           <TextInput
               style={styles.input}
               placeholder="Work Email"
               placeholderTextColor="#94a3b8"
               value={email}
               onChangeText={setEmail}
               keyboardType="email-address"
               autoCapitalize="none"
           />
           <TextInput
               style={styles.input}
               placeholder="Route Number"
               placeholderTextColor="#94a3b8"
               value={routeNumber}
               onChangeText={setRouteNumber}
               keyboardType="numeric"
           />

           <TouchableOpacity
               style={styles.uploadButton}
               onPress={handleImagePick}
           >
               <Text style={styles.uploadButtonText}>
                   {pcfImage ? 'Change PCF Image' : 'Upload PCF Image'}
               </Text>
           </TouchableOpacity>

           {pcfImage && (
               <Text style={styles.imageSuccess}>PCF Image uploaded</Text>
           )}

           <TouchableOpacity
               style={[styles.signupButton, loading && styles.signupButtonDisabled]}
               onPress={handleSignup}
               disabled={loading}
           >
               <Text style={styles.signupButtonText}>
                   {loading ? 'Creating Account...' : 'Create Account'}
               </Text>
           </TouchableOpacity>
       </View>
   );
}

const styles = StyleSheet.create({
   container: {
       flex: 1,
       justifyContent: 'center',
       padding: 16,
       backgroundColor: '#0f172a',
   },
   input: {
       backgroundColor: '#1e293b',
       borderWidth: 1,
       borderColor: '#334155',
       padding: 12,
       borderRadius: 8,
       marginBottom: 16,
       color: '#e2e8f0',
       fontSize: 16,
   },
   signupButton: {
       backgroundColor: '#064e3b',
       paddingVertical: 12,
       borderRadius: 8,
       alignItems: 'center',
   },
   signupButtonDisabled: {
       opacity: 0.7,
   },
   uploadButton: {
       backgroundColor: '#1e293b',
       padding: 12,
       borderRadius: 8,
       alignItems: 'center',
       marginBottom: 16,
   },
   uploadButtonText: {
       color: '#e2e8f0',
       fontSize: 16,
   },
   imageSuccess: {
       color: '#10b981',
       textAlign: 'center',
       marginBottom: 16,
   },
   infoText: {
       color: '#e2e8f0',
       textAlign: 'center',
       marginBottom: 24,
       fontSize: 14,
       lineHeight: 20,
   },
   signupButtonText: {
       color: '#fff',
       fontSize: 16,
       fontWeight: 'bold',
   }
});