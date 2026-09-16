import {
  ActivityIndicator,
  Linking,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState, useEffect, useRef, useMemo } from "react";
import { useObserve } from "expo-observe";
import { useRoute } from "@react-navigation/native";
import { WebView, WebViewNavigation } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../shared/hooks/useTheme";
import { fonts } from "../../shared/constants/fonts";

type RouteParams = {
  url: string;
  title?: string;
};

const ArticleWebViewScreen = () => {
  const route = useRoute<any>();
  const { url, title } = (route.params as RouteParams) || {};
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const webViewRef = useRef<WebView>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [readingProgress, setReadingProgress] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);

  const { markInteractive } = useObserve();

  useEffect(() => {
    markInteractive();
  }, [markInteractive]);

  // CSS injection to harmonize page background & text readability with app theme
  const injectedCSS = useMemo(() => {
    if (!isDark) return "";
    return `
      (function() {
        const style = document.createElement('style');
        style.id = 'devfeed-dark-theme';
        style.innerHTML = \`
          @media (prefers-color-scheme: light), (prefers-color-scheme: no-preference) {
            html, body {
              background-color: #1a1a1a !important;
              color: #e0e0e0 !important;
            }
            p, span, li, h1, h2, h3, h4, h5, h6, article, section, div:not([class*="code"]) {
              color: inherit !important;
            }
            a {
              color: #ff8c42 !important;
            }
            img, video, iframe, svg, canvas {
              opacity: 0.95;
            }
          }
        \`;
        if (!document.getElementById('devfeed-dark-theme')) {
          document.head.appendChild(style);
        }
      })();
    `;
  }, [isDark]);

  // Reading progress tracking script
  const injectedScrollListener = `
    (function() {
      let ticking = false;
      function reportProgress() {
        const docHeight = Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight
        );
        const winHeight = window.innerHeight;
        const maxScroll = docHeight - winHeight;
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
        const progress = maxScroll > 0 ? Math.min(1, Math.max(0, currentScroll / maxScroll)) : 0;
        
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'SCROLL_PROGRESS',
          progress: progress
        }));
        ticking = false;
      }

      window.addEventListener('scroll', function() {
        if (!ticking) {
          window.requestAnimationFrame(reportProgress);
          ticking = true;
        }
      }, { passive: true });
    })();
    true;
  `;

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "SCROLL_PROGRESS" && typeof data.progress === "number") {
        setReadingProgress(data.progress);
      }
    } catch {
      // Ignore non-json messages
    }
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCanGoBack(navState.canGoBack);
    setCanGoForward(navState.canGoForward);
    if (navState.url) {
      setCurrentUrl(navState.url);
    }
  };

  const handleShare = async () => {
    const targetUrl = currentUrl || url;
    if (!targetUrl) return;
    try {
      await Share.share({
        title: title || "DevFeed Article",
        message: targetUrl,
        url: targetUrl,
      });
    } catch {
      // User cancelled or share dismissed
    }
  };

  const handleOpenExternally = async () => {
    const targetUrl = currentUrl || url;
    if (!targetUrl) return;
    try {
      const supported = await Linking.canOpenURL(targetUrl);
      if (supported) {
        await Linking.openURL(targetUrl);
      }
    } catch (err) {
      console.warn("Failed to open URL in external browser", err);
    }
  };

  if (!url) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyText, { color: colors.subtext }]}>
          No article URL available.
        </Text>
      </View>
    );
  }

  const activeProgress = isLoading ? loadProgress : readingProgress;
  const showProgressBar = isLoading ? loadProgress > 0 && loadProgress < 1 : readingProgress > 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Reading/Loading Progress Bar */}
      <View
        style={[
          styles.progressTrack,
          { backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)" },
        ]}
      >
        <View
          testID="browser-progress-bar"
          style={[
            styles.progressIndicator,
            {
              backgroundColor: colors.accent,
              width: `${Math.max(activeProgress * 100, showProgressBar ? 3 : 0)}%`,
              opacity: showProgressBar ? 1 : 0,
            },
          ]}
        />
      </View>

      <View style={styles.webViewWrapper}>
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          startInLoadingState
          renderLoading={() => (
            <View style={[styles.loading, { backgroundColor: colors.background }]}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={[styles.loadingText, { color: colors.text }]}>
                Loading article…
              </Text>
            </View>
          )}
          onLoadProgress={({ nativeEvent }) => {
            setLoadProgress(nativeEvent.progress);
          }}
          onLoadEnd={() => {
            setIsLoading(false);
          }}
          onNavigationStateChange={handleNavigationStateChange}
          injectedJavaScriptBeforeContentLoaded={injectedCSS}
          injectedJavaScript={injectedScrollListener}
          onMessage={handleMessage}
          style={[
            styles.webview,
            { backgroundColor: colors.background, opacity: isLoading ? 0 : 1 },
          ]}
          allowsBackForwardNavigationGestures
        />
      </View>

      {/* Bottom Browser Action Chrome */}
      <View
        style={[
          styles.toolbar,
          {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
            paddingBottom: Math.max(insets.bottom, 12),
          },
        ]}
      >
        <TouchableOpacity
          testID="browser-back-button"
          onPress={() => webViewRef.current?.goBack()}
          disabled={!canGoBack}
          style={[styles.toolbarButton, !canGoBack && styles.disabledButton]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={canGoBack ? colors.text : colors.subtext}
          />
        </TouchableOpacity>

        <TouchableOpacity
          testID="browser-forward-button"
          onPress={() => webViewRef.current?.goForward()}
          disabled={!canGoForward}
          style={[styles.toolbarButton, !canGoForward && styles.disabledButton]}
          accessibilityLabel="Go forward"
          accessibilityRole="button"
        >
          <Ionicons
            name="chevron-forward"
            size={22}
            color={canGoForward ? colors.text : colors.subtext}
          />
        </TouchableOpacity>

        <TouchableOpacity
          testID="browser-reload-button"
          onPress={() => {
            setIsLoading(true);
            setLoadProgress(0.1);
            webViewRef.current?.reload();
          }}
          style={styles.toolbarButton}
          accessibilityLabel="Reload page"
          accessibilityRole="button"
        >
          <Ionicons name="reload-outline" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          testID="browser-share-button"
          onPress={handleShare}
          style={styles.toolbarButton}
          accessibilityLabel="Share article"
          accessibilityRole="button"
        >
          <Ionicons name="share-outline" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          testID="browser-external-button"
          onPress={handleOpenExternally}
          style={styles.toolbarButton}
          accessibilityLabel="Open in external browser"
          accessibilityRole="button"
        >
          <Ionicons name="open-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ArticleWebViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressTrack: {
    height: 3,
    width: "100%",
    zIndex: 10,
  },
  progressIndicator: {
    height: "100%",
  },
  webViewWrapper: {
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
    marginTop: 8,
    fontSize: 14,
    fontFamily: fonts.semibold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.regular,
    textAlign: "center",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
    paddingHorizontal: 8,
  },
  toolbarButton: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 44,
    minHeight: 44,
  },
  disabledButton: {
    opacity: 0.35,
  },
});
