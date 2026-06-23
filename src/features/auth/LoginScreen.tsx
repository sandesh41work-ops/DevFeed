import { StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { useState } from "react";
import Button from "../../shared/components/Button";
import Input from "../../shared/components/Input";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../shared/services/firebase";
import { loginUser } from "./authService";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared/types/navigation";
import { useTheme } from "../../shared/hooks/useTheme";
import { Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// test functions for firebase auth, you can run these in useEffect to test the login and signup functionality without UI
async function testFirebaseLogin() {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      "sandesh@gmail.com",
      "password124",
    );

    console.log("User logged in:", userCredential.user.email);
  } catch (error: any) {
    console.log(error.code);
    console.log(error.message);
  }
}

async function testSignup() {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      "sandesh@gmail.com",
      "password124",
    );

    console.log("User created:", userCredential.user.email);
  } catch (error: any) {
    console.log(error.code);
    console.log(error.message);
  }
}

const LoginScreen = () => {
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const navigation = useNavigation<NavigationProp>();

  function addDelay() {
    // function for test the loading indicator
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 10000);
  }

  async function handleLogin(email: string, password: string) {
    let userEmail = email.trim();
    let userPassword = password.trim();

    if (!userEmail) {
      setError("Please enter your email.");
      return false;
    }
    if (!userEmail.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!userPassword) {
      setError("Please enter your password.");
      return false;
    }

    if (userPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError("");
    setLoading(true);

    try {
      const user = await loginUser(userEmail, userPassword);
      console.log("loggin success: ", user);
    } catch (error) {
      console.log(error);
      setError("Invalid Credentials : Login Failed..");
    } finally {
      setLoading(false);
    }
  }

  return (
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
              style={[
                styles.subtitle,
                {
                  color: colors.subtext,
                },
              ]}
            >
              Login to continue
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

            {error ? (
              <Text style={{ color: "red", marginBottom: 10 }}>{error}</Text>
            ) : null}

            <Button
              title="Login"
              disabled={!email || !password}
              loading={loading}
              onPress={() => {
                handleLogin(email, password);
              }}
            />

            <TouchableOpacity
              style={styles.signupLink}
              onPress={() => navigation.navigate("SignUp")}
            >
              <Text
                style={[
                  styles.signupLinkText,
                  {
                    color: colors.accent,
                  },
                ]}
              >
                Don't have an account? Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

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
