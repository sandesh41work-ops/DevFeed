import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import Input from "./Input";
type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Search stories...",
}: SearchBarProps) => {
  const [clearButtonPressed, setClearButtonPressed] = useState(false);
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        customStyles={{ marginBottom: 1 }}
      />
      {/* Todo : Clear Icon */}
      <TouchableOpacity
        onPress={() => onChangeText("")}
        onPressIn={() => setClearButtonPressed(true)}
        onPressOut={() => setClearButtonPressed(false)}
        style={{ position: "absolute", right: 30, top: 13, padding: 4 }}
      >
        <Ionicons
          name="close-circle"
          size={32}
          color={clearButtonPressed ? "#e04646" : "#6d6262"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(SearchBar);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    // borderBottomWidth: 1,
    // borderColor: "#47474783",
  },
});
