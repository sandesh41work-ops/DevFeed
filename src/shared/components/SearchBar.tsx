import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import Input from "./Input";
import AnimatedBorder from "./AnimatedBorder";

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
    <View style={styles.container}>
      <View style={[styles.searchBox, { backgroundColor: colors.card }]}> 
        <AnimatedBorder color={colors.accent} borderRadius={16} />

        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          customStyles={{
            marginBottom: 0,
            borderWidth: 0,
            backgroundColor: "transparent",
          }}
        />

        {value.length > 0 && (
          <TouchableOpacity
            onPress={() => onChangeText("")}
            onPressIn={() => setClearButtonPressed(true)}
            onPressOut={() => setClearButtonPressed(false)}
            style={styles.clearButton}
          >
            <Ionicons
              name="close-circle"
              size={28}
              color={clearButtonPressed ? "#e04646" : "rgba(255,102,0,0.5)"}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default React.memo(SearchBar);

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 16,
  },
  searchBox: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },
  clearButton: {
    position: "absolute",
    right: 14,
    top: 12,
    padding: 4,
    zIndex: 1,
  },
});
