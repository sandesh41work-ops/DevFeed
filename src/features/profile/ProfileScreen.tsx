import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeMode, useTheme } from "../../shared/hooks/useTheme";
import { fonts } from "../../shared/constants/fonts";
import { RootStackParamList } from "../../shared/types/navigation";
import { logOutUser, updateUserDisplayName } from "../auth/authService";
import { useProfileDetails } from "./useProfileDetails";
import {
  cancelDailyReminder,
  getDailyReminderSettings,
  scheduleDailyReminders,
  testDailyReminder,
} from "../notifications/notificationService";

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
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark, themeMode, setThemeMode } = useTheme();
  const currentUser = useProfileDetails();

  // Notification state
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [loadingReminders, setLoadingReminders] = useState(true);
  const [testingNotification, setTestingNotification] = useState(false);

  // Username edit state
  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(currentUser?.displayName || "");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    setNameInput(currentUser?.displayName || "");
  }, [currentUser?.displayName]);

  const handleSaveUsername = async () => {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    try {
      setSavingName(true);
      await updateUserDisplayName(trimmed);
      setEditingName(false);
    } catch (err) {
      console.warn("Failed to update username", err);
      Alert.alert("Error", "Could not update username.");
    } finally {
      setSavingName(false);
    }
  };

  useEffect(() => {
    getDailyReminderSettings()
      .then((settings) => {
        setRemindersEnabled(
          Boolean(settings?.enabled && settings?.notificationIds?.length > 0)
        );
      })
      .catch((err) => {
        console.warn("Failed to fetch reminder settings:", err);
      })
      .finally(() => {
        setLoadingReminders(false);
      });
  }, []);

  const handleToggleReminders = useCallback(async (enable: boolean) => {
    setLoadingReminders(true);
    try {
      if (enable) {
        const scheduledIds = await scheduleDailyReminders();
        if (scheduledIds.length > 0) {
          setRemindersEnabled(true);
          Alert.alert(
            "Reminders Enabled",
            "Daily reading reminders have been scheduled for 9:25 AM."
          );
        } else {
          setRemindersEnabled(false);
          Alert.alert(
            "Permission Required",
            "Please grant notification permissions in system settings to receive reminders."
          );
        }
      } else {
        await cancelDailyReminder();
        setRemindersEnabled(false);
      }
    } catch (error) {
      console.error("Failed to toggle reminders:", error);
      Alert.alert("Error", "Could not update notification settings.");
    } finally {
      setLoadingReminders(false);
    }
  }, []);

  const handleSendTestReminder = useCallback(async () => {
    if (testingNotification) return;
    setTestingNotification(true);
    try {
      const id = await testDailyReminder();
      if (id) {
        Alert.alert(
          "Test Reminder Queued",
          "A test reminder notification will fire in approximately 2 minutes."
        );
      } else {
        Alert.alert(
          "Permission Denied",
          "Could not schedule test reminder. Please verify notification permissions."
        );
      }
    } catch (error) {
      console.error("Failed to schedule test reminder:", error);
      Alert.alert("Error", "Failed to schedule test notification.");
    } finally {
      setTestingNotification(false);
    }
  }, [testingNotification]);

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

  const themeOptions: { mode: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { mode: "system", label: "System", icon: "phone-portrait-outline" },
    { mode: "light", label: "Light", icon: "sunny-outline" },
    { mode: "dark", label: "Dark", icon: "moon-outline" },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header with back navigation */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Profile & Settings
        </Text>

        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* User Card */}
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
                { backgroundColor: colors.accent },
              ]}
            >
              <Text style={styles.avatarInitials}>
                {getInitials(currentUser?.displayName)}
              </Text>
            </View>
          </View>

          {editingName ? (
            <View style={styles.editNameContainer}>
              <TextInput
                value={nameInput}
                onChangeText={setNameInput}
                placeholder="Enter username"
                placeholderTextColor={colors.subtext}
                autoFocus
                style={[
                  styles.nameInput,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
              />
              <View style={styles.editNameActions}>
                <TouchableOpacity
                  onPress={handleSaveUsername}
                  disabled={savingName}
                  style={[styles.editButton, { backgroundColor: colors.accent }]}
                >
                  <Text style={styles.editButtonText}>
                    {savingName ? "..." : "Save"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setNameInput(currentUser?.displayName || "");
                    setEditingName(false);
                  }}
                  style={[
                    styles.editButton,
                    { backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1 },
                  ]}
                >
                  <Text style={[styles.cancelButtonText, { color: colors.subtext }]}>
                    Cancel
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setEditingName(true)}
              style={styles.nameRow}
              accessibilityRole="button"
              accessibilityLabel="Edit display name"
            >
              <Text style={[styles.profileName, { color: colors.text }]}>
                {currentUser?.displayName || "Developer"}
              </Text>
              <Ionicons
                name="pencil-outline"
                size={16}
                color={colors.subtext}
                style={styles.editPencilIcon}
              />
            </TouchableOpacity>
          )}

          <Text style={[styles.profileRole, { color: colors.subtext }]}>
            {currentUser?.email || "No email available"}
          </Text>
        </View>

        {/* Appearance Section */}
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
                  style={[styles.iconBox, { backgroundColor: isDark ? "#333333" : "#ECECEC" }]}
                >
                  <Ionicons
                    name={isDark ? "moon" : "sunny-outline"}
                    size={20}
                    color={colors.accent}
                  />
                </View>
                <View>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    Theme
                  </Text>
                  <Text
                    style={[styles.cardDescription, { color: colors.subtext }]}
                  >
                    {themeMode === "system"
                      ? `System default (${isDark ? "Dark" : "Light"})`
                      : themeMode === "dark"
                      ? "Dark Mode"
                      : "Light Mode"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Segmented Theme Buttons */}
            <View
              style={[
                styles.themeSelectorContainer,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
            >
              {themeOptions.map((option) => {
                const isActive = themeMode === option.mode;
                return (
                  <TouchableOpacity
                    key={option.mode}
                    onPress={() => setThemeMode(option.mode)}
                    style={[
                      styles.themeOptionButton,
                      isActive && {
                        backgroundColor: colors.card,
                        shadowColor: "#000",
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        shadowOffset: { width: 0, height: 2 },
                        elevation: 2,
                      },
                    ]}
                  >
                    <Ionicons
                      name={option.icon}
                      size={16}
                      color={isActive ? colors.accent : colors.subtext}
                    />
                    <Text
                      style={[
                        styles.themeOptionText,
                        {
                          color: isActive ? colors.text : colors.subtext,
                          fontFamily: isActive ? fonts.semibold : fonts.regular,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Notifications
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
                  style={[styles.iconBox, { backgroundColor: isDark ? "#333333" : "#ECECEC" }]}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color={colors.accent}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    Daily Reading Reminder
                  </Text>
                  <Text
                    style={[styles.cardDescription, { color: colors.subtext }]}
                  >
                    {remindersEnabled
                      ? "Scheduled daily for 9:25 AM"
                      : "Reminders are turned off"}
                  </Text>
                </View>
              </View>

              {loadingReminders ? (
                <ActivityIndicator size="small" color={colors.accent} />
              ) : (
                <Switch
                  value={remindersEnabled}
                  onValueChange={handleToggleReminders}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor="#fff"
                />
              )}
            </View>

            {remindersEnabled && (
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            )}

            {remindersEnabled && (
              <TouchableOpacity
                onPress={handleSendTestReminder}
                disabled={testingNotification}
                style={styles.testReminderButton}
              >
                <Ionicons
                  name="paper-plane-outline"
                  size={16}
                  color={colors.accent}
                />
                <Text style={[styles.testReminderText, { color: colors.accent }]}>
                  {testingNotification
                    ? "Scheduling Test..."
                    : "Send Test Reminder (2 min)"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* About DevFeed Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>

          <View
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.subtext }]}>
                Version
              </Text>
              <Text style={[styles.aboutValue, { color: colors.text }]}>
                1.2.1
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.subtext }]}>
                Platform
              </Text>
              <Text style={[styles.aboutValue, { color: colors.text }]}>
                React Native · Expo SDK 56
              </Text>
            </View>

            <View style={[styles.divider, { backgroundColor: colors.border }]} />

            <View style={styles.aboutRow}>
              <Text style={[styles.aboutLabel, { color: colors.subtext }]}>
                License
              </Text>
              <Text style={[styles.aboutValue, { color: colors.text }]}>
                MIT
              </Text>
            </View>
          </View>
        </View>

        {/* Account Section */}
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
                borderColor: colors.error,
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
  headerBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.semibold,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 24,
  },
  profileHeader: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    alignItems: "center",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 28,
    lineHeight: 34,
    fontFamily: fonts.mono,
    color: "#fff",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  editPencilIcon: {
    marginLeft: 6,
  },
  profileName: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: fonts.semibold,
  },
  editNameContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 8,
  },
  nameInput: {
    width: "100%",
    height: 44,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: fonts.regular,
    textAlign: "center",
    marginBottom: 8,
  },
  editNameActions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontFamily: fonts.semibold,
    fontSize: 13,
  },
  cancelButtonText: {
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  profileRole: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fonts.regular,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: fonts.semibold,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
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
    lineHeight: 22,
    fontFamily: fonts.semibold,
  },
  cardDescription: {
    marginTop: 2,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fonts.regular,
  },
  themeSelectorContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 4,
  },
  themeOptionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  themeOptionText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
  },
  testReminderButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 8,
  },
  testReminderText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
  },
  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  aboutLabel: {
    fontSize: 14,
    fontFamily: fonts.regular,
  },
  aboutValue: {
    fontSize: 14,
    fontFamily: fonts.semibold,
  },
  signOutButton: {
    minHeight: 50,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  signOutText: {
    fontSize: 15,
    lineHeight: 22,
    fontFamily: fonts.semibold,
  },
});

export default ProfileScreen;
