// ==================================================================
// PAYMENT BACKDROP COMPONENT - CAPA UI
// ==================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from './BaseComponent';
import { selectCartItems, selectCartTotal } from '../../state/selectors';
import { formatPrice } from '../../shared/utils';
import {
  detectCardType,
  formatCardNumber,
  formatExpiryDate,
  validateCardNumber,
  validateExpiryDate,
  validateCVC,
  validateCardholderName,
  validateDocumentNumber,
  maskCardNumber,
  getDocumentTypeLabel,
  getInstallmentLabel,
  COLOMBIA_DOCUMENT_TYPES,
  INSTALLMENT_OPTIONS,
} from '../../shared/utils/cardValidation';

interface PaymentBackdropProps {
  visible: boolean;
  onClose: () => void;
}

enum PaymentStep {
  FORM = 'FORM',
  SUMMARY = 'SUMMARY',
}

interface FormData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
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
}) => {
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  const [currentStep, setCurrentStep] = useState<PaymentStep>(PaymentStep.FORM);
  const [formData, setFormData] = useState<FormData>({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardholderName: '',
    documentType: 'CC',
    documentNumber: '',
    installments: 1,
  });

  const [showDocumentTypes, setShowDocumentTypes] = useState(false);
  const [showInstallments, setShowInstallments] = useState(false);

  // Detectar tipo de tarjeta
  const cardType = detectCardType(formData.cardNumber);

  // Validaciones individuales
  const isCardNumberValid = validateCardNumber(formData.cardNumber);
  const isExpiryValid = validateExpiryDate(formData.expiryDate);
  const isCvcValid = validateCVC(formData.cvc);
  const isNameValid = validateCardholderName(formData.cardholderName);
  const isDocumentValid = validateDocumentNumber(formData.documentNumber, formData.documentType);

  // Validación general del formulario
  const isFormValid = isCardNumberValid && isExpiryValid && isCvcValid && isNameValid && isDocumentValid;

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
   * Maneja el botón de pagar (sin funcionalidad por ahora)
   */
  const handlePay = () => {
    Alert.alert(
      'Pago pendiente',
      'Funcionalidad de pago pendiente de implementar.',
      [{ text: 'OK' }]
    );
  };

  /**
   * Reinicia el backdrop al cerrarlo
   */
  const handleClose = () => {
    setCurrentStep(PaymentStep.FORM);
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
    <View style={styles.dropdownContainer}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.dropdownOption,
            selectedValue === option.value && styles.dropdownOptionSelected,
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
        </TouchableOpacity>
      ))}
    </View>
  );

  /**
   * Renderiza el resumen de pago
   */
  const renderPaymentSummary = () => (
    <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {/* Datos del comprador */}
      <View style={styles.summarySection}>
        <Text style={styles.sectionTitle}>👤 Datos del comprador</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Nombre:</Text>
          <Text style={styles.summaryValue}>{formData.cardholderName}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Identificación:</Text>
          <Text style={styles.summaryValue}>
            {getDocumentTypeLabel(formData.documentType)} {formData.documentNumber}
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
    </ScrollView>
  );

  if (!visible) return null;

  return (
          <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.backdrop}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {currentStep === PaymentStep.FORM ? '💳 Datos de Pago' : '🧾 Resumen de Pago'}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Contenido dinámico según el paso */}
            {currentStep === PaymentStep.FORM ? (
              <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
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
                <Text style={styles.cardTypeLogo}>{cardType.logo}</Text>
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
                <Text style={styles.errorText}>Nombre inválido</Text>
              )}
            </View>

            {/* Tipo de documento */}
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Tipo de documento</Text>
              <TouchableOpacity
                style={styles.selector}
                onPress={() => setShowDocumentTypes(!showDocumentTypes)}
              >
                <Text style={styles.selectorText}>
                  {COLOMBIA_DOCUMENT_TYPES.find(type => type.value === formData.documentType)?.label}
                </Text>
                <Text style={styles.selectorArrow}>{showDocumentTypes ? '▲' : '▼'}</Text>
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
                style={styles.selector}
                onPress={() => setShowInstallments(!showInstallments)}
              >
                <Text style={styles.selectorText}>
                  {INSTALLMENT_OPTIONS.find(option => option.value === formData.installments)?.label}
                </Text>
                <Text style={styles.selectorArrow}>{showInstallments ? '▲' : '▼'}</Text>
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
            ) : (
              renderPaymentSummary()
            )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.9,
    paddingBottom: 20,
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
  scrollContainer: {
    paddingHorizontal: 20,
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
    fontSize: 16,
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
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.background,
  },
  selectorText: {
    fontSize: 16,
    color: colors.text,
  },
  selectorArrow: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.background,
    maxHeight: 200,
  },
  dropdownContainer: {
    paddingVertical: 4,
  },
  dropdownOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownOptionSelected: {
    backgroundColor: colors.primary,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: colors.text,
  },
  dropdownOptionTextSelected: {
    color: colors.background,
    fontWeight: '600',
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
    borderTopWidth: 2,
    borderTopColor: colors.primary,
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
});

// Estilos responsivos para pantallas pequeñas
if (screenWidth <= 375) {
  Object.assign(styles, {
    container: {
      ...styles.container,
      maxHeight: screenHeight * 0.95,
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
  });
}
