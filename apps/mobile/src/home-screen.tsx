import { getProducts, type Product } from '@acme/api-client/products';
import { getStores, type Store } from '@acme/api-client/stores';
import { brandColors } from '@acme/shared';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { ProductCard } from './components/product-card';
import { Screen } from './components/screen';
import { resolveMobileImageUrl } from './utils/resolve-mobile-image-url';

import ayanLogo from '../assets/ayan.png';

type HomeScreenProps = {
  onSelectStore: (storeId: string) => void;
};

type ProductsState = {
  errorMessage: string | null;
  isLoading: boolean;
  products: Product[];
};

type StoresState = {
  errorMessage: string | null;
  isLoading: boolean;
  stores: Store[];
};

const initialProductsState: ProductsState = {
  errorMessage: null,
  isLoading: true,
  products: []
};

const initialStoresState: StoresState = {
  errorMessage: null,
  isLoading: true,
  stores: []
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong while loading content.';

const HomeHeader = ({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (value: string) => void }) => (
  <View style={styles.header}>
    <View style={styles.brandRow}>
      <Image contentFit="contain" source={ayanLogo} style={styles.logo} transition={180} />

      <View style={styles.brandTextBlock}>
        <Text style={styles.brandName}>Ayan Market</Text>
        <Text style={styles.brandSlogan}>Fresh essentials for every day</Text>
      </View>
    </View>

    <View style={styles.searchField}>
      <Ionicons color="#7a746b" name="search-outline" size={18} />
      <TextInput
        onChangeText={setSearchQuery}
        placeholder="Search products or stores"
        placeholderTextColor="#9a948b"
        style={styles.searchInput}
        value={searchQuery}
      />
    </View>
  </View>
);

const ProductsSectionHeader = () => (
  <View style={styles.productsSectionHeader}>
    <Text style={styles.sectionEyebrow}>Products</Text>
    <Text style={styles.sectionTitle}>Shop by product</Text>
  </View>
);

const StoresRailLoading = () => (
  <ScrollView contentContainerStyle={styles.storesRailContent} horizontal showsHorizontalScrollIndicator={false}>
    {Array.from({ length: 4 }, (_, index) => (
      <View key={`store-skeleton-${index}`} style={[styles.storeCard, styles.storeSkeleton]} />
    ))}
  </ScrollView>
);

const LoadingState = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator color={brandColors.logoGreen} size="large" />
    <Text style={styles.loadingText}>Gathering today&apos;s products…</Text>
  </View>
);

const ErrorState = ({ errorMessage, onRetry }: { errorMessage: string; onRetry: () => void }) => (
  <View style={styles.stateCard}>
    <Text style={styles.stateTitle}>We couldn&apos;t load the home feed</Text>
    <Text style={styles.stateDescription}>{errorMessage}</Text>
    <Pressable onPress={onRetry} style={styles.retryButton}>
      <Text style={styles.retryButtonText}>Try again</Text>
    </Pressable>
  </View>
);

const EmptyState = ({ onRetry }: { onRetry: () => void }) => (
  <View style={styles.stateCard}>
    <Text style={styles.stateTitle}>No products available</Text>
    <Text style={styles.stateDescription}>We could not find any products for the current catalog. Try refreshing.</Text>
    <Pressable onPress={onRetry} style={styles.retryButton}>
      <Text style={styles.retryButtonText}>Refresh catalog</Text>
    </Pressable>
  </View>
);

const StoreCard = ({ onPress, store }: { onPress: () => void; store: Store }) => (
  <Pressable onPress={onPress} style={styles.storeCard}>
    <Image
      cachePolicy="memory-disk"
      contentFit="cover"
      source={resolveMobileImageUrl(store.imageUrl)}
      style={styles.storeImage}
      transition={180}
    />
    <Text style={styles.storeName}>{store.name}</Text>
  </Pressable>
);

const StoresRail = ({
  errorMessage,
  isLoading,
  onRetry,
  onSelectStore,
  stores
}: {
  errorMessage: string | null;
  isLoading: boolean;
  onRetry: () => void;
  onSelectStore: (storeId: string) => void;
  stores: Store[];
}) => (
  <View style={styles.storesSection}>
    <View style={styles.storesSectionHeader}>
      <View>
        <Text style={styles.sectionEyebrow}>Stores</Text>
        <Text style={styles.sectionTitle}>Browse by store</Text>
      </View>
    </View>

    {isLoading ? <StoresRailLoading /> : null}

    {!isLoading && errorMessage ? (
      <View style={styles.inlineStateCard}>
        <Text style={styles.inlineStateText}>{errorMessage}</Text>
        <Pressable onPress={onRetry} style={styles.inlineButton}>
          <Text style={styles.inlineButtonText}>Reload</Text>
        </Pressable>
      </View>
    ) : null}

    {!isLoading && !errorMessage && stores.length === 0 ? (
      <View style={styles.inlineStateCard}>
        <Text style={styles.inlineStateText}>No stores are available yet.</Text>
      </View>
    ) : null}

    {!isLoading && !errorMessage && stores.length > 0 ? (
      <ScrollView contentContainerStyle={styles.storesRailContent} horizontal showsHorizontalScrollIndicator={false}>
        {stores.map((store) => (
          <StoreCard key={store.id} onPress={() => onSelectStore(store.id)} store={store} />
        ))}
      </ScrollView>
    ) : null}
  </View>
);

export function HomeScreen({ onSelectStore }: HomeScreenProps) {
  const [productsState, setProductsState] = useState(initialProductsState);
  const [searchQuery, setSearchQuery] = useState('');
  const [storesState, setStoresState] = useState(initialStoresState);

  const loadHomeContent = useCallback(async () => {
    setProductsState((currentState) => ({
      ...currentState,
      errorMessage: null,
      isLoading: true
    }));

    setStoresState((currentState) => ({
      ...currentState,
      errorMessage: null,
      isLoading: true
    }));

    const [storesResult, productsResult] = await Promise.allSettled([getStores(), getProducts()]);

    setStoresState(
      storesResult.status === 'fulfilled'
        ? {
            errorMessage: null,
            isLoading: false,
            stores: storesResult.value.data
          }
        : {
            errorMessage: getErrorMessage(storesResult.reason),
            isLoading: false,
            stores: []
          }
    );

    setProductsState(
      productsResult.status === 'fulfilled'
        ? {
            errorMessage: null,
            isLoading: false,
            products: productsResult.value.data
          }
        : {
            errorMessage: getErrorMessage(productsResult.reason),
            isLoading: false,
            products: []
          }
    );
  }, []);

  useEffect(() => {
    void loadHomeContent();
  }, [loadHomeContent]);

  const header = useMemo(
    () => (
      <>
        <HomeHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <StoresRail
          errorMessage={storesState.errorMessage}
          isLoading={storesState.isLoading}
          onRetry={() => {
            void loadHomeContent();
          }}
          onSelectStore={onSelectStore}
          stores={storesState.stores}
        />
        <ProductsSectionHeader />
      </>
    ),
    [loadHomeContent, onSelectStore, searchQuery, storesState.errorMessage, storesState.isLoading, storesState.stores]
  );

  if (productsState.isLoading) {
    return (
      <Screen>
        <StatusBar style="dark" />
        <View style={styles.screenPadding}>
          {header}
          <LoadingState />
        </View>
      </Screen>
    );
  }

  if (productsState.errorMessage) {
    return (
      <Screen>
        <StatusBar style="dark" />
        <View style={styles.screenPadding}>
          {header}
          <ErrorState
            errorMessage={productsState.errorMessage}
            onRetry={() => {
              void loadHomeContent();
            }}
          />
        </View>
      </Screen>
    );
  }

  if (productsState.products.length === 0) {
    return (
      <Screen>
        <StatusBar style="dark" />
        <View style={styles.screenPadding}>
          {header}
          <EmptyState
            onRetry={() => {
              void loadHomeContent();
            }}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <StatusBar style="dark" />
      <FlatList
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.listContent}
        data={productsState.products}
        keyExtractor={(product) => product.id}
        ListHeaderComponent={header}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={styles.productColumn}>
            <ProductCard product={item} />
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screenPadding: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    gap: 16
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 16
  },
  productRow: {
    gap: 14,
    justifyContent: 'space-between'
  },
  productColumn: {
    flex: 1,
    maxWidth: '48%'
  },
  header: {
    marginBottom: 20,
    gap: 14
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12
  },
  brandTextBlock: {
    flex: 1,
    gap: 2
  },
  logo: {
    height: 62,
    width: 62
  },
  brandName: {
    color: brandColors.black,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28
  },
  brandSlogan: {
    color: '#6d6255',
    fontSize: 13,
    lineHeight: 18
  },
  searchField: {
    alignItems: 'center',
    backgroundColor: '#f7f5f1',
    borderColor: '#e7e5e4',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 48,
    paddingHorizontal: 14
  },
  searchInput: {
    color: brandColors.black,
    flex: 1,
    fontSize: 15,
    paddingVertical: 12
  },
  storesSection: {
    marginBottom: 20,
    gap: 12
  },
  productsSectionHeader: {
    marginBottom: 4,
    gap: 2
  },
  storesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  sectionEyebrow: {
    color: '#9c6b2f',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase'
  },
  sectionTitle: {
    color: brandColors.black,
    fontSize: 22,
    fontWeight: '700'
  },
  storesRailContent: {
    gap: 12,
    paddingRight: 8
  },
  storeCard: {
    width: 160,
    borderRadius: 18,
    backgroundColor: brandColors.white,
    borderColor: '#e7e5e4',
    borderWidth: 1,
    padding: 10,
    gap: 8,
  },
  storeSkeleton: {
    backgroundColor: '#ede6db'
  },
  storeImage: {
    width: '100%',
    height: 96,
    borderRadius: 14,
    marginBottom: 2
  },
  storeName: {
    color: brandColors.black,
    fontSize: 16,
    fontWeight: '700'
  },
  inlineStateCard: {
    borderRadius: 20,
    backgroundColor: brandColors.white,
    padding: 16,
    gap: 12
  },
  inlineStateText: {
    color: '#6d6255',
    fontSize: 14,
    lineHeight: 20
  },
  inlineButton: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    backgroundColor: '#efe2c4',
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  inlineButtonText: {
    color: '#8b6b3e',
    fontSize: 13,
    fontWeight: '700'
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12
  },
  loadingText: {
    color: '#5a5248',
    fontSize: 15
  },
  stateCard: {
    borderRadius: 24,
    backgroundColor: brandColors.white,
    padding: 24,
    shadowColor: '#3d2e1f',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    elevation: 2,
    gap: 12
  },
  stateTitle: {
    color: brandColors.black,
    fontSize: 22,
    fontWeight: '700'
  },
  stateDescription: {
    color: '#6d6255',
    fontSize: 15,
    lineHeight: 22
  },
  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: brandColors.logoGreen,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  retryButtonText: {
    color: brandColors.white,
    fontSize: 14,
    fontWeight: '700'
  },
  
});
