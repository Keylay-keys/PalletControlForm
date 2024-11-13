import { requireNativeView } from 'expo';
import * as React from 'react';

import { OcrViewProps } from './Ocr.types';

const NativeView: React.ComponentType<OcrViewProps> =
  requireNativeView('Ocr');

export default function OcrView(props: OcrViewProps) {
  return <NativeView {...props} />;
}
