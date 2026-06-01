type ButtonProps = {
  title: string;
  onPress: () => undefined | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  style?: object | StyleProp<ViewStyle>;
  textStyle?: object | StyleProp<ViewStyle>;
};

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  StyleProp,
} from "react-native";

const Button = ({
  title,
  onPress,
  disabled,
  loading,
  style,
  textStyle,
}: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.disabled, style]}
    >
      {loading ? (
        <ActivityIndicator color="#ffff" size="small" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}> {title} </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    height: 52,
    backgroundColor: "#2563eb",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  disabled: {
    backgroundColor: "#2564eb67",
  },
});
