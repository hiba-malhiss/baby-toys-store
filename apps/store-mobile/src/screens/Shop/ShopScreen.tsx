import React, { useMemo, useState, useCallback } from 'react';
import { FlatList, Modal } from 'react-native';
import {
  Box, HStack, VStack, Text, Button, Divider,
  Select, SelectTrigger, SelectInput, SelectPortal, SelectBackdrop,
  SelectContent, SelectItem, SelectIcon, Checkbox, CheckboxGroup, Icon, Pressable, Input, InputField, ScrollView
} from '@gluestack-ui/themed';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSliders, faXmark } from '@fortawesome/free-solid-svg-icons';
import { ProductCard } from '../../components/ProductCard/ProductCard';
import { useProductsInfiniteWithFilters, type ProductsFilters } from '../../api/product';
import { useBrands, useCategories, useColors, useMaterials } from '../../api/catalog';
// No custom StyleSheet — use Gluestack props only

const SORT_OPTIONS = [
  { label: 'Featured', value: 'rating' },
  { label: 'Best seller', value: 'sales' },
  { label: 'New arrivals', value: 'createdAt' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export default function ShopScreen() {
  const [sortBy, setSortBy] = useState<string>(SORT_OPTIONS[0].value);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filters, setFilters] = useState<ProductsFilters>({});

  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  const { data: colors = [] } = useColors();
  const { data: materials = [] } = useMaterials();

  const { data: pages, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useProductsInfiniteWithFilters(sortBy, filters, 12);

  const items = useMemo(() => pages?.pages.flatMap((p) => p.items) ?? [], [pages]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <Box flex={1}>
      {/* Top bar */}
      <HStack align="center" justify="space-between" px="$3" py="$2">
        <Button variant="ghost" onPress={() => setDrawerOpen(true)} startIcon={<FontAwesomeIcon icon={faSliders} size={16} />}>Filters</Button>

        <Select selectedValue={sortBy || ''} onValueChange={(v: any) => setSortBy(String(v))}>
          <SelectTrigger size="sm" minWidth={160} variant="outline">
            <SelectInput placeholder="Sort by" />
            <SelectIcon as={Icon} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              {SORT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} label={opt.label} value={opt.value} />
              ))}
            </SelectContent>
          </SelectPortal>
        </Select>
      </HStack>

      {/* Product list */}
      <FlatList
        data={items}
        keyExtractor={(item: any) => String(item.id)}
        numColumns={2}
        renderItem={({ item }) => (
          <Box w="50%" px="$3" py="$3">
            <ProductCard
              product={{
                id: item.id,
                name: item.title || item.name,
                shortDescription: item.shortDescription,
                price: item.price || 0,
                availableInStock: item.availableInStock,
                mainImage: item.thumbnailUrl || item.image || item.images?.[0]?.url || 'https://dummyimage.com/400x400/eaeaea/aaaaaa&text=Toy',
                rating: 0,
              }}
            />
          </Box>
        )}
        onEndReachedThreshold={0.6}
        onEndReached={loadMore}
        ListFooterComponent={
          isFetchingNextPage ? (
            <Box py="$4" alignItems="center"><Text>Loading more…</Text></Box>
          ) : <Box h={24} />
        }
      />

      {/* Filters drawer */}
      <Modal visible={drawerOpen} animationType="slide" transparent>
        <Box flex={1} justifyContent="flex-end">
          <Box position="absolute" left={0} right={0} top={0} bottom={0} onTouchStart={() => setDrawerOpen(false)} />
          <Box w="$full" maxH="80%" borderTopLeftRadius={16} borderTopRightRadius={16}>
            <HStack align="center" justify="space-between" px="$4" py="$3">
              <Text fontWeight="$bold" fontSize="$md">Filters</Text>
              <Button variant="ghost" onPress={() => setDrawerOpen(false)} startIcon={<FontAwesomeIcon icon={faXmark} size={18} />} />
            </HStack>

            <ScrollView>
              <Box p="$4">
                {/* Category */}
                <VStack space="$2" mb="$3">
                  <Text fontWeight="$bold" fontSize="$sm">Category</Text>
                  <Select
                    selectedValue={filters.categoryId ? String(filters.categoryId) : ''}
                    onValueChange={(v: any) => setFilters((f) => ({ ...f, categoryId: v ? Number(v) : undefined }))}
                  >
                    <SelectTrigger>
                      <SelectInput placeholder="All categories" />
                      <SelectIcon as={Icon} />
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectItem label="All" value="" />
                        {categories.map((c) => (
                          <SelectItem key={c.id} label={c.name} value={String(c.id)} />
                        ))}
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                </VStack>

                {/* Price */}
                <VStack space="$2" mb="$3">
                  <Text fontWeight="$bold" fontSize="$sm">Price</Text>
                  <HStack space="$2">
                    <Input flex={1}>
                      <InputField
                        keyboardType="numeric"
                        placeholder="Min"
                        value={filters.minPrice?.toString() || ''}
                        onChangeText={(t) => setFilters((f) => ({ ...f, minPrice: t ? Number(t) : undefined }))}
                      />
                    </Input>
                    <Input flex={1}>
                      <InputField
                        keyboardType="numeric"
                        placeholder="Max"
                        value={filters.maxPrice?.toString() || ''}
                        onChangeText={(t) => setFilters((f) => ({ ...f, maxPrice: t ? Number(t) : undefined }))}
                      />
                    </Input>
                  </HStack>
                </VStack>

                {/* Brands */}
                <VStack space="$2" mb="$3">
                  <Text fontWeight="$bold" fontSize="$sm">Brands</Text>
                  <CheckboxGroup
                    value={filters.brandIds?.map(String) || []}
                    onChange={(values: string[]) => setFilters((f) => ({ ...f, brandIds: values.map(Number) }))}
                  >
                    {brands.map((b) => (
                      <Checkbox key={b.id} value={String(b.id)}>{b.name}</Checkbox>
                    ))}
                  </CheckboxGroup>
                </VStack>

                {/* Colors */}
                <VStack space="$2" mb="$3">
                  <Text fontWeight="$bold" fontSize="$sm">Colors</Text>
                  <CheckboxGroup
                    value={filters.colorIds?.map(String) || []}
                    onChange={(values: string[]) => setFilters((f) => ({ ...f, colorIds: values.map(Number) }))}
                  >
                    <HStack flexWrap="wrap" space="$2">
                      {colors.map((c) => (
                        <Checkbox key={c.id} value={String(c.id)}>
                          <Box w={32} h={32} rounded={999} borderWidth={2} mr="$2" mb="$2" />
                        </Checkbox>
                      ))}
                    </HStack>
                  </CheckboxGroup>
                </VStack>

                {/* Materials */}
                <VStack space="$2" mb="$3">
                  <Text fontWeight="$bold" fontSize="$sm">Materials</Text>
                  <CheckboxGroup
                    value={filters.materialIds?.map(String) || []}
                    onChange={(values: string[]) => setFilters((f) => ({ ...f, materialIds: values.map(Number) }))}
                  >
                    {materials.map((m) => (
                      <Checkbox key={m.id} value={String(m.id)}>{m.name}</Checkbox>
                    ))}
                  </CheckboxGroup>
                </VStack>

                <HStack justifyContent="flex-end" space="$3" mt="$2">
                  <Button variant="outline" onPress={() => setFilters({})}>Clear</Button>
                  <Button onPress={() => setDrawerOpen(false)}>Apply</Button>
                </HStack>
              </Box>
            </ScrollView>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
