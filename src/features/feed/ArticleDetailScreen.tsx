import { ScrollView, StyleSheet, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { useObserve } from "expo-observe";
import { Story } from "../../shared/types/story";
import { useTheme } from "../../shared/hooks/useTheme";
import StoryDetailsCard from "../../shared/components/StoryDetailsCard";
import DiscussionCard from "../discussion/Discussion";
import SummaryCard from "../../shared/components/SummaryCard";

const ArticleDetailScreen = () => {
  const route = useRoute<any>();
  const { story }: { story: Story } = route.params;
  const { colors } = useTheme();
  const commentCount = story.descendants ?? 0;
  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <StoryDetailsCard story={story} />
          <SummaryCard articleId={story.id} url={story.url} />
          <DiscussionCard storyId={story.id} commentCount={commentCount} />
        </View>
      </ScrollView>
    </View>
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
});
