import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const Favicon = React.memo(({ url }: { url?: string }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  if (!url || error) {
    return (
      <View style={styles.fallbackIcon}>
        <Text>🌐</Text>
      </View>
    );
  }

  return (
    <>
      <Image
        source={{
          uri: `https://www.google.com/s2/favicons?domain=${url}&sz=64`,
        }}
        style={styles.favicon}
        onLoad={() => setLoading(false)}
        onError={() => {
          (setLoading(false), setError(true));
        }}
      />
      {loading && (
        <View style={styles.fallbackIcon}>
          <Ionicons
            name="globe-outline"
            size={18}
            color="#6B7280"
          />
        </View>
      )}
    </>
  );
});
const styles = StyleSheet.create({
  favicon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    marginRight: 12,
  },

  fallbackIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    marginRight: 12,

    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },

  fallbackText: {
    fontSize: 16,
  },
});

export default Favicon;
