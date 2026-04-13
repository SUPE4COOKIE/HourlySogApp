import { MMKV, createMMKV, useMMKVBoolean } from 'react-native-mmkv';


export const storage: MMKV = createMMKV({ id: 'hourly-sog-app' });

export function useDebugMode() {
  return useMMKVBoolean('debug.enabled', storage);
}

export const getIsDebugEnabled = () => storage.getBoolean('debug.enabled') ?? false;
export const setIsDebugEnabled = (val: boolean) => storage.set('debug.enabled', val);
