import { useState, useEffect } from 'react';
import { AppState } from 'react-native';
import * as Battery from 'expo-battery';

export function useBatteryOptimisation() {
  const [isOptimised, setIsOptimised] = useState<boolean>(false);

  useEffect(() => {
    const checkBattery = async () => {
      try {
        const enabled = await Battery.isBatteryOptimizationEnabledAsync();
		console.log("Battery optimization enabled:", enabled); 
        setIsOptimised(enabled);
      } catch (e) {
        console.log("Failed to check battery optimization", e);
        setIsOptimised(false);
      }
    };

    checkBattery();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        checkBattery();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return isOptimised;
}
