import { type Product } from '@acme/api-client/products';
import { brandColors } from '@acme/shared';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { resolveMobileImageUrl } from '../utils/resolve-mobile-image-url';

type ProductCardProps = {
  product: Product;
};

const formatPrice = (price: number, currencyCode: string) => {
  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode
  });
  return currencyFormatter.format(price);
};

const getProductDescription = (description: Product['description']) =>
  description?.trim() || 'A reliable everyday staple with clean ingredients and easy prep.';

export function ProductCard({ product }: ProductCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          cachePolicy="memory-disk"
          contentFit="contain"
          source={resolveMobileImageUrl(product.imageUrl)}
          style={styles.image}
          transition={180}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.textBlock}>
          <Text style={styles.title}>{product.name}</Text>
          <Text numberOfLines={2} style={styles.description}>
            {getProductDescription(product.description)}
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.price}>
            {formatPrice(product.price, product.currencyCode)}
            <Text style={styles.unit}> / {product.unit}</Text>
          </Text>

          <Pressable accessibilityLabel={`Add ${product.name} to cart`} style={styles.iconButton}>
            <Ionicons color={brandColors.white} name="bag-handle-outline" size={18} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: brandColors.white,
    borderColor: '#e7e5e4',
    borderRadius: 20,
    borderWidth: 1,
    gap: 12,
    padding: 12,
    shadowColor: '#3d2e1f',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
    elevation: 2
  },
  imageContainer: {
    alignItems: 'center',
    backgroundColor: '#f8faf8',
    borderRadius: 16,
    height: 132,
    justifyContent: 'center',
    overflow: 'hidden'
  },
  image: {
    height: '100%',
    width: '100%'
  },
  content: {
    gap: 10
  },
  textBlock: {
    gap: 4
  },
  title: {
    color: brandColors.black,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20
  },
  description: {
    color: '#6d6255',
    fontSize: 12,
    lineHeight: 18
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10
  },
  price: {
    color: brandColors.black,
    flex: 1,
    fontSize: 14,
    fontWeight: '700'
  },
  unit: {
    color: '#78716c',
    fontSize: 11,
    fontWeight: '500'
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: brandColors.logoGreen,
    borderRadius: 999,
    height: 38,
    justifyContent: 'center',
    width: 38
  }
});
