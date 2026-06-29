import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../shared/hooks/useTheme";
import { useSummaryQuery } from "./useSummaryQuery";
type Props = {
  articleId: number;
  url: string;
};

const Summary = ({ articleId, url }: Props) => {
  const { colors } = useTheme();

  const { data, isLoading, error } = useSummaryQuery(articleId, url);
  const summary = data?.summary ?? [];

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
      <View style={styles.header}>
        <Ionicons name="sparkles" size={22} color={colors.accent} />

        <Text style={[styles.heading, { color: colors.text }]}>AI Summary</Text>
      </View>

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
        </View>
      )}

      {!isLoading && !error && summary.length > 0 && (
        <>
          {data?.title && (
            <Text style={[styles.title, { color: colors.text }]}>
              {data.title}
            </Text>
          )}

          {data?.summary.map((point, index) => (
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
          ))}
        </>
      )}
    </View>
  );
};

export default Summary;

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
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

  bullet: {
    fontSize: 18,
    marginRight: 10,
    marginTop: 1,
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
});
