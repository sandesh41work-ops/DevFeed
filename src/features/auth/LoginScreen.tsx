import { useCallback, useEffect, useRef, useState } from "react";
import { useObserve } from "expo-observe";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { loginUser } from "./authService";
import { useTheme } from "../../shared/hooks/useTheme";
import { fonts } from "../../shared/constants/fonts";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared/types/navigation";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function LoginScreen() {
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation<NavigationProp>();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  const handleLogin = async () => {
    setEmailError("");
    setPasswordError("");
    setGeneralError("");
    setInfoMessage("");

    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!email.includes("@")) {
      setEmailError("Enter a valid email");
      return;
    }
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      Keyboard.dismiss();
      await loginUser(email, password);
    } catch (e: any) {
      setGeneralError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePress = useCallback(() => {
    setInfoMessage("Google sign-in is not yet configured");
  }, []);

  const handleApplePress = useCallback(() => {
    setInfoMessage("Apple sign-in is not yet configured");
  }, []);

  const handleEmailSubmit = useCallback(() => {
    Keyboard.dismiss();
    passwordRef.current?.focus();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require("../../../assets/illustrations/loginCat.png")}
            resizeMode="cover"
            style={styles.hero}
          />

          <Text
            style={[
              styles.subtitle,
              { color: colors.subtext, fontFamily: fonts.regular },
            ]}
          >
            Welcome back. Pick up where you left off.
          </Text>

          {!!generalError && (
            <View
              style={[styles.banner, { backgroundColor: colors.error + "1A" }]}
            >
              <Text style={[styles.bannerText, { color: colors.error }]}>
                {generalError}
              </Text>
            </View>
          )}

          {!!infoMessage && (
            <View
              style={[
                styles.infoBanner,
                {
                  backgroundColor: colors.accent + "1A",
                  borderColor: colors.accent + "33",
                },
              ]}
            >
              <Text style={[styles.infoBannerText, { color: colors.text }]}>
                {infoMessage}
              </Text>
            </View>
          )}

          <View style={styles.field}>
            <Text
              style={[
                styles.label,
                { color: colors.subtext, fontFamily: fonts.regular },
              ]}
            >
              EMAIL
            </Text>

            <Input
              ref={emailRef}
              placeholder="dev@feed.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (emailError) setEmailError("");
              }}
              keyboardType="email-address"
              autoComplete="email"
              textContentType="emailAddress"
              returnKeyType="next"
              onSubmitEditing={handleEmailSubmit}
              customStyles={{ marginBottom: 0 }}
            />

            {!!emailError && (
              <Text style={[styles.inlineError, { color: colors.error }]}>
                {emailError}
              </Text>
            )}
          </View>

          <View style={styles.field}>
            <Text
              style={[
                styles.label,
                { color: colors.subtext, fontFamily: fonts.regular },
              ]}
            >
              PASSWORD
            </Text>

            <Input
              ref={passwordRef}
              placeholder="••••••••"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (passwordError) setPasswordError("");
              }}
              secureTextEntry={!showPassword}
              autoComplete="password"
              textContentType="password"
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              customStyles={{ marginBottom: 0 }}
              rightElement={
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color={colors.subtext}
                  />
                </Pressable>
              }
            />

            {!!passwordError && (
              <Text style={[styles.inlineError, { color: colors.error }]}>
                {passwordError}
              </Text>
            )}
          </View>

          <Button
            title="Login"
            disabled={loading}
            loading={loading}
            onPress={handleLogin}
          />

          <View style={styles.divider}>
            <View style={[styles.line, { backgroundColor: colors.border }]} />

            <Text
              style={[
                styles.or,
                { color: colors.subtext, fontFamily: fonts.regular },
              ]}
            >
              OR
            </Text>

            <View style={[styles.line, { backgroundColor: colors.border }]} />
          </View>

          <Pressable
            style={[
              styles.socialButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={handleGooglePress}
            accessibilityRole="button"
            accessibilityLabel="Continue with Google"
          >
            <MaterialCommunityIcons name="google" color="#EA4335" size={20} />

            <Text
              style={[
                styles.socialText,
                { color: colors.text, fontFamily: fonts.regular },
              ]}
            >
              Continue with Google
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.socialButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={handleApplePress}
            accessibilityRole="button"
            accessibilityLabel="Continue with Apple"
          >
            <MaterialCommunityIcons name="apple" color="#000" size={22} />

            <Text
              style={[
                styles.socialText,
                { color: colors.text, fontFamily: fonts.regular },
              ]}
            >
              Continue with Apple
            </Text>
          </Pressable>

          <View style={styles.footer}>
            <Text
              style={[
                styles.footerText,
                { color: colors.subtext, fontFamily: fonts.regular },
              ]}
            >
              Don't have an account?
            </Text>

            <Pressable onPress={() => navigation.navigate("SignUp")}>
              <Text
                style={[
                  styles.loginText,
                  { color: colors.accent, fontFamily: fonts.semibold },
                ]}
              >
                Sign Up
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
    paddingBottom: 40,
  },

  hero: {
    width: "100%",
    height: 200,
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },

  subtitle: {
    marginTop: 6,
    textAlign: "center",
    marginBottom: 32,
    fontSize: 16,
  },

  banner: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 16,
  },

  bannerText: {
    fontSize: 13,
    textAlign: "center",
  },

  infoBanner: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },

  infoBannerText: {
    fontSize: 13,
    textAlign: "center",
  },

  field: {
    marginBottom: 18,
  },

  label: {
    fontWeight: "700",
    fontSize: 12,
    marginBottom: 8,
    letterSpacing: 1,
  },

  inlineError: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 30,
  },

  line: {
    flex: 1,
    height: 1,
  },

  or: {
    marginHorizontal: 12,
    fontWeight: "600",
    fontSize: 14,
  },

  socialButton: {
    height: 54,
    borderRadius: 30,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },

  socialText: {
    fontWeight: "600",
    fontSize: 15,
  },

  footer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },

  footerText: {
    fontSize: 14,
  },

  loginText: {
    fontWeight: "700",
    fontSize: 14,
  },
});
