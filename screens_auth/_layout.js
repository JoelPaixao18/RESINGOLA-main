import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Login';
import SignUp from './SignUp';
import Details from './Details';

const Stack = createStackNavigator();

export default function AuthLayout() {
  return (
    // O NavigationContainer é necessário para envolver toda a navegação
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,  // Oculta o cabeçalho globalmente
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Details" component={Details} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}