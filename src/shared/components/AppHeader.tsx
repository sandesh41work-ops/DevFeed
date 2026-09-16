import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { memo } from "react";
import { fonts } from "../constants/fonts";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type AppHeaderProps = {
  activeTab?: "Feed" | "Bookmarks";
};

const AppHeader = ({ activeTab = "Feed" }: AppHeaderProps) => {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.leftContainer}>
        <Text style={[styles.terminalPrompt, { color: colors.accent }]}>
          {">_"}
        </Text>
        <Text style={[styles.title, { color: colors.text }]}>
          DevFeed
          {activeTab === "Bookmarks" && (
            <Text style={[styles.subtitle, { color: colors.subtext }]}>
              {" / Bookmarks"}
            </Text>
          )}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate("Profile")}
        accessibilityRole="button"
        accessibilityLabel="Go to Profile"
      >
        <Ionicons name="person-outline" size={22} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

export default memo(AppHeader);

const styles = StyleSheet.create({
  container: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  terminalPrompt: {
    fontFamily: fonts.mono,
    fontSize: 19,
    marginRight: 8,
  },

  title: {
    fontSize: 20,
    fontFamily: fonts.semibold,
  },

  subtitle: {
    fontSize: 16,
    fontFamily: fonts.regular,
  },

  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
