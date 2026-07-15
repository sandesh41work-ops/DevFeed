import { memo, useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "../hooks/useTheme";
import { useSummaryQuery } from "../../features/summary/useSummaryQuery";

type Props = {
  articleId: number;
  url: string;
};

const SummaryCard = ({ articleId, url }: Props) => {
  const { colors } = useTheme();

  const [expanded, setExpanded] = useState(false);
  const [enabled, setEnabled] = useState(false);

  const rotation = useSharedValue(0);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${rotation.value}deg`,
      },
    ],
  }));

  const { data, isLoading, error, refetch } = useSummaryQuery(articleId, url, {
    enabled,
  });

  useEffect(() => {
    rotation.value = withSpring(expanded ? 180 : 0, {
      damping: 18,
      stiffness: 180,
    });
  }, [expanded]);

  const handlePress = () => {
    if (!enabled) {
      setEnabled(true);
    }

    setExpanded((prev) => !prev);
  };

  const summary = data?.summary;
  const isBulletSummary = Array.isArray(summary);

  return (
    <Animated.View
      layout={LinearTransition.springify().stiffness(400)}
      exiting={undefined}
      style={[
        styles.card,
        {
            overflow: "hidden",
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handlePress}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: colors.accent + "20",
              },
            ]}
          >
            <Ionicons name="sparkles-outline" size={22} color={colors.accent} />
          </View>

          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.heading,
                {
                  color: colors.text,
                },
              ]}
            >
              AI Summary
            </Text>

            <Text
              style={[
                styles.subHeading,
                {
                  color: colors.subtext,
                },
              ]}
            >
              {expanded ? "AI-generated summary" : "Generate a concise summary"}
            </Text>
          </View>
        </View>

        <Animated.View style={chevronStyle}>
          <Ionicons name="chevron-down" size={22} color={colors.subtext} />
        </Animated.View>
      </TouchableOpacity>
      {expanded && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={undefined}
          layout={LinearTransition.springify()}
        >
          {isLoading && (
            <Animated.View
              entering={FadeIn}
              exiting={undefined}
              style={styles.center}
            >
              <ActivityIndicator size="small" color={colors.accent} />

              <Text
                style={[
                  styles.message,
                  {
                    color: colors.subtext,
                  },
                ]}
              >
                Generating summary...
              </Text>
            </Animated.View>
          )}

          {!isLoading && error && (
            <Animated.View
              entering={FadeIn}
              exiting={undefined}
              style={styles.center}
            >
              <Ionicons name="alert-circle-outline" size={28} color="#EF4444" />

              <Text
                style={[
                  styles.message,
                  {
                    color: "#EF4444",
                  },
                ]}
              >
                Failed to generate summary.
              </Text>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => refetch()}
              >
                <Text
                  style={[
                    styles.retryText,
                    {
                      color: colors.accent,
                    },
                  ]}
                >
                  Try again
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {!isLoading && !error && summary && (
            <Animated.View
              entering={FadeIn}
              exiting={undefined}
            >
              {data?.title && (
                <Text
                  style={[
                    styles.articleTitle,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {data.title}
                </Text>
              )}

              {isBulletSummary ? (
                summary.map((point: string, index: number) => (
                  <View key={index} style={styles.item}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={colors.accent}
                    />

                    <Text
                      style={[
                        styles.summaryText,
                        {
                          color: colors.text,
                        },
                      ]}
                    >
                      {point}
                    </Text>
                  </View>
                ))
              ) : (
                <Text
                  style={[
                    styles.summaryText,
                    {
                      color: colors.text,
                    },
                  ]}
                >
                  {summary}
                </Text>
              )}
            </Animated.View>
          )}
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default memo(SummaryCard);
const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  heading: {
    fontSize: 18,
    fontFamily: "IBMPlexSans_600SemiBold",
  },

  subHeading: {
    fontSize: 13,
    marginTop: 2,
    fontFamily: "IBMPlexSans_400Regular",
  },

  articleTitle: {
    fontSize: 16,
    fontFamily: "IBMPlexSans_600SemiBold",
    marginBottom: 18,
    paddingHorizontal: 16,
  },

  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
    paddingHorizontal: 16,
  },

  summaryText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 12,
    marginLeft: 12,
    fontFamily: "IBMPlexSans_400Regular",
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    paddingHorizontal: 16,
  },

  message: {
    marginTop: 12,
    fontSize: 15,
    fontFamily: "IBMPlexSans_400Regular",
  },

  retryButton: {
    marginTop: 16,
  },

  retryText: {
    fontSize: 15,
    fontFamily: "IBMPlexSans_600SemiBold",
  },
});
