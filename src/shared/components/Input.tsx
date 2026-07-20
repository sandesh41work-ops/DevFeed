import { KeyboardTypeOptions, StyleSheet, TextInput, TextStyle } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { fonts } from "../constants/fonts";

import { StyleProp } from "react-native";
type InputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  customStyles?: StyleProp<TextStyle>;
};

const Input = ({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  customStyles,
}: InputProps) => {
  const { colors } = useTheme();

  return (
    <TextInput
      style={[
        styles.input,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          color: colors.text,
          fontFamily: fonts.regular,
        },
        customStyles,
      ]}
      placeholder={placeholder}
      placeholderTextColor={colors.subtext}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType}
      autoCapitalize="none"
    />
  );
};

export default Input;

const styles = StyleSheet.create({
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 16,
    fontSize: 16,
  },
});