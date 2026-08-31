import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../shared/components/AppHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../shared/hooks/useTheme";
import { fonts } from "../../shared/constants/fonts";
import { RootStackParamList } from "../../shared/types/navigation";
import { logOutUser } from "../auth/authService";
import { useProfileDetails } from "./useProfileDetails";

type Density = "comfortable" | "compact";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const getInitials = (name?: string | null) => {
  if (!name?.trim()) return "?";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
};

const ProfileScreen = () => {
  const [density, setDensity] = useState<Density>("comfortable");
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();
  const currentUser = useProfileDetails();

  const signOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await logOutUser();
          navigation.replace("Login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.profileHeader,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: colors.border },
              ]}
            >
              <Text style={[styles.avatarInitials, { color: colors.text }]}>
                {getInitials(currentUser?.displayName)}
              </Text>
            </View>
          </View>

          <Text style={[styles.profileName, { color: colors.text }]}>
            {currentUser?.displayName || "User"}
          </Text>

          <Text style={[styles.profileRole, { color: colors.subtext }]}>
            {currentUser?.email || ""}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Appearance
          </Text>

          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.settingRow}>
              <View style={styles.settingLeft}>
                <View
                  style={[styles.iconBox, { backgroundColor: colors.border }]}
                >
                  <Ionicons
                    name={isDark ? "moon" : "sunny-outline"}
                    size={20}
                    color={colors.subtext}
                  />
                </View>
                <View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    Theme
                  </Text>
                  <Text
                    style={[styles.cardDescription, { color: colors.subtext }]}
                  >
                    {isDark ? "Dark Mode" : "Light Mode"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Account
          </Text>

          <Pressable
            onPress={signOut}
            style={({ pressed }) => [
              styles.signOutButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Ionicons name="log-out-outline" size={22} color={colors.error} />
            <Text style={[styles.signOutText, { color: colors.error }]}>
              Sign Out
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 24,
  },
  profileHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 28,
    alignItems: "center",
    borderRadius: 16,
    marginHorizontal: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "600",
    fontFamily: fonts.semibold,
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
  },
  section: {
    marginHorizontal: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: "600",
    fontFamily: fonts.semibold,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  settingLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
    fontFamily: fonts.regular,
  },
  cardDescription: {
    marginTop: 2,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
  },
  signOutButton: {
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  signOutText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    fontFamily: fonts.semibold,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: "600",
    fontFamily: fonts.semibold,
  },
});

export default ProfileScreen;
