import React from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import Input from "./Input";
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
    const {colors} = useTheme();
    return (
        <View style={[styles.container, {backgroundColor: colors.background}]}>
            <Input
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                customStyles = {{marginBottom : 1}}
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
        paddingVertical: 10,
        // borderBottomWidth: 1,
        // borderColor: "#47474783",
    },
});