import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { memo, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
type Props = {
  onPress: () => void;
};

const SummaryCard = ({ onPress }: Props) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const { colors } = useTheme();

  return (
    <Animated.View style={animatedStyle}>
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.accent + "20" },
          ]}
        >
          <Ionicons name="sparkles-outline" size={22} color={colors.accent} />
        </View>

        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>AI Summary</Text>

          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            Generate a concise summary of this article.
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={22} color={colors.subtext} />
      </View>
    </TouchableOpacity>
    </Animated.View>
  );
};

export default memo(SummaryCard);

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },

  content: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontFamily: "IBMPlexSans_600SemiBold",

    fontWeight: "700",
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
});
