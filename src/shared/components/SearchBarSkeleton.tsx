import { StyleSheet, View } from "react-native";
import ShimmerBone from "./ShimmerBone";
import { useTheme } from "../hooks/useTheme";

export default function SearchBarSkeleton() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ShimmerBone
        width="100%"
        height={50} 
        borderRadius={12}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
});
