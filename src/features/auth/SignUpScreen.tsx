import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import Button from "../../shared/components/Button";
import Input from "../../shared/components/Input";
import { registerUser } from "./authService";
import { useNavigation } from "@react-navigation/native";
import LoginScreen from "./LoginScreen";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared/types/navigation";
import { useTheme } from "../../shared/hooks/useTheme";
import { Platform } from "react-native";
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SignUpScreen = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();

  function addDelay() {
    // function for test the loading indicator
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 10000);
  }
  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (!email.includes("@")) {
      setError("Enter a valid email");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await registerUser(email, password);

      // auth state listener handles navigation automatically
    } catch (e: any) {
      setError(e.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              styles.container,
              {
                backgroundColor: colors.background,
              },
            ]}
          >
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.card,
                  shadowColor: isDark ? "#000" : "#000",
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 28,
                  fontWeight: "700",
                  color: colors.text,
                  marginBottom: 8,
                }}
              >
                Create Account
              </Text>

              <Text
                style={[
                  styles.subtitle,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                Create Account to continue
              </Text>

              <Input
                value={email}
                placeholder="Enter your email"
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              <Input
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
              />

              <Input
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
              />

              {error ? (
                <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
              ) : null}

              <Button
                title="Create Account"
                disabled={!email || !password}
                loading={loading}
                onPress={() => {
                  console.log("Email: ", email);
                  console.log("Password :", password);
                  console.log("Confirm Password :", confirmPassword);
                  handleSignUp();
                }}
              />

              <TouchableOpacity
                style={styles.signupLink}
                onPress={() => navigation.navigate("Login")}
              >
                <Text
                  style={[
                    styles.signupLinkText,
                    {
                      color: colors.accent,
                    },
                  ]}
                >
                  Already Have Account? Login instead
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f4f7",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 25,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },

  signupLink: {
    marginTop: 15,
  },
  signupLinkText: {
    color: "#2563eb",
    fontSize: 14,
    textAlign: "center",
  },
});
