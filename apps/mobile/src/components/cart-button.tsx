import { brandColors } from '@acme/shared';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useCart } from '../cart/use-cart';

type CartButtonProps = {
  onPress?: () => void;
};

export function CartButton({ onPress }: CartButtonProps) {
  const { cartCount } = useCart();
  const badgeText = cartCount > 99 ? '99+' : String(cartCount);

  return (
    <Pressable accessibilityLabel="Open cart" onPress={onPress} style={styles.button}>
      <Ionicons color={brandColors.black} name="cart-outline" size={22} />

      {cartCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeText}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: brandColors.white,
    borderColor: '#e7e5e4',
    borderRadius: 999,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44
  },
  badge: {
    alignItems: 'center',
    backgroundColor: brandColors.logoGreen,
    borderColor: brandColors.white,
    borderRadius: 999,
    borderWidth: 2,
    justifyContent: 'center',
    minWidth: 22,
    paddingHorizontal: 5,
    position: 'absolute',
    right: -4,
    top: -4
  },
  badgeText: {
    color: brandColors.white,
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14
  }
});
