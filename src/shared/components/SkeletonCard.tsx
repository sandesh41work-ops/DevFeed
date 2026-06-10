import { Animated, Easing, StyleSheet, View } from 'react-native'
import { useEffect, useRef } from 'react'

export default function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start()
  }, [])

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.favicon} />
      <View style={styles.content}>
        <View style={styles.titleLine} />
        <View style={styles.titleLineShort} />
        <View style={styles.metaLine} />
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 12,
    marginVertical: 6,
    flexDirection: 'row',
    gap: 12,
  },
  favicon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  content: { flex: 1, gap: 8 },
  titleLine: {
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '90%',
  },
  titleLineShort: {
    height: 14,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '60%',
  },
  metaLine: {
    height: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    width: '40%',
  },
})