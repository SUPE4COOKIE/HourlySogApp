import { Text, View, Button, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator} from "react-native";
import { useUpdateSogs, checkForUpdate } from "@/hooks/updateSogs";
import { storage } from "@/storage/mmkv";
import { clearImageCache } from "@/storage/images";
import DownloadBar from "@/components/downloadBar";
import { useState, useEffect } from "react";
import { HelloWidget } from "@/widgets/HelloWidget";
import { WidgetPreview, registerWidgetTaskHandler } from "react-native-android-widget";




/*
(checkforupdate -> if new images exist, show update button)
updatesogs -> fetches images.json
	-> cacheImages -> for each image, check if it's in MMKV, if not download and save to MMKV
		-> DownloadBar listens for global events from cacheImages to update progress
*/

export default function Index() {
  const { updateSogs, isLoading, error } = useUpdateSogs();
  const [cachedKeys, setCachedKeys] = useState<string[]>([]);
  const [needUpdate, setNeedUpdate] = useState<boolean | null>(null);

  useEffect(() => {
    checkForUpdate().then(result => {
      console.log('[Index] checkForUpdate resolved:', result);
      setNeedUpdate(result);
    });
  }, []);

  const showCache = () => {
    setCachedKeys(storage.getAllKeys());
  };

  const hideCache = () => {
	setCachedKeys([]);
  }

  const clearCache = () => {
	clearImageCache();
	setCachedKeys([]);
	setNeedUpdate(true);
  }

  return (
    <View style={styles.container}>
      <DownloadBar />

      <TouchableOpacity
        style={[styles.updateButton, (isLoading || !needUpdate) && styles.updateButtonDisabled]}
        onPress={async () => { await updateSogs(); setNeedUpdate(await checkForUpdate()); }}
        disabled={isLoading || !needUpdate}
        activeOpacity={0.7}
      >
        {isLoading
          ? <ActivityIndicator color="#fff" size="small" />
          : <Text style={styles.updateButtonText}>
              {needUpdate === null ? "Checking..." : needUpdate ? "Update Sogs" : "No Updates Available"}
            </Text>
        }
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.debugSection}>
        <Button title="Show image cache" onPress={cachedKeys.length == 0 ? showCache : hideCache} />
        <TouchableOpacity onPress={clearCache} style={styles.clearCacheButton}>
          <Text style={styles.clearCacheText}>Clear Cache</Text>
        </TouchableOpacity>
		<WidgetPreview
        renderWidget={() => <HelloWidget />}
        width={320}
        height={200}
		
      />
        <ScrollView style={styles.cacheList}>
          {cachedKeys.length === 0
            ? <></>
            : cachedKeys.map(key => (
                <Text key={key} style={styles.cacheKey}>{key}</Text>
              ))
          }
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
    backgroundColor: '#111',
  },
  error: {
    color: 'red',
    marginTop: 12,
  },
  debugSection: {
    marginTop: 32,
    flex: 1,
  },
  cacheList: {
    marginTop: 12,
  },
  cacheKey: {
    color: '#aaa',
    fontSize: 12,
    paddingVertical: 1,
  },
  empty: {
    color: '#555',
    fontStyle: 'italic',
  },
  updateButton: {
    backgroundColor: '#2563eb',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  updateButtonDisabled: {
    backgroundColor: '#333',
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  clearCacheButton: {
	marginTop: 8,
	backgroundColor: '#db3636',
	padding: 10,
	borderRadius: 8,
	alignItems: 'center',
  },
  clearCacheText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
