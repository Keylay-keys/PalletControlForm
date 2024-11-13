// modules/ocr/src/OcrModule.ts
import { NativeModule, requireNativeModule } from 'expo';
import { OcrModuleEvents, OCRResult } from './Ocr.types';

declare class OcrModule extends NativeModule<OcrModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
  processImage(uri: string): Promise<string>; // Returns JSON string of OCRResult
}

const OcrModuleInstance = requireNativeModule<OcrModule>('Ocr');

export const processImage = async (uri: string): Promise<OCRResult> => {
  try {
    const resultString = await OcrModuleInstance.processImage(uri);
    return JSON.parse(resultString) as OCRResult;
  } catch (error) {
    console.error('OCR Processing Error:', error);
    throw error;
  }
};

export default OcrModuleInstance;