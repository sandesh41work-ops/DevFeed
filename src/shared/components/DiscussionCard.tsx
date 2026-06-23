import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../shared/hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
type DiscussionCardProps = {
  commentCount: number;
  onPress: () => void;
};

const DiscussionCard = ({ commentCount, onPress }: DiscussionCardProps) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons
            name="chatbubbles-outline"
            size={24}
            color={colors.accent}
          />

          <View>
            <Text style={[styles.title, { color: colors.text }]}>
              Discussion
            </Text>

            <Text style={[styles.count, { color: colors.subtext }]}>
              {commentCount} comments
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
      </View>

      <Text style={[styles.description, { color: colors.subtext }]}>
        Explore insights, opinions, and discussions from the Hacker News
        community.
      </Text>
    </Pressable>
  );
};

export default DiscussionCard;

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  icon: {
    fontSize: 24,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  count: {
    marginTop: 2,
    fontSize: 14,
  },

  chevron: {
    fontSize: 20,
    fontWeight: "600",
  },

  description: {
    marginTop: 16,
    fontSize: 14,
    lineHeight: 22,
  },

  button: {
    marginTop: 20,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
