import { requireNativeViewManager } from 'expo-modules-core';
import * as React from 'react';

import { MymoduleViewProps } from './Mymodule.types';

const NativeView: React.ComponentType<MymoduleViewProps> =
  requireNativeViewManager('Mymodule');

export default function MymoduleView(props: MymoduleViewProps) {
  return <NativeView {...props} />;
}
