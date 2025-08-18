// ==================================================================
// PRODUCT CARD COMPONENT - CAPA UI
// ==================================================================

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Product } from '../../shared/types';
import { formatPrice } from '../../shared/utils';
import { colors, BaseProps } from './BaseComponent';

interface ProductCardProps extends BaseProps {
  product: Product;
  onPress?: (product: Product) => void;
}

const { width: screenWidth } = Dimensions.get('window');

/**
 * Componente ProductCard para mostrar información de un producto
 * Diseño responsive que se adapta a diferentes tamaños de pantalla
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  style,
  testID,
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(product);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.8}
      testID={testID}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image || 'https://via.placeholder.com/200x200?text=Instrumento' }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        
        <Text style={styles.description} numberOfLines={3}>
          {product.description || 'Instrumento musical disponible'}
        </Text>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            {formatPrice(product.price)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 16,
    minHeight: 120,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
    flex: 1,
  },
  priceContainer: {
    marginTop: 'auto',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
});

// Estilos responsivos para diferentes tamaños de pantalla
const responsiveStyles = StyleSheet.create({
  // Para pantallas pequeñas como iPhone SE
  smallScreen: {
    container: {
      marginHorizontal: 12,
    },
    imageContainer: {
      height: 160,
    },
    infoContainer: {
      padding: 12,
      minHeight: 100,
    },
    name: {
      fontSize: 16,
    },
    description: {
      fontSize: 13,
    },
    price: {
      fontSize: 18,
    },
  },
});

// Aplicar estilos responsivos basados en el ancho de pantalla
if (screenWidth <= 375) { // iPhone SE y dispositivos similares
  Object.assign(styles, responsiveStyles.smallScreen);
}
