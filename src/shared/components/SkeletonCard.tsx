import { StyleSheet, View } from "react-native";
import ShimmerBone from "./ShimmerBone";
import { useTheme } from "../hooks/useTheme";

export default function SkeletonCard() {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: isDark ? "#2A2A2A" : colors.border,
        },
      ]}
    >
      <View style={styles.cardContent}>
        <View style={styles.header}>
          <ShimmerBone width={16} height={16} borderRadius={4} />
          <ShimmerBone
            width={110}
            height={12}
            borderRadius={4}
            style={{ marginLeft: 8 }}
          />
        </View>

        <View style={styles.titleContainer}>
          <ShimmerBone width="100%" height={16} borderRadius={4} />
          <View style={{ height: 7 }} />
          <ShimmerBone width="80%" height={16} borderRadius={4} />
        </View>

        <View style={styles.footer}>
          <ShimmerBone width={140} height={12} borderRadius={4} />
          <View style={styles.spacer} />
          <View style={styles.footerItem}>
            <ShimmerBone width={35} height={14} borderRadius={4} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 11,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 44,
  },

  cardContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  titleContainer: {
    marginVertical: 4,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  spacer: {
    flex: 1,
    minWidth: 8,
  },

  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
});