import { useEffect, useState, memo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../shared/hooks/useTheme";
import { getStory } from "../../shared/services/hackerNewsServices";
import { useQuery } from "@tanstack/react-query";
import { Comment } from "../../shared/types/comment";
import CommentItem from "./CommentItem";
import { Ionicons } from "@expo/vector-icons";

type DiscussionProps = {
  storyId: number;
  commentCount: number;
};

const DiscussionCard = ({ storyId, commentCount }: DiscussionProps) => {
  const [expanded, setExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(10);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isCommentsLoading, setIsCommentsLoading] = useState(false);

  const { colors } = useTheme();

  const rotation = useSharedValue(0);
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

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

  useEffect(() => {
    rotation.value = withSpring(expanded ? 180 : 0, {
      damping: 18,
      stiffness: 180,
    });
  }, [expanded]);

  const toggleDiscussion = () => {
    setExpanded((prev) => !prev);
  };

  const isInitialLoading = isStoryLoading || (isCommentsLoading && comments.length === 0);

  return (
    <Animated.View
      layout={LinearTransition.springify().stiffness(400)}
      exiting={undefined}
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={toggleDiscussion}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}> 
          <View style={styles.headerTop}>
            <View style={styles.titleContainer}>
              <Ionicons
                name="chatbubbles-outline"
                size={24}
                color={colors.accent}
              />

              <View>
                <Text style={[styles.title, { color: colors.text }]}>Discussion</Text>
                <Text style={[styles.count, { color: colors.subtext }]}> 
                  {commentCount} comments
                </Text>
              </View>
            </View>

            <Animated.View style={chevronStyle}>
              <View style={styles.toggleRow}>
              
                <Ionicons
                  name="chevron-down"
                  size={20}
                  color={colors.subtext}
                />
              </View>
            </Animated.View>
          </View>
        </View>
      </TouchableOpacity>

      {!expanded ? (
        <Text style={[styles.description, { color: colors.subtext }]}> 
          Explore insights, opinions, and discussions from the Hacker News community.
        </Text>
      ) : (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={undefined}
          layout={LinearTransition.springify()}
        >
          {isInitialLoading ? (
            <View style={styles.centeredLoading}>
              <ActivityIndicator size="large" color={colors.accent} />
            </View>
          ) : (
            <>
              {comments.map((comment: Comment) => (
                <CommentItem key={comment.id} comment={comment} />
              ))}

              {isCommentsLoading && comments.length > 0 && (
                <View style={styles.loadingMore}>
                  <Text style={[styles.loadingText, { color: colors.subtext }]}>Loading more comments…</Text>
                  <ActivityIndicator size="small" color={colors.accent} />
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
                      { color: colors.accent },
                    ]}
                  >
                    Load More Comments
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default memo(DiscussionCard);

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

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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

  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  toggleText: {
    fontSize: 14,
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

  centeredLoading: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 24,
  },

  description: {
    marginBottom: 16,
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

  disabledButton: {
    opacity: 0.5,
  },
});
