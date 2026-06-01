import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Story } from "../types/story";

const StoryCard = ({ story }: { story: Story }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.card}>
      <Text style={styles.title}>{story.title}</Text>

      <Text style={styles.domain}>{story.url}</Text>

      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>▲ {story.score}</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>💬 {story.descendants ?? 0}</Text>
        </View>
      </View>

      <Text style={styles.meta}>
        {story.by} • {story.time}
      </Text>
    </TouchableOpacity>
  );
};

export default StoryCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 3,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 24,
  },

  domain: {
    marginTop: 8,
    fontSize: 13,
    color: "#6B7280",
  },

  badgeContainer: {
    flexDirection: "row",
    marginTop: 12,
  },

  badge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },

  meta: {
    marginTop: 12,
    fontSize: 13,
    color: "#6B7280",
  },
});
