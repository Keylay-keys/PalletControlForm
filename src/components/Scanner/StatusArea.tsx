// src/components/Scanner/StatusArea.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { BlurView } from '@react-native-community/blur';
import { Ionicons } from '@expo/vector-icons';

interface StatusAreaProps {
 orderNumber: string | null;
 containerCode: string | null;
 currentPage: number;
 totalPages: number;
 visible: boolean;
 onNewScan: () => void;
 onPageUpdate: (current: number, total: number) => void;
}

export const StatusArea: React.FC<StatusAreaProps> = ({
 orderNumber,
 containerCode,
 currentPage,
 totalPages,
 visible,
 onNewScan,
 onPageUpdate
}) => {
 return (
   <MotiView
     from={{ opacity: 0, height: 0 }}
     animate={{ 
       opacity: visible ? 1 : 0,
       height: visible ? 'auto' : 0
     }}
     transition={{
       type: 'spring',
       damping: 15
     }}
     style={styles.container}
   >
     <BlurView style={styles.blur} blurType="dark" blurAmount={10}>
       <View style={styles.content}>
         <View style={styles.row}>
           <View style={styles.labelContainer}>
             <Ionicons name="document-text" size={20} color="#4F46E5" />
             <Text style={styles.label}>Order #</Text>
           </View>
           <Text style={styles.value}>{orderNumber || '-'}</Text>
         </View>

         <View style={styles.row}>
           <View style={styles.labelContainer}>
             <Ionicons name="barcode" size={20} color="#4F46E5" />
             <Text style={styles.label}>Container Code</Text>
           </View>
           <Text style={styles.value}>{containerCode || '-'}</Text>
         </View>

         <View style={styles.pageRow}>
           <View style={styles.pageInfo}>
             <Text style={styles.pageText}>
               Page {currentPage} of {totalPages}
             </Text>
           </View>
           <TouchableOpacity
             style={styles.newButton}
             onPress={onNewScan}
           >
             <Ionicons name="add-circle" size={20} color="#4F46E5" />
             <Text style={styles.newButtonText}>New Scan</Text>
           </TouchableOpacity>
         </View>
       </View>
     </BlurView>
   </MotiView>
 );
};

const styles = StyleSheet.create({
 container: {
   margin: 16,
   borderRadius: 12,
   overflow: 'hidden',
 },
 blur: {
   overflow: 'hidden',
 },
 content: {
   padding: 16,
 },
 row: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   marginBottom: 12,
 },
 labelContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   gap: 8,
 },
 label: {
   color: '#94A3B8',
   fontSize: 14,
 },
 value: {
   color: '#FFFFFF',
   fontSize: 16,
   fontWeight: '500',
 },
 pageRow: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   marginTop: 4,
 },
 pageInfo: {
   backgroundColor: 'rgba(79, 70, 229, 0.1)',
   paddingHorizontal: 12,
   paddingVertical: 6,
   borderRadius: 8,
 },
 pageText: {
   color: '#4F46E5',
   fontSize: 14,
   fontWeight: '500',
 },
 newButton: {
   flexDirection: 'row',
   alignItems: 'center',
   gap: 4,
 },
 newButtonText: {
   color: '#4F46E5',
   fontSize: 14,
   fontWeight: '500',
 },
});