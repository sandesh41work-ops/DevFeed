import React, { useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
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

  const perimeter =
    2 * (size.width + size.height - 2 * strokeWidth);
  const segmentLength = Math.min(80, Math.max(40, perimeter * 0.12));
  const gradientId = useMemo(
    () => `beamGradient-${Math.random().toString(36).slice(2)}`,
    []
  );

  useEffect(() => {
    if (!size.width || !size.height) return;

    offset.value = withRepeat(
      withTiming(perimeter, {
        duration: 2800,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [size, perimeter]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: -offset.value,
  }));

  return (
    <View
      style={StyleSheet.absoluteFill}
      onLayout={(e: LayoutChangeEvent) =>
        setSize(e.nativeEvent.layout)
      }
    >
      <Svg
        pointerEvents="none"
        width={size.width}
        height={size.height}
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="0" />
            <Stop offset="20%" stopColor={color} stopOpacity="0.35" />
            <Stop offset="50%" stopColor={color} stopOpacity="0.95" />
            <Stop offset="100%" stopColor={color} stopOpacity="0" />
          </LinearGradient>
        </Defs>
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
          opacity={0.12}
        />
        <AnimatedRect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={Math.max(size.width - strokeWidth, 0)}
          height={Math.max(size.height - strokeWidth, 0)}
          rx={borderRadius}
          ry={borderRadius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth * 1.5}
          strokeDasharray={[segmentLength, Math.max(perimeter - segmentLength, 1)]}
          animatedProps={animatedProps}
          strokeLinecap="round"
          opacity={0.95}
        />
      </Svg>
    </View>
  );
}