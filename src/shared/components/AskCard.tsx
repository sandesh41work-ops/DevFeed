import React, { memo, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { Story } from "../types/story";
import { RootStackParamList } from "../types/navigation";
import { fonts } from "../constants/fonts";
import { LinearGradient } from "expo-linear-gradient";
import { isStoryVisited, markVisitedStory } from "../services/visitedStories";

const space = (n: number) => n * 4;

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

    navigation.navigate("ArticleDetail", { story });
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
          borderColor: isDark ? "#232323" : "#E5E5E5",
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
      accessibilityLabel={`${visited ? "Read" : "Unread"} Ask HN post: ${
        story.title
      }, by ${story.by}, ${timeAgo} ago, ${commentCount} comments`}
      accessibilityHint="Opens the discussion"
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
              size={13}
              color={colors.accent ?? "#FF6600"}
            />

            <Text
              style={[
                styles.askBadgeText,
                {
                  color: colors.accent ?? "#FF6600",
                },
              ]}
            >
              ASK HN
            </Text>
          </View>

          {!visited && (
            <View style={styles.unreadBadge}>
              <View style={styles.unreadDot} />

              <Text style={styles.unreadText}>New</Text>
            </View>
          )}
        </View>

        {/* Question */}
        <Text
          style={[
            styles.title,
            {
              color: visited ? colors.subtext : colors.text,
              fontWeight: visited ? "400" : "600",
            },
          ]}
          numberOfLines={3}
        >
          {story.title}
        </Text>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.authorSection}>
            <Text
              style={[styles.meta, { color: colors.subtext }]}
              numberOfLines={1}
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
              size={14}
              color={colors.accent ?? "#FF6600"}
              accessibilityElementsHidden
              importantForAccessibility="no"
            />

            <Text
              style={[
                styles.commentText,
                {
                  color: colors.accent ?? "#FF6600",
                },
              ]}
            >
              {commentCount}
            </Text>
          </View>
        </View>
      </LinearGradient>
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
    marginHorizontal: space(4),
    marginBottom: space(3),
    borderRadius: space(4.5),
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    minHeight: 55,
  },

  gradient: {
    paddingHorizontal: space(5),
    paddingVertical: space(5),
    flex: 1,
    borderRadius: space(4.5),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: space(2.5),
  },

  askBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: space(1),
    paddingHorizontal: space(2),
    paddingVertical: space(1),
    borderRadius: space(3),
  },

  askBadgeText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.7,
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
    fontSize: 17,
    lineHeight: 25,
    letterSpacing: -0.2,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: space(4),
  },

  authorSection: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
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

  commentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: space(1),
    paddingHorizontal: space(2),
    paddingVertical: space(1),
    borderRadius: 999,
  },

  commentText: {
    fontFamily: fonts.semibold,
    fontSize: 12.5,
    fontWeight: "600",
  },
});
