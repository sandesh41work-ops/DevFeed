import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import Button from "../../shared/components/Button";
import { Story } from "../../shared/types/story";

const ArticleDetailScreen = () => {
    const route = useRoute<any>();
    const { story }: { story: Story } = route.params;

    const publishedDate = new Date(story.time * 1000);

    const openURL = () => {
        if (story.url) {
            Linking.openURL(story.url);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>{story.title}</Text>

                <Text style={styles.author}>By {story.by}</Text>

                <Text style={styles.date}>{publishedDate.toLocaleString()}</Text>

                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{story.score}</Text>
                        <Text style={styles.statLabel}>Points</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statValue}>{story.descendants ?? 0}</Text>
                        <Text style={styles.statLabel}>Comments</Text>
                    </View>
                </View>

                <View style={styles.typeContainer}>
                    <Text style={styles.typeText}>Type: {story.type}</Text>
                </View>

                {story.url && <Button title="Read Full Article" onPress={openURL} />}
            </View>
        </View>
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
});
