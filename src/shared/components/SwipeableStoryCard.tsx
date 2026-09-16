import { useRef } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import Swipeable, {
  type SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import { Story } from "../types/story";
import StoryCard from "./StoryCard";
import { useTheme } from "../hooks/useTheme";
import { Ionicons } from "@expo/vector-icons";
import { fonts } from "../constants/fonts";

type Props = {
  story: Story;
  onDelete: (id: number) => void;
};

export default function SwipeableStoryCard({ story, onDelete }: Props) {
  const swipeableRef = useRef<SwipeableMethods>(null);
  const { colors } = useTheme();

  const renderRightActions = (
    _progress: unknown,
    _translation: unknown,
    swipeableMethods: SwipeableMethods,
  ) => (
    <TouchableOpacity
      style={[styles.deleteButton, { backgroundColor: colors.error }]}
      onPress={() => {
        swipeableMethods.close();
        onDelete(story.id);
      }}
      accessibilityRole="button"
      accessibilityLabel="Delete bookmark"
    >
      <Ionicons name="trash" size={20} color="#fff" />

      <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
    >
      <StoryCard story={story} />
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    marginVertical: 6,
    borderRadius: 12,
    marginRight: 16,
    gap: 4,
  },
  deleteText: {
    color: "#fff",
    fontFamily: fonts.semibold,
    fontSize: 13,
  },
});
