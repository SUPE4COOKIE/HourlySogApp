import * as React from 'react';

import { SoggyWidgetViewProps } from './SoggyWidget.types';

export default function SoggyWidgetView(props: SoggyWidgetViewProps) {
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
