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
import {View} from "react-native"
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabParamList>();

function MainTabNavigator() {
  const { colors } = useTheme();
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
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
  );
}

function RootNavigator() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { colors } = useTheme();

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
      <ActivityIndicator
        size="large"
        color={colors.accent}
      />
    </View>
  );
}

  return (
    <NavigationContainer>
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
              }}
            />
            <Stack.Screen
              name="ArticleWebView"
              component={ArticleWebViewScreen}
              options={({ route }) => ({
                title: route.params?.title ?? "Article",
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
