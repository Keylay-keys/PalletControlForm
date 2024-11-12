import type { StyleProp, ViewStyle } from 'react-native';
import type { EventSubscription } from 'expo-modules-core';  // Changed from Subscription

export type OnLoadEventPayload = {
  url: string;
};

export interface ScannerEvent {
  value: string;
}

export interface ScannerModule {
  scan(): Promise<void>;
  addListener(
    eventName: 'onChange',
    listener: (event: ScannerEvent) => void
  ): EventSubscription;  // Changed from Subscription
}

export type ScannerModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type ScannerViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};