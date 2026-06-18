import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTheme } from "../../shared/hooks/useTheme";

type DiscussionCardProps = {
  commentCount: number;
  onPress: () => void;
};

const DiscussionCard = ({
  commentCount,
  onPress,
}: DiscussionCardProps) => {
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.icon,
              { color: colors.accent },
            ]}
          >
            💬
          </Text>

          <View>
            <Text
              style={[
                styles.title,
                { color: colors.text },
              ]}
            >
              Discussion
            </Text>

            <Text
              style={[
                styles.count,
                { color: colors.subtext },
              ]}
            >
              {commentCount} comments
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.chevron,
            { color: colors.subtext },
          ]}
        >
          ↓
        </Text>
      </View>

      <Text
        style={[
          styles.description,
          { color: colors.subtext },
        ]}
      >
        Explore insights, opinions, and
        discussions from the Hacker News
        community.
      </Text>

      <View
        style={[
          styles.button,
          {
            backgroundColor: colors.accent,
          },
        ]}
      >
        <Text style={styles.buttonText}>
          View Discussion
        </Text>
      </View>
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