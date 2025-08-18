/**
 * Jam Store App - Tienda Virtual de Instrumentos Musicales
 * Arquitectura Hexagonal + Redux (Flux) + React Native
 *
 * @format
 */

import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from './src/application/store';
import { HomeScreen } from './src/ui/screens/HomeScreen';
import { SplashScreen } from './src/ui/screens/SplashScreen';
import { useAppNavigation, AppScreen } from './src/shared/hooks/useAppNavigation';

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
  const { currentScreen, navigateToHome } = useAppNavigation();

  if (currentScreen === AppScreen.SPLASH) {
    return <SplashScreen onFinish={navigateToHome} />;
  }

  return <HomeScreen />;
}

export default App;
