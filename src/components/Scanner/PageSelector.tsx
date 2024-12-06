// src/components/Scanner/PageSelector.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Ionicons } from '@expo/vector-icons';

interface PageSelectorProps {
 currentPage: number;
 totalPages: number;
 onPageChange: (page: number) => void;
}

export const PageSelector: React.FC<PageSelectorProps> = ({
 currentPage,
 totalPages,
 onPageChange
}) => {
 const [isOpen, setIsOpen] = React.useState(false);

 return (
   <MotiView
     style={styles.container}
     animate={{ height: isOpen ? totalPages * 50 + 50 : 50 }}
     transition={{ type: 'spring', damping: 15 }}
   >
     <TouchableOpacity 
       style={styles.header}
       onPress={() => setIsOpen(!isOpen)}
     >
       <Text style={styles.headerText}>
         Page {currentPage} of {totalPages}
       </Text>
       <Ionicons 
         name={isOpen ? "chevron-up" : "chevron-down"} 
         size={20} 
         color="#4F46E5" 
       />
     </TouchableOpacity>

     {isOpen && (
       <View style={styles.pageList}>
         {Array.from({ length: totalPages }).map((_, index) => (
           <TouchableOpacity
             key={index}
             style={[
               styles.pageItem,
               currentPage === index + 1 && styles.selectedPage
             ]}
             onPress={() => {
               onPageChange(index + 1);
               setIsOpen(false);
             }}
           >
             <Text style={styles.pageText}>Page {index + 1}</Text>
           </TouchableOpacity>
         ))}
       </View>
     )}
   </MotiView>
 );
};

const styles = StyleSheet.create({
 container: {
   backgroundColor: 'rgba(31, 41, 55, 0.8)',
   borderRadius: 12,
   overflow: 'hidden',
 },
 header: {
   flexDirection: 'row',
   justifyContent: 'space-between',
   alignItems: 'center',
   padding: 16,
 },
 headerText: {
   color: '#FFFFFF',
   fontSize: 16,
   fontWeight: '600',
 },
 pageList: {
   borderTopWidth: 1,
   borderTopColor: 'rgba(255, 255, 255, 0.1)',
 },
 pageItem: {
   padding: 16,
   borderBottomWidth: 1,
   borderBottomColor: 'rgba(255, 255, 255, 0.1)',
 },
 selectedPage: {
   backgroundColor: 'rgba(79, 70, 229, 0.2)',
 },
 pageText: {
   color: '#FFFFFF',
   fontSize: 14,
 },
});