import React, { memo } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

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

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.card}
      onPress={() => navigation.navigate("ArticleDetail", { story })}
    >
      <View style={styles.header}>
        <Favicon url={story.url} />

        <View style={styles.headerContent}>
          <Text style={styles.title} numberOfLines={3}>
            {story.title}
          </Text>

          <Text style={styles.domain}>
            {getDomain(story.url)}
          </Text>
        </View>
      </View>

      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            ⬆️ {story.score}
          </Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            💬 {story.descendants ?? 0}
          </Text>
        </View>

        {story.score > 500 && (
          <View style={styles.trendingBadge}>
            <Text style={styles.trendingText}>
              🔥 Trending
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.meta}>
        {story.by} • {getTimeAgo(story.time)}
      </Text>
    </TouchableOpacity>
  );
});

export default StoryCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 18,

    shadowColor: "#000",
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
    color: "#111827",
    lineHeight: 24,
  },

  domain: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
  },

  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  badge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,

    marginRight: 8,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },

  trendingBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },

  trendingText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#92400E",
  },

  meta: {
    marginTop: 14,
    fontSize: 13,
    color: "#6B7280",
  },
});