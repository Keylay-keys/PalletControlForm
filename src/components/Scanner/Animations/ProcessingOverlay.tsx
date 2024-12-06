// src/components/Scanner/Animations/ProcessingOverlay.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';

export const ProcessingOverlay = () => {
 return (
   <MotiView
     from={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     style={[StyleSheet.absoluteFill, styles.container]}
   >
     <View style={styles.content}>
       <MotiView
         from={{ rotate: '0deg' }}
         animate={{ rotate: '360deg' }}
         transition={{
           loop: true,
           type: 'timing',
           duration: 2000,
         }}
       >
         <Ionicons name="sync" size={48} color="#4F46E5" />
       </MotiView>
       <Text style={styles.text}>Processing PCF...</Text>
     </View>
   </MotiView>
 );
};

const styles = StyleSheet.create({
 container: {
   backgroundColor: 'rgba(0, 0, 0, 0.8)',
   justifyContent: 'center',
   alignItems: 'center',
 },
 content: {
   alignItems: 'center',
 },
 text: {
   color: '#FFFFFF',
   fontSize: 16,
   marginTop: 16,
   fontWeight: '500',
 },
});