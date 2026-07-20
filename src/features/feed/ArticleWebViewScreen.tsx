import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { useTheme } from "../../shared/hooks/useTheme";

type RouteParams = {
  url: string;
  title?: string;
};

const ArticleWebViewScreen = () => {
  const route = useRoute<any>();
  const { url } = route.params as RouteParams;
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(true);

  if (!url) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}> 
        <Text style={[styles.emptyText, { color: colors.text }]}>No article URL available.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <WebView
          source={{ uri: url }}
          startInLoadingState
          renderLoading={() => (
            <View style={[styles.loading, { backgroundColor: colors.background }]}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={[styles.loadingText, { color: colors.text }]}>Loading article…</Text>
            </View>
          )}
          onLoadEnd={() => setIsLoading(false)}
          style={[styles.webview, { backgroundColor: colors.background, opacity: isLoading ? 0 : 1 }]}
          allowsBackForwardNavigationGestures
        />
      </View>
    </View>
  );
};

export default ArticleWebViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loading: {
    ...StyleSheet.absoluteFill,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
});
