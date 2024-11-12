export { default } from './src/ScannerModule';
export { default as ScannerView } from './src/ScannerView';
export * from './src/Scanner.types';

import { EventSubscription } from 'expo-modules-core';  // Changed from Subscription

const Scanner = require('./src/ScannerModule').default;

export const scan = async (): Promise<void> => {
  return await Scanner.scan();
};

export const addListener = (
  eventName: 'onChange',
  listener: (event: { value: string }) => void
): EventSubscription => {  // Changed from Subscription
  return Scanner.addListener(eventName, listener);
};