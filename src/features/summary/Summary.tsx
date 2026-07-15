import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../shared/hooks/useTheme";
import { useSummaryQuery } from "./useSummaryQuery";
import { memo } from "react";

type Props = {
  articleId: number;
  url: string;
  onClose: () => void;
};

const Summary = ({ articleId, url, onClose }: Props) => {
  const { colors } = useTheme();

  const { data, isLoading, error, refetch } = useSummaryQuery(articleId, url);
  const summary = data?.summary;
  const isBulletSummary = Array.isArray(summary);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onClose}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Ionicons name="sparkles" size={22} color={colors.accent} />
          </View>

          <View>
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
              AI-generated summary
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-up" size={20} color={colors.subtext} />
      </TouchableOpacity>

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accent} />
          <Text style={[styles.message, { color: colors.subtext }]}>
            Generating summary...
          </Text>
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Ionicons name="alert-circle-outline" size={28} color="#EF4444" />
          <Text style={[styles.message, { color: "#EF4444" }]}>
            Failed to generate summary.
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            style={styles.retryButton}
          >
            <Text style={[styles.retryText, { color: colors.accent }]}>
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {!isLoading && !error && summary && (
        <>
          {data?.title && (
            <Text style={[styles.title, { color: colors.text }]}>
              {data.title}
            </Text>
          )}

          {isBulletSummary ? (
            summary.map((point, index) => (
              <View key={index} style={styles.item}>
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.accent}
                />
                <Text style={[styles.summaryText, { color: colors.text }]}>
                  {point}
                </Text>
              </View>
            ))
          ) : (
            <Text style={[styles.summaryText, { color: colors.text }]}>
              {summary}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

export default memo(Summary);

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  heading: {
    
    fontFamily: "IBMPlexSans_600SemiBold",
    fontSize: 18,
  },

  subHeading: {
    fontFamily: "IBMPlexSans_400Regular",
    fontSize: 13,
    marginTop: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },

  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  summaryText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },

  center: {
    alignItems: "center",
    paddingVertical: 24,
  },

  message: {
    marginTop: 12,
    fontSize: 15,
  },

  retryButton: {
    marginTop: 12,
  },

  retryText: {
    fontSize: 15,
    fontWeight: "600",
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
});
