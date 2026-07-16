import { ScrollView, StyleSheet, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Story } from "../../shared/types/story";
import { useTheme } from "../../shared/hooks/useTheme";
import StoryDetailsCard from "../../shared/components/StoryDetailsCard";
import DiscussionCard from "../discussion/Discussion";
import SummaryCard from "../../shared/components/SummaryCard";
import Discussion from "../discussion/Discussion";

const ArticleDetailScreen = () => {
  const route = useRoute<any>();
  const { story }: { story: Story } = route.params;
  const { colors } = useTheme();
  const commentCount = story.descendants ?? 0;

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StoryDetailsCard story={story} />
        <SummaryCard articleId={story.id} url={story.url} />
        <DiscussionCard storyId={story.id} commentCount={commentCount} />
      </View>
    </ScrollView>
  );
};

export default ArticleDetailScreen;

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  container: {
    flex: 1,
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
    color: "#FF6600", 
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
 