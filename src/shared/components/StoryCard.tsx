import React, { memo, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { Story } from "../types/story";
import Favicon from "./FavIcon";
import { fonts } from "../constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
const HOT_THRESHOLD = 500;

// 4px baseline grid — every margin/padding below is a multiple of this,
// so spacing reads as a system rather than eyeballed numbers.
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
  const navigation = useNavigation<any>();

  const { colors, isDark } = useTheme();
  const isHot = story.score > HOT_THRESHOLD;

  // Derived values only need recomputing when the story itself changes,
  // not on every parent re-render or theme toggle.
  const domain = useMemo(() => getDomain(story.url), [story.url]);
  const timeAgo = useMemo(() => getTimeAgo(story.time), [story.time]);

  const commentCount = story.descendants ?? 0;

  return (
    <Pressable
      onPress={() => navigation.navigate("ArticleDetail", { story })}
      // Android gets a real ripple instead of a flat opacity fade;
      // iOS falls back to the opacity style below.
      android_ripple={{ color: isDark ? "#2A2A2A" : "#ECECEC" }}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,

          borderColor: isDark ? "#232323" : "#a92727",
          opacity: pressed ? 0.85 : 1,
        },
      ]}
      accessibilityRole="link"
      accessibilityLabel={`${story.title}, ${story.score} points, by ${story.by}, ${timeAgo} ago, ${commentCount} comments${isHot ? ", trending" : ""}`}
      accessibilityHint="Opens the full story"
    >
      <LinearGradient
        colors={["rgba(255,102,0,0.03)", "rgba(255,102,0,0)"]}
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
        </View>

        <Text
          style={[styles.title, { color: colors.text }]}
          numberOfLines={3}
          ellipsizeMode="tail"
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

// Small enough that giving it its own component keeps the JSX above
// readable, and memo means three of these re-rendering costs nothing.
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
    // Ensures the whole row clears the 44pt minimum touch target even
    // if title + footer collapse to a single short line.
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

  title: {
    fontFamily: fonts.semibold,
    fontSize: 16.5,
    fontWeight: "500",
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
