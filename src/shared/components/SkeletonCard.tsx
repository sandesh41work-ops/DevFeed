import { StyleSheet, View } from 'react-native'
import ShimmerBone from "./ShimmerBone"
import { useTheme } from '../hooks/useTheme'

export default function SkeletonCard() {
  const { colors } = useTheme()

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {/* Favicon Skeleton Bone (Fixed Prop Syntax Here) */}
      <ShimmerBone width={32} height={32} borderRadius={8} />

      {/* Content Text Lines Skeleton Bones */}
      <View style={styles.content}>
        <ShimmerBone width="60%" height={16} />
        <ShimmerBone width="90%" height={16} />
        <ShimmerBone width="40%" height={16} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 6,
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    flex: 1,
    gap: 8
  },
})