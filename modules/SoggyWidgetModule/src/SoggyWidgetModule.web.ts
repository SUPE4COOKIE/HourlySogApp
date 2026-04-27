import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './SoggyWidget.types';

type SoggyWidgetModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class SoggyWidgetModule extends NativeModule<SoggyWidgetModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(SoggyWidgetModule, 'SoggyWidgetModule');
