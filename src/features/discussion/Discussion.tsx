import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../../shared/hooks/useTheme'
import { memo } from 'react'
const Discussion = () => {
    const { colors } = useTheme()
    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Text>Discussion will go here</Text>
        </View>
    )
}

export default memo(Discussion)

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

