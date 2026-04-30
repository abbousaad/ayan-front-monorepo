import { getPublicPricingConfig, type PricingConfig } from '@acme/api-client/orders';
import { getDiscountAmount, getTotalWithPricing, type CartItem } from '@acme/cart';
import { brandColors } from '@acme/shared';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useCart } from './cart/use-cart';
import { AuthChoiceModal } from './components/auth-choice-modal';
import { Screen } from './components/screen';
import { resolveMobileImageUrl } from './utils/resolve-mobile-image-url';

type CartScreenProps = {
  onBack: () => void;
  onProceed: () => void;
};

type PricingState = {
  errorMessage: string | null;
  isLoading: boolean;
  pricingConfig: PricingConfig;
};

const DEFAULT_PRICING_CONFIG: PricingConfig = {
  deliveryFee: 0,
  discountRate: 0
};

const formatPrice = (price: number, currencyCode = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
  }).format(price);

const getDisplayCurrencyCode = (items: CartItem[]): string => {
  const fallbackCurrency = items[0]?.currencyCode ?? 'USD';
  const knownCurrencies = items.flatMap((item) => (item.currencyCode ? [item.currencyCode] : []));

  if (knownCurrencies.length > 1 && new Set(knownCurrencies).size > 1) {
    console.warn('Mixed cart currencies detected in mobile cart. Using the first item currency for totals.', knownCurrencies);
  }

  return fallbackCurrency;
};

const getLineTotal = (item: CartItem) => item.price * item.quantity;

export function CartScreen({ onBack, onProceed }: CartScreenProps) {
  const {
    clearCartItems,
    decrementCartItem,
    incrementCartItem,
    isCartEmpty,
    removeCartItem,
    state,
    subtotal
  } = useCart();
  const [pricingState, setPricingState] = useState<PricingState>({
    errorMessage: null,
    isLoading: true,
    pricingConfig: DEFAULT_PRICING_CONFIG
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const currencyCode = getDisplayCurrencyCode(state.items);

  useEffect(() => {
    let isMounted = true;

    const loadPricingConfig = async () => {
      if (state.items.length === 0) {
        if (isMounted) {
          setPricingState({
            errorMessage: null,
            isLoading: false,
            pricingConfig: DEFAULT_PRICING_CONFIG
          });
        }

        return;
      }

      setPricingState((currentState) => ({
        ...currentState,
        errorMessage: null,
        isLoading: true
      }));

      try {
        const pricingConfig = await getPublicPricingConfig();

        if (isMounted) {
          setPricingState({
            errorMessage: null,
            isLoading: false,
            pricingConfig
          });
        }
      } catch {
        if (isMounted) {
          setPricingState({
            errorMessage: "Couldn't load delivery fee - using default.",
            isLoading: false,
            pricingConfig: DEFAULT_PRICING_CONFIG
          });
        }
      }
    };

    void loadPricingConfig();

    return () => {
      isMounted = false;
    };
  }, [state.items.length]);

  const discountAmount = getDiscountAmount(
    subtotal,
    pricingState.pricingConfig.deliveryFee,
    pricingState.pricingConfig.discountRate
  );
  const total = getTotalWithPricing(subtotal, pricingState.pricingConfig.deliveryFee, pricingState.pricingConfig.discountRate);

  return (
    <Screen>
      <StatusBar style="dark" />
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable accessibilityLabel="Go back" onPress={onBack} style={styles.iconButton}>
            <Ionicons color={brandColors.black} name="arrow-back" size={20} />
          </Pressable>

          <Text style={styles.headerTitle}>Your cart</Text>

          {isCartEmpty ? <View style={styles.headerSpacer} /> : <Pressable onPress={clearCartItems} style={styles.clearButton}><Text style={styles.clearButtonText}>Clear cart</Text></Pressable>}
        </View>

        {isCartEmpty ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons color="#6d6255" name="bag-handle-outline" size={26} />
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyDescription}>Browse products and add a few items to see live totals here.</Text>
            <Pressable onPress={onBack} style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Browse products</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <ScrollView contentContainerStyle={styles.itemsContent} showsVerticalScrollIndicator={false} style={styles.itemsScrollView}>
              {state.items.map((item) => {
                const itemCurrencyCode = item.currencyCode ?? currencyCode;

                return (
                  <View key={item.productId} style={styles.cartItemCard}>
                    <Image
                      cachePolicy="memory-disk"
                      contentFit="cover"
                      source={resolveMobileImageUrl(item.imageUrl ?? '')}
                      style={styles.itemImage}
                      transition={180}
                    />

                    <View style={styles.itemContent}>
                      <View style={styles.itemTopRow}>
                        <View style={styles.itemTextBlock}>
                          <Text numberOfLines={2} style={styles.itemName}>
                            {item.name}
                          </Text>
                          <Text style={styles.itemMeta}>
                            {formatPrice(item.price, itemCurrencyCode)}
                            {item.unit ? <Text style={styles.itemUnit}> / {item.unit}</Text> : null}
                          </Text>
                        </View>

                        <Pressable
                          accessibilityLabel={`Remove ${item.name} from cart`}
                          onPress={() => removeCartItem(item.productId)}
                          style={styles.removeButton}
                        >
                          <Ionicons color="#7c6f63" name="trash-outline" size={17} />
                        </Pressable>
                      </View>

                      <View style={styles.itemBottomRow}>
                        <View style={styles.quantityControl}>
                          <Pressable
                            accessibilityLabel={`Decrease ${item.name} quantity`}
                            onPress={() => decrementCartItem(item.productId)}
                            style={styles.quantityButton}
                          >
                            <Text style={styles.quantityButtonText}>-</Text>
                          </Pressable>

                          <Text style={styles.quantityText}>{item.quantity}</Text>

                          <Pressable
                            accessibilityLabel={`Increase ${item.name} quantity`}
                            onPress={() => incrementCartItem(item.productId)}
                            style={styles.quantityButton}
                          >
                            <Text style={styles.quantityButtonText}>+</Text>
                          </Pressable>
                        </View>

                        <Text style={styles.lineTotal}>{formatPrice(getLineTotal(item), itemCurrencyCode)}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.footer}>
              <View style={styles.footerCard}>
                {pricingState.isLoading ? (
                  <Text style={styles.footerPlaceholder}>Calculating totals...</Text>
                ) : (
                  <>
                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Subtotal</Text>
                      <Text style={styles.totalValue}>{formatPrice(subtotal, currencyCode)}</Text>
                    </View>

                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Delivery Fee</Text>
                      <Text style={styles.totalValueSmall}>
                        {formatPrice(pricingState.pricingConfig.deliveryFee, currencyCode)}
                      </Text>
                    </View>

                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Discount</Text>
                      <Text style={styles.totalValueSmall}>
                        {discountAmount > 0 ? `-${formatPrice(discountAmount, currencyCode)}` : formatPrice(0, currencyCode)}
                      </Text>
                    </View>

                    <View style={styles.totalRow}>
                      <Text style={styles.totalLabel}>Total</Text>
                      <Text style={styles.totalValue}>{formatPrice(total, currencyCode)}</Text>
                    </View>

                    {pricingState.errorMessage ? <Text style={styles.footerNote}>{pricingState.errorMessage}</Text> : null}
                  </>
                )}

                <Pressable
                  disabled={pricingState.isLoading || isCartEmpty}
                  onPress={() => setShowAuthModal(true)}
                  style={[styles.primaryButton, pricingState.isLoading || isCartEmpty ? styles.primaryButtonDisabled : null]}
                >
                  <Text style={styles.primaryButtonText}>Proceed</Text>
                </Pressable>
              </View>
            </View>
          </>
        )}

        <AuthChoiceModal
          onClose={() => setShowAuthModal(false)}
          onContinueAsGuest={() => {
            setShowAuthModal(false);
            onProceed();
          }}
          visible={showAuthModal}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#f7f5f1',
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 18
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: brandColors.white,
    borderColor: '#e7e5e4',
    borderRadius: 999,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44
  },
  headerTitle: {
    color: brandColors.black,
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center'
  },
  headerSpacer: {
    width: 44
  },
  clearButton: {
    minWidth: 72,
    paddingVertical: 8
  },
  clearButtonText: {
    color: '#8b6b3e',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right'
  },
  emptyState: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24
  },
  emptyIconWrap: {
    alignItems: 'center',
    backgroundColor: '#ede6db',
    borderRadius: 999,
    height: 72,
    justifyContent: 'center',
    marginBottom: 18,
    width: 72
  },
  emptyTitle: {
    color: brandColors.black,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center'
  },
  emptyDescription: {
    color: '#6d6255',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center'
  },
  itemsScrollView: {
    flex: 1
  },
  itemsContent: {
    gap: 14,
    paddingBottom: 18
  },
  cartItemCard: {
    backgroundColor: brandColors.white,
    borderColor: '#e7e5e4',
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 12
  },
  itemImage: {
    borderRadius: 18,
    height: 88,
    width: 88
  },
  itemContent: {
    flex: 1,
    gap: 12,
    justifyContent: 'space-between'
  },
  itemTopRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between'
  },
  itemTextBlock: {
    flex: 1,
    gap: 4
  },
  itemName: {
    color: brandColors.black,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20
  },
  itemMeta: {
    color: '#6d6255',
    fontSize: 13,
    lineHeight: 18
  },
  itemUnit: {
    color: '#8b8176',
    fontSize: 12,
    fontWeight: '500'
  },
  removeButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 34,
    justifyContent: 'center',
    width: 34
  },
  itemBottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between'
  },
  quantityControl: {
    alignItems: 'center',
    backgroundColor: brandColors.white,
    borderColor: '#e7e5e4',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    height: 38,
    paddingHorizontal: 4
  },
  quantityButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 30,
    justifyContent: 'center',
    width: 30
  },
  quantityButtonText: {
    color: brandColors.black,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20
  },
  quantityText: {
    color: brandColors.black,
    fontSize: 14,
    fontWeight: '700',
    minWidth: 18,
    textAlign: 'center'
  },
  lineTotal: {
    color: brandColors.black,
    fontSize: 15,
    fontWeight: '700'
  },
  footer: {
    backgroundColor: '#f7f5f1',
    paddingBottom: 20,
    paddingTop: 8
  },
  footerCard: {
    backgroundColor: '#fbf7f1',
    borderColor: '#eee7db',
    borderRadius: 28,
    borderWidth: 1,
    gap: 12,
    padding: 18
  },
  footerPlaceholder: {
    color: '#6d6255',
    fontSize: 15,
    fontWeight: '600',
    paddingVertical: 8,
    textAlign: 'center'
  },
  totalRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  totalLabel: {
    color: '#6d6255',
    fontSize: 14
  },
  totalValue: {
    color: brandColors.black,
    fontSize: 18,
    fontWeight: '700'
  },
  totalValueSmall: {
    color: brandColors.black,
    fontSize: 14,
    fontWeight: '700'
  },
  footerNote: {
    color: '#8b6b3e',
    fontSize: 13,
    lineHeight: 18
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: brandColors.logoGreen,
    borderRadius: 999,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  primaryButtonDisabled: {
    opacity: 0.55
  },
  primaryButtonText: {
    color: brandColors.white,
    fontSize: 15,
    fontWeight: '700'
  }
});
