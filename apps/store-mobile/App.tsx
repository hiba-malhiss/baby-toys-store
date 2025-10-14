import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faHouse,
  faTags,
  faCartShopping,
  faUser,
  faEnvelope,
  faMagnifyingGlass,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { uiConfig, navThemeFromTokens, tokens } from '@pwn/theme';

import HomeScreen from './src/screens/HomeScreen';
import ShopScreen from './src/screens/ShopScreen';
import CartScreen from './src/screens/CartScreen';
import MeScreen from './src/screens/MeScreen';
import HeaderActions from './src/components/HeaderActions';
import BottomTabBar from './src/components/BottomTabBar';

// Map tab names to icons
const ICONS: Record<string, any> = {
  Home: faHouse,
  Shop: faTags,
  Cart: faCartShopping,
  Me: faUser,
  Messages: faEnvelope,
  Search: faMagnifyingGlass,
  Favorites: faHeart,
};

// Build navigation theme from shared tokens
const navTheme = navThemeFromTokens(DefaultTheme);

const Tab = createBottomTabNavigator();

// Default header actions (to avoid repeating)
const defaultHeaderOptions = {
  headerRight: () => (
    <HeaderActions
      onMessage={() => {}}
      onSearch={() => {}}
      onFavorite={() => {}}
    />
  ),
};

export default function App() {
  return (
    <GluestackUIProvider config={uiConfig}>
      <NavigationContainer theme={navTheme}>
        <Tab.Navigator
          tabBar={(props) => <BottomTabBar {...props} />}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              const icon = ICONS[route.name] ?? faHouse;
              return <FontAwesomeIcon icon={icon} size={size} color={color as string} />;
            },
            tabBarActiveTintColor: tokens.colors.primary,
            tabBarInactiveTintColor: tokens.colors.iconMuted,
            headerTitleAlign: 'center',
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{ ...defaultHeaderOptions, title: 'Home' }}
          />
          <Tab.Screen
            name="Shop"
            component={ShopScreen}
            options={{ ...defaultHeaderOptions, title: 'Shop' }}
          />
          <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
          <Tab.Screen name="Me" component={MeScreen} options={{ title: 'Me' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}