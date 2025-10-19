import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faHouse,
  faTags,
  faCartShopping,
  faEnvelope,
  faMagnifyingGlass,
  faHeart, faUser,
} from '@fortawesome/free-solid-svg-icons';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { uiConfig } from '@pwn/theme';
// import "./global.css"
import HomeScreen from './src/screens/Home/HomeScreen';
import ShopScreen from './src/screens/Shop/ShopScreen';
import CartScreen from './src/screens/Cart/CartScreen';
import MeScreen from './src/screens/Me/MeScreen';
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

// Use React Navigation default theme; Gluestack handles UI theming via colorMode
const navTheme = DefaultTheme;

const Tab = createBottomTabNavigator();

// Export a shared QueryClient for hooks and axios interceptors
export const queryClient = new QueryClient();

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
    <QueryClientProvider client={queryClient}>
      <GluestackUIProvider config={uiConfig} colorMode="light">
        <NavigationContainer theme={navTheme}>
          <Tab.Navigator
            tabBar={(props) => <BottomTabBar {...props} />}
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color, size }) => {
                const icon = ICONS[route.name] ?? faHouse;
                return <FontAwesomeIcon icon={icon} size={size} color={color as string} />;
              },
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
    </QueryClientProvider>
  );
}