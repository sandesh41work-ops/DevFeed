import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../features/auth/LoginScreen";
import HomeScreen from "../features/feed/HomeScreen";
import { User } from "firebase/auth";
import { RootStackParamList, TabParamList } from "../shared/types/navigation";
import { useEffect, useState } from "react";
import { auth } from "../shared/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ActivityIndicator } from "react-native";
import SignUpScreen from "../features/auth/SignUpScreen";
import ArticleDetailScreen from "../features/feed/ArticleDetailScreen";
import ArticleWebViewScreen from "../features/feed/ArticleWebViewScreen";
import { useTheme } from "../shared/hooks/useTheme";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BookmarksScreen from "../features/bookmarks/BookmarksScreen";
import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import AppHeader from "../shared/components/AppHeader";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();

function MainTabNavigator() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: colors.background }}>
      <AppHeader/>
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        sceneStyle: {
          backgroundColor: colors.background,
        },
        animation: "shift",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          height: 70,
          paddingBottom: 8, // Adjusts spacing from the absolute physical bottom edge
          paddingTop: 8, // Adjusts spacing from the top edge of the bar
        },
        tabBarItemStyle: {
          justifyContent: "center", // Centering the inner item contents vertically
          alignItems: "center", // Centering the inner item contents horizontally
        },
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: colors.subtext,

        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Feed") {
            iconName = focused ? "newspaper" : "newspaper-outline";
          } else {
            iconName = focused ? "bookmark" : "bookmark-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="Feed"
        component={HomeScreen}
        options={{ title: "Feed" }}
      />
      <Tabs.Screen
        name="Bookmarks"
        component={BookmarksScreen}
        options={{ title: "Bookmarks" }}
      />
    </Tabs.Navigator>
    </View>
  );
}

function RootNavigator() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { colors, isDark } = useTheme();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe; // cleanup
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }
const navigationTheme = {
  ...(isDark ? DarkTheme : DefaultTheme),
  colors: {
    ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
    background: colors.background,
    card: colors.background,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
  },
};
  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.subtext,
          headerTitleStyle: {
            color: colors.text,
          },
        }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="MainTabs"
              component={MainTabNavigator}
              options={{ headerShown: false }} // Hides double headers
            />
            <Stack.Screen
              name="ArticleDetail"
              component={ArticleDetailScreen}
              options={{
                title: "Article",
                animation: "slide_from_right",

                // Slide in from the right
              }}
            />
            <Stack.Screen
              name="ArticleWebView"
              component={ArticleWebViewScreen}
              options={({ route }) => ({
                title: route.params?.title ?? "Article",
                animation: "slide_from_right",
              })}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;
