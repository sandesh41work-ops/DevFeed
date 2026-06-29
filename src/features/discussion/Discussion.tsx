import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../../shared/hooks/useTheme";
import DiscussionCard from "../../shared/components/DiscussionCard";
import { getStory } from "../../shared/services/hackerNewsServices";
import { useQuery } from "@tanstack/react-query";
import { TouchableOpacity } from "react-native";
import { Comment } from "../../shared/types/comment";
import CommentItem from "./CommentItem";
import { Ionicons } from "@expo/vector-icons";
type DiscussionProps = {
  storyId: number;
  commentCount: number;
};

const Discussion = ({ storyId, commentCount }: DiscussionProps) => {
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  const { colors } = useTheme();

  const { data: story, isLoading: isStoryLoading } = useQuery({
    queryKey: ["story", storyId],
    queryFn: () => getStory(storyId),
    enabled: expanded,
  });

  const allCommentIds = story?.kids ?? [];

  useEffect(() => {
    if (!expanded) {
      setComments([]);
      setVisibleCount(10);
      return;
    }

    if (!story) {
      return;
    }

    const nextIds = allCommentIds.slice(comments.length, visibleCount);
    if (nextIds.length === 0) {
      return;
    }

    let isCanceled = false;
    setIsCommentsLoading(true);

    Promise.all(nextIds.map(getStory))
      .then((newComments) => {
        if (!isCanceled) {
          setComments((prev) => [...prev, ...newComments]);
        }
      })
      .catch(() => {
        if (!isCanceled) {
          setComments((prev) => prev);
        }
      })
      .finally(() => {
        if (!isCanceled) {
          setIsCommentsLoading(false);
        }
      });

    return () => {
      isCanceled = true;
    };
  }, [expanded, story, visibleCount, allCommentIds.length, comments.length]);

  const handleOpenDiscussion = () => {
    setExpanded(true);
  };

  const isInitialLoading = isStoryLoading || (isCommentsLoading && comments.length === 0);

  if (!expanded) {
    return (
      <DiscussionCard
        commentCount={commentCount}
        onPress={handleOpenDiscussion}
      />
    );
  }

  if (isInitialLoading) {
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
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: colors.text }]}>
            Discussion ({commentCount})
          </Text>

          <TouchableOpacity style={styles.sortButton}>
            <Ionicons
              name="swap-vertical"
              size={14}
              color={colors.subtext}
            />
            <Text style={[styles.sortText, { color: colors.subtext }]}>Top</Text>
          </TouchableOpacity>
        </View>
      </View>

      {comments.map((comment: Comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}

      {isCommentsLoading && comments.length > 0 && (
        <View style={styles.loadingMore}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.subtext }]}>Loading more comments…</Text>
        </View>
      )}

      {comments.length < allCommentIds.length && (
        <TouchableOpacity
          onPress={() => setVisibleCount((prev) => prev + 10)}
          disabled={isCommentsLoading}
          style={isCommentsLoading ? styles.disabledButton : undefined}
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
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  sortIcon: {
    fontSize: 14,
  },

  sortText: {
    fontSize: 12,
    fontWeight: "600",
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

  loadingMore: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  loadingText: {
    fontSize: 14,
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

  disabledButton: {
    opacity: 0.5,
  },
});
