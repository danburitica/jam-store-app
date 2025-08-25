// ==================================================================
// USE APP NAVIGATION HOOK TESTS - SHARED LAYER
// ==================================================================

import { useAppNavigation, AppScreen } from '../../../src/shared/hooks/useAppNavigation';

describe('useAppNavigation Hook', () => {
  it('should export AppScreen enum with correct values', () => {
    expect(AppScreen.SPLASH).toBe('SPLASH');
    expect(AppScreen.HOME).toBe('HOME');
    expect(AppScreen.CART).toBe('CART');
  });

  it('should export useAppNavigation function', () => {
    expect(typeof useAppNavigation).toBe('function');
  });

  it('should have correct AppScreen enum structure', () => {
    expect(Object.keys(AppScreen)).toHaveLength(3);
    expect(Object.values(AppScreen)).toEqual(['SPLASH', 'HOME', 'CART']);
    expect(Object.entries(AppScreen)).toEqual([
      ['SPLASH', 'SPLASH'],
      ['HOME', 'HOME'],
      ['CART', 'CART']
    ]);
  });

  it('should maintain consistent screen values', () => {
    expect(AppScreen.SPLASH).toBe('SPLASH');
    expect(AppScreen.HOME).toBe('HOME');
    expect(AppScreen.CART).toBe('CART');
    
    // Values should be strings
    expect(typeof AppScreen.SPLASH).toBe('string');
    expect(typeof AppScreen.HOME).toBe('string');
    expect(typeof AppScreen.CART).toBe('string');
  });

  it('should have valid enum values', () => {
    const allScreens = Object.values(AppScreen);
    expect(allScreens).toContain('SPLASH');
    expect(allScreens).toContain('HOME');
    expect(allScreens).toContain('CART');
    
    // All values should be strings
    allScreens.forEach(screen => {
      expect(typeof screen).toBe('string');
      expect(screen.length).toBeGreaterThan(0);
    });
  });

  it('should have unique enum values', () => {
    const values = Object.values(AppScreen);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  it('should have consistent enum keys', () => {
    const keys = Object.keys(AppScreen);
    expect(keys).toContain('SPLASH');
    expect(keys).toContain('HOME');
    expect(keys).toContain('CART');
    
    // All keys should be strings
    keys.forEach(key => {
      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
    });
  });

  it('should work with string comparisons', () => {
    const splash = AppScreen.SPLASH;
    const home = AppScreen.HOME;
    const cart = AppScreen.CART;
    
    expect(splash === 'SPLASH').toBe(true);
    expect(home === 'HOME').toBe(true);
    expect(cart === 'CART').toBe(true);
    
    expect(splash).not.toBe(home);
    expect(home).not.toBe(cart);
    expect(cart).not.toBe(splash);
  });

  it('should handle enum in switch statements', () => {
    const testScreen = (screen: AppScreen): string => {
      switch (screen) {
        case AppScreen.SPLASH:
          return 'splash';
        case AppScreen.HOME:
          return 'home';
        case AppScreen.CART:
          return 'cart';
        default:
          return 'unknown';
      }
    };
    
    expect(testScreen(AppScreen.SPLASH)).toBe('splash');
    expect(testScreen(AppScreen.HOME)).toBe('home');
    expect(testScreen(AppScreen.CART)).toBe('cart');
  });

  it('should work with array operations', () => {
    const screens = [AppScreen.SPLASH, AppScreen.HOME, AppScreen.CART];
    
    expect(screens).toHaveLength(3);
    expect(screens).toContain(AppScreen.SPLASH);
    expect(screens).toContain(AppScreen.HOME);
    expect(screens).toContain(AppScreen.CART);
    
    // Test filtering
    const splashScreens = screens.filter(screen => screen === AppScreen.SPLASH);
    expect(splashScreens).toHaveLength(1);
    expect(splashScreens[0]).toBe(AppScreen.SPLASH);
  });

  it('should work with object operations', () => {
    const screenMap = {
      [AppScreen.SPLASH]: 'Splash Screen',
      [AppScreen.HOME]: 'Home Screen',
      [AppScreen.CART]: 'Cart Screen'
    };
    
    expect(screenMap[AppScreen.SPLASH]).toBe('Splash Screen');
    expect(screenMap[AppScreen.HOME]).toBe('Home Screen');
    expect(screenMap[AppScreen.CART]).toBe('Cart Screen');
  });

  it('should maintain type safety', () => {
    // Test that AppScreen values are assignable to string
    const screen: string = AppScreen.SPLASH;
    expect(typeof screen).toBe('string');
    
    // Test that AppScreen can be used in string arrays
    const screenArray: string[] = [AppScreen.SPLASH, AppScreen.HOME, AppScreen.CART];
    expect(Array.isArray(screenArray)).toBe(true);
    expect(screenArray).toHaveLength(3);
  });
});
