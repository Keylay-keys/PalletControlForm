// modules\ocr\index.ts
export { default } from './src/OcrModule';
export { default as OcrView } from './src/OcrView';
export * from './src/Ocr.types';

const Ocr = require('./src/OcrModule').default;

export const processImage = async (uri: string) => {
  return await Ocr.processImage(uri);
};

export const verifyRouteNumber = async (uri: string, routeNumber: string): Promise<boolean> => {
  const result = await Ocr.verifyRouteNumber(uri, routeNumber);
  const { isValid } = JSON.parse(result);
  return isValid;
};