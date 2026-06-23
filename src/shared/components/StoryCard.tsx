import React, { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { Story } from "../types/story";
import Favicon from "./FavIcon";

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
  const now = Math.floor(Date.now() / 1000);
  const diff = now - unixTime;
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const StoryCard = memo(({ story }: { story: Story }) => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          shadowColor: isDark ? "#000" : "#000",
        },
      ]}
      onPress={() => navigation.navigate("ArticleDetail", { story })}
    >
      <View style={styles.header}>
        <Favicon url={story.url} />

        <View style={styles.headerContent}>
          <Text
            style={[
              styles.title,
              {
                color: colors.text,
              },
            ]}
            numberOfLines={3}
          >
            {story.title}
          </Text>

          <Text
            style={[
              styles.domain,
              {
                color: colors.subtext,
              },
            ]}
          >
            {getDomain(story.url)}
          </Text>
        </View>
      </View>

      <View style={styles.badgeContainer}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: isDark ? "#333333" : "#F3F4F6",
            },
          ]}
        >
          <View style={styles.badgeContent}>
            <Ionicons name="thumbs-up-outline" size={14} color={colors.text} />
            <Text style={[styles.badgeText, { color: colors.text }]}>
              {story.score}
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.badge,
            {
              backgroundColor: isDark ? "#333333" : "#F3F4F6",
            },
          ]}
        >
          <View style={styles.badgeContent}>
            <Ionicons name="chatbubble-outline" size={14} color={colors.text} />
            <Text style={[styles.badgeText, { color: colors.text }]}>
              {story.descendants ?? 0}
            </Text>
          </View>
        </View>

        {story.score > 500 && (
          <View style={styles.trendingBadge}>
            <Ionicons name="flame" size={14} color="#92400E" />
            <Text style={styles.trendingText}>Trending</Text>
          </View>
        )}
      </View>

      <Text
        style={[
          styles.meta,
          {
            color: colors.subtext,
          },
        ]}
      >
        {story.by} • {getTimeAgo(story.time)}
      </Text>
    </TouchableOpacity>
  );
});

export default StoryCard;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 18,

    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 4,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  headerContent: {
    flex: 1,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 24,
  },

  domain: {
    marginTop: 6,
    fontSize: 13,
  },

  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    flexWrap: "wrap",
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  trendingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },

  meta: {
    marginTop: 14,
    fontSize: 13,
  },
  badgeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  trendingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
});
