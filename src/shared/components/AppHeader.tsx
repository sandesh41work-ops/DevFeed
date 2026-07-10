import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { memo } from "react";
import { useState } from "react";
import UserManagementModal from "./UserMangementModal";

const AppHeader = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme();
  return (
    <View style={[{ backgroundColor: colors.background }, styles.container]}>
      <View style={styles.leftContainer}>
        <MaterialCommunityIcons
          name="console-line"
          size={24}
          color={colors.text}
        />

        <Text style={[styles.title, { color: colors.text }]}>DevFeed</Text>
      </View>

      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="person-outline" size={22} color={colors.text} />
      </TouchableOpacity>
      <UserManagementModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default memo(AppHeader);

const styles = StyleSheet.create({
  container: {
    height: 64,
    paddingHorizontal: 20,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: "#E3BFB1",
  },

  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    marginLeft: 10,
    fontSize: 24,
    fontWeight: "700",
    color: "#A33E00",
  },

  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,

    alignItems: "center",
    justifyContent: "center",
  },
});
