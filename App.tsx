import * as React from 'react';
import {View, Text, Image, StyleSheet, ImageBackground} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
<<<<<<< HEAD
import Screen from './screen/Screen';

export default function App() {
  return <Screen />;
=======
import Intro from './components/Intro';
import SignUpScreen from './screen/SignUpScreen';
import EmailSignUp from './screen/EmailSignUp';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Intro"
          component={Intro}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="EmailSignUp" 
          component={EmailSignUp} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
>>>>>>> 1776f455f79adba6d50d643b26a4bf73199ac992
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    position: 'absolute',
    top: 200,
    fontSize: 60,
    fontWeight: 'bold',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});
