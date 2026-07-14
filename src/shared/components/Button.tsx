import { TextStyle, ViewStyle, StyleProp } from "react-native";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

type ButtonProps = {
  title: string;
  onPress: () => undefined | Promise<void> | void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

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
