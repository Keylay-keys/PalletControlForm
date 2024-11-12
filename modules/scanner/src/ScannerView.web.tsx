import * as React from 'react';

import { ScannerViewProps } from './Scanner.types';

export default function ScannerView(props: ScannerViewProps) {
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
