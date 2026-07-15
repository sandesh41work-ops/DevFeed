import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Button from "./Button";
import { Story } from "../types/story";
import { useTheme } from "../hooks/useTheme";
import {
  addBookmark,
  isBookmarked,
  removeBookmark,
} from "../services/bookmarkService";
import { Ionicons } from "@expo/vector-icons";
import { Share } from "react-native";
type Props = {
  story: Story;
};

const StoryDetailsCard = ({ story }: Props) => {
  const [bookmarked, setBookmarked] = useState(false);
  const { colors } = useTheme();

  const publishedDate = new Date(story.time * 1000);

  useEffect(() => {
    isBookmarked(story.id).then(setBookmarked);
  }, [story.id]);

  const navigation = useNavigation<any>();
  const openArticle = useCallback(() => {
    if (story.url) {
      navigation.navigate("ArticleWebView", {
        url: story.url,
        title: story.title,
      });
    }
  }, [navigation, story.title, story.url]);
  const toggleBookmark = async () => {
    const next = !bookmarked;

    setBookmarked(next);

    try {
      if (next) {
        await addBookmark(story);
      } else {
        await removeBookmark(story.id);
      }
    } catch {
      setBookmarked(!next);
    }
  };

  const shareStory = async () => {
    await Share.share({
      title: story.title,
      message: story.url ?? story.title,
    });
  };
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Title */}

      <Text style={[styles.title, { color: colors.text }]}>{story.title}</Text>

      {/* Source */}

      <Text style={[styles.domain, { color: colors.subtext }]}>
        {story.url
          ? new URL(story.url).hostname.replace("www.", "")
          : "news.ycombinator.com"}
      </Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="arrow-up-outline" size={16} color={colors.accent} />

            <Text style={[styles.statValue, { color: colors.text }]}>
              {story.score} Points
            </Text>
          </View>
        </View>

        <View style={[styles.infoRow, { marginTop: 18 }]}>
          <View style={styles.infoItem}>
            <Ionicons name="person-outline" size={16} color={colors.accent} />

            <Text style={[styles.infoText, { color: colors.subtext }]}>
              Published by{" "}
              <Text style={[styles.authorName, { color: colors.text }]}>
                {story.by}
              </Text>{" "}
              on{" "}
              <Text style={[styles.authorName, { color: colors.text }]}>
                {publishedDate.toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </Text>
          </View>
        </View>
      </View>
      <Button
        title="Read Article"
        onPress={openArticle}
        style={styles.readButton}
        textStyle={styles.readButtonText}
      />

      <View
        style={[
          styles.divider,
          {
            backgroundColor: colors.border,
          },
        ]}
      />

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { width: "50%", justifyContent: "center" },
          ]}
          onPress={toggleBookmark}
        >
          <Ionicons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={18}
            color={bookmarked ? "#EF4444" : colors.text}
          />

          <Text
            style={[
              styles.actionText,
              {
                color: bookmarked ? "#EF4444" : colors.text,
              },
            ]}
          >
            {bookmarked ? "Saved" : "Bookmark"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { width: "50%", justifyContent: "center" },
          ]}
          onPress={shareStory}
        >
          <Ionicons name="share-social-outline" size={18} color={colors.text} />

          <Text
            style={[
              styles.actionText,
              {
                color: colors.text,
              },
            ]}
          >
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StoryDetailsCard;
const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
  },

  title: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 21,
    lineHeight: 30,
  },

  domain: {
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 14,
    marginTop: 12,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: 12,
  },

  statsRow: {
    flexDirection: "row",
    marginTop: 22,
    marginBottom: 24,
  },

  stat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 28,
  },

  readButton: {
    backgroundColor: "#FF6600",
    marginTop: 4,
  },

  readButtonText: {
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 16,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },

  actionText: {
    marginLeft: 6,
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 14,
  },

  dateHint: {
    marginLeft: 6,
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 13,
  },

  authorName: {
    fontFamily: "IBMPlexSans_600SemiBold",
  },
  infoContainer: {
    marginVertical: 20,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    marginLeft: 8,
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 14,
  },

  statValue: {
    marginLeft: 8,
    fontFamily: "IBMPlexMono_600SemiBold",
    fontSize: 15,
  },
});
