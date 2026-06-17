import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import Button from "../../shared/components/Button";
import { Story } from "../../shared/types/story";
import { useTheme } from "../../shared/hooks/useTheme";
import { useEffect, useState } from "react";
import {
  addBookmark,
  isBookmarked,
  removeBookmark,
} from "../../shared/services/bookmarkService";
import Discussion from "../discussion/Discussion";
const ArticleDetailScreen = () => {
  const [bookmarked, setBookmarked] = useState(false);
  const route = useRoute<any>();
  const { story }: { story: Story } = route.params;

  const publishedDate = new Date(story.time * 1000);
  const { colors } = useTheme();
  const openURL = () => {
    if (story.url) {
      Linking.openURL(story.url);
    }
  };

  useEffect(() => {
    isBookmarked(story.id).then(setBookmarked);
  }, []);


  const toggleBookmark = async () => {
    if (bookmarked) {
      await removeBookmark(story.id);
    } else {
      await addBookmark(story);
    }
    setBookmarked(!bookmarked);
  };
  return (
    <ScrollView>

      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card },
            {
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            {story.title}
          </Text>

          <Text style={[styles.author, { color: colors.subtext }]}>
            By {story.by}
          </Text>

          <Text style={[styles.date, { color: colors.subtext }]}>
            {publishedDate.toLocaleString()}
          </Text>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.accent }]}>
                {story.score}
              </Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>
                Points
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.border }]}>
              <Text style={[styles.statValue, { color: colors.accent }]}>
                {story.descendants ?? 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.subtext }]}>
                Comments
              </Text>
            </View>
          </View>

          <View style={styles.typeContainer}>
            <Text style={[styles.typeText, { color: colors.text }]}>
              Type: {story.type}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            {story.url && (
              <Button
                style={styles.actionButton}
                title="Read Article"
                onPress={openURL}
              />
            )}

            <Button
              style={[{
                padding: 10,
                margin: 10,
                width: "auto",
                backgroundColor: bookmarked ? "#EF4444" : colors.accent,
              }, styles.actionButton]}
              title={bookmarked ? "Remove" : "Bookmark"}
              onPress={toggleBookmark}
            />
          </View>
        </View>

        <Discussion>

        </Discussion>
      </View>
      
    </ScrollView>

  );
};

export default ArticleDetailScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F4F4F4",
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 12,
  },
  author: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FF6600", // Hacker News orange
  },
  statLabel: {
    marginTop: 4,
    color: "#666",
  },
  typeContainer: {
    marginBottom: 20,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },

  actionButton: {
    flex: 1,
  },
});
