import { Stack } from "expo-router";
import { Image, View } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Hourly Sog",
          headerStyle: {
            backgroundColor: '#111',
          },
          headerTintColor: '#fff',
          headerShadowVisible: false,
          headerLeft: () => (
            <View style={{ marginLeft: 0, marginRight: 10 }}>
              <Image 
                source={require('../assets/images/adaptive-icon.png')} 
                style={{ width: 40, height: 40 }} 
                resizeMode="contain"
              />
            </View>
          ),
        }} 
      />
    </Stack>
  );
}
