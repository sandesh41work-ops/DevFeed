import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import Button from "./Button";
import { useTheme } from "../hooks/useTheme";
import { Dimensions } from "react-native";
import { fonts } from "../constants/fonts";

type Props = {
  refetch: () => void;
};
const space = (n: number) => n * 4;
const { width } = Dimensions.get("window");
export default function ErrorState({ refetch }: Props) {
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
        source={require("../../../assets/illustrations/error_state.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text
        style={[
          styles.title,
          {
            color: colors.text,
          },
        ]}
      >
        Oops! Something went wrong
      </Text>

      <Text
        style={[
          styles.subtitle,
          {
            color: colors.subtext,
          },
        ]}
      >
       
        Please check your internet connection and try again.
      </Text>
      <Button
        title="Try Again"
        onPress={refetch}
        style={[styles.button, {backgroundColor : colors.accent}]}

      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: Math.min(width * 0.8, 300),
    height: Math.min(width * 0.8, 300),
    paddingVertical : 10
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
