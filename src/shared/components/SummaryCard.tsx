import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";

type Props = {
    onPress: () => void;
};

const SummaryCard = ({ onPress }: Props) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[
                styles.card,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                },
            ]}
        >
            <View style={styles.content}>
                <View
                    style={[
                        styles.iconContainer,
                        { backgroundColor: colors.accent + "20" },
                    ]}
                >
                    <Ionicons
                        name="sparkles-outline"
                        size={22}
                        color={colors.accent}
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: colors.text }]}>
                        AI Summary
                    </Text>

                    <Text style={[styles.subtitle, { color: colors.subtext }]}>
                        Generate a concise 5-point summary of this article.
                    </Text>
                </View>

                <Ionicons
                    name="chevron-forward"
                    size={22}
                    color={colors.subtext}
                />
            </View>
        </TouchableOpacity>
    );
};

export default SummaryCard;

const styles = StyleSheet.create({
    card: {
        marginTop: 16,
        borderRadius: 16,
        borderWidth: 1,
        padding: 16,
    },

    content: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconContainer: {
        width: 46,
        height: 46,
        borderRadius: 23,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 14,
    },

    textContainer: {
        flex: 1,
    },

    title: {
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 4,
    },

    subtitle: {
        fontSize: 14,
        lineHeight: 20,
    },
});