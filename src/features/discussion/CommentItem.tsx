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
};

const CommentItem = ({ comment, onRepliesPress , level = 0}: CommentItemProps) => {
    const [expanded, setExpanded] = useState(false);
    const { colors } = useTheme();
    const childIds = comment.kids ?? [];

    const { data: childComments = [], isLoading } = useCommentsQuery(
        expanded ? childIds : [],
    );

    return (
        <View style={styles.comment}>
            <Text style={[styles.author, { color: colors.text }]}>
                {comment.by ?? "Unknown"}
            </Text>

            <CommentHtml html={comment.text ?? "No comment text available"} />

            {!!comment.kids?.length && (
                <TouchableOpacity onPress={() => setExpanded((prev) => !prev)}>
                    <Text style={[styles.replyCount, { color: colors.accent }]}>
                        {expanded ? "Hide Replies" : `💬 ${childIds.length} replies`}
                    </Text>
                </TouchableOpacity>
            )}
            {expanded && (
                <View style={{ marginLeft: 16 }}>
                    {isLoading ? (
                        <ActivityIndicator />
                    ) : (
                        childComments.map(child => (
                            <CommentItem
                                key={child.id}
                                comment={child}
                                level={(level ?? 0) + 1}
                            />
                        ))
                    )}
                </View>
            )}
        </View>
    );
};

export default CommentItem;

const styles = StyleSheet.create({
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

    replyCount: {
        marginTop: 8,
        fontWeight: "600",
    },
});
