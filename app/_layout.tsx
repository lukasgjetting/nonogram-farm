import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/src/utils/useColorScheme";
import { SaveDataProvider } from "@/src/lib/save-data";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [isLoadingSaveData, setIsLoadingSaveData] = useState(true);

  const isLoaded = !isLoadingSaveData;

  useEffect(() => {
    if (isLoaded) {
      SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <SaveDataProvider onLoaded={() => setIsLoadingSaveData(false)}>
          {isLoaded ? (
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="nonogram/[nonogramKey]"
                options={{ headerShown: false, gestureEnabled: false }}
              />
              <Stack.Screen name="shop" options={{ headerShown: false }} />
              <Stack.Screen name="inventory" options={{ headerShown: false }} />
            </Stack>
          ) : null}
        </SaveDataProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
