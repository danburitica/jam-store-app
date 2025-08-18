# 🎵 Jam Store - Arquitectura del Proyecto

## 📐 Arquitectura Hexagonal + Redux (Flux)

Este proyecto implementa una **Arquitectura Hexagonal** adaptada a React Native, combinada con el patrón **Flux** usando Redux para el manejo de estado.

## 📂 Estructura del Proyecto

```
src/
├── application/           # Capa de Aplicación
│   ├── store/            # Configuración del store Redux
│   └── usecases/         # Casos de uso de la aplicación
├── domain/               # Capa de Dominio (Núcleo)
│   ├── entities/         # Entidades del negocio
│   ├── repositories/     # Interfaces de repositorios
│   └── services/         # Interfaces de servicios
├── infrastructure/       # Capa de Infraestructura
│   ├── api/             # Llamadas a APIs externas
│   ├── storage/         # Almacenamiento local
│   └── encryption/      # Servicios de cifrado
├── ui/                  # Capa de Presentación
│   ├── components/      # Componentes reutilizables
│   ├── screens/         # Pantallas de la aplicación
│   └── navigation/      # Configuración de navegación
├── state/               # Redux State Management
│   ├── actions/         # Acciones Redux (Flux)
│   ├── reducers/        # Reducers Redux
│   └── selectors/       # Selectores para obtener datos
└── shared/              # Código Compartido
    ├── utils/           # Funciones utilitarias
    ├── constants/       # Constantes globales
    └── types/           # Tipos TypeScript
```

## 🔐 Seguridad

- **Cifrado**: Todas las transacciones se almacenan cifradas usando AES-256
- **Storage**: Datos sensibles nunca se almacenan en texto plano
- **Validación**: Validación en múltiples capas (UI, Domain, Infrastructure)

## 🧪 Testing

```bash
# Ejecutar tests
npm test

# Ejecutar en modo watch
npm run test:watch
```

## 🚀 Desarrollo

```bash
# Ejecutar en iOS
npm run ios

# Ejecutar en Android
npm run android

# Iniciar Metro bundler
npm start
```

## 📦 Dependencias Principales

- **react-native**: Framework principal
- **redux**: Manejo de estado
- **react-redux**: Conexión Redux-React
- **@react-native-async-storage/async-storage**: Almacenamiento local
- **crypto-js**: Cifrado de datos
- **react-native-safe-area-context**: Manejo de safe areas
