import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import RootNavigator from "./src/navigation/RootNavigator";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import {
  IBMPlexSans_600SemiBold,
  IBMPlexSans_400Regular,
} from "@expo-google-fonts/ibm-plex-sans";
import { IBMPlexMono_600SemiBold } from "@expo-google-fonts/ibm-plex-mono";
import { useTheme } from "./src/shared/hooks/useTheme";
import { ObserveRoot, Observe } from "expo-observe";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { scheduleDailyReminder } from "./src/features/notifications/notificationService"; 

// Enable metrics reporting in development builds for dashboard visibility
Observe.configure({
  dispatchInDebug: true,
  integrations: {
    "react-navigation": true,
  },
});

const queryClient = new QueryClient();

function App() {
  const { colors } = useTheme();
  const [fontsLoaded] = useFonts({
    IBMPlexSans_600SemiBold,
    IBMPlexSans_400Regular,
    IBMPlexMono_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  
  useEffect(() => {
    scheduleDailyReminder();
  },[])
  return (
    <GestureHandlerRootView
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <StatusBar style="auto" />
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

function Root() {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  );
}

export default ObserveRoot.wrap(Root);