import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../hooks/useTheme";
import DiscussionCard from "../../features/discussion/Discussion";
import { fonts } from "../constants/fonts";
import { RootStackParamList } from "../types/navigation";

const space = (n: number) => n * 4;

const getTimeAgo = (unixTime: number) => {
  const diff = Math.floor(Date.now() / 1000) - unixTime;
  if (diff < 60) return `${diff}s`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}d`;
};

type AskDetailsProps = NativeStackScreenProps<RootStackParamList, "AskDetail">;

const AskDetails = ({ route }: AskDetailsProps) => {
  const { story } = route.params;
  const { colors, isDark } = useTheme();
  const commentCount = story.descendants ?? 0;
  const timeAgo = useMemo(() => getTimeAgo(story.time), [story.time]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}> 
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.content}
      >
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <LinearGradient
            colors={
              isDark
                ? ["rgba(255,102,0,0.08)", "rgba(255,102,0,0)"]
                : ["rgba(255,102,0,0.15)", "rgba(255,102,0,0)"]
            }
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.headerRow}>
              <View style={[styles.askBadge, { backgroundColor: isDark ? "rgba(255,102,0,0.12)" : "rgba(255,102,0,0.10)" }]}> 
                <Text style={[styles.askBadgeText, { color: colors.accent }]}>ASK HN</Text>
              </View>
              <Text style={[styles.meta, { color: colors.subtext }]}> 
                {commentCount} comments · {timeAgo} ago
              </Text>
            </View>

            <Text style={[styles.title, { color: colors.text }]}>{story.title}</Text>

            <Text style={[styles.subText, { color: colors.subtext }]}>Asked by {story.by}</Text>
          </LinearGradient>
        </View>

        <DiscussionCard storyId={story.id} commentCount={commentCount} initialExpanded />
      </ScrollView>
    </View>
  );
};

export default AskDetails;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingBottom: 28,
  },
  content: {
    flexGrow: 1,
  },
  card: {
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
    marginBottom: space(3),
  },
  headerGradient: {
    padding: space(4),
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: space(3),
  },
  askBadge: {
    paddingHorizontal: space(2),
    paddingVertical: space(1),
    borderRadius: space(3),
  },
  askBadgeText: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 0.7,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    lineHeight: 26,
    marginBottom: space(2),
  },
  subText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
  },
  meta: {
    fontFamily: fonts.regular,
    fontSize: 12.5,
  },
});
