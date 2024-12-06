// PalletControlFormUpload.tsx
import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { ImagePickerResponse, launchImageLibrary } from 'react-native-image-picker';
import { RootParamList } from '../types';
import auth from '@react-native-firebase/auth';

type PalletControlFormUploadProps = {
  route: {
    params: {
      routes: string[];
      businessName: string;
    };
  };
  navigation: StackNavigationProp<RootParamList>;
};

export default function PalletControlFormUpload({
  route,
  navigation,
}: PalletControlFormUploadProps) {
  const { routes, businessName } = route.params;
  const [loading, setLoading] = useState(false);

  const [pcfFiles, setPcfFiles] = useState<{ [key: string]: string | null }>(
    routes.reduce((acc, route) => {
      acc[route] = null;
      return acc;
    }, {} as { [key: string]: string | null })
  );

  const handleFileUpload = async (routeNumber: string) => {
    try {
      const result: ImagePickerResponse = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 2000,
        maxHeight: 2000,
      });

      if (!result.didCancel && result.assets?.[0]?.uri) {
        setPcfFiles((prev) => ({
          ...prev,
          [routeNumber]: result.assets![0].uri,
        } as { [key: string]: string | null }));
        Alert.alert('Success', `PCF uploaded for Route ${routeNumber}`);
      } else {
        Alert.alert('Cancelled', 'No file was selected.');
      }
    } catch (error) {
      console.error('File upload error:', error);
      Alert.alert('Error', 'Failed to upload file. Please try again.');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const uploadPromises = routes.map(async (route) => {
        const fileUri = pcfFiles[route];
        if (!fileUri) {
          throw new Error(`No file uploaded for route ${route}`);
        }

        const storageRef = storage().ref().child(`verification/${route}/pcf.jpg`);

        await storageRef.putFile(fileUri);
        const imageUrl = await storageRef.getDownloadURL();

        // Updated Firestore write with more complete data
        await firestore()
          .collection('routes')
          .doc(route)
          .set({
            ownerId: auth().currentUser?.uid,
            businessName: businessName,
            routeNumber: route,
            verificationStatus: {
              isVerified: false,
              submittedAt: firestore.FieldValue.serverTimestamp(),
              pcfImageUrl: imageUrl,
              submittedBy: auth().currentUser?.uid,
            },
            createdAt: firestore.FieldValue.serverTimestamp(),
            updatedAt: firestore.FieldValue.serverTimestamp(),
          });
      });

      await Promise.all(uploadPromises);
      Alert.alert('Success', 'PCF submitted for verification.');
      // Ensure initialView parameter is provided or omitted if not needed
      navigation.navigate('Dashboard', { initialView: 'operator' }); // Adjust 'operator' to your app logic if necessary
    } catch (error: any) {
      console.error('Upload error:', error);
      Alert.alert('Error', `Upload failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pallet Control Form Upload</Text>
      <Text style={styles.description}>
        Please upload a Pallet Control Form for each route. This verifies your
        business name is tied to the route number.
      </Text>

      <FlatList
        data={routes}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.routeItem}>
            <Text style={styles.routeText}>Route: {item}</Text>
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => handleFileUpload(item)}
              disabled={loading}
            >
              <Text style={styles.uploadButtonText}>
                {pcfFiles[item] ? 'Change PCF' : 'Upload PCF'}
              </Text>
            </TouchableOpacity>
            {pcfFiles[item] && (
              <Text style={styles.successText}>File Uploaded</Text>
            )}
          </View>
        )}
      />

      <TouchableOpacity
        style={[
          styles.submitButton,
          (routes.length === 0 || loading) && styles.disabled,
        ]}
        onPress={handleSubmit}
        disabled={routes.length === 0 || loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'Uploading...' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#0f172a' },
  title: { fontSize: 24, color: '#ffffff', marginBottom: 16, textAlign: 'center' },
  description: { fontSize: 16, color: '#6b7280', marginBottom: 24, textAlign: 'center' },
  routeItem: {
    backgroundColor: '#1e293b',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  routeText: { color: '#ffffff', fontSize: 16 },
  uploadButton: {
    backgroundColor: '#334155',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  uploadButtonText: { color: '#ffffff', textAlign: 'center', fontSize: 14 },
  successText: { color: '#10b981', marginTop: 4, fontSize: 12 },
  submitButton: {
    backgroundColor: '#660000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: { color: '#ffffff', fontSize: 16, fontWeight: 'bold' },
  disabled: { opacity: 0.5 },
});
