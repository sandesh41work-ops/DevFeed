import React, { memo, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { Story } from "../types/story";
import Favicon from "./FavIcon";
import { fonts } from "../constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import { isStoryVisited, markVisitedStory } from "../services/visitedStories";

const HOT_THRESHOLD = 500;
const space = (n: number) => n * 4;

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
          borderColor: isDark ? "#232323" : "#E5E5E5",
          // Accent left bar for unread stories
          borderLeftWidth: visited ? StyleSheet.hairlineWidth : 4,
          borderLeftColor: visited
            ? isDark
              ? "#232323"
              : "#E5E5E5"
            : "#e37226e3",
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
      <LinearGradient
        colors={
          visited
            ? ["transparent", "transparent"]
            : ["rgba(255,102,0,0.05)", "rgba(255,102,0,0)"]
        }
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Favicon url={story.url} />
          <Text
            style={[styles.domain, { color: colors.subtext }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {domain}
          </Text>

          {/* Dynamic Unread Badge */}
          {!visited && (
            <View style={styles.unreadBadge}>
              <View style={styles.unreadDot} />
              <Text style={styles.unreadText}>New</Text>
            </View>
          )}
        </View>

        {/* Title contrast shift instead of full element opacity */}
        <Text
          style={[
            styles.title,
            {
              color: visited ? colors.subtext : colors.text,
              fontWeight: visited ? "400" : "600",
            },
          ]}
        >
          {story.title}
        </Text>

        <View style={styles.footer}>
          <Text style={[styles.meta, { color: colors.subtext }]}>
            {story.score} upvotes
          </Text>
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
              color={colors.accent ?? "#C4501E"}
              style={styles.hotIcon}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
          )}

          <View style={styles.footerItem}>
            <Ionicons
              name="chatbubble-outline"
              size={14}
              color={colors.subtext}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />
            <Text style={[styles.footerText, { color: colors.subtext }]}>
              {commentCount}
            </Text>
          </View>
        </View>
      </LinearGradient>
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
    marginHorizontal: space(4),
    marginBottom: space(3),
    borderRadius: space(4.5),
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    minHeight: 44,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: space(2.5),
  },

  domain: {
    fontFamily: fonts.semibold,
    marginLeft: space(2),
    flexShrink: 1,
    fontSize: 12.5,
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  unreadBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 102, 0, 0.12)",
    paddingHorizontal: space(2),
    paddingVertical: space(0.5),
    borderRadius: space(3),
    marginLeft: "auto",
  },

  unreadDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#FF6600",
    marginRight: space(1),
  },

  unreadText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FF6600",
    letterSpacing: 0.5,
  },

  title: {
    fontFamily: fonts.semibold,
    fontSize: 16.5,
    lineHeight: 23,
    letterSpacing: -0.1,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: space(4),
  },

  meta: {
    fontFamily: fonts.semibold,
    fontSize: 12.5,
    fontWeight: "400",
    flexShrink: 1,
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    marginHorizontal: space(1.75),
  },

  spacer: {
    flex: 1,
    minWidth: space(2),
  },

  hotIcon: {
    marginRight: space(3.5),
  },

  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  footerText: {
    fontFamily: fonts.semibold,
    marginLeft: space(1),
    fontSize: 12.5,
    fontWeight: "500",
  },

  gradient: {
    paddingHorizontal: space(5),
    paddingVertical: space(5),
    flex: 1,
    borderRadius: space(4.5),
  },
});