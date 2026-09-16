import React, { memo, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { Story } from "../types/story";
import { RootStackParamList } from "../types/navigation";
import { fonts } from "../constants/fonts";
import { isStoryVisited, markVisitedStory } from "../services/visitedStories";

const getTimeAgo = (unixTime: number) => {
  const diff = Math.floor(Date.now() / 1000) - unixTime;

  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;

  return `${Math.floor(diff / 86400)}d`;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const AskCard = memo(({ story }: { story: Story }) => {
  const [visited, setVisited] = useState(false);

  const navigation = useNavigation<NavigationProp>();
  const { colors, isDark } = useTheme();

  useEffect(() => {
    isStoryVisited(story.id).then(setVisited);
  }, [story.id]);

  const handlePress = () => {
    setVisited(true);

    markVisitedStory(story.id).catch((error) => {
      console.warn("Failed to persist visited story", error);
    });

    navigation.navigate("AskDetail", { story });
  };

  const timeAgo = useMemo(() => getTimeAgo(story.time), [story.time]);
  const commentCount = story.descendants ?? 0;

  return (
    <Pressable
      onPress={handlePress}
      android_ripple={{
        color: isDark ? "#2A2A2A" : "#ECECEC",
      }}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: isDark ? "#2A2A2A" : "#E5E5E5",
          borderLeftWidth: visited ? StyleSheet.hairlineWidth : 3,
          borderLeftColor: visited
            ? isDark
              ? "#2A2A2A"
              : "#E5E5E5"
            : colors.accent,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
      accessibilityRole="link"
      accessibilityLabel={`${visited ? "Read" : "Unread"} Ask HN post: ${
        story.title
      }, by ${story.by}, ${timeAgo} ago, ${commentCount} comments`}
      accessibilityHint="Opens the discussion"
    >
      <View style={styles.cardContent}>
        {/* Ask label */}
        <View style={styles.header}>
          <View
            style={[
              styles.askBadge,
              {
                backgroundColor: isDark
                  ? "rgba(255,102,0,0.12)"
                  : "rgba(255,102,0,0.10)",
              },
            ]}
          >
            <Ionicons
              name="chatbubble-outline"
              size={12}
              color={colors.accent}
            />

            <Text
              style={[
                styles.askBadgeText,
                {
                  color: colors.accent,
                },
              ]}
            >
              ASK HN
            </Text>
          </View>
        </View>

        {/* Question */}
        <Text
          style={[
            styles.title,
            {
              color: visited ? colors.subtext : colors.text,
              fontFamily: visited ? fonts.regular : fonts.semibold,
            },
          ]}
          numberOfLines={4}
          ellipsizeMode="tail"
        >
          {story.title}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.authorSection}>
            <Text
              style={[styles.meta, { color: colors.subtext }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {story.by}
            </Text>

            <Dot color={isDark ? "#3A3A3A" : "#D9D9D9"} />

            <Text style={[styles.meta, { color: colors.subtext }]}>
              {timeAgo} ago
            </Text>
          </View>

          <View style={styles.spacer} />

          {/* Comments */}
          <View
            style={[
              styles.commentBadge,
              {
                backgroundColor: isDark
                  ? "rgba(255,102,0,0.12)"
                  : "rgba(255,102,0,0.08)",
              },
            ]}
          >
            <Ionicons
              name="chatbubble-outline"
              size={12}
              color={colors.accent}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />

            <Text
              style={[
                styles.commentText,
                {
                  color: colors.accent,
                },
              ]}
            >
              {commentCount}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
});

AskCard.displayName = "AskCard";

export default AskCard;

const Dot = memo(({ color }: { color: string }) => (
  <View
    style={[
      styles.dot,
      {
        backgroundColor: color,
      },
    ]}
  />
));

Dot.displayName = "Dot";

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 11,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    minHeight: 44,
  },

  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  askBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  askBadgeText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    letterSpacing: 0.5,
  },

  title: {
    fontSize: 16.5,
    lineHeight: 23,
    letterSpacing: -0.15,
    marginBottom: 10,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
  },

  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },

  meta: {
    fontFamily: fonts.regular,
    fontSize: 12.5,
    maxWidth: 110,
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: 6,
  },

  spacer: {
    flex: 1,
    minWidth: 8,
  },

  commentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },

  commentText: {
    fontFamily: fonts.mono,
    fontSize: 12,
  },
});
