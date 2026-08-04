import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { FEEDS } from "../types/feed";
import { useTheme } from "../hooks/useTheme";
import { fonts } from "../constants/fonts";
type Feed = (typeof FEEDS)[number]["id"];

type FeedSelectorProps = {
  selectedFeed: Feed;
  onFeedChange: (feed: Feed) => void;
};

const FeedSelector = ({ selectedFeed, onFeedChange }: FeedSelectorProps) => {
  const { colors } = useTheme();
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[
          styles.contentContainer,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        {FEEDS.map((feed) => {
          const isSelected = selectedFeed === feed.id;

          return (
            <Pressable
              key={feed.id}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => onFeedChange(feed.id)}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.accent : colors.card,

                  borderColor: isSelected ? colors.accent : colors.border,

                  opacity: pressed ? 0.8 : 1,

                  transform: [
                    {
                      scale: pressed ? 0.97 : 1,
                    },
                  ],
                },
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  {
                    color: isSelected ? "#FFFFFF" : colors.text,
                  },
                ]}
              >
                {feed.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default React.memo(FeedSelector);

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    marginBottom: 1,
  },

  contentContainer: {
    paddingHorizontal: 15,
    paddingBottom: 5,
    paddingTop :1,
    gap: 7,
  },

  chip: {
    paddingHorizontal: 23,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },

  chipText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: fonts.semibold,
    letterSpacing: 1,
  },
});
