import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Details from './screens_auth/Details';
import Welcome from './screens/Welcome';
import Login from './screens_auth/Login';
import SignUp from './screens_auth/SignUp';
import _TabsLayout from './screens/_layout';
import EditarProfile from './screens/EditarProfile';
import EditarImovel from './screens/EditarImovel';
import Notifications from './screens/Notifications';

// Criando o Stack Navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,  // Oculta o cabeçalho globalmente
        }}
      >
        <Stack.Screen name="Welcome" options={{headerShown: false}} component={Welcome} />
        <Stack.Screen name="Login" options={{headerShown: false}} component={Login} />
        <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUp} />
        <Stack.Screen name="_TabsLayout" options={{headerShown: false}} component={_TabsLayout} />
        <Stack.Screen name="EditarProfile" options={{title: 'Editar Perfil'}} component={EditarProfile} />
        <Stack.Screen name="EditarImovel" options={{title: 'Editar Imóvel'}} component={EditarImovel} />
        <Stack.Screen name="Details" component={Details} />
        <Stack.Screen 
          name="Notifications" 
          component={Notifications}
          options={{
            headerShown: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

