import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouse, faTags, faCartShopping, faUser, faEnvelope, faMagnifyingGlass, faHeart } from '@fortawesome/free-solid-svg-icons';
import { GluestackUIProvider } from '@gluestack-ui/themed';
import { createConfig } from '@gluestack-style/react';

import HomeScreen from './src/screens/HomeScreen';
import ShopScreen from './src/screens/ShopScreen';
import CartScreen from './src/screens/CartScreen';
import MeScreen from './src/screens/MeScreen';
import HeaderActions from './src/components/HeaderActions';

const Tab = createBottomTabNavigator();

// Colors pulled from web ui-kit constants.scss
// $color-primary: #1096b5; $color-primary-dark: #0f83b2; $color-primary-hover: #0a6487; $color-primary-light: #e6f7fb
// $color-text-primary: #171717; $color-border: #e2e8f0; $color-bg-primary: #ffffff
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1096b5',
    background: '#ffffff',
    card: '#ffffff',
    text: '#171717',
    border: '#e2e8f0',
  },
};

const uiConfig = createConfig({
  tokens: {
    colors: {
      primary50: '#e6f7fb',
      primary100: '#cfeff6',
      primary200: '#b8e7f2',
      primary300: '#a1dfed',
      primary400: '#8ad7e9',
      primary500: '#1096b5',
      primary600: '#0f83b2',
      primary700: '#0a6487',
      primary800: '#084e69',
      primary900: '#06384b',
      accent500: '#f26c62',
      accent600: '#d9574f',
      accent700: '#c54a42',
      success500: '#25bf0c',
      warning500: '#feb705',
      info500: '#12aee0',
      danger500: '#e74c3c',
      text500: '#171717',
      text600: '#101010',
      text700: '#333333',
      border500: '#e2e8f0',
      background500: '#ffffff',
      muted500: '#898989',
    },
  },
});

export default function App() {
  return (
    <GluestackUIProvider config={uiConfig}>
      <NavigationContainer theme={navTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              const map: Record<string, any> = {
                Home: faHouse,
                Shop: faTags,
                Cart: faCartShopping,
                Me: faUser,
                Messages: faEnvelope,
                Search: faMagnifyingGlass,
                Favorites: faHeart,
              };
              const icon = map[route.name] ?? faHouse;
              return <FontAwesomeIcon icon={icon} size={size} color={color as string} />;
            },
            tabBarLabelStyle: { fontSize: 12 },
            tabBarActiveTintColor: navTheme.colors.primary,
            tabBarInactiveTintColor: '#898989',
            headerTitleAlign: 'center',
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerRight: () => <HeaderActions onMessage={() => {}} onSearch={() => {}} onFavorite={() => {}} />,
              title: 'Home',
            }}
          />
          <Tab.Screen
            name="Shop"
            component={ShopScreen}
            options={{
              headerRight: () => <HeaderActions onMessage={() => {}} onSearch={() => {}} onFavorite={() => {}} />,
              title: 'Shop',
            }}
          />
          <Tab.Screen name="Cart" component={CartScreen} />
          <Tab.Screen name="Me" component={MeScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}
