const EN = {
  ProgrammingError: "Programming Error",
  IapticError_StoreNotInitialized: "IapticRN.store is not initialized, call IapticRN.initialize() first",
  Error: "Error",
  ValidationError: "Receipt Validation Error",
  PurchaseError_title: "Purchase Error #{0}",
  PurchaseError_E_UNKNOWN: "An unknown error occurred.",
  PurchaseError_E_USER_CANCELLED: "The user cancelled the purchase.",
  PurchaseError_E_ITEM_UNAVAILABLE: "The requested product is not available.",
  PurchaseError_E_NETWORK_ERROR: "A network error occurred.",
  PurchaseError_E_SERVICE_ERROR: "The service returned an error.",
  PurchaseError_E_RECEIPT_FAILED: "Failed to validate receipt.",
  PurchaseError_E_NOT_PREPARED: "The purchase cannot be completed because it has not been prepared.",
  PurchaseError_E_DEVELOPER_ERROR: "An error occurred in the application.",
  PurchaseError_E_ALREADY_OWNED: "This item has already been purchased.",
  PurchaseError_E_DEFERRED_PAYMENT: "The payment has been deferred.",
  PurchaseError_E_USER_ERROR: "An error occurred in the application.",
  PurchaseError_E_REMOTE_ERROR: "A remote error occurred.",
  PurchaseError_E_RECEIPT_FINISHED_FAILED: "Failed to finish the transaction.",
  PurchaseError_E_NOT_ENDED: "The transaction has not been ended.",
  PurchaseError_E_BILLING_RESPONSE_JSON_PARSE_ERROR: "Failed to parse the billing response.",
  PurchaseError_E_INTERRUPTED: "The operation was interrupted.",
  PurchaseError_E_IAP_NOT_AVAILABLE: "In-app purchases are not available.",
  UnknownError_title: "Unknown Error",
  UnknownError: "An unknown error occurred.",
  IapticRN_initialized_called: "IapticRN.initialize() can only be called once",
  IapticError_6777001: "Failed to initialize the in-app purchase library",
  IapticError_6777002: "Failed to load in-app products metadata",
  IapticError_6777003: "Failed to make a purchase",
  IapticError_6777004: "Failed to load the purchase receipt",
  IapticError_6777005: "Client is not allowed to issue the request",
  IapticError_6777006: "Purchase flow has been cancelled by user",
  IapticError_6777007: "Something is suspicious about a purchase",
  IapticError_6777008: "The user is not allowed to make a payment",
  IapticError_6777010: "Unknown error",
  IapticError_6777011: "Failed to refresh the purchase receipt",
  IapticError_6777012: "The product identifier is invalid",
  IapticError_6777013: "Cannot finalize a transaction or acknowledge a purchase",
  IapticError_6777014: "Failed to communicate with the server",
  IapticError_6777015: "Subscriptions are not available",
  IapticError_6777016: "Purchase information is missing token",
  IapticError_6777017: "Verification of store data failed",
  IapticError_6777018: "Bad response from the server",
  IapticError_6777019: "Failed to refresh the store",
  IapticError_6777020: "Payment has expired",
  IapticError_6777021: "Failed to download the content",
  IapticError_6777022: "Failed to update a subscription",
  IapticError_6777023: "The requested product is not available in the store",
  IapticError_6777024: "The user has not allowed access to Cloud service information",
  IapticError_6777025: "The device could not connect to the network",
  IapticError_6777026: "The user has revoked permission to use this cloud service",
  IapticError_6777027: "The user has not yet acknowledged Apple's privacy policy",
  IapticError_6777028: "The app is attempting to use a property without required entitlement",
  IapticError_6777029: "The offer identifier is invalid",
  IapticError_6777030: "The price specified in App Store Connect is no longer valid",
  IapticError_6777031: "The signature in a payment discount is not valid",
  IapticError_6777032: "Parameters are missing in a payment discount",
  IapticError_6778003: "Subscription has expired",
  IapticError_UnsupportedPlatform: "Unsupported platform",
  ValidationError_MissingTransactionId: "Transaction ID is missing",
  // Active Subscription Component
  ActiveSubscription_WillCancel: "Will be cancelled on {0} at {1}",
  ActiveSubscription_WillRenew: "Auto-renewing on {0} at {1}",
  ActiveSubscription_Status_Active: "Active",
  ActiveSubscription_Status_Expired: "Expired",
  ActiveSubscription_Tag_Trial: "Trial Period",
  ActiveSubscription_Tag_Retry: "Payment Retry",
  ActiveSubscription_ManageSubscriptions: "Manage Subscriptions",
  ActiveSubscription_ManageBilling: "Manage Billing",
};

const EN_UK: typeof EN = {
  ...EN,
  // PROGRESS_INITIALIZING: "Initializing...",
  // PROGRESS_LOADING_PRODUCTS: "Loading products...",
  // PROGRESS_RESTORING_PURCHASES: "Restoring purchases...",
  // PROGRESS_PURCHASING_PRODUCT: "Purchasing product...",
  // PROGRESS_CONSUMING_PRODUCT: "Consuming product...",
  // PROGRESS_ACKNOWLEDGING_PURCHASE: "Acknowledging purchase...",
  // PROGRESS_FINISHING_TRANSACTION: "Finishing transaction...",
};

const EN_AU: typeof EN = {
  ...EN,
  // PROGRESS_INITIALIZING: "Initializing...",
  // PROGRESS_LOADING_PRODUCTS: "Loading products...",
  // PROGRESS_RESTORING_PURCHASES: "Restoring purchases...",
  // PROGRESS_PURCHASING_PRODUCT: "Purchasing product...",
  // PROGRESS_CONSUMING_PRODUCT: "Consuming product...",
  // PROGRESS_ACKNOWLEDGING_PURCHASE: "Acknowledging purchase...",
  // PROGRESS_FINISHING_TRANSACTION: "Finishing transaction...",
};

const ES: typeof EN = {
  Error: "Error",
  ProgrammingError: "Error de programación",
  IapticError_StoreNotInitialized: "IapticRN.store no está inicializado, llame a IapticRN.initialize() primero",
  ValidationError: "Error de validación del recibo",
  PurchaseError_title: "Error con el Store #{0}",
  PurchaseError_E_UNKNOWN: "Se produjo un error inesperado.",
  PurchaseError_E_USER_CANCELLED: "El usuario canceló la compra.",
  PurchaseError_E_ITEM_UNAVAILABLE: "El producto solicitado no está disponible.",
  PurchaseError_E_NETWORK_ERROR: "Se produjo un error de red.",
  PurchaseError_E_SERVICE_ERROR: "El servicio devolvió un error.",
  PurchaseError_E_RECEIPT_FAILED: "No se pudo validar el recibo.",
  PurchaseError_E_NOT_PREPARED: "La compra no puede ser completada porque no ha sido preparada.",
  PurchaseError_E_DEVELOPER_ERROR: "Se produjo un error en la aplicación.",
  PurchaseError_E_ALREADY_OWNED: "Este elemento ya ha sido comprado.",
  PurchaseError_E_DEFERRED_PAYMENT: "El pago ha sido diferido.",
  PurchaseError_E_USER_ERROR: "Se produjo un error en la aplicación.",
  PurchaseError_E_REMOTE_ERROR: "Se produjo un error remoto.",
  PurchaseError_E_RECEIPT_FINISHED_FAILED: "No se pudo finalizar la transacción.",
  PurchaseError_E_NOT_ENDED: "La transacción no ha sido finalizada.",
  PurchaseError_E_BILLING_RESPONSE_JSON_PARSE_ERROR: "No se pudo analizar la respuesta de facturación.",
  PurchaseError_E_INTERRUPTED: "La operación fue interrumpida.",
  PurchaseError_E_IAP_NOT_AVAILABLE: "Las compras en la aplicación no están disponibles.",
  UnknownError_title: "Error desconocido",
  UnknownError: "Se produjo un error inesperado.",
  IapticRN_initialized_called: "Initialize solo puede ser llamado una vez",
  IapticError_6777001: "Error al inicializar la biblioteca de compras",
  IapticError_6777002: "Error al cargar los metadatos de los productos",
  IapticError_6777003: "Error al realizar la compra",
  IapticError_6777004: "Error al cargar el recibo de compra",
  IapticError_6777005: "El cliente no está autorizado para realizar esta solicitud",
  IapticError_6777006: "El proceso de compra ha sido cancelado por el usuario",
  IapticError_6777007: "Hay algo sospechoso en esta compra",
  IapticError_6777008: "El usuario no está autorizado para realizar pagos",
  IapticError_6777010: "Error desconocido",
  IapticError_6777011: "Error al actualizar el recibo de compra",
  IapticError_6777012: "El identificador del producto no es válido",
  IapticError_6777013: "No se puede finalizar la transacción o confirmar la compra",
  IapticError_6777014: "Error al comunicarse con el servidor",
  IapticError_6777015: "Las suscripciones no están disponibles",
  IapticError_6777016: "Falta el token en la información de compra",
  IapticError_6777017: "La verificación de los datos de la tienda falló",
  IapticError_6777018: "Respuesta incorrecta del servidor",
  IapticError_6777019: "Error al actualizar la tienda",
  IapticError_6777020: "El pago ha expirado",
  IapticError_6777021: "Error al descargar el contenido",
  IapticError_6777022: "Error al actualizar la suscripción",
  IapticError_6777023: "El producto solicitado no está disponible en la tienda",
  IapticError_6777024: "El usuario no ha permitido el acceso a la información del servicio en la nube",
  IapticError_6777025: "El dispositivo no pudo conectarse a la red",
  IapticError_6777026: "El usuario ha revocado el permiso para usar este servicio en la nube",
  IapticError_6777027: "El usuario aún no ha aceptado la política de privacidad de Apple",
  IapticError_6777028: "La aplicación intenta usar una propiedad sin el permiso requerido",
  IapticError_6777029: "El identificador de la oferta no es válido",
  IapticError_6777030: "El precio especificado en App Store Connect ya no es válido",
  IapticError_6777031: "La firma en el descuento de pago no es válida",
  IapticError_6777032: "Faltan parámetros en el descuento de pago",
  IapticError_6778003: "La suscripción ha expirado",
  IapticError_UnsupportedPlatform: "Plataforma no soportada",
  ValidationError_MissingTransactionId: "Falta el ID de transacción",
  // Active Subscription Component
  ActiveSubscription_WillCancel: "Se cancelará el {0} a las {1}",
  ActiveSubscription_WillRenew: "Se renovará automáticamente el {0} a las {1}",
  ActiveSubscription_Status_Active: "Activa",
  ActiveSubscription_Status_Expired: "Expirada",
  ActiveSubscription_Tag_Trial: "Período de prueba",
  ActiveSubscription_Tag_Retry: "Reintento de pago",
  ActiveSubscription_ManageSubscriptions: "Gestionar suscripciones",
  ActiveSubscription_ManageBilling: "Gestionar facturación",
};

const LANGUAGES: Record<string, typeof EN> = {
  en: EN,
  en_uk: EN_UK,
  en_au: EN_AU,
  es: ES
};

import { NativeModules, Platform } from 'react-native';
import { logger } from './IapticLogger';

/**
 * Handles localized messages for the iaptic React Native plugin
 */
export class Locales {
  
  private static currentLanguage: string = 'en';
  private static fallbackLanguage: string = 'en';

  /**
   * Adds a new language to the locales
   * @param language The language code to add
   * @param messages The messages for the language
   */
  static addLanguage(language: string, messages: typeof EN) {
    LANGUAGES[language] = messages;
  }

  /**
   * Sets the current language for messages
   * @param language The language code to use
   */
  static setLanguage(language: string) {
    this.currentLanguage = language;
  }

  static get(key: keyof typeof EN, args: string[] = [], fallbackMessage: string = ''): string {
    let value = LANGUAGES[this.currentLanguage][key] || LANGUAGES[this.fallbackLanguage][key];
    if (!value) {
      logger.warn(`Locale key ${key} not found for language ${this.currentLanguage}`);
      value = fallbackMessage;
    }
    if (args.length > 0) {
      return value.replace(/{(\d+)}/g, (match, index) => args[index]);
    }
    return value;
  }

  /**
   * Gets the device language and returns a supported language code
   * Defaults to 'en' if the device language is not supported
   */
  static getDeviceLanguage(): string {
    // Get device language
    const deviceLanguage = 
      (Platform.OS === 'ios'
        ? NativeModules.SettingsManager?.settings?.AppleLocale || // iOS
          NativeModules.SettingsManager?.settings?.AppleLanguages[0] // iOS fallback
        : NativeModules.I18nManager?.localeIdentifier) || 'en'; // Android
    
    const fullCode = deviceLanguage.toLowerCase().replace(/[_-]/g, '_');
    const shortCode = fullCode.split('_')[0];
    // Return the language if supported, otherwise return 'en'
    return LANGUAGES.hasOwnProperty(fullCode) ? fullCode : LANGUAGES.hasOwnProperty(shortCode) ? shortCode : 'en';
  }

  /**
   * Initializes the locales with the device language
   */
  static initialize() {
    this.currentLanguage = this.getDeviceLanguage();
  }
}

Locales.initialize();