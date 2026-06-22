import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { Comment } from "../../shared/types/comment";
import CommentHtml from "../../shared/components/Comment";
import { useTheme } from "../../shared/hooks/useTheme";
import { useState } from "react";
import { useCommentsQuery } from "./useCommentQuery";
import { ActivityIndicator } from "react-native";

type CommentItemProps = {
  
    comment: Comment;
    onRepliesPress?: (comment: Comment) => void;
    level?: number;
    isAuthor?: boolean;
};

const CommentItem = ({ comment, onRepliesPress , level = 0, isAuthor = false}: CommentItemProps) => {
    const [expanded, setExpanded] = useState(false);
    const { colors } = useTheme();
    const childIds = comment.kids ?? [];
    const commentCount = childIds.length;

    const { data: childComments = [], isLoading } = useCommentsQuery(
        expanded ? childIds : [],
    );

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

    return (
        <View style={[styles.commentWrapper, level > 0 && { marginLeft: 12 }]}>
            {level > 0 && <View style={[styles.threadLine, { backgroundColor: colors.border }]} />}

            <View style={styles.comment}>
                <View style={styles.commentHeader}>
                    <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
                        <Text style={styles.avatarText}>{getInitials(comment.by)}</Text>
                    </View>

                    <View style={styles.headerContent}>
                        <View style={styles.nameRow}>
                            <Text style={[styles.author, { color: colors.text }]}>
                                {comment.by ?? "Unknown"}
                            </Text>
                            {isAuthor && (
                                <View style={[styles.authorBadge, { backgroundColor: colors.accent }]}>
                                    <Text style={styles.authorBadgeText}>AUTHOR</Text>
                                </View>
                            )}
                        </View>
                        <Text style={[styles.timestamp, { color: colors.subtext }]}>
                            {getTimeAgo(comment.time)}
                        </Text>
                    </View>
                </View>

                <View style={styles.commentContent}>
                    <CommentHtml html={comment.text ?? "No comment text available"} />
                </View>

                <View style={styles.commentFooter}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Text style={[styles.actionIcon, { color: colors.accent }]}>👍</Text>
                        <Text style={[styles.actionCount, { color: colors.accent }]}>12</Text>
                    </TouchableOpacity>

                    {!!commentCount && (
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => setExpanded((prev) => !prev)}
                        >
                            <Text style={[styles.actionText, { color: colors.accent }]}>
                                {expanded ? "Hide Replies" : `💬 Reply`}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>

                {expanded && (
                    <View style={[styles.repliesContainer, { borderLeftColor: colors.border }]}>
                        {isLoading ? (
                            <ActivityIndicator color={colors.accent} />
                        ) : commentCount > 0 ? (
                            <>
                                {childComments.map(child => (
                                    <CommentItem
                                        key={child.id}
                                        comment={child}
                                        level={(level ?? 0) + 1}
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
                        ) : null}
                    </View>
                )}
            </View>
        </View>
    );
};

export default CommentItem;

const styles = StyleSheet.create({
    commentWrapper: {
        marginBottom: 16,
        position: "relative",
    },

    threadLine: {
        position: "absolute",
        left: 20,
        top: 44,
        bottom: 0,
        width: 2,
    },

    comment: {
        marginBottom: 8,
        paddingBottom: 8,
    },

    commentHeader: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
        marginBottom: 8,
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },

    avatarText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 12,
    },

    headerContent: {
        flex: 1,
    },

    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    author: {
        fontSize: 14,
        fontWeight: "700",
    },

    authorBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },

    authorBadgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "700",
    },

    timestamp: {
        fontSize: 12,
        marginTop: 2,
    },

    commentContent: {
        marginLeft: 46,
        marginBottom: 8,
    },

    commentFooter: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginLeft: 46,
    },

    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },

    actionIcon: {
        fontSize: 16,
    },

    actionCount: {
        fontSize: 12,
        fontWeight: "600",
    },

    actionText: {
        fontSize: 12,
        fontWeight: "600",
    },

    repliesContainer: {
        marginTop: 12,
        marginLeft: 12,
        paddingLeft: 12,
        borderLeftWidth: 2,
    },

    viewMoreButton: {
        paddingVertical: 8,
        marginTop: 8,
    },

    viewMoreText: {
        fontSize: 12,
        fontWeight: "600",
    },
});
