import type { PublicOrder } from '@acme/api-client';
import { brandColors } from '@acme/shared';
import Ionicons from '@expo/vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef } from 'react';
import { BackHandler, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useCart } from './cart/use-cart';
import { Screen } from './components/screen';

type OrderConfirmationScreenProps = {
  order: PublicOrder;
  onBackToHome: () => void;
};

const formatPrice = (price: number, currencyCode = 'USD') =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
  }).format(price);

const getDeliveryLabel = (deliveryMode: PublicOrder['deliveryMode']) =>
  deliveryMode === 'instant' ? 'Instant delivery' : 'Scheduled delivery';

export function OrderConfirmationScreen({ onBackToHome, order }: OrderConfirmationScreenProps) {
  const { clearCartItems } = useCart();
  const hasClearedCartRef = useRef(false);
  const orderId = `#${order.id.slice(-8).toUpperCase()}`;
  const total = order.grandTotal ?? order.totalAmount;

  useEffect(() => {
    if (hasClearedCartRef.current) {
      return;
    }

    clearCartItems();
    hasClearedCartRef.current = true;
  }, [clearCartItems]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onBackToHome();
      return true;
    });

    return () => {
      subscription.remove();
    };
  }, [onBackToHome]);

  return (
    <Screen>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroIcon}>
          <Ionicons color={brandColors.logoGreen} name="checkmark-circle" size={68} />
        </View>

        <Text style={styles.title}>Order placed!</Text>
        <Text style={styles.orderId}>{orderId}</Text>

        <View style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Delivery</Text>
            <Text style={styles.detailValue}>{getDeliveryLabel(order.deliveryMode)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Address</Text>
            <Text style={styles.detailValueRight}>{order.guestAddress}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items</Text>

          {order.items?.length ? (
            <View style={styles.itemsList}>
              {order.items.map((item) => (
                <View key={`${item.productId}-${item.quantity}-${item.lineTotal}`} style={styles.itemRow}>
                  <View style={styles.itemTextBlock}>
                    <Text style={styles.itemName}>{item.productId}</Text>
                    <Text style={styles.itemMeta}>
                      Qty {item.quantity} x {formatPrice(item.unitPrice)}
                    </Text>
                  </View>

                  <Text style={styles.itemTotal}>{formatPrice(item.lineTotal)}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.emptyItemsText}>Order items are unavailable for this confirmation.</Text>
          )}
        </View>

        {typeof total === 'number' ? (
          <View style={styles.totalCard}>
            <Text style={styles.totalLabel}>Grand total</Text>
            <Text style={styles.totalValue}>{formatPrice(total)}</Text>
          </View>
        ) : null}

        <Pressable onPress={onBackToHome} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Back to shopping</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: 'stretch',
    backgroundColor: '#f7f5f1',
    gap: 16,
    minHeight: '100%',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 32
  },
  heroIcon: {
    alignItems: 'center',
    marginBottom: 4
  },
  title: {
    color: brandColors.black,
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center'
  },
  orderId: {
    color: '#6d6255',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
    textAlign: 'center'
  },
  card: {
    backgroundColor: brandColors.white,
    borderColor: '#e7e5e4',
    borderRadius: 24,
    borderWidth: 1,
    gap: 14,
    padding: 18
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between'
  },
  detailLabel: {
    color: '#6d6255',
    fontSize: 14
  },
  detailValue: {
    color: brandColors.black,
    fontSize: 14,
    fontWeight: '700'
  },
  detailValueRight: {
    color: brandColors.black,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right'
  },
  sectionTitle: {
    color: brandColors.black,
    fontSize: 20,
    fontWeight: '700'
  },
  itemsList: {
    gap: 12
  },
  itemRow: {
    alignItems: 'center',
    borderTopColor: '#f0ebe3',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingTop: 12
  },
  itemTextBlock: {
    flex: 1,
    gap: 3
  },
  itemName: {
    color: brandColors.black,
    fontSize: 14,
    fontWeight: '700'
  },
  itemMeta: {
    color: '#6d6255',
    fontSize: 13
  },
  itemTotal: {
    color: brandColors.black,
    fontSize: 14,
    fontWeight: '700'
  },
  emptyItemsText: {
    color: '#6d6255',
    fontSize: 14,
    lineHeight: 20
  },
  totalCard: {
    alignItems: 'center',
    backgroundColor: '#fbf7f1',
    borderColor: '#eee7db',
    borderRadius: 24,
    borderWidth: 1,
    gap: 6,
    padding: 18
  },
  totalLabel: {
    color: '#6d6255',
    fontSize: 14
  },
  totalValue: {
    color: brandColors.black,
    fontSize: 24,
    fontWeight: '700'
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: brandColors.logoGreen,
    borderRadius: 999,
    justifyContent: 'center',
    minHeight: 50,
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 12
  },
  primaryButtonText: {
    color: brandColors.white,
    fontSize: 15,
    fontWeight: '700'
  }
});
