import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../hooks/useTheme";
import { fonts } from "../constants/fonts";
import { Dimensions } from "react-native";

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

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <Image
        source={image}
        resizeMode="contain"
        style={[
          styles.image,
          {
            width: imageSize,
            height: imageSize,
          },
        ]}
      />

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: space(6),
  },

  image: {
    width: Math.min(width * 0.8, 320),
    height: Math.min(width * 0.8, 300),
  },
  // image: {
  //   width: 380,
  //   height: 380,
  // //   marginBottom: space(6),
  // },

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
