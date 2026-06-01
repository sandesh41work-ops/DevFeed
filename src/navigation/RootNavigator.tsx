import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../features/auth/LoginScreen";
import HomeScreen from "../features/feed/HomeScreen";
import { User } from "firebase/auth";
import { RootStackParamList } from "../shared/types/navigation";
import { useEffect, useState } from "react";
import { auth } from "../shared/services/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ActivityIndicator } from "react-native";
import SignUpScreen from "../features/auth/SignUpScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe; // cleanup
  }, []);

  if (loading) return <ActivityIndicator />;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <Stack.Screen name="Home" component={HomeScreen} />
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
