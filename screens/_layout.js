import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from 'react-native-vector-icons';
import Home from './Home';
import Profile from './Profile';
import Upload from './Upload';
import Map from './Map';
import Save from './Save';

const Tab = createBottomTabNavigator();

export default function _TabsLayout() {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        // Definindo os ícones baseados nas abas
        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'Upload') {
          iconName = focused ? 'cloud-upload' : 'cloud-upload-outline';
        } else if (route.name === 'Map') {
          iconName = focused ? 'map' : 'map-outline';
        } else if (route.name === 'Save') {
          iconName = focused ? 'bookmark' : 'bookmark-outline';
        }

          // Retornando o ícone correspondente
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false, // Oculta o cabeçalho
        tabBarStyle: {
          backgroundColor: '#1A7526', // Define o fundo verde
          height: 75,
        },

        tabBarActiveTintColor: 'white', // Cor dos ícones ativos
        tabBarInactiveTintColor: 'white', // Cor dos ícones inativos
      })
    }
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Map" component={Map} />
      <Tab.Screen name="Upload" component={Upload} />
      <Tab.Screen name="Save" component={Save} />
    </Tab.Navigator>
  );
}
