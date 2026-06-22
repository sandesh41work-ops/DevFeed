import { Linking, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import Button from "./Button";
import { Story } from "../types/story";
import { useTheme } from "../hooks/useTheme";
import {
    addBookmark,
    isBookmarked,
    removeBookmark,
} from "../services/bookmarkService";

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

    const openURL = () => {
        if (story.url) {
            Linking.openURL(story.url);
        }
    };

    const toggleBookmark = async () => {
        if (bookmarked) {
            await removeBookmark(story.id);
        } else {
            await addBookmark(story);
        }

        setBookmarked(!bookmarked);
    };

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.card,
                    borderWidth: 1,
                    borderColor: colors.border,
                },
            ]}
        >
            <Text style={[styles.title, { color: colors.text }]}>{story.title}</Text>

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

            <View style={[styles.actionRow, { borderTopColor: colors.border, borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.actionItem}>
                    <Text style={[styles.actionText, { color: colors.text }]}>🔖</Text>
                    <Text style={[styles.actionLabel, { color: colors.text }]}>Save</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem}>
                    <Text style={[styles.actionText, { color: colors.text }]}>↗️</Text>
                    <Text style={[styles.actionLabel, { color: colors.text }]}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionItem}>
                    <Text style={[styles.actionText, { color: colors.text }]}>🔗</Text>
                    <Text style={[styles.actionLabel, { color: colors.text }]}>Open</Text>
                </TouchableOpacity>
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
                    style={[
                        styles.actionButton,
                        {
                            padding: 10,
                            margin: 10,
                            width: "auto",
                            backgroundColor: bookmarked ? "#EF4444" : colors.accent,
                        },
                    ]}
                    title={bookmarked ? "Remove" : "Bookmark"}
                    onPress={toggleBookmark}
                />
            </View>
        </View>
    );
};

export default StoryDetailsCard;

const styles = StyleSheet.create({
    card: {
        borderRadius: 16,
        padding: 20,
        elevation: 3,
    },

    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 12,
    },

    author: {
        fontSize: 16,
        marginBottom: 4,
    },

    date: {
        fontSize: 14,
        marginBottom: 20,
    },

    statsRow: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 20,
    },

    statCard: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: "center",
    },

    statValue: {
        fontSize: 22,
        fontWeight: "700",
    },

    statLabel: {
        marginTop: 4,
    },

    actionRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 12,
        marginVertical: 12,
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },

    actionItem: {
        alignItems: "center",
        gap: 4,
    },

    actionText: {
        fontSize: 18,
    },

    actionLabel: {
        fontSize: 12,
        fontWeight: "600",
    },

    typeContainer: {
        marginBottom: 20,
    },

    typeText: {
        fontSize: 14,
        fontWeight: "600",
    },

    buttonRow: {
        flexDirection: "row",
        gap: 12,
    },

    actionButton: {
        flex: 1,
    },
});
