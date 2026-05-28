
type ButtonProps = {
    title: string;
    onPress: () => undefined;
    disabled?: boolean;
    loading?: boolean;
}

import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native'

const Button = ({ title, onPress, disabled, loading }: ButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[styles.button, (disabled) && styles.disabled]}
        >
            {
                loading ? (
                    <ActivityIndicator color="#ffff" size='small' />)
                    : (<Text style={styles.buttonText}> {title} </Text>)
            }

        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        height: 52,
        backgroundColor: '#2563eb',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    disabled: {
        backgroundColor: '#2564eb67',
    }
})