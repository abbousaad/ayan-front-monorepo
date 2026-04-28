import { getStoreById, getStoreProducts, type Store } from '@acme/api-client/stores';
import { brandColors } from '@acme/shared';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import type { Product } from '@acme/api-client/products';

import { CartButton } from './components/cart-button';
import { ProductCard } from './components/product-card';
import { Screen } from './components/screen';
import { resolveMobileImageUrl } from './utils/resolve-mobile-image-url';

type StoreProductsScreenProps = {
  onBack: () => void;
  onOpenCart?: () => void;
  storeId: string;
};

type ScreenState = {
  errorMessage: string | null;
  isLoading: boolean;
  products: Product[];
  store: Store | null;
};

const initialState: ScreenState = {
  errorMessage: null,
  isLoading: true,
  products: [],
  store: null
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : 'Something went wrong while loading this store.';

const LoadingState = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator color={brandColors.logoGreen} size="large" />
    <Text style={styles.loadingText}>Gathering this store&apos;s products…</Text>
  </View>
);

const Banner = ({
  onBack,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  store
}: {
  onBack: () => void;
  onOpenCart?: () => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  store: Store | null;
}) => (
  <View style={styles.banner}>
    <View style={styles.headerTopRow}>
      <View style={styles.storeHeaderRow}>
        {store ? (
          <Image
            cachePolicy="memory-disk"
            contentFit="cover"
            source={resolveMobileImageUrl(store.imageUrl)}
            style={styles.storeImage}
            transition={180}
          />
        ) : (
          <View style={[styles.storeImage, styles.storeImagePlaceholder]} />
        )}

        <View style={styles.storeTextBlock}>
          <Text style={styles.eyebrow}>Store</Text>
          <Text style={styles.title}>{store ? store.name : 'Store products'}</Text>
        </View>
      </View>

      <View style={styles.headerActions}>
        <CartButton onPress={onOpenCart} />

        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons color="#8b6b3e" name="close" size={20} />
        </Pressable>
      </View>
    </View>

    <View style={styles.searchField}>
      <Ionicons color="#7a746b" name="search-outline" size={18} />
      <TextInput
        onChangeText={setSearchQuery}
        placeholder="Search this store"
        placeholderTextColor="#9a948b"
        style={styles.searchInput}
        value={searchQuery}
      />
    </View>
  </View>
);

const ErrorState = ({ errorMessage, onRetry }: { errorMessage: string; onRetry: () => void }) => (
  <View style={styles.stateCard}>
    <Text style={styles.stateTitle}>We couldn&apos;t load this store</Text>
    <Text style={styles.stateDescription}>{errorMessage}</Text>
    <Pressable onPress={onRetry} style={styles.retryButton}>
      <Text style={styles.retryButtonText}>Try again</Text>
    </Pressable>
  </View>
);

const EmptyState = ({ onRetry }: { onRetry: () => void }) => (
  <View style={styles.stateCard}>
    <Text style={styles.stateTitle}>No products available</Text>
    <Text style={styles.stateDescription}>This store does not have products yet. Try refreshing soon.</Text>
    <Pressable onPress={onRetry} style={styles.retryButton}>
      <Text style={styles.retryButtonText}>Refresh store</Text>
    </Pressable>
  </View>
);

export function StoreProductsScreen({ onBack, onOpenCart, storeId }: StoreProductsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [state, setState] = useState(initialState);

  const loadStoreProducts = useCallback(async () => {
    setState((currentState) => ({
      ...currentState,
      errorMessage: null,
      isLoading: true
    }));

    try {
      const [storeResponse, productsResponse] = await Promise.all([getStoreById(storeId), getStoreProducts(storeId)]);

      setState({
        errorMessage: null,
        isLoading: false,
        products: productsResponse.data,
        store: storeResponse.data
      });
    } catch (error) {
      setState({
        errorMessage: getErrorMessage(error),
        isLoading: false,
        products: [],
        store: null
      });
    }
  }, [storeId]);

  useEffect(() => {
    void loadStoreProducts();
  }, [loadStoreProducts]);

  const header = (
    <Banner onBack={onBack} onOpenCart={onOpenCart} searchQuery={searchQuery} setSearchQuery={setSearchQuery} store={state.store} />
  );

  if (state.isLoading) {
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

  if (state.errorMessage) {
    return (
      <Screen>
        <StatusBar style="dark" />
        <View style={styles.screenPadding}>
          {header}
          <ErrorState errorMessage={state.errorMessage} onRetry={loadStoreProducts} />
        </View>
      </Screen>
    );
  }

  if (state.products.length === 0) {
    return (
      <Screen>
        <StatusBar style="dark" />
        <View style={styles.screenPadding}>
          {header}
          <EmptyState onRetry={loadStoreProducts} />
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
        data={state.products}
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
    paddingTop: 10,
    paddingBottom: 24,
    gap: 16
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
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
  banner: {
    borderRadius: 28,
    backgroundColor: brandColors.white,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 14,
    gap: 10,
    marginBottom: 12
  },
  headerTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8
  },
  backButton: {
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: brandColors.white,
    borderColor: '#e7e5e4',
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 44
  },
  eyebrow: {
    color: '#9c6b2f',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase'
  },
  storeHeaderRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 10
  },
  storeImage: {
    borderRadius: 18,
    height: 62,
    width: 62
  },
  storeImagePlaceholder: {
    backgroundColor: '#ede6db'
  },
  storeTextBlock: {
    flex: 1,
    gap: 1
  },
  title: {
    color: brandColors.black,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 27
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
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
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
