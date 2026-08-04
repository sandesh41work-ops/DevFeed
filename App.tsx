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
const queryClient = new QueryClient();
export default function App() {
  const { colors } = useTheme();
  const [fontsLoaded] = useFonts({
    IBMPlexSans_600SemiBold,
    IBMPlexSans_400Regular,
    IBMPlexMono_600SemiBold,
  });

  if (!fontsLoaded) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor : colors.background }}>
      <QueryClientProvider client={queryClient}>
        <RootNavigator />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
