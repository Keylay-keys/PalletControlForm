// src/components/Scanner/Animations/LoadingOverlay.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { BlurView } from '@react-native-community/blur';

export const LoadingOverlay = () => {
 return (
   <MotiView
     from={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     exit={{ opacity: 0 }}
     style={StyleSheet.absoluteFill}
   >
     <BlurView
       style={StyleSheet.absoluteFill}
       blurType="dark"
       blurAmount={10}
     >
       <MotiView
         from={{ translateY: -200 }}
         animate={{ translateY: 800 }}
         transition={{
           type: 'timing',
           duration: 2000,
           loop: true,
         }}
         style={styles.scanLine}
       />
     </BlurView>
   </MotiView>
 );
};

const styles = StyleSheet.create({
 scanLine: {
   height: 2,
   backgroundColor: '#4F46E5',
   width: '100%',
   shadowColor: '#4F46E5',
   shadowOffset: { width: 0, height: 0 },
   shadowOpacity: 0.5,
   shadowRadius: 10,
 },
});