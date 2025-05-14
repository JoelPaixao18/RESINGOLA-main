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

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1A7526',
          height: 75,
        },
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'white',
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={Home} 
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Home', { refresh: Date.now() });
          },
        })}
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Profile', { refresh: Math.random() });
          },
        })}
      />
      <Tab.Screen 
        name="Map" 
        component={Map} 
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Map', { refresh: Date.now() });
          },
        })}
      />
      <Tab.Screen 
        name="Upload" 
        component={Upload} 
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Upload', { refresh: Date.now() });
          },
        })}
      />
      <Tab.Screen 
        name="Save" 
        component={Save} 
        listeners={({ navigation }) => ({
          tabPress: () => {
            navigation.navigate('Save', { refresh: Date.now() });
          },
        })}
      />
    </Tab.Navigator>
  );
}