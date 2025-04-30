import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Details from './Details';
import _TabsLayout from '../screens/_layout';

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
        <Stack.Screen name="_TabsLayout" component={_TabsLayout} />
        <Stack.Screen name="Details" component={Details} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}