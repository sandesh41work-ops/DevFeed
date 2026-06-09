import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

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
            <TouchableOpacity onPress={() => onChangeText("")} style={{ position: "absolute", right: 40, top: 15, padding: 4 }}>
                <Text style={{ fontSize: 20, color: "#6d6262" }}>X</Text>
            </TouchableOpacity>
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