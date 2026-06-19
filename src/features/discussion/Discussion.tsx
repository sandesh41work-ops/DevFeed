import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../../shared/hooks/useTheme";
import DiscussionCard from "../../shared/components/DiscussionCard";
import { useCommentsQuery } from "./useCommentQuery";
import { getStory } from "../../shared/services/api";
import { useQuery } from "@tanstack/react-query";
import { TouchableOpacity } from "react-native";
import { Comment } from "../../shared/types/comment";
import CommentItem from "./CommentItem";
type DiscussionProps = {
  storyId: number;
  commentCount: number;
};

const Discussion = ({ storyId, commentCount }: DiscussionProps) => {
  const [expanded, setExpanded] = useState(false);

  const { colors } = useTheme();
  const [visibleCount, setVisibleCount] = useState(10);

  const { data: story, isLoading: isStoryLoading } = useQuery({
    queryKey: ["story", storyId],
    queryFn: () => getStory(storyId),
    enabled: expanded,
  });

  const allCommentIds = story?.kids ?? [];
  const commentIds = allCommentIds.slice(0, visibleCount);
  const { data: comments = [], isLoading: isCommentsLoading } =
    useCommentsQuery(commentIds);


  const handleOpenDiscussion = () => {
    setExpanded(true);
  };

  if (!expanded) {
    return (
      <DiscussionCard
        commentCount={commentCount}
        onPress={handleOpenDiscussion}
      />
    );
  }
  if (isStoryLoading || isCommentsLoading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          💬 Discussion
        </Text>

        <Text style={[styles.count, { color: colors.subtext }]}>
          {commentCount} comments
        </Text>
      </View>

      {comments.map((comment: Comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}

      {visibleCount < allCommentIds.length && (
        <TouchableOpacity
          onPress={() => setVisibleCount(prev => prev + 10)}
        >
          <Text
            style={[
              styles.placeholder,
              { color: colors.accent }
            ]}
          >
            Load More Comments
          </Text>
        </TouchableOpacity> 
      )}
    </View>
  );
};

export default Discussion;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  count: {
    marginTop: 4,
    fontSize: 14,
  },

  comment: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  author: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
  },

  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },

  replyCount: {
    marginTop: 8,
    fontWeight: "600",
  },

  placeholder: {
    marginTop: 8,
    fontWeight: "600",
    textAlign: "center",
  },
});
