// ==================================================================
// HOME SCREEN - CAPA UI
// ==================================================================

import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Product } from '../../shared/types';
import { ProductCard } from '../components/ProductCard';
import { colors, baseStyles } from '../components/BaseComponent';
import { productActions } from '../../state/actions';
import {
  selectProducts,
  selectProductsLoading,
  selectProductsError,
  selectCartItemsCount,
} from '../../state/selectors';
import { MockProductRepository } from '../../infrastructure/api/MockProductsData';

interface HomeScreenProps {
  onNavigateToCart: () => void;
}

/**
 * Pantalla principal que muestra la lista de instrumentos musicales
 * Sin navegación a detalle, solo visualización directa
 */
export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToCart }) => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);
  const cartItemsCount = useSelector(selectCartItemsCount);

  // Instancia del repositorio mock
  const productRepository = new MockProductRepository();

  /**
   * Carga los productos al montar el componente
   */
  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * Función para cargar productos desde el repositorio mock
   */
  const loadProducts = async () => {
    try {
      dispatch(productActions.fetchStart());
      const fetchedProducts = await productRepository.getAllProducts();
      dispatch(productActions.fetchSuccess(fetchedProducts));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      dispatch(productActions.fetchError(errorMessage));
    }
  };

  /**
   * Maneja el refresh de la lista
   */
  const handleRefresh = () => {
    loadProducts();
  };

  /**
   * Renderiza cada item de la lista
   */
  const renderProduct = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      testID={`product-card-${item.id}`}
    />
  );

  /**
   * Renderiza el estado de carga
   */
  if (isLoading && products.length === 0) {
    return (
      <SafeAreaView style={baseStyles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[baseStyles.bodyText, styles.loadingText]}>
          Cargando instrumentos...
        </Text>
      </SafeAreaView>
    );
  }

  /**
   * Renderiza el estado de error
   */
  if (error && products.length === 0) {
    return (
      <SafeAreaView style={baseStyles.centerContainer}>
        <Text style={[baseStyles.headerText, styles.errorTitle]}>
          😔 Oops!
        </Text>
        <Text style={[baseStyles.bodyText, styles.errorText]}>
          No pudimos cargar los instrumentos.
        </Text>
        <Text style={baseStyles.smallText}>
          {error}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>🎵 Jam Store</Text>
            <Text style={styles.subtitle}>Instrumentos Musicales</Text>
          </View>
          
          <TouchableOpacity
            style={styles.cartButton}
            onPress={onNavigateToCart}
            activeOpacity={0.8}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {cartItemsCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[baseStyles.bodyText, styles.emptyText]}>
              No hay instrumentos disponibles
            </Text>
          </View>
        )}
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
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
  },
  cartIcon: {
    fontSize: 24,
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.background,
  },
  cartBadgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingVertical: 8,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  errorTitle: {
    fontSize: 24,
    marginBottom: 16,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.textSecondary,
  },
});
