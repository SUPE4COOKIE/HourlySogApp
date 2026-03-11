import { MMKV, createMMKV } from 'react-native-mmkv';


export const storage: MMKV = createMMKV({ id: 'hourly-sog-app' });
