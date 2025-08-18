// ==================================================================
// APP NAVIGATION HOOK - SHARED
// ==================================================================

import { useState, useCallback } from 'react';

/**
 * Estados de la aplicación para navegación
 */
export enum AppScreen {
  SPLASH = 'SPLASH',
  HOME = 'HOME',
}

/**
 * Hook personalizado para manejar la navegación de la aplicación
 * Controla la transición entre Splash Screen y Home Screen
 */
export const useAppNavigation = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.SPLASH);

  /**
   * Navega al Home Screen
   */
  const navigateToHome = useCallback(() => {
    setCurrentScreen(AppScreen.HOME);
  }, []);

  /**
   * Navega al Splash Screen (para casos especiales)
   */
  const navigateToSplash = useCallback(() => {
    setCurrentScreen(AppScreen.SPLASH);
  }, []);

  /**
   * Verifica si está en una pantalla específica
   */
  const isCurrentScreen = useCallback((screen: AppScreen) => {
    return currentScreen === screen;
  }, [currentScreen]);

  return {
    currentScreen,
    navigateToHome,
    navigateToSplash,
    isCurrentScreen,
  };
};
