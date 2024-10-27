import * as React from 'react';

import { MymoduleViewProps } from './Mymodule.types';

export default function MymoduleView(props: MymoduleViewProps) {
  return (
    <div>
      <span>{props.name}</span>
    </div>
  );
}
