import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

type SearchBarProps = {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
};

const SearchBar = ({
    value,
    onChangeText,
    placeholder = "Search stories...",
}: SearchBarProps) => {
    return (
        <View style={styles.container}>
            <TextInput
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                style={styles.input}
                autoCorrect={false}
                autoCapitalize="none"
                clearButtonMode="while-editing"
            />
            {/* Todo : Clear Icon */}
        </View>
    );
};

export default React.memo(SearchBar);

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: "#ddd",
    },

    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 12,
        backgroundColor: "#fff",
    },
});