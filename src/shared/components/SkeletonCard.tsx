import { StyleSheet, View } from "react-native";
import ShimmerBone from "./ShimmerBone";
import { useTheme } from "../hooks/useTheme";
import SearchBarSkeleton from "./SearchBarSkeleton";
import { LinearGradient } from "expo-linear-gradient";

export default function SkeletonCard() {
  const { colors, isDark } = useTheme();

  return (
    <View style={[]}>
      <LinearGradient
        colors={["rgba(255,102,0,0.03)", "rgba(255,102,0,0)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[
          styles.card,
          {
            backgroundColor: colors.background,
            shadowColor: isDark ? "#000" : "#000",
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <ShimmerBone width={32} height={30} borderRadius={16} />

          <View style={styles.headerContent}>
            <ShimmerBone width="100%" height={18} />

            <View style={{ height: 2 }} />

            <ShimmerBone width="35%" height={13} />
          </View>
        </View>

        {/* Badges */}
        <View style={styles.badgeContainer}>
          <ShimmerBone width={70} height={30} borderRadius={999} />

          <ShimmerBone width={75} height={30} borderRadius={999} />

          <ShimmerBone width={95} height={30} borderRadius={999} />
        </View>

        {/* Meta */}
        <View style={styles.metaContainer}>
          <ShimmerBone width={120} height={13} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 18,

    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 4,
  },

  header: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  headerContent: {
    flex: 1,
    marginLeft: 12,
    gap: 8,
  },

  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },

  metaContainer: {
    marginTop: 14,
  },
});
