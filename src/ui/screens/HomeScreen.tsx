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
} from '../../state/selectors';
import { MockProductRepository } from '../../infrastructure/api/MockProductsData';

/**
 * Pantalla principal que muestra la lista de instrumentos musicales
 * Sin navegación a detalle, solo visualización directa
 */
export const HomeScreen: React.FC = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const isLoading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

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
        <Text style={styles.title}>🎵 Jam Store</Text>
        <Text style={styles.subtitle}>Instrumentos Musicales</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
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
