import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Intro from '../components/Intro';
const Stack = createStackNavigator();

export default function Screen() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name="인트로"
          component={Intro}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
