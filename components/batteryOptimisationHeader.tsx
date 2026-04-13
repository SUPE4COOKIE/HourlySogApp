import { View, StyleSheet, Text, TouchableOpacity, Platform } from "react-native";
import * as IntentLauncher from 'expo-intent-launcher';

const BatteryOptimisationHeader = ({ isOptimised }: { isOptimised: boolean }) => {
  if (!isOptimised) {
    return null;
  }

  const openBatterySettings = async () => {
    if (Platform.OS === 'android') {
      try {
        await IntentLauncher.startActivityAsync('android.settings.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS', {
          data: 'package:com.anonymous.HourlySogApp'
        });
      } catch (e) {
        console.log("Failed to open battery settings:", e);
      }
    }
  };

  const styles = StyleSheet.create({
	container: {
	  padding: 12,
	  backgroundColor: 'rgba(168, 85, 247, 0.15)',
	  borderColor: '#7e22ce',
	  borderWidth: 1,
	  borderRadius: 8,
	  alignItems: 'center',
	  marginBottom: 12,
	},
	title: {
	  color: '#d8b4fe',
	  fontSize: 16,
	  fontWeight: 'bold',
	  marginBottom: 6,
	},
	description: {
	  color: '#e9d5ff',
	  fontSize: 14,
	  textAlign: 'center',
	  lineHeight: 20,
	},
	boldText: {
	  fontWeight: 'bold',
	  color: '#ffffff',
	},
	button: {
	  marginTop: 12,
	  backgroundColor: '#9333ea',
	  paddingVertical: 8,
	  paddingHorizontal: 16,
	  borderRadius: 6,
	},
	buttonText: {
	  color: '#fff',
	  fontWeight: 'bold',
	}
  });

  return (
	<View style={styles.container}>
	  <Text style={styles.title}>⚠️ Battery Optimisation Enabled</Text>
	  <Text style={styles.description}>
		Battery optimisation is currently enabled. This may prevent your widget from updating reliably every hour.
		{"\n\n"}
		Please tap the button below and select <Text style={styles.boldText}>"Allow"</Text> or <Text style={styles.boldText}>"Don't Optimize"</Text> to ensure the widget runs smoothly in the background.
	  </Text>
	  <TouchableOpacity style={styles.button} onPress={openBatterySettings}>
		<Text style={styles.buttonText}>Open Battery Settings</Text>
	  </TouchableOpacity>
	</View>
  );
}

export default BatteryOptimisationHeader;