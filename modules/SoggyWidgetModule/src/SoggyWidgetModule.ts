import { NativeModule, requireNativeModule } from 'expo';

import { SoggyWidgetModuleEvents } from './SoggyWidget.types';

declare class SoggyWidgetModule extends NativeModule<SoggyWidgetModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<SoggyWidgetModule>('SoggyWidget');
