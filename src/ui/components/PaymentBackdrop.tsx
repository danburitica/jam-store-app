// ==================================================================
// PAYMENT BACKDROP COMPONENT - CAPA UI
// ==================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { colors } from './BaseComponent';
import { selectCartItems, selectCartTotal } from '../../state/selectors';
import { formatPrice } from '../../shared/utils';
import { cartActions } from '../../state/actions';
import { ProcessTransactionUseCase } from '../../application/usecases/ProcessTransactionUseCase';
import { defaultTransactionService } from '../../infrastructure/api/TransactionService';

// Importar logos de tarjetas
const visaLogo = require('../../assets/images/visa-logo.png');
const mastercardLogo = require('../../assets/images/mastercard-logo.png');

import {
  detectCardType,
  formatCardNumber,
  formatExpiryDate,
  validateCardNumber,
  validateExpiryDate,
  validateCVC,
  validateCardholderName,
  validateEmail,
  validateDocumentNumber,
  maskCardNumber,
  getInstallmentLabel,
  COLOMBIA_DOCUMENT_TYPES,
  INSTALLMENT_OPTIONS,
} from '../../shared/utils/cardValidation';

interface PaymentBackdropProps {
  visible: boolean;
  onClose: () => void;
  onBackToHome: () => void;
}

enum PaymentStep {
  FORM = 'FORM',
  SUMMARY = 'SUMMARY',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
}

enum PaymentResult {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

interface FormData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
  email: string;
  documentType: string;
  documentNumber: string;
  installments: number;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * Componente backdrop para captura de datos de tarjeta de crédito
 * Incluye validaciones automáticas y detección de tipo de tarjeta
 */
export const PaymentBackdrop: React.FC<PaymentBackdropProps> = ({
  visible,
  onClose,
  onBackToHome,
}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const [currentStep, setCurrentStep] = useState<PaymentStep>(PaymentStep.FORM);
  const [paymentResult, setPaymentResult] = useState<PaymentResult | null>(null);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [formData, setFormData] = useState<FormData>({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    email: '',
    documentType: 'CC',
    documentNumber: '',
    installments: 1,
  });

  const [showDocumentTypes, setShowDocumentTypes] = useState(false);
  const [showInstallments, setShowInstallments] = useState(false);

  // Instancia del use case
  const processTransactionUseCase = new ProcessTransactionUseCase(defaultTransactionService);

  // Debug: Monitorear cambios en el estado
  useEffect(() => {
    console.log('🔄 Estado actual del backdrop:', currentStep);
    console.log('📋 Resultado del pago:', paymentResult);
    console.log('💾 Datos de transacción:', transactionData);
  }, [currentStep, paymentResult, transactionData]);

  // Detectar tipo de tarjeta
  const cardType = detectCardType(formData.cardNumber);

  // Validaciones individuales
  const isCardNumberValid = validateCardNumber(formData.cardNumber);
  const isExpiryValid = validateExpiryDate(formData.expiryDate);
  const isCvcValid = validateCVC(formData.cvc);
  const isNameValid = validateCardholderName(formData.cardholderName) && formData.cardholderName.trim().length >= 5;
  const isEmailValid = validateEmail(formData.email);
  const isDocumentValid = validateDocumentNumber(formData.documentNumber, formData.documentType);

  // Validación general del formulario
  const isFormValid = isCardNumberValid && isExpiryValid && isCvcValid && isNameValid && isEmailValid && isDocumentValid;

  /**
   * Actualiza un campo del formulario
   */
  const updateField = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Maneja el cambio en el número de tarjeta
   */
  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    updateField('cardNumber', formatted);
  };

  /**
   * Maneja el cambio en la fecha de expiración
   */
  const handleExpiryDateChange = (value: string) => {
    const formatted = formatExpiryDate(value);
    updateField('expiryDate', formatted);
  };

  /**
   * Maneja el envío del formulario y navega al resumen
   */
  const handleSubmit = () => {
    if (isFormValid) {
      setCurrentStep(PaymentStep.SUMMARY);
    }
  };

  /**
   * Simula el procesamiento del pago
   */
  const handlePay = async () => {
    try {
      console.log('🔄 Iniciando procesamiento de pago...');
      
      // Cambiar a estado de procesamiento
      setCurrentStep(PaymentStep.PROCESSING);
      
      // Preparar datos para el use case
      const request = {
        cardNumber: formData.cardNumber,
        cvc: formData.cvc,
        expiryDate: formData.expiryDate,
        cardholderName: formData.cardholderName,
        documentNumber: formData.documentNumber,
        documentType: formData.documentType,
        amount: cartTotal,
        customerEmail: formData.email,
        installments: formData.installments,
      };

      console.log('📋 Datos del formulario:', request);

      // Procesar transacción
      console.log('🔄 Procesando transacción...', request);
      
      const result = await processTransactionUseCase.execute(request) as any;
      
      console.log('📋 Resultado de transacción:', result);
      
      if (result.success && result.transaction) {
        console.log('✅ Transacción exitosa:', result.transaction);
        setTransactionData(result.transaction);
        setPaymentResult(result.transaction.status === 'APPROVED' ? PaymentResult.SUCCESS : PaymentResult.FAILED);
      } else {
        console.log('❌ Transacción fallida:', result.error);
        setPaymentResult(PaymentResult.FAILED);
        setTransactionData({ message: result.error || 'Error al procesar la transacción' });
      }
      
      console.log('🔄 Cambiando a estado RESULT...');
      // Cambiar al estado de resultado
      setCurrentStep(PaymentStep.RESULT);
      console.log('✅ Estado cambiado a RESULT');
    } catch (error) {
      console.log('💥 Error en transacción:', error);
      setPaymentResult(PaymentResult.FAILED);
      setTransactionData({ message: 'Error de conexión con el servidor' });
      setCurrentStep(PaymentStep.RESULT);
      console.log('✅ Estado cambiado a RESULT después del error');
    }
  };

  /**
   * Maneja el botón "Volver al Home"
   */
  const handleBackToHome = () => {
    // Limpiar el carrito solo si el pago fue exitoso
    if (paymentResult === PaymentResult.SUCCESS) {
      dispatch(cartActions.clearCart());
    }
    
    // Cerrar backdrop y navegar al home
    handleClose();
    onBackToHome();
  };

  /**
   * Reinicia el backdrop al cerrarlo
   */
  const handleClose = () => {
    setCurrentStep(PaymentStep.FORM);
    setPaymentResult(null);
    setTransactionData(null);
    onClose();
  };

  /**
   * Renderiza un selector dropdown
   */
  const renderDropdown = (
    options: readonly { label: string; value: any }[],
    selectedValue: any,
    onSelect: (value: any) => void,
    _placeholder: string
  ) => (
    <ScrollView 
      style={styles.dropdownContainer}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      {options.map((option, index) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.dropdownOption,
            selectedValue === option.value && styles.dropdownOptionSelected,
            index === options.length - 1 && styles.dropdownOptionLast,
          ]}
          onPress={() => onSelect(option.value)}
        >
          <Text
            style={[
              styles.dropdownOptionText,
              selectedValue === option.value && styles.dropdownOptionTextSelected,
            ]}
          >
            {option.label}
          </Text>
          {selectedValue === option.value && (
            <Text style={styles.dropdownCheckmark}>✓</Text>
          )}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  /**
   * Renderiza el estado de procesamiento
   */
  const renderProcessing = () => (
    <View style={styles.processingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.processingText}>Procesando tu pago...</Text>
      <Text style={styles.processingSubtext}>
        Por favor espera mientras verificamos tu información
      </Text>
    </View>
  );

  /**
   * Renderiza el resultado del pago
   */
  const renderPaymentResult = () => (
    <View style={styles.resultContainer}>
      {paymentResult === PaymentResult.SUCCESS ? (
        <>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✅</Text>
          </View>
          <Text style={styles.successTitle}>¡Pago exitoso!</Text>
          <Text style={styles.successSubtitle}>
            {transactionData?.message || 'Tu compra ha sido procesada correctamente'}
          </Text>
          <View style={styles.successDetails}>
            <Text style={styles.successDetailsText}>
              Total pagado: {formatPrice(cartTotal)}
            </Text>
            <Text style={styles.successDetailsText}>
              Cuotas: {getInstallmentLabel(formData.installments)}
            </Text>
            {transactionData?.transactionId && (
              <Text style={styles.successDetailsText}>
                ID: {transactionData.transactionId}
              </Text>
            )}
            {transactionData?.reference && (
              <Text style={styles.successDetailsText}>
                Referencia: {transactionData.reference}
              </Text>
            )}
          </View>
        </>
      ) : (
        <>
          <View style={styles.errorIcon}>
            <Text style={styles.errorIconText}>❌</Text>
          </View>
          <Text style={styles.errorTitle}>El pago no se pudo procesar</Text>
          <Text style={styles.errorSubtitle}>
            {transactionData?.message || 'Verifica tus datos e intenta nuevamente'}
          </Text>
          {transactionData?.status && transactionData.status !== 'APPROVED' && (
            <View style={styles.errorDetails}>
              <Text style={styles.errorDetailsText}>
                Estado: {transactionData.status}
              </Text>
              {transactionData?.attempts && (
                <Text style={styles.errorDetailsText}>
                  Intentos: {transactionData.attempts}
                </Text>
              )}
            </View>
          )}
        </>
      )}
      
      <TouchableOpacity style={styles.backToHomeButton} onPress={handleBackToHome}>
        <Text style={styles.backToHomeButtonText}>🏠 Regresar al Home</Text>
      </TouchableOpacity>
    </View>
  );

  /**
   * Renderiza el resumen de pago
   */
  const renderPaymentSummary = () => (
    <View>
      {/* Datos del comprador */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>👤 Datos del comprador</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Nombre:</Text>
          <Text style={styles.summaryValue}>{formData.cardholderName}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Email:</Text>
          <Text style={styles.summaryValue}>{formData.email}</Text>
        </View>
                    <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Identificación:</Text>
              <Text style={styles.summaryValue}>
                {formData.documentType} {formData.documentNumber}
              </Text>
            </View>
      </View>

      {/* Datos de la tarjeta */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>💳 Tarjeta de crédito</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Número:</Text>
          <Text style={styles.summaryValue}>{maskCardNumber(formData.cardNumber)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Cuotas:</Text>
          <Text style={styles.summaryValue}>{getInstallmentLabel(formData.installments)}</Text>
        </View>
      </View>

      {/* Productos del carrito */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>🛒 Tu pedido</Text>
        {cartItems.map((item, index) => (
          <View key={`${item.product.id}-${index}`} style={styles.productRow}>
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.product.name}
              </Text>
              <Text style={styles.productQuantity}>Cantidad: {item.quantity}</Text>
            </View>
            <Text style={styles.productPrice}>
              {formatPrice(item.product.price * item.quantity)}
            </Text>
          </View>
        ))}
        
        {/* Total */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total a pagar:</Text>
          <Text style={styles.totalValue}>{formatPrice(cartTotal)}</Text>
        </View>
      </View>

      {/* Botón de pagar */}
      <TouchableOpacity style={styles.payButton} onPress={handlePay}>
        <Text style={styles.payButtonText}>💰 Pagar</Text>
      </TouchableOpacity>
    </View>
  );

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => {
        // Solo permitir cerrar si no está procesando o mostrando resultado
        if (currentStep !== PaymentStep.PROCESSING && currentStep !== PaymentStep.RESULT) {
          handleClose();
        }
      }}
    >
      <KeyboardAvoidingView 
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? -100 : 0}
      >
        <View style={styles.backdrop}>
          <View style={styles.container}>
            {/* Header fijo */}
            <View style={styles.header}>
              {currentStep === PaymentStep.SUMMARY && (
                <TouchableOpacity style={styles.backButton} onPress={() => setCurrentStep(PaymentStep.FORM)}>
                  <Text style={styles.title}>← 🧾 Resumen de Pago</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.title}>
                {currentStep === PaymentStep.FORM && '💳 Datos de Pago'}
                {currentStep === PaymentStep.PROCESSING && '⏳ Procesando Pago'}
                {currentStep === PaymentStep.RESULT && '📋 Resultado'}
              </Text>
              {currentStep !== PaymentStep.PROCESSING && currentStep !== PaymentStep.RESULT && (
                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Contenido scrollable con manejo de teclado */}
            <View style={styles.content}>
              {currentStep === PaymentStep.FORM ? (
                <ScrollView 
                  style={styles.scrollContainer} 
                  showsVerticalScrollIndicator={false} 
                  contentContainerStyle={[
                    styles.scrollContent,
                    Platform.OS === 'ios' && { paddingBottom: 120 }, // Más padding en iOS para teclado
                    Platform.OS === 'android' && { paddingBottom: 60 } // Padding reducido en Android
                  ]}
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled={true}
                  automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
                  keyboardDismissMode="interactive"
                  contentInsetAdjustmentBehavior="automatic"
                >
                {/* Número de tarjeta */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Número de tarjeta</Text>
              <View style={styles.cardNumberContainer}>
                <TextInput
                  style={[styles.input, !isCardNumberValid && formData.cardNumber.length > 0 && styles.inputError]}
                  value={formData.cardNumber}
                  onChangeText={handleCardNumberChange}
                  placeholder="1234 5678 9012 3456"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="numeric"
                  maxLength={19}
                />
                {cardType.name !== 'UNKNOWN' && (
                  <Image 
                    source={cardType.name === 'VISA' ? visaLogo : mastercardLogo}
                    style={styles.cardTypeLogo}
                    resizeMode="contain"
                  />
                )}
              </View>
              {!isCardNumberValid && formData.cardNumber.length > 0 && (
                <Text style={styles.errorText}>Número de tarjeta inválido</Text>
              )}
            </View>

            {/* Fecha de expiración y CVC */}
            <View style={styles.rowContainer}>
              <View style={[styles.fieldContainer, styles.halfWidth]}>
                <Text style={styles.label}>Fecha (MM/YY)</Text>
                <TextInput
                  style={[styles.input, !isExpiryValid && formData.expiryDate.length > 0 && styles.inputError]}
                  value={formData.expiryDate}
                  onChangeText={handleExpiryDateChange}
                  placeholder="12/25"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="numeric"
                  maxLength={5}
                />
                {!isExpiryValid && formData.expiryDate.length > 0 && (
                  <Text style={styles.errorText}>Fecha inválida</Text>
                )}
              </View>

              <View style={[styles.fieldContainer, styles.halfWidth]}>
                <Text style={styles.label}>CVC</Text>
                <TextInput
                  style={[styles.input, !isCvcValid && formData.cvc.length > 0 && styles.inputError]}
                  value={formData.cvc}
                  onChangeText={(value) => updateField('cvc', value.replace(/\D/g, '').substring(0, 3))}
                  placeholder="123"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="numeric"
                  maxLength={3}
                  secureTextEntry
                />
                {!isCvcValid && formData.cvc.length > 0 && (
                  <Text style={styles.errorText}>CVC inválido</Text>
                )}
              </View>
            </View>

            {/* Nombre del titular */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nombre en la tarjeta</Text>
              <TextInput
                style={[styles.input, !isNameValid && formData.cardholderName.length > 0 && styles.inputError]}
                value={formData.cardholderName}
                onChangeText={(value) => updateField('cardholderName', value)}
                placeholder="Juan Pérez"
                placeholderTextColor={colors.placeholder}
                autoCapitalize="words"
              />
                             {!isNameValid && formData.cardholderName.length > 0 && (
                 <Text style={styles.errorText}>El nombre debe tener al menos 5 caracteres</Text>
               )}
            </View>

            {/* Email */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, !isEmailValid && formData.email.length > 0 && styles.inputError]}
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                placeholder="juan.perez@email.com"
                placeholderTextColor={colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
              {!isEmailValid && formData.email.length > 0 && (
                <Text style={styles.errorText}>Email inválido</Text>
              )}
            </View>

            {/* Tipo de documento */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Tipo de documento</Text>
              <TouchableOpacity
                style={[styles.selector, showDocumentTypes && styles.selectorActive]}
                onPress={() => setShowDocumentTypes(!showDocumentTypes)}
              >
                <Text style={styles.selectorText}>
                  {COLOMBIA_DOCUMENT_TYPES.find(type => type.value === formData.documentType)?.label || 'Seleccionar tipo'}
                </Text>
                <Text style={[styles.selectorArrow, showDocumentTypes && styles.selectorArrowActive]}>
                  {showDocumentTypes ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              {showDocumentTypes && (
                <View style={styles.dropdown}>
                  {renderDropdown(
                    COLOMBIA_DOCUMENT_TYPES,
                    formData.documentType,
                    (value) => {
                      updateField('documentType', value);
                      setShowDocumentTypes(false);
                    },
                    'Seleccionar tipo'
                  )}
                </View>
              )}
            </View>

            {/* Número de documento */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Número de documento</Text>
              <TextInput
                style={[styles.input, !isDocumentValid && formData.documentNumber.length > 0 && styles.inputError]}
                value={formData.documentNumber}
                onChangeText={(value) => updateField('documentNumber', value)}
                placeholder="12345678"
                placeholderTextColor={colors.placeholder}
                keyboardType={formData.documentType === 'PP' ? 'default' : 'numeric'}
              />
              {!isDocumentValid && formData.documentNumber.length > 0 && (
                <Text style={styles.errorText}>Documento inválido</Text>
              )}
            </View>

            {/* Número de cuotas */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Número de cuotas</Text>
              <TouchableOpacity
                style={[styles.selector, showInstallments && styles.selectorActive]}
                onPress={() => setShowInstallments(!showInstallments)}
              >
                <Text style={styles.selectorText}>
                  {INSTALLMENT_OPTIONS.find(option => option.value === formData.installments)?.label || 'Seleccionar cuotas'}
                </Text>
                <Text style={[styles.selectorArrow, showInstallments && styles.selectorArrowActive]}>
                  {showInstallments ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
              {showInstallments && (
                <View style={styles.dropdown}>
                  {renderDropdown(
                    INSTALLMENT_OPTIONS,
                    formData.installments,
                    (value) => {
                      updateField('installments', value);
                      setShowInstallments(false);
                    },
                    'Seleccionar cuotas'
                  )}
                </View>
              )}
            </View>

                {/* Botón de continuar */}
                <TouchableOpacity
                  style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
                  onPress={handleSubmit}
                  disabled={!isFormValid}
                >
                  <Text style={[styles.submitButtonText, !isFormValid && styles.submitButtonTextDisabled]}>
                    Continuar con el pago
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            ) : currentStep === PaymentStep.SUMMARY ? (
              <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {renderPaymentSummary()}
              </ScrollView>
            ) : currentStep === PaymentStep.PROCESSING ? (
              renderProcessing()
            ) : (
              renderPaymentResult()
            )}
          </View>
                  </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 80 : 60, // Más padding en iOS para espacio adecuado
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: Platform.OS === 'ios' ? screenHeight * 0.65 : screenHeight * 0.7,
    minHeight: Platform.OS === 'ios' ? screenHeight * 0.3 : screenHeight * 0.5,
    maxHeight: Platform.OS === 'ios' ? screenHeight * 0.75 : screenHeight * 0.8,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  backButton: {
    padding: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: Platform.OS === 'ios' ? 50 : 20, // Padding base más grande para iOS
    flexGrow: 1, // Permite que el contenido crezca
  },
  fieldContainer: {
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.background,
  },
  inputError: {
    borderColor: colors.error,
  },
  cardNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  cardTypeLogo: {
    position: 'absolute',
    right: 12,
    width: 32,
    height: 20,
    resizeMode: 'contain',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  selector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: colors.background,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectorActive: {
    borderColor: colors.primary,
    borderWidth: 2,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  selectorText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  selectorArrow: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  selectorArrowActive: {
    color: colors.primary,
    transform: [{ rotate: '180deg' }],
  },
  dropdown: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.background,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  dropdownContainer: {
    maxHeight: 180,
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownOptionLast: {
    borderBottomWidth: 0,
  },
  dropdownOptionSelected: {
    backgroundColor: colors.primary,
    borderBottomColor: colors.primary,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  dropdownOptionTextSelected: {
    color: colors.background,
    fontWeight: '600',
  },
  dropdownCheckmark: {
    fontSize: 16,
    color: colors.background,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    backgroundColor: colors.textTertiary,
  },
  submitButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: colors.textSecondary,
  },
  // Estilos del resumen de pago
  summarySection: {
    marginTop: 16,
    padding: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  summaryValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  productInfo: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  payButton: {
    backgroundColor: colors.success,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  payButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
  // Estilos del estado de procesamiento
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
    minHeight: 300,
  },
  processingText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginTop: 24,
    textAlign: 'center',
  },
  processingSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 24,
  },
  // Estilos del resultado del pago
  resultContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 40,
    minHeight: 400,
  },
  successIcon: {
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 64,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.success,
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  successDetails: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    width: '100%',
  },
  successDetailsText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorIcon: {
    marginBottom: 24,
  },
  errorIconText: {
    fontSize: 64,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 12,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  errorDetails: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  errorDetailsText: {
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
    marginBottom: 4,
  },
  backToHomeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 200,
  },
  backToHomeButtonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
});

// Estilos responsivos para pantallas pequeñas
if (screenWidth <= 375) {
  Object.assign(styles, {
    backdrop: {
      ...styles.backdrop,
      paddingTop: 40, // Menos espaciado en pantallas pequeñas
    },
    container: {
      ...styles.container,
      height: screenHeight * 0.8, // Reducir altura para mejor proporción
      maxHeight: screenHeight * 0.85,
    },
    title: {
      ...styles.title,
      fontSize: 18,
    },
    input: {
      ...styles.input,
      paddingVertical: 10,
      fontSize: 15,
    },
    processingContainer: {
      ...styles.processingContainer,
      paddingHorizontal: 30,
      minHeight: 250,
    },
    resultContainer: {
      ...styles.resultContainer,
      paddingHorizontal: 30,
      minHeight: 350,
    },
    processingText: {
      ...styles.processingText,
      fontSize: 18,
    },
    successTitle: {
      ...styles.successTitle,
      fontSize: 22,
    },
    errorTitle: {
      ...styles.errorTitle,
      fontSize: 22,
    },
  });
}

// Estilos responsivos para tablets
if (screenWidth > 768 && screenWidth <= 1024) {
  Object.assign(styles, {
    backdrop: {
      ...styles.backdrop,
      paddingTop: 100, // Más espaciado en tablets
    },
    container: {
      ...styles.container,
      height: screenHeight * 0.6, // Altura reducida en tablets
      maxHeight: screenHeight * 0.75,
    },
  });
}
