import { useEffect, useRef } from "react";
import { Animated, DimensionValue, StyleSheet } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
const SCREEN_WIDTH = Dimensions.get("window").width;

interface ShimmerBoneProps {
  width: DimensionValue; // Restricts to numbers, "50%", "auto", etc.
  height: DimensionValue; // Restricts to numbers, "50%", "auto", etc.
  borderRadius?: number;
style?: any;
}

export default function ShimmerBone({
  width,
  height,
  borderRadius = 4,
  style
}: ShimmerBoneProps) {
  const { isDark, colors } = useTheme();
  const shimmerAnimatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnimatedValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const translateX = shimmerAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
   <View
      style={[
        styles.boneBase,
        { width, height, borderRadius, backgroundColor: colors.skeleton },
        style, 
      ]}
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,102,0,0.08)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 8,
  },
  boneBase: {
    overflow: "hidden",
    position: "relative",
  },
  gradient: {
    flex: 1,
    width: "100%",
  },
});
