import { Text, View, Button, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Switch } from "react-native";
import { useUpdateSogs, checkForUpdate } from "@/hooks/updateSogs";
import { useHasWidget } from "@/hooks/useHasWidget";
import { useBatteryOptimisation } from "@/hooks/useBatteryOptimisation";
import { storage, useDebugMode } from "@/storage/mmkv";
import { clearImageCache } from "@/storage/Images";
import DownloadBar from "@/components/downloadBar";
import { useState, useEffect } from "react";
import { syncSogsToWidget } from "@/widgets/NativeSoggyWidgetSync";
import WidgetPlacedHeader from "@/components/widgetPlacedHeader";
import BatteryOptimisationHeader from "@/components/batteryOptimisationHeader";

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
  const [isDebugEnabled, setDebugEnabled] = useDebugMode();
  const hasWidget = useHasWidget();
  const isOptimised = useBatteryOptimisation();

  useEffect(() => {
    checkForUpdate().then(result => {
      console.log('[Index] checkForUpdate resolved:', result);
      setNeedUpdate(result);
    });
    
    syncSogsToWidget().catch(e => console.error("Failed to sync sogs on launch", e));
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
	syncSogsToWidget().catch(e => console.error("Failed to sync sogs on launch", e));
  }

  return (
    <ScrollView style={styles.container}>
      <DownloadBar />

      <WidgetPlacedHeader hasWidget={hasWidget} />
      <BatteryOptimisationHeader isOptimised={isOptimised} />

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

      <View style={styles.debugSwitchContainer}>
        <Text style={styles.debugSwitchText}>Enable Debug Mode</Text>
        <Switch
          value={isDebugEnabled ?? false}
          onValueChange={(val) => setDebugEnabled(val)}
        />
      </View>

      {isDebugEnabled && (
        <View style={styles.debugSection}>
          <Button title="Show image cache" onPress={cachedKeys.length == 0 ? showCache : hideCache} />

          <TouchableOpacity onPress={clearCache} style={styles.clearCacheButton}>
            <Text style={styles.clearCacheText}>Clear Cache</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => syncSogsToWidget()} style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Force Widget Update</Text>
          </TouchableOpacity>

          <ScrollView style={styles.cacheList}>
            {cachedKeys.length === 0
              ? <></>
              : cachedKeys.map(key => (
                <Text key={key} style={styles.cacheKey}>{key}</Text>
              ))
            }
          </ScrollView>
        </View>
      )}
    </ScrollView>
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
  statusContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#222',
    borderRadius: 8,
    alignItems: 'center',
  },
  statusText: {
    color: '#ddd',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugSwitchContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  debugSwitchText: {
    color: '#aaa',
    fontSize: 16,
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
  actionButton: {
    marginTop: 8,
    backgroundColor: '#10b981',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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