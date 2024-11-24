// src/components/Scanner/PreviewImage.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView, GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, useAnimatedGestureHandler, withSpring } from 'react-native-reanimated';

interface PreviewImageProps {
  uri: string;
}

export const PreviewImage = ({ uri }: PreviewImageProps) => {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedScale = useSharedValue(1);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      // Ensure scale doesn't go below 1
      scale.value = Math.max(savedScale.value * event.scale, 1);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = savedTranslateX.value + event.translationX / scale.value;
      translateY.value = savedTranslateY.value + event.translationY / scale.value;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return (
    <GestureHandlerRootView style={styles.previewContainer}>
      <GestureDetector gesture={Gesture.Simultaneous(pinchGesture, panGesture)}>
        <Animated.Image
          source={{ uri }}
          style={[styles.preview, animatedStyle]}
          resizeMode="contain"
        />
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  previewContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
  preview: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});
