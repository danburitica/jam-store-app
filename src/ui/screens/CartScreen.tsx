// ==================================================================
// CART SCREEN - CAPA UI
// ==================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemsCount,
} from '../../state/selectors';
import { cartActions } from '../../state/actions';
import { CartItem } from '../../shared/types';
import { formatPrice } from '../../shared/utils';
import { colors } from '../components/BaseComponent';
import { PaymentBackdrop } from '../components/PaymentBackdrop';

interface CartScreenProps {
  onBackToHome: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

/**
 * Pantalla de Carrito de Compras
 * Muestra los productos agregados y permite proceder al pago
 */
export const CartScreen: React.FC<CartScreenProps> = ({ onBackToHome }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const itemsCount = useSelector(selectCartItemsCount);
  
  const [showPaymentBackdrop, setShowPaymentBackdrop] = useState(false);

  /**
   * Aumenta la cantidad de un producto en el carrito
   */
  const increaseQuantity = (productId: string, currentQuantity: number) => {
    dispatch(cartActions.updateQuantity(productId, currentQuantity + 1));
  };

  /**
   * Disminuye la cantidad de un producto en el carrito
   */
  const decreaseQuantity = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      dispatch(cartActions.updateQuantity(productId, currentQuantity - 1));
    } else {
      dispatch(cartActions.removeItem(productId));
    }
  };

  /**
   * Elimina un producto del carrito
   */
  const removeItem = (productId: string) => {
    dispatch(cartActions.removeItem(productId));
  };

  /**
   * Renderiza cada item del carrito
   */
  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItemContainer}>
      <Image
        source={{ uri: item.product.image || 'https://via.placeholder.com/80x80?text=Instrumento' }}
        style={styles.productImage}
        resizeMode="cover"
      />
      
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.productPrice}>
          {formatPrice(item.product.price)}
        </Text>
      </View>

      <View style={styles.quantityControls}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => decreaseQuantity(item.product.id, item.quantity)}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        
        <Text style={styles.quantityText}>{item.quantity}</Text>
        
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => increaseQuantity(item.product.id, item.quantity)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeItem(item.product.id)}
      >
        <Text style={styles.removeButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Renderiza el estado vacío del carrito
   */
  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
      <Text style={styles.emptySubtitle}>
        Agrega algunos instrumentos desde la tienda
      </Text>
      <TouchableOpacity style={styles.backToHomeButton} onPress={onBackToHome}>
        <Text style={styles.backToHomeButtonText}>Ir a la Tienda</Text>
      </TouchableOpacity>
    </View>
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderEmptyCart()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBackToHome}>
          <Text style={styles.backButtonText}>← Tienda</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Carrito ({itemsCount})</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Lista de productos */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.product.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Footer con total y botón de pago */}
      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>
            {formatPrice(cartTotal)}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.payButton}
          onPress={() => setShowPaymentBackdrop(true)}
        >
          <Text style={styles.payButtonText}>
            💳 Paga con Tarjeta de Crédito
          </Text>
        </TouchableOpacity>
      </View>

      {/* Backdrop de pago */}
      <PaymentBackdrop
        visible={showPaymentBackdrop}
        onClose={() => setShowPaymentBackdrop(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 60, // Para centrar el título
  },
  listContainer: {
    padding: 16,
  },
  cartItemContainer: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: colors.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  removeButtonText: {
    fontSize: 18,
  },
  footer: {
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  payButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  // Estados vacíos
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  backToHomeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backToHomeButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
});

// Estilos responsivos para pantallas pequeñas
if (screenWidth <= 375) {
  Object.assign(styles, {
    cartItemContainer: {
      ...styles.cartItemContainer,
      padding: 12,
    },
    productImage: {
      ...styles.productImage,
      width: 50,
      height: 50,
    },
    productName: {
      ...styles.productName,
      fontSize: 14,
    },
    productPrice: {
      ...styles.productPrice,
      fontSize: 13,
    },
  });
}
