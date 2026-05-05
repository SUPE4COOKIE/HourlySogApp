// src/widgets/SoggyWidgetSync.ts
import { storage } from "@/storage/mmkv";
import { Paths, File } from 'expo-file-system/next';
import SoggyWidgetModule from '@/modules/SoggyWidgetModule';

export const syncSogsToWidget = async () => {
    const keys = storage.getAllKeys();
	  if (keys.length === 0) return;

	  const uris = keys.map(key => new File(Paths.document, key).uri);

	  // uses the native kotlin module !! (manage the whole widget and alarms)
	  //await SoggyWidgetModule.startWidgetLoop(uris);
	  console.log("Native widget loop started!");
};