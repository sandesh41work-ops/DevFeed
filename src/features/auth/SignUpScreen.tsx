import { useCallback, useRef, useState } from "react";
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
import { registerUser } from "./authService";
import { useTheme } from "../../shared/hooks/useTheme";
import { fonts } from "../../shared/constants/fonts";
import Input from "../../shared/components/Input";
import Button from "../../shared/components/Button";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared/types/navigation";
import { useNavigation } from "@react-navigation/native";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

function getPasswordStrength(password: string): { score: number; label: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score = Math.min(score + 1, 4);

  if (score <= 1) return { score, label: "Weak" };
  if (score <= 2) return { score, label: "Fair" };
  if (score <= 3) return { score, label: "Good" };
  return { score, label: "Strong" };
}

export default function SignUpScreen() {
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigation = useNavigation<NavigationProp>();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const passwordStrength = getPasswordStrength(password);
  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const handleSignUp = async () => {
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setGeneralError("");
    setTermsError("");
    setInfoMessage("");

    if (!email || !password || !confirmPassword) {
      if (!email) setEmailError("Email is required");
      if (!password) setPasswordError("Password is required");
      if (!confirmPassword) setConfirmPasswordError("Please confirm your password");
      return;
    }
    if (!email.includes("@")) {
      setEmailError("Enter a valid email");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }
    if (!acceptedTerms) {
      setTermsError("You must accept the terms to continue");
      return;
    }
    try {
      setLoading(true);
      Keyboard.dismiss();
      await registerUser(email, password);
    } catch (e: any) {
      setGeneralError(e.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePress = useCallback(() => {
    setInfoMessage("Google sign-up is not yet configured");
  }, []);

  const handleApplePress = useCallback(() => {
    setInfoMessage("Apple sign-up is not yet configured");
  }, []);

  const handleEmailSubmit = useCallback(() => {
    Keyboard.dismiss();
    passwordRef.current?.focus();
  }, []);

  const handlePasswordSubmit = useCallback(() => {
    Keyboard.dismiss();
    confirmRef.current?.focus();
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
          source={require("../../../assets/illustrations/signUpCat.png")}
          resizeMode="cover"
          style={styles.hero}
        />

        <Text
          style={[
            styles.title,
            { color: colors.text, fontFamily: fonts.semibold },
          ]}
        >
          Create Account
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: colors.subtext, fontFamily: fonts.regular },
          ]}
        >
          Join the developer journey.
        </Text>

        {!!generalError && (
          <View style={[styles.banner, { backgroundColor: colors.error + "1A" }]}>
            <Text style={[styles.bannerText, { color: colors.error }]}>
              {generalError}
            </Text>
          </View>
        )}

        {!!infoMessage && (
          <View style={[styles.infoBanner, { backgroundColor: colors.accent + "1A", borderColor: colors.accent + "33" }]}>
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
              if (confirmPasswordError && confirmPassword.length > 0) {
                setConfirmPasswordError("");
              }
            }}
            secureTextEntry={!showPassword}
            autoComplete="password"
            textContentType="newPassword"
            returnKeyType="next"
            onSubmitEditing={handlePasswordSubmit}
            customStyles={{ marginBottom: 0 }}
            rightElement={
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? "Hide password" : "Show password"}
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

          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <View style={styles.strengthBar}>
                {[0, 1, 2, 3].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.strengthSegment,
                      {
                        backgroundColor:
                          i < passwordStrength.score
                            ? passwordStrength.score <= 1
                              ? "#FF4444"
                              : passwordStrength.score <= 2
                              ? "#FFA500"
                              : "#4CAF50"
                            : colors.border,
                      },
                    ]}
                  />
                ))}
              </View>
              <Text
                style={[
                  styles.strengthLabel,
                  {
                    color:
                      passwordStrength.score <= 1
                        ? "#FF4444"
                        : passwordStrength.score <= 2
                        ? "#FFA500"
                        : "#4CAF50",
                  },
                ]}
                accessibilityLabel={`Password strength: ${passwordStrength.label}`}
              >
                {passwordStrength.label}
              </Text>
            </View>
          )}

        </View>

        <View style={styles.field}>
          <Text
            style={[
              styles.label,
              { color: colors.subtext, fontFamily: fonts.regular },
            ]}
          >
            CONFIRM PASSWORD
          </Text>

          <Input
            ref={confirmRef}
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (confirmPasswordError) setConfirmPasswordError("");
            }}
            secureTextEntry={!showConfirm}
            autoComplete="password"
            textContentType="newPassword"
            returnKeyType="done"
            onSubmitEditing={handleSignUp}
            customStyles={{ marginBottom: 0 }}
            rightElement={
              <Pressable
                onPress={() => setShowConfirm(!showConfirm)}
                accessibilityRole="button"
                accessibilityLabel={showConfirm ? "Hide password" : "Show password"}
              >
                <MaterialCommunityIcons
                  name={showConfirm ? "eye-off" : "eye"}
                  size={20}
                  color={colors.subtext}
                />
              </Pressable>
            }
          />

          {!!confirmPasswordError && (
            <Text style={[styles.inlineError, { color: colors.error }]}>
              {confirmPasswordError}
            </Text>
          )}

          {passwordsMatch && (
            <View style={styles.matchIndicator} accessibilityLabel="Passwords match">
              <MaterialCommunityIcons name="check-circle" size={14} color="#4CAF50" />
              <Text style={[styles.matchText, {color: colors.text}]}>Passwords match</Text>
            </View>
          )}

          {passwordsMismatch && (
            <View style={styles.matchIndicator} accessibilityLabel="Passwords do not match">
              <MaterialCommunityIcons name="close-circle" size={14} color="#FF4444" />
              <Text style={[styles.matchText, { color: "#FF4444" }]}>
                Passwords do not match
              </Text>
            </View>
          )}
        </View>

        <View style={styles.termsRow}>
          <Pressable
            style={styles.checkboxWrap}
            onPress={() => {
              setAcceptedTerms(!acceptedTerms);
              if (termsError) setTermsError("");
            }}
            accessibilityRole="checkbox"
            accessibilityLabel="Accept terms of service and privacy policy"
            accessibilityState={{ checked: acceptedTerms }}
          >
            <View
              style={[
                styles.checkbox,
                { borderColor: colors.border },
                acceptedTerms && { backgroundColor: colors.accent, borderColor: colors.accent },
              ]}
            >
              {acceptedTerms && (
                <MaterialCommunityIcons name="check" size={14} color="black" />
              )}
            </View>
          </Pressable>
          <Text style={[styles.termsText, { color: colors.subtext }]}>
            I agree to the{" "}
            <Text
              onPress={() => Alert.alert("Terms of Service", "Terms of service content goes here.")}
              style={[styles.termsLink, { color: colors.accent }]}
            >
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text
              onPress={() => Alert.alert("Privacy Policy", "Privacy policy content goes here.")}
              style={[styles.termsLink, { color: colors.accent }]}
            >
              Privacy Policy
            </Text>
          </Text>
        </View>

        {!!termsError && (
          <Text style={[styles.termsError, { color: colors.error }]}>
            {termsError}
          </Text>
        )}

        <Button
          title="Create Account"
          disabled={loading}
          loading={loading}
          onPress={handleSignUp}
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
            Already have an account?
          </Text>

          <Pressable onPress={() => navigation.navigate("Login")}>
            <Text
              style={[
                styles.loginText,
                { color: colors.accent, fontFamily: fonts.semibold },
              ]}
            >
              Login
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

  helperText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },

  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 8,
  },

  strengthBar: {
    flexDirection: "row",
    gap: 4,
    flex: 1,
  },

  strengthSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },

  strengthLabel: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 40,
    textAlign: "right",
  },

  matchIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
    marginLeft: 4,
  },

  matchText: {
    fontSize: 12,
    fontWeight: "600",
  },

  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
    marginTop: 4,
  },

  checkboxWrap: {
   
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 1,
  },

  termsText: {
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },

  termsLink: {
    fontWeight: "600",
    fontSize: 13,
  },

  termsError: {
    fontSize: 12,
    marginBottom: 8,
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

  inlineError: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});