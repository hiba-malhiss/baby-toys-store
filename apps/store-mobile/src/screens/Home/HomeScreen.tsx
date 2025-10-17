import React, { useMemo, useState, useCallback } from 'react';
import { ImageBackground, FlatList, ScrollView as RNScrollView } from 'react-native';
import { Box, HStack, VStack, Pressable, Text, Image } from '@gluestack-ui/themed';
import { tokens } from '@pwn/theme';
import { useNavigation } from '@react-navigation/native';
import { useCategories } from '../../api/catalog';
import { useProductsInfinite } from '../../api/product';
import { styles } from './homeScreenStyles';
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
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1596464716121-e69697f5388f?q=80&w=1600&auto=format&fit=crop' }}
        style={styles.banner}
        resizeMode="cover"
      >
        <Box style={styles.bannerOverlay} />
        <Box style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>Discover Joyful Toys</Text>
          <Text style={styles.bannerSubtitle}>Safe, playful, and curated for every age</Text>
        </Box>
      </ImageBackground>

      {/* Categories */}
      <HStack style={styles.categoriesWrap}>
        {categories
          ?.filter((c) => c?.isMain !== false)
          .map((cat) => (
            <Pressable key={cat.id} style={styles.categoryButton} onPress={() => handleCategoryPress(cat.id)}>
              <VStack style={styles.categoryCard}>
                <Image
                  source={{ uri: cat.image || 'https://dummyimage.com/200x200/eaeaea/aaaaaa&text=Toy' }}
                  style={styles.categoryImage}
                  alt={cat.name}
                />
                <Text style={styles.categoryLabel}>{cat.name}</Text>
              </VStack>
            </Pressable>
          ))}
        {isLoading && (
          <Box style={[styles.categoryButton, { width: '100%', alignItems: 'center' }]}>
            <Text style={{ color: tokens.colors.textMuted }}>Loading categories…</Text>
          </Box>
        )}
        {!!error && (
          <Box style={[styles.categoryButton, { width: '100%', alignItems: 'center' }]}>
            <Text style={{ color: tokens.colors.error }}>Failed to load categories</Text>
          </Box>
        )}
      </HStack>

      {/* Section Header */}
      <Box style={styles.sectionHeaderTopPicks}>
        <Text style={styles.sectionTitleTopPicks}>Top Picks</Text>
      </Box>

      {/* Sort Tabs */}
      <RNScrollView horizontal showsHorizontalScrollIndicator={false}>
        <HStack style={styles.sortTabsWrap}>
          {SORT_OPTIONS.map((opt) => {
            const selected = sortBy === opt.value;
            return (
              <Pressable
                key={opt.value}
                onPress={() => setSortBy(opt.value)}
                style={[styles.chip, selected ? styles.chipSelected : styles.chipDefault]}
              >
                <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </HStack>
      </RNScrollView>
    </>
  ), [categories, error, handleCategoryPress, isLoading, sortBy]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <FlatList
      style={{ backgroundColor: tokens.colors.background }}
      data={products}
      keyExtractor={(item: any) => String(item.id)}
      numColumns={2}
      columnWrapperStyle={styles.productsRow}
      ListHeaderComponent={renderHeader}
      renderItem={({ item }) => <ProductCard product={item} />}
      onEndReachedThreshold={0.5}
      onEndReached={loadMore}
      ListFooterComponent={
        <Box>
          {isFetchingNextPage && (
            <Box style={{ paddingVertical: 16, alignItems: 'center' }}>
              <Text style={{ color: tokens.colors.textMuted }}>Loading more…</Text>
            </Box>
          )}
          <Box style={{ height: 24 }} />
        </Box>
      }
    />
  );
}
