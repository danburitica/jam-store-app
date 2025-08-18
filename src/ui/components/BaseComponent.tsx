// ==================================================================
// BASE COMPONENT - CAPA UI
// ==================================================================

import React from 'react';
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

/**
 * Props base que todos los componentes pueden extender
 */
export interface BaseProps {
  testID?: string;
  style?: ViewStyle | TextStyle;
}

/**
 * Estilos base comunes para todos los componentes
 * Siguiendo los principios de responsive design
 */
export const baseStyles = StyleSheet.create({
  // Contenedores
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  safeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Textos
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
  },
  bodyText: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 24,
  },
  smallText: {
    fontSize: 14,
    color: '#999999',
  },
  
  // Botones
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44, // Tamaño mínimo táctil
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  
  // Layouts responsivos
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  spaceAround: {
    justifyContent: 'space-around',
  },
  
  // Espaciado
  padding: {
    padding: 16,
  },
  paddingHorizontal: {
    paddingHorizontal: 16,
  },
  paddingVertical: {
    paddingVertical: 16,
  },
  margin: {
    margin: 16,
  },
  marginHorizontal: {
    marginHorizontal: 16,
  },
  marginVertical: {
    marginVertical: 16,
  },
  
  // Sombras y elevación
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  // Estados
  disabled: {
    opacity: 0.5,
  },
  loading: {
    opacity: 0.7,
  },
});

/**
 * Colores del tema de la aplicación
 */
export const colors = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  background: '#FFFFFF',
  surface: '#F2F2F7',
  text: '#000000',
  textSecondary: '#666666',
  textTertiary: '#999999',
  border: '#E0E0E0',
  placeholder: '#C7C7CC',
} as const;

