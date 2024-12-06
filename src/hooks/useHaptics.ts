// src/hooks/useHaptics.ts
import * as Haptics from 'expo-haptics';

export const useHaptics = () => {
 const lightFeedback = async () => {
   await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
 };

 const mediumFeedback = async () => {
   await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
 };

 const heavyFeedback = async () => {
   await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
 };

 const successFeedback = async () => {
   await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
 };

 const errorFeedback = async () => {
   await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
 };

 return {
   lightFeedback,
   mediumFeedback,
   heavyFeedback,
   successFeedback,
   errorFeedback,
 };
};