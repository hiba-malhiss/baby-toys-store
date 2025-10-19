import React, { useMemo, useState, useCallback } from 'react';
import { FlatList } from 'react-native';
import { Box, HStack, VStack, Pressable, Text, Image, ScrollView, Button } from '@gluestack-ui/themed';
import { useNavigation } from '@react-navigation/native';
import { useCategories } from '../../api/catalog';
import { useProductsInfinite } from '../../api/product';
// No custom styles: use Gluestack props only
import { ProductCard } from '../../components/ProductCard/ProductCard';

const SORT_OPTIONS = [
  { label: 'Featured', value: 'rating' },
  { label: 'Best seller', value: 'sales' },
  { label: 'New arrivals', value: 'createdAt' },
];

export default function HomeScreen() {
  const navigation = useNavigation();
  const { data: categories, isLoading, error } = useCategories();
  const [sortBy, setSortBy] = useState<string>(SORT_OPTIONS[0].value);
  const {
    data: productsPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductsInfinite(sortBy, 12);

  const products = useMemo(() => {
    return productsPages?.pages.flatMap((p) => p.items) ?? [];
  }, [productsPages]);

  const handleCategoryPress = useCallback(
    (categoryId: string) => {
      // @ts-ignore
      navigation.navigate('Shop');
    },
    [navigation]
  );

  const renderHeader = useCallback(() => (
    <>
      {/* Banner */}
      <Box w="$full">
        <Box position="relative">
          <Image
            alt="Banner"
            source={{ uri: 'https://images.unsplash.com/photo-1596464716121-e69697f5388f?q=80&w=1600&auto=format&fit=crop' }}
            w="$full"
            h={180}
            rounded={0}
          />
          <Box position="absolute" left={0} right={0} top={0} bottom={0} bg="rgba(0,0,0,0.25)" />
          <VStack position="absolute" left={16} right={16} bottom={16} space="$1">
            <Text fontSize="$xl" fontWeight="$bold">
              Discover Joyful Toys
            </Text>
            <Text fontSize="$sm">
              Safe, playful, and curated for every age
            </Text>
          </VStack>
        </Box>
      </Box>

      {/* Categories */}
      <HStack flexWrap="wrap" px="$3" py="$3" space="$3">
        {categories
          ?.filter((c) => c?.isMain !== false)
          .map((cat) => (
            <Pressable key={cat.id} onPress={() => handleCategoryPress(cat.id)}>
              <VStack w={112} alignItems="center" space="$2">
                <Image
                  source={{ uri: cat.image || 'https://dummyimage.com/200x200/eaeaea/aaaaaa&text=Toy' }}
                  alt={cat.name}
                  w={96}
                  h={96}
                  rounded={12}
                />
                <Text textAlign="center" fontSize="$sm" fontWeight="$bold">{cat.name}</Text>
              </VStack>
            </Pressable>
          ))}
        {isLoading && (
          <Box w="$full" alignItems="center" py="$2">
            <Text>Loading categories…</Text>
          </Box>
        )}
        {!!error && (
          <Box w="$full" alignItems="center" py="$2">
            <Text>Failed to load categories</Text>
          </Box>
        )}
      </HStack>

      {/* Section Header */}
      <HStack align="center" justify="space-between" px="$3" py="$2">
        <Text fontSize="$lg" fontWeight="$bold">Top Picks</Text>
      </HStack>

      {/* Sort Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack px="$3" py="$2" space="$2">
          {SORT_OPTIONS.map((opt) => {
            const selected = sortBy === opt.value;
            return (
              <Button
                key={opt.value}
                variant={selected ? 'solid' : 'outline'}
                size="sm"
                onPress={() => setSortBy(opt.value)}
              >
                {opt.label}
              </Button>
            );
          })}
        </HStack>
      </ScrollView>
    </>
  ), [categories, error, handleCategoryPress, isLoading, sortBy]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <FlatList
      data={products}
      keyExtractor={(item: any) => String(item.id)}
      ListHeaderComponent={renderHeader}
      numColumns={2}
      renderItem={({ item }) => (
        <Box w="50%" px="$3" py="$3">
          <ProductCard product={item} />
        </Box>
      )}
      onEndReachedThreshold={0.5}
      onEndReached={loadMore}
      ListFooterComponent={
        <Box>
          {isFetchingNextPage && (
            <Box py="$4" alignItems="center">
              <Text color="$muted500">Loading more…</Text>
            </Box>
          )}
          <Box h={24} />
        </Box>
      }
    />
  );
}
