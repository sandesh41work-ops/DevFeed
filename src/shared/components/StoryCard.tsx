import React, { memo, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { Story } from "../types/story";
import Favicon from "./FavIcon";
import { fonts } from "../constants/fonts";
import { isStoryVisited, markVisitedStory } from "../services/visitedStories";

const HOT_THRESHOLD = 500;

const getDomain = (url?: string) => {
  try {
    return url
      ? new URL(url).hostname.replace("www.", "")
      : "news.ycombinator.com";
  } catch {
    return "news.ycombinator.com";
  }
};

const getTimeAgo = (unixTime: number) => {
  const diff = Math.floor(Date.now() / 1000) - unixTime;
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

const StoryCard = memo(({ story }: { story: Story }) => {
  const [visited, setVisited] = useState(false);

  useEffect(() => {
    isStoryVisited(story.id).then(setVisited);
  }, [story.id]);

  const navigation = useNavigation<any>();

  const handlePress = () => {
    setVisited(true);
    markVisitedStory(story.id).catch((error) => {
      console.warn("Failed to persist visited story", error);
    });
    navigation.navigate("ArticleDetail", { story });
  };

  const { colors, isDark } = useTheme();
  const isHot = story.score > HOT_THRESHOLD;

  const domain = useMemo(() => getDomain(story.url), [story.url]);
  const timeAgo = useMemo(() => getTimeAgo(story.time), [story.time]);
  const commentCount = story.descendants ?? 0;

  return (
    <Pressable
      onPress={handlePress}
      android_ripple={{ color: isDark ? "#2A2A2A" : "#ECECEC" }}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: isDark ? "#2A2A2A" : "#E5E5E5",
          // Subtle left accent bar for unread stories
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
      accessibilityLabel={`${visited ? "Read" : "Unread"} story: ${
        story.title
      }, ${story.score} points, by ${story.by}, ${timeAgo} ago, ${commentCount} comments${
        isHot ? ", trending" : ""
      }`}
      accessibilityHint="Opens the full story"
    >
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <Favicon url={story.url} />
          <Text
            style={[styles.domain, { color: colors.subtext }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {domain}
          </Text>
        </View>

        {/* Title with contrast distinction and bounded lines */}
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

        <View style={styles.footer}>
          <View style={styles.scoreRow}>
            <Ionicons
              name="arrow-up"
              size={12}
              color={colors.subtext}
              style={styles.scoreIcon}
            />
            <Text style={[styles.monoMeta, { color: colors.subtext }]}>
              {story.score}
            </Text>
          </View>
          <Dot color={isDark ? "#3A3A3A" : "#D9D9D9"} />
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

          <View style={styles.spacer} />

          {isHot && (
            <Ionicons
              name="flame-outline"
              size={14}
              color={colors.accent}
              style={styles.hotIcon}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
          )}

          <View style={styles.footerItem}>
            <Ionicons
              name="chatbubble-outline"
              size={12}
              color={colors.subtext}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
            <Text style={[styles.monoFooterText, { color: colors.subtext }]}>
              {commentCount}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
});

StoryCard.displayName = "StoryCard";

export default StoryCard;

const Dot = memo(({ color }: { color: string }) => (
  <View style={[styles.dot, { backgroundColor: color }]} />
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

  domain: {
    fontFamily: fonts.semibold,
    marginLeft: 8,
    flexShrink: 1,
    fontSize: 12.5,
    letterSpacing: 0.2,
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

  scoreRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  scoreIcon: {
    marginRight: 2,
  },

  monoMeta: {
    fontFamily: fonts.mono,
    fontSize: 12,
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

  hotIcon: {
    marginRight: 10,
  },

  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  monoFooterText: {
    fontFamily: fonts.mono,
    marginLeft: 4,
    fontSize: 12,
  },
});