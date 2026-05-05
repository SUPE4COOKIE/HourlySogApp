import { MMKV, createMMKV, useMMKVBoolean } from 'react-native-mmkv';

export const storage: MMKV = createMMKV({ id: 'hourly-sog-app' });
export const settingsStorage: MMKV = createMMKV({ id: 'settings' });

// Migrate and clean up old keys that leaked into the image cache
if (storage.contains('debug.enabled')) {
  settingsStorage.set('debug.enabled', storage.getBoolean('debug.enabled') ?? false);
  storage.remove('debug.enabled');
}

export function useDebugMode() {
  return useMMKVBoolean('debug.enabled', settingsStorage);
}

export const getIsDebugEnabled = () => settingsStorage.getBoolean('debug.enabled') ?? false;
export const setIsDebugEnabled = (val: boolean) => settingsStorage.set('debug.enabled', val);
