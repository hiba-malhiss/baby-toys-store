import React from 'react';
import { HStack, Pressable } from '@gluestack-ui/themed';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEnvelope, faMagnifyingGlass, faHeart } from '@fortawesome/free-solid-svg-icons';

type Props = {
  onMessage: () => void;
  onSearch: () => void;
  onFavorite: () => void;
};

export default function HeaderActions({ onMessage, onSearch, onFavorite }: Props) {
  return (
    <HStack space={8} alignItems="center" mr={8}>
      <Pressable onPress={onMessage} accessibilityLabel="Contact us" hitSlop={10}>
        <FontAwesomeIcon icon={faEnvelope} size={20} color="#898989" />
      </Pressable>
      <Pressable onPress={onSearch} accessibilityLabel="Search" hitSlop={10}>
        <FontAwesomeIcon icon={faMagnifyingGlass} size={20} color="#898989" />
      </Pressable>
      <Pressable onPress={onFavorite} accessibilityLabel="Favorites" hitSlop={10}>
        <FontAwesomeIcon icon={faHeart} size={20} color="#898989" />
      </Pressable>
    </HStack>
  );
}
