import React from 'react';
import { VStack, HStack, Box, Text } from '@gluestack-ui/themed';
import { TouchableWithoutFeedback } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { tokens } from '@pwn/theme';

export default function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <HStack
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: tokens.colors.background,
        borderTopWidth: 1,
        borderColor: tokens.colors.border,
      }}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index;
        const { options } = descriptors[route.key];
        const label =
          typeof options.tabBarLabel === 'string'
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const color = focused ? tokens.colors.primary : tokens.colors.iconMuted;
        const icon = options.tabBarIcon
          ? options.tabBarIcon({ color, size: 22, focused })
          : null;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name as never);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: 'tabLongPress', target: route.key });
        };

        return (
          <TouchableWithoutFeedback
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            focusable={false}
            importantForAccessibility="no"
          >
            <VStack
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
              }}
            >
              <Box style={{ backgroundColor: 'transparent', borderWidth: 0 }}>
                {icon}
              </Box>
              <Text
                style={{
                  fontSize: 12,
                  color: color as string,
                  marginTop: 4,
                }}
              >
                {label as string}
              </Text>
            </VStack>
          </TouchableWithoutFeedback>
        );
      })}
    </HStack>
  );
}
