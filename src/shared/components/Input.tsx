import { KeyboardTypeOptions, StyleProp, StyleSheet, TextInput, TextStyle, View, NativeSyntheticEvent, TextInputSubmitEditingEventData } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { fonts } from "../constants/fonts";
import { ReactNode, forwardRef } from "react";

type InputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  customStyles?: StyleProp<TextStyle>;
  rightElement?: ReactNode;
  autoComplete?: string;
  textContentType?: string;
  returnKeyType?: "done" | "next" | "go" | "search" | "send";
  onSubmitEditing?: (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => void;
};

const Input = forwardRef<TextInput, InputProps>(({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  customStyles,
  rightElement,
  autoComplete,
  textContentType,
  returnKeyType,
  onSubmitEditing,
}: InputProps, ref) => {
  const { colors } = useTheme();

  return (
    <View style={styles.wrapper}>
      <TextInput
        ref={ref}
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
        autoCorrect={false}
        autoComplete={autoComplete as any}
        textContentType={textContentType as any}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing}
      />
      {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
    </View>
  );
});

Input.displayName = "Input";

export default Input;

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingRight: 45,
    marginBottom: 16,
    fontSize: 16,
  },
  rightElement: {
    position: "absolute",
    right: 12,
    top: 13,
  },
});