import { NativeModule, requireNativeModule } from 'expo';

import { ScannerModuleEvents } from './ScannerModule.types';

declare class ScannerModule extends NativeModule<ScannerModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ScannerModule>('Scanner');
