import { StyleSheet, View } from "react-native";
import ShimmerBone from "./ShimmerBone";
import { useTheme } from "../hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";

const space = (n: number) => n * 4;

export default function SkeletonCard() {
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: isDark ? "#232323" : "#a92727",
        },
      ]}
    >
      <LinearGradient
        colors={["rgba(255,102,0,0.03)", "rgba(255,102,0,0)"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
      
        <View style={styles.header}>
         
          <ShimmerBone width={16} height={16} borderRadius={4} />
         
          <ShimmerBone width={110} height={12} borderRadius={4} style={{ marginLeft: space(2) }} />
        </View>

        
        <View style={styles.titleContainer}>
          <ShimmerBone width="100%" height={16} borderRadius={4} />
          <View style={{ height: 7 }} /> 
          <ShimmerBone width="80%" height={16} borderRadius={4} />
        </View>

        
        <View style={styles.footer}>
          
          <ShimmerBone width={160} height={12} borderRadius={4} />

          <View style={styles.spacer} />

          
          <View style={styles.footerItem}>
            <ShimmerBone width={35} height={14} borderRadius={4} />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: space(4),
    marginBottom: space(3),
    borderRadius: space(4.5),
    borderWidth: StyleSheet.hairlineWidth,
    minHeight: 44,
  },

  gradient: {
    paddingHorizontal: space(5),
    paddingVertical: space(5),
    flex: 1,
    borderRadius: space(4.5),
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: space(2.5),
  },

  titleContainer: {
    marginVertical: space(1),
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: space(4),
  },

  spacer: {
    flex: 1,
    minWidth: space(2),
  },

  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
});