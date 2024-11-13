import * as React from 'react';

import { OcrViewProps } from './Ocr.types';

export default function OcrView(props: OcrViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
