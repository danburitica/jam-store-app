// ==================================================================
// SPLASH SCREEN - CAPA UI
// ==================================================================

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SplashScreenProps {
  onFinish: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * Pantalla de bienvenida que se muestra al iniciar la aplicación
 * Diseño minimalista con temática musical
 */
export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Animaciones
  const fadeAnim = React.useMemo(() => new Animated.Value(0), []);
  const scaleAnim = React.useMemo(() => new Animated.Value(0.5), []);
  const slideAnim = React.useMemo(() => new Animated.Value(50), []);
  const pulseAnim = React.useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    // Iniciar animaciones de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de pulsación para los puntos de carga
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Timer para transición automática al Home
    const timer = setTimeout(() => {
      pulseAnimation.stop();
      // Animación de salida
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onFinish();
      });
    }, 2500); // 2.5 segundos

    return () => {
      clearTimeout(timer);
      pulseAnimation.stop();
    };
  }, [fadeAnim, scaleAnim, slideAnim, pulseAnim, onFinish]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo de la aplicación */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image 
            source={require('../../assets/images/imagotipo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>



        {/* Indicador de carga sutil */}
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.loadingDot} />
          <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
          <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e', // Azul oscuro elegante
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: screenWidth > 375 ? 200 : 160, // Responsive y más grande
    width: screenWidth > 375 ? 400 : 320, // Responsive y más grande
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: screenWidth > 375 ? 42 : 36, // Responsive
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  tagline: {
    fontSize: screenWidth > 375 ? 18 : 16, // Responsive
    color: '#a8a8a8',
    textAlign: 'center',
    fontWeight: '300',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: screenHeight > 667 ? 100 : 80, // Responsive
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    marginHorizontal: 4,
    opacity: 0.3,
  },
  loadingDotDelay1: {
    opacity: 0.6,
  },
  loadingDotDelay2: {
    opacity: 0.9,
  },
});

// Estilos adicionales para pantallas muy pequeñas (iPhone SE)
if (screenWidth <= 375) {
  Object.assign(styles, {
    content: {
      ...styles.content,
      paddingHorizontal: 30,
    },
    iconContainer: {
      ...styles.iconContainer,
      marginBottom: 20,
    },
    textContainer: {
      ...styles.textContainer,
      marginBottom: 40,
    },
  });
}
