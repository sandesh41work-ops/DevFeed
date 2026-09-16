import { TouchableOpacity, StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { fonts } from "../../shared/constants/fonts";
import { Comment } from "../../shared/types/comment";
import CommentHtml from "../../shared/components/Comment";
import { useTheme } from "../../shared/hooks/useTheme";
import { useState, memo } from "react";
import { useCommentsQuery } from "./useCommentQuery";
import { Ionicons } from "@expo/vector-icons";

type CommentItemProps = {
  comment: Comment;
  onRepliesPress?: (comment: Comment) => void;
  level?: number;
  isAuthor?: boolean;
};

const getTimeAgo = (timestamp?: number) => {
  if (!timestamp) return "unknown";
  const now = Date.now() / 1000;
  const diff = Math.floor(now - timestamp);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return `${Math.floor(diff / 2592000)}mo ago`;
};

const getInitials = (name?: string) => {
  if (!name) return "?";
  return name.substring(0, 2).toUpperCase();
};

const CommentItem = ({
  comment,
  level = 0,
  isAuthor = false,
}: CommentItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const { colors, isDark } = useTheme();
  const childIds = comment.kids ?? [];
  const commentCount = childIds.length;

  const { data: childComments = [], isLoading } = useCommentsQuery(
    expanded ? childIds : [],
  );

  const isNested = level > 0;
  const isDeep = level >= 3;

  return (
    <View
      style={[
        styles.commentWrapper,
        !isNested && styles.rootCommentWrapper,
        !isNested && { borderBottomColor: colors.border },
      ]}
    >
      <View style={styles.commentContentBlock}>
        {/* Comment Header */}
        <View style={styles.commentHeader}>
          <View
            style={[
              styles.avatar,
              isNested && styles.nestedAvatar,
              { backgroundColor: colors.accent },
            ]}
          >
            <Text
              style={[
                styles.avatarText,
                isNested && styles.nestedAvatarText,
              ]}
            >
              {getInitials(comment.by)}
            </Text>
          </View>

          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text
                style={[
                  styles.author,
                  { color: colors.text },
                  isNested && styles.nestedAuthor,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {comment.by ?? "Unknown"}
              </Text>
              {isAuthor && (
                <View
                  style={[
                    styles.authorBadge,
                    { backgroundColor: colors.accent },
                  ]}
                >
                  <Text style={styles.authorBadgeText}>AUTHOR</Text>
                </View>
              )}
              <View
                style={[
                  styles.dot,
                  { backgroundColor: isDark ? "#444" : "#CCC" },
                ]}
              />
              <Text style={[styles.timestamp, { color: colors.subtext }]}>
                {getTimeAgo(comment.time)}
              </Text>
            </View>
          </View>
        </View>

        {/* Comment Body */}
        <View style={styles.commentContent}>
          <CommentHtml html={comment.text ?? "No comment text available"} />
        </View>

        {/* Comment Actions - Only rendered if replies exist */}
        {commentCount > 0 && (
          <View style={styles.commentFooter}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setExpanded((prev) => !prev)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel={
                expanded ? "Hide replies" : `View ${commentCount} replies`
              }
            >
              <Ionicons
                name={expanded ? "chevron-up" : "chatbubble-outline"}
                size={13}
                color={colors.accent}
              />
              <Text style={[styles.actionText, { color: colors.accent }]}>
                {expanded
                  ? "Hide replies"
                  : `${commentCount} ${commentCount === 1 ? "reply" : "replies"}`}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Flattened Thread Replies with subtle vertical guide line */}
      {expanded && (
        <View
          style={[
            styles.repliesContainer,
            isDeep && styles.deepRepliesContainer,
            {
              borderLeftColor: isDark ? "#383838" : "#E2E8F0",
            },
          ]}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.accent} />
            </View>
          ) : (
            <>
              {childComments.map((child) => (
                <CommentItem
                  key={child.id}
                  comment={child}
                  level={level + 1}
                />
              ))}
              {commentCount > childComments.length && (
                <TouchableOpacity style={styles.viewMoreButton}>
                  <Text style={[styles.viewMoreText, { color: colors.accent }]}>
                    View {commentCount - childComments.length} more replies
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default memo(CommentItem);

const styles = StyleSheet.create({
  commentWrapper: {
    width: "100%",
  },

  rootCommentWrapper: {
    paddingBottom: 14,
    marginBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  commentContentBlock: {
    width: "100%",
  },

  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
  },

  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  nestedAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },

  avatarText: {
    color: "#fff",
    fontSize: 11,
    fontFamily: fonts.mono,
  },

  nestedAvatarText: {
    fontSize: 9,
  },

  headerInfo: {
    flex: 1,
  },

  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },

  author: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    maxWidth: 160,
  },

  nestedAuthor: {
    fontSize: 13,
  },

  authorBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1.5,
    borderRadius: 3,
  },

  authorBadgeText: {
    color: "#fff",
    fontFamily: fonts.semibold,
    fontSize: 9,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },

  timestamp: {
    fontFamily: fonts.regular,
    fontSize: 12,
  },

  commentContent: {
    marginTop: 2,
    marginBottom: 4,
    width: "100%",
  },

  commentFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 4,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 4,
    paddingRight: 8,
  },

  actionText: {
    fontFamily: fonts.semibold,
    fontSize: 12.5,
  },

  repliesContainer: {
    marginTop: 8,
    marginLeft: 6,
    paddingLeft: 12,
    borderLeftWidth: 1.5,
    gap: 10,
  },

  deepRepliesContainer: {
    marginLeft: 2,
    paddingLeft: 8,
  },

  loadingContainer: {
    paddingVertical: 12,
    alignItems: "flex-start",
  },

  viewMoreButton: {
    paddingVertical: 6,
    marginTop: 4,
  },

  viewMoreText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
});
