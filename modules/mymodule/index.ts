import { NativeModulesProxy, EventEmitter, Subscription } from 'expo-modules-core';

// Import the native module. On web, it will be resolved to Mymodule.web.ts
// and on native platforms to Mymodule.ts
import MymoduleModule from './src/MymoduleModule';
import MymoduleView from './src/MymoduleView';
import { ChangeEventPayload, MymoduleViewProps } from './src/Mymodule.types';

// Get the native constant value.
export const PI = MymoduleModule.PI;

export function hello(): string {
  return MymoduleModule.hello();
}

export async function setValueAsync(value: string) {
  return await MymoduleModule.setValueAsync(value);
}

export async function scan() {
  return await MymoduleModule.scan();
}

const emitter = new EventEmitter(MymoduleModule ?? NativeModulesProxy.Mymodule);

export function addChangeListener(listener: (event: ChangeEventPayload) => void): Subscription {
  return emitter.addListener<ChangeEventPayload>('onChange', listener);
}



export { MymoduleView, MymoduleViewProps, ChangeEventPayload };
