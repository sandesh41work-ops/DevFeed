import { ScrollView, StyleSheet, View, Platform } from "react-native";
import { useEffect } from "react";
import { useObserve } from "expo-observe";
import { useTheme } from "../../shared/hooks/useTheme";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import AppHeader from "../../shared/components/AppHeader";

const ProfileScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  return (
    <SafeAreaView>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <AppHeader />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 24 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile content will be added here */}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingBottom: 40,
  },
});
