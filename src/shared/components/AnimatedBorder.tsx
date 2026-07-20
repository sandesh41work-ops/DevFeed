import React, { useEffect, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Svg, { Rect } from "react-native-svg";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedRect = Animated.createAnimatedComponent(Rect);

type Props = {
  color: string;
  borderRadius?: number;
  strokeWidth?: number;
};

export default function AnimatedBorder({
  color,
  borderRadius = 16,
  strokeWidth = 1,
}: Props) {
  const [size, setSize] = useState({
    width: 0,
    height: 0,
  });

  const offset = useSharedValue(0);

  const perimeter = 2 * (size.width + size.height - 2 * strokeWidth);
  const segmentLength = Math.min(80, Math.max(40, perimeter * 0.12));

  useEffect(() => {
    if (!size.width || !size.height) return;

    offset.value = withRepeat(
      withTiming(perimeter, {
        duration: 2800,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [size, perimeter]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: -offset.value,
  }));

  return (
    <View
      style={StyleSheet.absoluteFill}
      onLayout={(e: LayoutChangeEvent) => setSize(e.nativeEvent.layout)}
    >
      <Svg
        pointerEvents="none"
        width={size.width}
        height={size.height}
        style={StyleSheet.absoluteFill}
      >
        <Rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={Math.max(size.width - strokeWidth, 0)}
          height={Math.max(size.height - strokeWidth, 0)}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth / 2}
          opacity={0.15}
        />
        <AnimatedRect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={Math.max(size.width - strokeWidth, 0)}
          height={Math.max(size.height - strokeWidth, 0)}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={[segmentLength, perimeter]}
          animatedProps={animatedProps}
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}