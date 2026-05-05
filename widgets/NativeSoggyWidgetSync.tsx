// src/widgets/SoggyWidgetSync.ts
import { storage } from "@/storage/mmkv";
import { Paths, File } from 'expo-file-system/next';
import SoggyWidgetModule from '@/modules/SoggyWidgetModule';

export const syncSogsToWidget = async () => {
    const keys = storage.getAllKeys();
	  const uris = keys.map(key => new File(Paths.document, key).uri);

	  try {
	      // uses the native kotlin module !! (manage the whole widget and alarms)
	      await SoggyWidgetModule.startWidgetLoop(uris);
	  } catch (e) {
	      console.error("Failed to start widget loop:", e);
	  }
};