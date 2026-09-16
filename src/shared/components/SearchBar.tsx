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
  const [isFocused, setIsFocused] = useState(false);
  const [clearButtonPressed, setClearButtonPressed] = useState(false);
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: colors.card,
            borderColor: isFocused ? colors.accent : colors.border,
          },
        ]}
      >
        <Input
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessibilityRole="button"
            accessibilityLabel="Clear search input"
          >
            <Ionicons
              name="close-circle"
              size={22}
              color={clearButtonPressed ? colors.error : colors.subtext}
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
    marginVertical: 6,
    marginHorizontal: 16,
  },
  searchBox: {
    position: "relative",
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  clearButton: {
    position: "absolute",
    right: 12,
    top: 14,
    padding: 2,
    zIndex: 1,
  },
});