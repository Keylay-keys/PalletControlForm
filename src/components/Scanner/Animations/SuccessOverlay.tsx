// src/components/Scanner/Animations/SuccessOverlay.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface SuccessOverlayProps {
 visible: boolean;
 onComplete: () => void;
}

export const SuccessOverlay: React.FC<SuccessOverlayProps> = ({
 visible,
 onComplete
}) => {
 React.useEffect(() => {
   if (visible) {
     Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
     const timer = setTimeout(onComplete, 1500);
     return () => clearTimeout(timer);
   }
 }, [visible]);

 return (
   <MotiView
     from={{ opacity: 0 }}
     animate={{ opacity: visible ? 1 : 0 }}
     exit={{ opacity: 0 }}
     style={[StyleSheet.absoluteFill, styles.container]}
   >
     <MotiView
       from={{ scale: 0.5, opacity: 0 }}
       animate={{ scale: 1, opacity: 1 }}
       transition={{ type: 'spring', damping: 10 }}
     >
       <Ionicons name="checkmark-circle" size={80} color="#10B981" />
     </MotiView>
   </MotiView>
 );
};

const styles = StyleSheet.create({
 container: {
   backgroundColor: 'rgba(0, 0, 0, 0.9)',
   justifyContent: 'center',
   alignItems: 'center',
 },
});