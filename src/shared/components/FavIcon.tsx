import React, { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const Favicon = React.memo(({ url }: { url?: string }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.faviconContainer}>
      <Image
        source={{
          uri: `https://www.google.com/s2/favicons?domain=${url}&sz=64`,
        }}
        style={styles.favIcon}
        onLoad={() => setLoading(false)}
        onError={() => {
          (setLoading(false), setError(true));
        }}
      />
      {loading && error && (
        <View style={[styles.placeholderIcon, styles.favIcon]}>
          <Ionicons
            name="globe-outline"
            size={18}
            color="#6B7280"
          />
        </View>
      )}
    </View>
  );
});
const styles = StyleSheet.create({
  faviconContainer: {
    width: 36,
    height: 36,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  favIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
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

  placeholderIcon: {
      position: "absolute",
  },

  fallbackText: {
    fontSize: 16,
  },
});

export default Favicon;
