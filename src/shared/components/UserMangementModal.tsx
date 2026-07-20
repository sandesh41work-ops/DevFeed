import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { fonts } from "../constants/fonts";
import { memo, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "../services/firebase";
import { useTheme } from "../hooks/useTheme";
import { updateUserDisplayName } from "../../features/auth/authService";
import { TextInput } from "react-native-gesture-handler";
type Props = {
  visible: boolean;
  onClose: () => void;
};

const UserManagementModal = ({ visible, onClose }: Props) => {
  const { height } = useWindowDimensions();
  const { colors } = useTheme();
  const currentUser = auth.currentUser;
  const [name, setName] = useState(currentUser?.displayName || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setName(currentUser?.displayName ?? "");
  }, [visible]);

  const handleSaveUsername = async () => {
    const username = name.trim();

    if (!username) return;

    try {
      setSaving(true);

      await updateUserDisplayName(username);

      // Refresh the current user
      await auth.currentUser?.reload();

      onClose();
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };
  const handleLogout = async () => {
    try {
      await auth.signOut();
      onClose();
    } catch (error) {
      console.log("Logout Error:", error);
    }
  };

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalBackdrop} onPress={onClose} />

      <View
        style={[
          styles.sheetContainer,
          {
            maxHeight: height * 0.85,
            backgroundColor: colors.card,
          },
        ]}
      >
        <View
          style={[
            styles.dragHandle,
            {
              backgroundColor: colors.border,
            },
          ]}
        />

        <View style={styles.contentContainer}>
          <View
            style={[
              styles.avatarContainer,
              {
                backgroundColor: colors.background,
              },
            ]}
          >
            <Ionicons name="person" size={36} color={colors.subtext} />
          </View>

          {currentUser?.displayName ? (
            <Text
              style={[
                styles.name,
                {
                  color: colors.text,
                },
              ]}
            >
              {currentUser.displayName}
            </Text>
          ) : (
            <>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Username not set - Set your username"
                placeholderTextColor={colors.subtext}
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
              />

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  {
                    backgroundColor: colors.accent,
                  },
                ]}
                onPress={handleSaveUsername}
                disabled={saving}
              >
                <Text style={styles.saveButtonText}>
                  {saving ? "Saving..." : "Save Username"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <Text
            style={[
              styles.email,
              {
                color: colors.subtext,
              },
            ]}
          >
            {currentUser?.email || "No email available"}
          </Text>

          <View
            style={[
              styles.divider,
              {
                backgroundColor: colors.border,
              },
            ]}
          />

          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color={colors.accent} />

            <Text
              style={[
                styles.actionText,
                {
                  color: colors.accent,
                },
              ]}
            >
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default memo(UserManagementModal);

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  sheetContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 34,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 24,
  },

  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 24,
  },

  contentContainer: {
    width: "100%",
  },

  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,

    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",

    marginBottom: 16,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: fonts.semibold,
    textAlign: "center",
    marginBottom: 4,
  },

  email: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 28,
    fontFamily: fonts.regular,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginBottom: 12,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },

  actionText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: fonts.semibold,
    marginLeft: 12,
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: fonts.regular,
    marginBottom: 16,
  },

  saveButton: {
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: fonts.semibold,
  },
});
