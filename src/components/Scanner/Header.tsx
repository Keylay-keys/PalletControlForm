// src/components/Scanner/Header.tsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
 onClose: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onClose }) => {
 const insets = useSafeAreaInsets();
 
 return (
   <View style={[styles.container, { paddingTop: insets.top }]}>
     <TouchableOpacity 
       style={styles.closeButton}
       onPress={onClose}
     >
       <Ionicons name="close" size={24} color="#FFFFFF" />
     </TouchableOpacity>
     <Text style={styles.title}>Scan PCF</Text>
     <View style={styles.placeholder} />
   </View>
 );
};

const styles = StyleSheet.create({
 container: {
   backgroundColor: '#1F2937',
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   padding: 16,
 },
 closeButton: {
   padding: 8,
 },
 title: {
   color: '#FFFFFF',
   fontSize: 18,
   fontWeight: '600',
 },
 placeholder: {
   width: 40, // Same width as close button for centering
 },
});