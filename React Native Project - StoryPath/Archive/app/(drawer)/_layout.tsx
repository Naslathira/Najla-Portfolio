import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Octicons } from '@expo/vector-icons';
import HomeScreen from './index';
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: 'Welcome',
            drawerIcon: ({ focused, size }) => (
              <Ionicons
                name="home"
                size={size}
                color={focused ? '#7cc' : '#ccc'}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: 'Profile',
            drawerIcon: ({ focused, size }) => (
              <Ionicons
                name="person"
                size={size}
                color={focused ? '#7cc' : '#ccc'}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="projects"
          options={{
            drawerLabel: 'Projects',
            drawerIcon: ({ focused, size }) => (
              <Octicons
                name="project"
                size={size}
                color={focused ? '#7cc' : '#ccc'}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
