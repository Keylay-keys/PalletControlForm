import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './Scanner.types';

type ScannerModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ScannerModule extends NativeModule<ScannerModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ScannerModule);
