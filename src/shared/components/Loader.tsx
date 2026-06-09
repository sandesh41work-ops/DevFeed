import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

type LoaderProps = {
  size?: "small" | "large";
};

const Loader = ({ size = "large" }: LoaderProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} />
    </View>
  );
};

export default React.memo(Loader);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});