import { requireNativeView } from 'expo';
import * as React from 'react';

import { ScannerViewProps } from './Scanner.types';

const NativeView: React.ComponentType<ScannerViewProps> =
  requireNativeView('Scanner');

export default function ScannerView(props: ScannerViewProps) {
  return <NativeView {...props} />;
}
