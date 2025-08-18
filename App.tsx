/**
 * Jam Store App - Tienda Virtual de Instrumentos Musicales
 * Arquitectura Hexagonal + Redux (Flux) + React Native
 *
 * @format
 */

import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/application/store';
import { baseStyles, colors } from './src/ui/components/BaseComponent';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <View style={baseStyles.centerContainer}>
        <Text style={baseStyles.headerText}>🎵 Jam Store</Text>
        <Text style={[baseStyles.bodyText, styles.subtitle]}>
          Tienda Virtual de Instrumentos Musicales
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  subtitle: {
    marginTop: 8,
    marginBottom: 16,
    textAlign: 'center',
  },
  readyText: {
    marginTop: 20,
    color: colors.success,
    fontWeight: '600',
  },
});

export default App;
