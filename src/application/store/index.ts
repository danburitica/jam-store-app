// ==================================================================
// REDUX STORE CONFIGURATION - PATRÓN FLUX
// ==================================================================

import { createStore, applyMiddleware, Store } from 'redux';
import { rootReducer, RootState } from '../../state/reducers';

// Middleware personalizado para logging en desarrollo
const loggerMiddleware = (store: any) => (next: any) => (action: any) => {
  if (__DEV__) {
    console.group(`🔄 ACTION: ${action.type}`);
    console.log('Previous State:', store.getState());
    console.log('Action:', action);
  }
  
  const result = next(action);
  
  if (__DEV__) {
    console.log('Next State:', store.getState());
    console.groupEnd();
  }
  
  return result;
};

// Configuración del store
export const configureStore = (): Store<RootState> => {
  const store = createStore(
    rootReducer,
    applyMiddleware(loggerMiddleware)
  );

  return store;
};

// Crear la instancia del store
export const store = configureStore();

// Tipos para usar en la aplicación
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;

// Exportar el estado global
export type { RootState } from '../../state/reducers';

