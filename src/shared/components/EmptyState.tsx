import React, { useEffect } from "react";
import {
  Dimensions,
  ImageSourcePropType,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { fonts } from "../constants/fonts";
import { useTheme } from "../hooks/useTheme";

type Props = {
  image?: ImageSourcePropType;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onPress?: () => void;
  imageSize?: number;
};

const space = (n: number) => n * 4;
const { width } = Dimensions.get("window");

export default function EmptyState({
  image,
  title,
  subtitle,
  buttonText,
  onPress,
  imageSize = Math.min(width * 0.8, 320),
}: Props) {
  const { colors } = useTheme();

  const keyboardVisible = useSharedValue(Keyboard.isVisible());

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";

    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, () => {
      keyboardVisible.value = true;
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      keyboardVisible.value = false;
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: withTiming(
          keyboardVisible.value ? -70 : 0,
          {
            duration: 250,
          }
        ),
      },
    ],
  }));

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(
          keyboardVisible.value ? 0.6 : 1,
          {
            duration: 250,
          }
        ),
      },
    ],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(keyboardVisible.value ? 0.95 : 1, {
      duration: 250,
    }),
    marginTop: withTiming(keyboardVisible.value ? -20 : 0, {
      duration: 250,
    }),
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.background },
        containerAnimatedStyle,
      ]}
    >
      {image && (
        <Animated.Image
          source={image}
          resizeMode="contain"
          style={[
            styles.image,
            {
              width: imageSize,
              height: imageSize,
            },
            imageAnimatedStyle,
          ]}
        />
      )}

      <Animated.View style={textAnimatedStyle}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
            },
          ]}
        >
          {title ?? "No Results Found!"}
        </Text>

        <Text
          style={[
            styles.subtitle,
            {
              color: colors.subtext,
            },
          ]}
        >
          {subtitle ??
            "Try another keyword or browse today's top Hacker News stories."}
        </Text>
      </Animated.View>

      {buttonText && onPress && (
        <Pressable
          onPress={onPress}
          android_ripple={{ color: "#ffffff22" }}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.accent,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  image: {
    marginBottom: 16,
  },

  title: {
    fontSize: 24,
    fontFamily: fonts.semibold,
    textAlign: "center",
    marginBottom: space(3),
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 300,
    marginBottom: space(8),
    fontFamily: fonts.semibold,
  },

  button: {
    paddingHorizontal: space(7),
    paddingVertical: space(3.5),
    borderRadius: 16,
    elevation: 2,
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontFamily: fonts.semibold,
  },
});