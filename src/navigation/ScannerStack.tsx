// src/navigation/ScannerStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainScannerScreen } from '../screens/MainScannerScreen';

const Stack = createStackNavigator();

export const ScannerStack = () => {
 return (
   <Stack.Navigator
     screenOptions={{
       headerShown: false,
       cardStyle: { backgroundColor: '#0A0A0F' },
       cardOverlayEnabled: true,
       cardStyleInterpolator: ({ current: { progress } }) => ({
         cardStyle: {
           opacity: progress,
         },
       }),
     }}
   >
     <Stack.Screen name="Scanner" component={MainScannerScreen} />
   </Stack.Navigator>
 );
};