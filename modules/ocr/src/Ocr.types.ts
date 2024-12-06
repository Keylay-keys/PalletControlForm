// modules/ocr/src/Ocr.types.ts
import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export interface LineItem {
  product: string;
  description: string;
  bestBefore: string;
  days: string;
}

export interface OCRResult {
  lineItems: LineItem[];
  isValid?: boolean;
  containerCode: string;
  pageInfo: {
    current: number;
    total: number;
  };
}

export type OcrModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
};

export type ChangeEventPayload = {
  value: string;
};

export type OcrViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};