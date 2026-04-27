import { requireNativeView } from 'expo';
import * as React from 'react';

import { SoggyWidgetViewProps } from './SoggyWidget.types';

const NativeView: React.ComponentType<SoggyWidgetViewProps> =
  requireNativeView('SoggyWidget');

export default function SoggyWidgetView(props: SoggyWidgetViewProps) {
  return <NativeView {...props} />;
}
