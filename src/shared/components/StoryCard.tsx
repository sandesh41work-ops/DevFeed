import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Story } from "../types/story";
import React from "react";
import { useNavigation } from "@react-navigation/native";


import Favicon from "./FavIcon";
const StoryCard = React.memo(({ story }: { story: Story }) => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={() => navigation.navigate("ArticleDetail", { story })}
    >
      <View style={styles.header}>
        <Favicon url={story.url} />

        <View style={styles.headerContent}>
          <Text style={styles.title}>{story.title}</Text>
          <Text style={styles.domain}>{story.url}</Text>
        </View>
      </View>
      <Text style={styles.meta}>
        {story.by} • {story.time}
      </Text>
    </TouchableOpacity>
  );
});

export default StoryCard;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  favicon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    marginRight: 12,
  },

  headerContent: {
    flex: 1,
  },
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
  badge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,

    elevation: 2,
    marginRight: 8,
  },
  fallbackIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  fallbackText: {
    fontSize: 18,
  },
});
