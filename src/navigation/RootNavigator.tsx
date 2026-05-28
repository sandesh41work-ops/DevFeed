import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../features/auth/LoginScreen';
import HomeScreen from '../features/feed/HomeScreen';

import { RootStackParamList } from '../shared/types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();
function RootNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default RootNavigator; 