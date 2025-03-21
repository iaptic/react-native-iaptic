import { NativeModules, Platform } from 'react-native';
import { logger } from './IapticLogger';
import { IapticLocale } from './IapticLocale';

/**
 * English (United States) locale.
 * 
 * Our default locale.
 */
const EN: IapticLocale = {
  ProgrammingError: "Programming Error",
  IapticError_StoreNotInitialized: "IapticRN.store is not initialized, call IapticRN.initialize() first",
  IapticError_StoreAlreadyInitialized: "IapticRN.store is already initialized, call IapticRN.destroy() first",
  Error: "Error",
  ValidationError: "Receipt Validation Error",
  PurchaseError_title: "Purchase Error #{0}",
  PurchaseError_E_UNKNOWN: "An unknown error occurred.",
  PurchaseError_E_USER_CANCELLED: "The user cancelled the purchase.",
  PurchaseError_E_ITEM_UNAVAILABLE: "The requested product is not available.",
  PurchaseError_E_NETWORK_ERROR: "A network error occurred.",
  PurchaseError_E_SERVICE_ERROR: "The service returned an error.",
  PurchaseError_E_RECEIPT_FAILED: "Failed to load your purchase receipt.",
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
  // Billing cycle templates
  BillingCycle_Finite: "{cycles}x {duration}",
  BillingCycle_NonRecurring: "for {duration}",
  BillingCycle_Infinite: "every {duration}",
  // Duration units
  Duration_D_singular: "day",
  Duration_D_plural: "days",
  Duration_W_singular: "week",
  Duration_W_plural: "weeks",
  Duration_M_singular: "month",
  Duration_M_plural: "months",
  Duration_Y_singular: "year",
  Duration_Y_plural: "years",
  ProductPrice_StartingAt: "starting at {0} per month",
  SubscriptionView_Title: "Choose Your Plan",
  SubscriptionView_Close: "Close",
  ActiveSubscription_ManageBilling: "Payment Methods",
  SubscriptionView_CurrentSubscription: "Your Subscription",
  SubscriptionView_Back: "Back",
  SubscriptionView_ChangePlan: "Change Plan",
  SubscriptionView_BillingOptions: "Offers:",
  SubscriptionView_Includes: "Includes:",
  SubscriptionView_Continue: "Subscribe",
  SubscriptionView_Processing: "Processing...",
  EntitlementGrid_Checkmark: "✓",
  DateFormatter_Date: "{0}",
  DateFormatter_Time: "{0}",
  SubscriptionView_CurrentPlan: "Current Plan",
  SubscriptionView_UpdatePlan: "Update Plan",
  SubscriptionView_ProcessingTitle: "Processing Purchase",
  SubscriptionView_PleaseWait: "Please wait...",
  SubscriptionView_Cancel: "Cancel",
  SubscriptionView_ProcessingStatus_purchasing: "purchasing...",
  SubscriptionView_ProcessingStatus_processing: "processing...",
  SubscriptionView_ProcessingStatus_validating: "validating...",
  SubscriptionView_ProcessingStatus_finishing: "finalizing...",
  SubscriptionView_ProcessingStatus_cancelled: "cancelled...",
  SubscriptionView_ProcessingStatus_completed: "completed...",
  SubscriptionView_TermsPrefix: "By subscribing, you agree to our",
  SubscriptionView_TermsLink: "Terms and Conditions",
  SubscriptionView_RestorePurchase: "Restore Purchases",
  SubscriptionView_RestoringTitle: "Restoring Purchases...",
  SubscriptionView_RestoreProgress: "Processed {0} of {1} purchases",
};

/**
 * English (United Kingdom) locale.
 */
const EN_UK: IapticLocale = {
  ...EN,
  SubscriptionView_ProcessingStatus_finishing: "finalising...",
};

/**
 * English (Australia) locale.
 */
const EN_AU: IapticLocale = {
  ...EN,
  // Australian English adjustments:
  PurchaseError_E_ITEM_UNAVAILABLE: "The requested product is unavailable",
  SubscriptionView_ProcessingStatus_finishing: "finalising...",
  SubscriptionView_TermsLink: "Terms and Conditions",
};

const ES: IapticLocale = {
  Error: "Error",
  ProgrammingError: "Error de programación",
  IapticError_StoreNotInitialized: "IapticRN.store no está inicializado, llame a IapticRN.initialize() primero",
  IapticError_StoreAlreadyInitialized: "IapticRN.store ya está inicializado, llame a IapticRN.destroy() primero",
  ValidationError: "Error de validación del recibo",
  PurchaseError_title: "Error con el Store #{0}",
  PurchaseError_E_UNKNOWN: "Se produjo un error inesperado.",
  PurchaseError_E_USER_CANCELLED: "El usuario canceló la compra.",
  PurchaseError_E_ITEM_UNAVAILABLE: "El producto solicitado no está disponible.",
  PurchaseError_E_NETWORK_ERROR: "Se produjo un error de red.",
  PurchaseError_E_SERVICE_ERROR: "El servicio devolvió un error.",
  PurchaseError_E_RECEIPT_FAILED: "Error al cargar el recibo de compra",  // Updated from "No se pudo validar el recibo"
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
  BillingCycle_Finite: "{cycles}x {duration}",
  BillingCycle_NonRecurring: "por {duration}",
  BillingCycle_Infinite: "cada {duration}",
  Duration_D_singular: "día",
  Duration_D_plural: "días",
  Duration_W_singular: "semana",
  Duration_W_plural: "semanas",
  Duration_M_singular: "mes",
  Duration_M_plural: "meses",
  Duration_Y_singular: "año",
  Duration_Y_plural: "años",
  ProductPrice_StartingAt: "desde {0} al mes",
  SubscriptionView_Title: "Elige Tu Plan",
  SubscriptionView_Close: "Cerrar",
  SubscriptionView_ChangePlan: "Cambiar Plan",
  SubscriptionView_CurrentSubscription: "Tu Suscripción",
  SubscriptionView_Back: "Atrás",
  SubscriptionView_Includes: "Incluye:",
  SubscriptionView_BillingOptions: "Ofertas:",
  SubscriptionView_Continue: "Suscríbete",
  SubscriptionView_Processing: "Procesando...",
  EntitlementGrid_Checkmark: "✓",
  DateFormatter_Date: "{0}",
  DateFormatter_Time: "{0}",
  SubscriptionView_CurrentPlan: "Plan Actual",
  SubscriptionView_UpdatePlan: "Actualizar Plan",
  SubscriptionView_ProcessingTitle: "Procesando Compra",
  SubscriptionView_PleaseWait: "Por favor espera...",
  SubscriptionView_Cancel: "Cancelar",
  SubscriptionView_ProcessingStatus_purchasing: "comprando...",
  SubscriptionView_ProcessingStatus_processing: "procesando...",
  SubscriptionView_ProcessingStatus_validating: "validando...",
  SubscriptionView_ProcessingStatus_finishing: "finalizando...",
  SubscriptionView_ProcessingStatus_completed: "completado...",
  SubscriptionView_ProcessingStatus_cancelled: "cancelado...",
  SubscriptionView_TermsPrefix: "Al suscribirte, aceptas nuestros",
  SubscriptionView_TermsLink: "Términos y Condiciones",
  SubscriptionView_RestorePurchase: "Restaurar Compras",
  SubscriptionView_RestoringTitle: "Restaurando Compras...",
  SubscriptionView_RestoreProgress: "Procesado {0} de {1} compras",
};

/**
 * French (France) locale.
 */
const FR: IapticLocale = {
  Error: "Erreur",
  ProgrammingError: "Erreur de programmation",
  IapticError_StoreNotInitialized: "IapticRN.store n'est pas initialisé, appelez d'abord IapticRN.initialize()",
  IapticError_StoreAlreadyInitialized: "IapticRN.store est déjà initialisé, appelez d'abord IapticRN.destroy()",
  ValidationError: "Erreur de validation du reçu",
  PurchaseError_title: "Erreur d'achat #{0}",
  PurchaseError_E_UNKNOWN: "Une erreur inconnue est survenue.",
  PurchaseError_E_USER_CANCELLED: "L'utilisateur a annulé l'achat.",
  PurchaseError_E_ITEM_UNAVAILABLE: "Le produit demandé n'est pas disponible.",
  PurchaseError_E_NETWORK_ERROR: "Une erreur réseau est survenue.",
  PurchaseError_E_SERVICE_ERROR: "Le service a renvoyé une erreur.",
  PurchaseError_E_RECEIPT_FAILED: "Échec de la récupération du reçu.",
  PurchaseError_E_NOT_PREPARED: "L'achat ne peut être complété car il n'a pas été préparé.",
  PurchaseError_E_DEVELOPER_ERROR: "Une erreur s'est produite dans l'application.",
  PurchaseError_E_ALREADY_OWNED: "Cet article a déjà été acheté.",
  PurchaseError_E_DEFERRED_PAYMENT: "Le paiement a été différé.",
  PurchaseError_E_USER_ERROR: "Une erreur s'est produite dans l'application.",
  PurchaseError_E_REMOTE_ERROR: "Une erreur distante est survenue.",
  PurchaseError_E_RECEIPT_FINISHED_FAILED: "Échec de la finalisation de la transaction.",
  PurchaseError_E_NOT_ENDED: "La transaction n'a pas été terminée.",
  PurchaseError_E_BILLING_RESPONSE_JSON_PARSE_ERROR: "Échec de l'analyse de la réponse de facturation.",
  PurchaseError_E_INTERRUPTED: "L'opération a été interrompue.",
  PurchaseError_E_IAP_NOT_AVAILABLE: "Les achats intégrés ne sont pas disponibles.",
  UnknownError_title: "Erreur inconnue",
  UnknownError: "Une erreur inconnue est survenue.",
  IapticRN_initialized_called: "IapticRN.initialize() ne peut être appelé qu'une seule fois",
  IapticError_6777001: "Échec de l'initialisation de la bibliothèque d'achats intégrés",
  IapticError_6777002: "Échec du chargement des métadonnées des produits",
  IapticError_6777003: "Échec de l'achat",
  IapticError_6777004: "Échec du chargement du reçu d'achat",
  IapticError_6777005: "Le client n'est pas autorisé à effectuer cette demande",
  IapticError_6777006: "Le processus d'achat a été annulé par l'utilisateur",
  IapticError_6777007: "Quelque chose semble suspect avec cet achat",
  IapticError_6777008: "L'utilisateur n'est pas autorisé à effectuer des paiements",
  IapticError_6777010: "Erreur inconnue",
  IapticError_6777011: "Échec de l'actualisation du reçu d'achat",
  IapticError_6777012: "L'identifiant du produit est invalide",
  IapticError_6777013: "Impossible de finaliser une transaction ou de confirmer un achat",
  IapticError_6777014: "Échec de la communication avec le serveur",
  IapticError_6777015: "Les abonnements ne sont pas disponibles",
  IapticError_6777016: "Les informations d'achat manquent de jeton",
  IapticError_6777017: "Échec de la vérification des données du store",
  IapticError_6777018: "Mauvaise réponse du serveur",
  IapticError_6777019: "Échec de l'actualisation du store",
  IapticError_6777020: "Le paiement a expiré",
  IapticError_6777021: "Échec du téléchargement du contenu",
  IapticError_6777022: "Échec de la mise à jour d'un abonnement",
  IapticError_6777023: "Le produit demandé n'est pas disponible dans le store",
  IapticError_6777024: "L'utilisateur n'a pas autorisé l'accès aux informations du service cloud",
  IapticError_6777025: "L'appareil n'a pas pu se connecter au réseau",
  IapticError_6777026: "L'utilisateur a révoqué l'autorisation d'utiliser ce service cloud",
  IapticError_6777027: "L'utilisateur n'a pas encore accepté la politique de confidentialité d'Apple",
  IapticError_6777028: "L'application tente d'utiliser une propriété sans les droits requis",
  IapticError_6777029: "L'identifiant de l'offre est invalide",
  IapticError_6777030: "Le prix spécifié dans App Store Connect n'est plus valide",
  IapticError_6777031: "La signature dans une réduction de paiement n'est pas valide",
  IapticError_6777032: "Paramètres manquants dans une réduction de paiement",
  IapticError_6778003: "L'abonnement a expiré",
  IapticError_UnsupportedPlatform: "Plateforme non prise en charge",
  ValidationError_MissingTransactionId: "ID de transaction manquant",
  ActiveSubscription_WillCancel: "Serra annulé le {0} à {1}",
  ActiveSubscription_WillRenew: "Renouvellement automatique le {0} à {1}",
  ActiveSubscription_Status_Active: "Actif",
  ActiveSubscription_Status_Expired: "Expiré",
  ActiveSubscription_Tag_Trial: "Période d'essai",
  ActiveSubscription_Tag_Retry: "Nouvelle tentative de paiement",
  ActiveSubscription_ManageSubscriptions: "Gérer les abonnements",
  BillingCycle_Finite: "{cycles}x {duration}",
  BillingCycle_NonRecurring: "pendant {duration}",
  BillingCycle_Infinite: "tous les {duration}",
  Duration_D_singular: "jour",
  Duration_D_plural: "jours",
  Duration_W_singular: "semaine",
  Duration_W_plural: "semaines",
  Duration_M_singular: "mois",
  Duration_M_plural: "mois",
  Duration_Y_singular: "an",
  Duration_Y_plural: "ans",
  ProductPrice_StartingAt: "à partir de {0} par mois",
  SubscriptionView_Title: "Choisissez Votre Plan",
  SubscriptionView_Close: "Fermer",
  ActiveSubscription_ManageBilling: "Moyens de paiement",
  SubscriptionView_ChangePlan: "Changer de Plan",
  SubscriptionView_CurrentSubscription: "Votre Abonnement",
  SubscriptionView_Back: "Retour",
  SubscriptionView_Includes: "Inclut :",
  SubscriptionView_BillingOptions: "Offres :",
  SubscriptionView_Continue: "S'abonner",
  SubscriptionView_Processing: "En cours...",
  EntitlementGrid_Checkmark: "✓",
  DateFormatter_Date: "{0}",
  DateFormatter_Time: "{0}",
  SubscriptionView_CurrentPlan: "Plan Actuel",
  SubscriptionView_UpdatePlan: "Modifier le Plan",
  SubscriptionView_ProcessingTitle: "Traitement de l'Achat",
  SubscriptionView_PleaseWait: "Veuillez patienter...",
  SubscriptionView_Cancel: "Annuler",
  SubscriptionView_ProcessingStatus_purchasing: "achat en cours...",
  SubscriptionView_ProcessingStatus_processing: "traitement...",
  SubscriptionView_ProcessingStatus_validating: "validation...",
  SubscriptionView_ProcessingStatus_finishing: "finalisation...",
  SubscriptionView_ProcessingStatus_completed: "terminé...",
  SubscriptionView_ProcessingStatus_cancelled: "annulé...",
  SubscriptionView_TermsPrefix: "En vous abonnant, vous acceptez nos",
  SubscriptionView_TermsLink: "Conditions Générales",
  SubscriptionView_RestorePurchase: "Restaurer les achats",
  SubscriptionView_RestoringTitle: "Restauration des achats...",
  SubscriptionView_RestoreProgress: "Traitement {0} sur {1} achats",
};

/**
 * German (Germany) locale.
 */
const DE: IapticLocale = {
  Error: "Fehler",
  ProgrammingError: "Programmierfehler",
  IapticError_StoreNotInitialized: "IapticRN.store ist nicht initialisiert, rufen Sie zuerst IapticRN.initialize() auf",
  IapticError_StoreAlreadyInitialized: "IapticRN.store ist bereits initialisiert, rufen Sie zuerst IapticRN.destroy() auf",
  ValidationError: "Kassenbon-Validierungsfehler",
  PurchaseError_title: "Kauf Fehler #{0}",
  PurchaseError_E_UNKNOWN: "Ein unbekannter Fehler ist aufgetreten.",
  PurchaseError_E_USER_CANCELLED: "Der Kauf wurde vom Benutzer abgebrochen.",
  PurchaseError_E_ITEM_UNAVAILABLE: "Das angeforderte Produkt ist nicht verfügbar.",
  PurchaseError_E_NETWORK_ERROR: "Ein Netzwerkfehler ist aufgetreten.",
  PurchaseError_E_SERVICE_ERROR: "Der Dienst hat einen Fehler zurückgegeben.",
  PurchaseError_E_RECEIPT_FAILED: "Fehler beim Laden des Kaufbelegs",  // Updated from "Kassenbon konnte nicht validiert werden"
  PurchaseError_E_NOT_PREPARED: "Der Kauf kann nicht abgeschlossen werden, da er nicht vorbereitet wurde.",
  PurchaseError_E_DEVELOPER_ERROR: "Ein Fehler ist in der Anwendung aufgetreten.",
  PurchaseError_E_ALREADY_OWNED: "Dieser Artikel wurde bereits gekauft.",
  PurchaseError_E_DEFERRED_PAYMENT: "Die Zahlung wurde zurückgestellt.",
  PurchaseError_E_USER_ERROR: "Ein Fehler ist in der Anwendung aufgetreten.",
  PurchaseError_E_REMOTE_ERROR: "Ein entfernter Fehler ist aufgetreten.",
  PurchaseError_E_RECEIPT_FINISHED_FAILED: "Transaktion konnte nicht abgeschlossen werden.",
  PurchaseError_E_NOT_ENDED: "Die Transaktion wurde nicht beendet.",
  PurchaseError_E_BILLING_RESPONSE_JSON_PARSE_ERROR: "Fehler beim Parsen der Abrechnungsantwort.",
  PurchaseError_E_INTERRUPTED: "Der Vorgang wurde unterbrochen.",
  PurchaseError_E_IAP_NOT_AVAILABLE: "In-App-Käufe sind nicht verfügbar.",
  UnknownError_title: "Unbekannter Fehler",
  UnknownError: "Ein unbekannter Fehler ist aufgetreten.",
  IapticRN_initialized_called: "IapticRN.initialize() kann nur einmal aufgerufen werden",
  IapticError_6777001: "Fehler beim Initialisieren der In-App-Kauf-Bibliothek",
  IapticError_6777002: "Fehler beim Laden der Produktmetadaten",
  IapticError_6777003: "Fehler beim Kaufvorgang",
  IapticError_6777004: "Fehler beim Laden des Kaufbelegs",
  IapticError_6777005: "Client ist nicht berechtigt, diese Anfrage zu stellen",
  IapticError_6777006: "Kaufvorgang wurde vom Benutzer abgebrochen",
  IapticError_6777007: "Etwas erscheint verdächtig an diesem Kauf",
  IapticError_6777008: "Der Benutzer ist nicht berechtigt, Zahlungen vorzunehmen",
  IapticError_6777010: "Unbekannter Fehler",
  IapticError_6777011: "Fehler beim Aktualisieren des Kaufbelegs",
  IapticError_6777012: "Ungültige Produktkennung",
  IapticError_6777013: "Transaktion kann nicht abgeschlossen oder Kauf nicht bestätigt werden",
  IapticError_6777014: "Fehler bei der Kommunikation mit dem Server",
  IapticError_6777015: "Abonnements sind nicht verfügbar",
  IapticError_6777016: "Kaufinformationen fehlen Token",
  IapticError_6777017: "Überprüfung der Store-Daten fehlgeschlagen",
  IapticError_6777018: "Ungültige Serverantwort",
  IapticError_6777019: "Fehler beim Aktualisieren des Stores",
  IapticError_6777020: "Zahlung ist abgelaufen",
  IapticError_6777021: "Fehler beim Herunterladen des Inhalts",
  IapticError_6777022: "Fehler beim Aktualisieren eines Abonnements",
  IapticError_6777023: "Das angeforderte Produkt ist im Store nicht verfügbar",
  IapticError_6777024: "Benutzer hat den Zugriff auf Cloud-Dienstinformationen nicht erlaubt",
  IapticError_6777025: "Gerät konnte keine Netzwerkverbindung herstellen",
  IapticError_6777026: "Benutzer hat die Berechtigung für diesen Cloud-Dienst widerrufen",
  IapticError_6777027: "Benutzer hat die Datenschutzrichtlinie von Apple noch nicht bestätigt",
  IapticError_6777028: "App versucht, eine Eigenschaft ohne erforderliche Berechtigung zu nutzen",
  IapticError_6777029: "Ungültiges Angebotskennzeichen",
  IapticError_6777030: "Preisangabe in App Store Connect ist nicht mehr gültig",
  IapticError_6777031: "Ungültige Signatur in einem Zahlungsrabatt",
  IapticError_6777032: "Fehlende Parameter in einem Zahlungsrabatt",
  IapticError_6778003: "Abonnement ist abgelaufen",
  IapticError_UnsupportedPlatform: "Nicht unterstützte Plattform",
  ValidationError_MissingTransactionId: "Transaktions-ID fehlt",
  ActiveSubscription_WillCancel: "Wird gekündigt am {0} um {1}",
  ActiveSubscription_WillRenew: "Automatische Verlängerung am {0} um {1}",
  ActiveSubscription_Status_Active: "Aktiv",
  ActiveSubscription_Status_Expired: "Abgelaufen",
  ActiveSubscription_Tag_Trial: "Testphase",
  ActiveSubscription_Tag_Retry: "Zahlungswiederholung",
  ActiveSubscription_ManageSubscriptions: "Abonnements verwalten",
  BillingCycle_Finite: "{cycles}x {duration}",
  BillingCycle_NonRecurring: "für {duration}",
  BillingCycle_Infinite: "jeden {duration}",
  Duration_D_singular: "Tag",
  Duration_D_plural: "Tage",
  Duration_W_singular: "Woche",
  Duration_W_plural: "Wochen",
  Duration_M_singular: "Monat",
  Duration_M_plural: "Monate",
  Duration_Y_singular: "Jahr",
  Duration_Y_plural: "Jahre",
  ProductPrice_StartingAt: "ab {0} pro Monat",
  SubscriptionView_Title: "Wählen Sie Ihren Plan",
  SubscriptionView_Close: "Schließen",
  ActiveSubscription_ManageBilling: "Zahlungsmethoden",
  SubscriptionView_ChangePlan: "Plan ändern",
  SubscriptionView_CurrentSubscription: "Ihre Abonnement",
  SubscriptionView_Back: "Zurück",
  SubscriptionView_Includes: "Enthält:",
  SubscriptionView_BillingOptions: "Angebote:",
  SubscriptionView_Continue: "Abonnieren",
  SubscriptionView_Processing: "Wird verarbeitet...",
  EntitlementGrid_Checkmark: "✓",
  DateFormatter_Date: "{0}",
  DateFormatter_Time: "{0}",
  SubscriptionView_CurrentPlan: "Aktueller Plan",
  SubscriptionView_UpdatePlan: "Plan aktualisieren",
  SubscriptionView_ProcessingTitle: "Verarbeitung",
  SubscriptionView_PleaseWait: "Bitte warten...",
  SubscriptionView_Cancel: "Abbrechen",
  SubscriptionView_ProcessingStatus_purchasing: "in Bearbeitung...",
  SubscriptionView_ProcessingStatus_processing: "Verarbeitung...",
  SubscriptionView_ProcessingStatus_validating: "Validierung...",
  SubscriptionView_ProcessingStatus_finishing: "Abschluss...",
  SubscriptionView_ProcessingStatus_completed: "Abgeschlossen...",
  SubscriptionView_ProcessingStatus_cancelled: "Abgebrochen...",
  SubscriptionView_TermsPrefix: "Mit dem Abonnieren stimmen Sie unseren",
  SubscriptionView_TermsLink: "Nutzungsbedingungen",
  SubscriptionView_RestorePurchase: "Käufe wiederherstellen",
  SubscriptionView_RestoringTitle: "Wiederherstellen...",
  SubscriptionView_RestoreProgress: "Verarbeitet {0} von {1} Käufen",
};

/**
 * Japanese (Japan) locale.
 */
const JA: IapticLocale = {
  Error: "エラー",
  ProgrammingError: "プログラミングエラー",
  IapticError_StoreNotInitialized: "IapticRN.storeが初期化されていません。まずIapticRN.initialize()を呼び出してください",
  IapticError_StoreAlreadyInitialized: "IapticRN.storeは既に初期化されています。まずIapticRN.destroy()を呼び出してください",
  ValidationError: "領収書検証エラー",
  PurchaseError_title: "購入エラー #{0}",
  PurchaseError_E_UNKNOWN: "不明なエラーが発生しました。",
  PurchaseError_E_USER_CANCELLED: "ユーザーが購入をキャンセルしました。",
  PurchaseError_E_ITEM_UNAVAILABLE: "リクエストされた商品は利用できません。",
  PurchaseError_E_NETWORK_ERROR: "ネットワークエラーが発生しました。",
  PurchaseError_E_SERVICE_ERROR: "サービスからエラーが返されました。",
  PurchaseError_E_RECEIPT_FAILED: "購入領収書の読み込みに失敗しました",  // Updated from "領収書の検証に失敗しました"
  PurchaseError_E_NOT_PREPARED: "準備が完了していないため、購入を完了できません。",
  PurchaseError_E_DEVELOPER_ERROR: "アプリケーションでエラーが発生しました。",
  PurchaseError_E_ALREADY_OWNED: "この商品は既に購入済みです。",
  PurchaseError_E_DEFERRED_PAYMENT: "支払いが延期されました。",
  PurchaseError_E_USER_ERROR: "アプリケーションでエラーが発生しました。",
  PurchaseError_E_REMOTE_ERROR: "リモートエラーが発生しました。",
  PurchaseError_E_RECEIPT_FINISHED_FAILED: "トランザクションの終了に失敗しました。",
  PurchaseError_E_NOT_ENDED: "トランザクションが終了していません。",
  PurchaseError_E_BILLING_RESPONSE_JSON_PARSE_ERROR: "課金応答の解析に失敗しました。",
  PurchaseError_E_INTERRUPTED: "操作が中断されました。",
  PurchaseError_E_IAP_NOT_AVAILABLE: "アプリ内課金は利用できません。",
  UnknownError_title: "不明なエラー",
  UnknownError: "不明なエラーが発生しました。",
  IapticRN_initialized_called: "IapticRN.initialize()は1回のみ呼び出せます",
  IapticError_6777001: "アプリ内課金ライブラリの初期化に失敗しました",
  IapticError_6777002: "アプリ内商品のメタデータの読み込みに失敗しました",
  IapticError_6777003: "購入処理に失敗しました",
  IapticError_6777004: "購入領収書の読み込みに失敗しました",
  IapticError_6777005: "クライアントはこのリクエストを実行する権限がありません",
  IapticError_6777006: "購入フローがユーザーによってキャンセルされました",
  IapticError_6777007: "購入に不審な点があります",
  IapticError_6777008: "ユーザーは支払いを実行する権限がありません",
  IapticError_6777010: "未知のエラー",
  IapticError_6777011: "購入領収書の更新に失敗しました",
  IapticError_6777012: "製品IDが無効です",
  IapticError_6777013: "トランザクションの終了または購入の確認ができません",
  IapticError_6777014: "サーバーとの通信に失敗しました",
  IapticError_6777015: "サブスクリプションは利用できません",
  IapticError_6777016: "購入情報にトークンが含まれていません",
  IapticError_6777017: "ストアデータの検証に失敗しました",
  IapticError_6777018: "サーバーからの不正な応答",
  IapticError_6777019: "ストアの更新に失敗しました",
  IapticError_6777020: "支払いが期限切れです",
  IapticError_6777021: "コンテンツのダウンロードに失敗しました",
  IapticError_6777022: "サブスクリプションの更新に失敗しました",
  IapticError_6777023: "リクエストされた商品はストアで利用できません",
  IapticError_6777024: "ユーザーがクラウドサービス情報へのアクセスを許可していません",
  IapticError_6777025: "デバイスがネットワークに接続できませんでした",
  IapticError_6777026: "ユーザーがこのクラウドサービスの使用許可を取り消しました",
  IapticError_6777027: "ユーザーがAppleのプライバシーポリシーをまだ承認していません",
  IapticError_6777028: "アプリが必要な権限なしでプロパティを使用しようとしています",
  IapticError_6777029: "無効なオファーIDです",
  IapticError_6777030: "App Store Connectで指定された価格が無効です",
  IapticError_6777031: "支払い割引の署名が無効です",
  IapticError_6777032: "支払い割引にパラメータが不足しています",
  IapticError_6778003: "サブスクリプションが期限切れです",
  IapticError_UnsupportedPlatform: "サポートされていないプラットフォーム",
  ValidationError_MissingTransactionId: "トランザクションIDがありません",
  ActiveSubscription_WillCancel: "{0} {1}にキャンセルされます",
  ActiveSubscription_WillRenew: "{0} {1}に自動更新されます",
  ActiveSubscription_Status_Active: "有効",
  ActiveSubscription_Status_Expired: "期限切れ",
  ActiveSubscription_Tag_Trial: "試用期間",
  ActiveSubscription_Tag_Retry: "支払い再試行",
  ActiveSubscription_ManageSubscriptions: "サブスクリプション管理",
  BillingCycle_Finite: "{cycles}回 {duration}",
  BillingCycle_NonRecurring: "{duration}間",
  BillingCycle_Infinite: "{duration}毎",
  Duration_D_singular: "日",
  Duration_D_plural: "日",
  Duration_W_singular: "週間",
  Duration_W_plural: "週間",
  Duration_M_singular: "ヶ月",
  Duration_M_plural: "ヶ月",
  Duration_Y_singular: "年",
  Duration_Y_plural: "年",
  ProductPrice_StartingAt: "月額 {0} から",
  SubscriptionView_Title: "計画を選択してください",
  SubscriptionView_Close: "閉じる",
  ActiveSubscription_ManageBilling: "支払い方法",
  SubscriptionView_ChangePlan: "計画を変更する",
  SubscriptionView_CurrentSubscription: "あなたのサブスクリプション",
  SubscriptionView_Back: "戻る",
  SubscriptionView_Includes: "含む:",
  SubscriptionView_BillingOptions: "支払いオプション:",
  SubscriptionView_Continue: "購入する",
  SubscriptionView_Processing: "処理中...",
  EntitlementGrid_Checkmark: "✓",
  DateFormatter_Date: "{0}",
  DateFormatter_Time: "{0}",
  SubscriptionView_CurrentPlan: "現在のプラン",
  SubscriptionView_UpdatePlan: "更新计划",
  SubscriptionView_ProcessingTitle: "処理中",
  SubscriptionView_PleaseWait: "お待ちください...",
  SubscriptionView_Cancel: "キャンセル",
  SubscriptionView_ProcessingStatus_purchasing: "処理中...",
  SubscriptionView_ProcessingStatus_processing: "処理中...",
  SubscriptionView_ProcessingStatus_validating: "検証中...",
  SubscriptionView_ProcessingStatus_finishing: "最終処理中...",
  SubscriptionView_ProcessingStatus_completed: "完了...",
  SubscriptionView_ProcessingStatus_cancelled: "キャンセル中...",
  SubscriptionView_TermsPrefix: "購読することで、当社の",
  SubscriptionView_TermsLink: "利用規約",
  SubscriptionView_RestorePurchase: "購入を復元する",
  SubscriptionView_RestoringTitle: "復元中...",
  SubscriptionView_RestoreProgress: "処理中 {0} 件 / 合計 {1} 件",
};

/**
 * Chinese (Simplified) locale.
 */
const ZH: IapticLocale = {
  Error: "错误",
  ProgrammingError: "编程错误",
  IapticError_StoreNotInitialized: "IapticRN.store未初始化，请先调用IapticRN.initialize()",
  IapticError_StoreAlreadyInitialized: "IapticRN.store已初始化，请先调用IapticRN.destroy()",
  ValidationError: "收据验证错误",
  PurchaseError_title: "购买错误 #{0}",
  PurchaseError_E_UNKNOWN: "发生未知错误。",
  PurchaseError_E_USER_CANCELLED: "用户已取消购买。",
  PurchaseError_E_ITEM_UNAVAILABLE: "请求的商品不可用。",
  PurchaseError_E_NETWORK_ERROR: "网络错误。",
  PurchaseError_E_SERVICE_ERROR: "服务返回错误。",
  PurchaseError_E_RECEIPT_FAILED: "加载购买收据失败",  // Updated from "收据验证失败"
  PurchaseError_E_NOT_PREPARED: "购买未准备完成，无法继续。",
  PurchaseError_E_DEVELOPER_ERROR: "应用程序发生错误。",
  PurchaseError_E_ALREADY_OWNED: "此商品已购买。",
  PurchaseError_E_DEFERRED_PAYMENT: "付款已延期。",
  PurchaseError_E_USER_ERROR: "应用程序发生错误。",
  PurchaseError_E_REMOTE_ERROR: "发生远程错误。",
  PurchaseError_E_RECEIPT_FINISHED_FAILED: "无法完成交易。",
  PurchaseError_E_NOT_ENDED: "交易未结束。",
  PurchaseError_E_BILLING_RESPONSE_JSON_PARSE_ERROR: "解析账单响应失败。",
  PurchaseError_E_INTERRUPTED: "操作被中断。",
  PurchaseError_E_IAP_NOT_AVAILABLE: "应用内购买不可用。",
  UnknownError_title: "未知错误",
  UnknownError: "发生未知错误。",
  IapticRN_initialized_called: "IapticRN.initialize()只能调用一次",
  IapticError_6777001: "初始化应用内购买库失败",
  IapticError_6777002: "加载商品元数据失败",
  IapticError_6777003: "购买失败",
  IapticError_6777004: "加载购买收据失败",
  IapticError_6777005: "客户端无权执行此请求",
  IapticError_6777006: "用户已取消购买流程",
  IapticError_6777007: "购买存在可疑情况",
  IapticError_6777008: "用户无权进行支付",
  IapticError_6777010: "未知错误",
  IapticError_6777011: "更新购买收据失败",
  IapticError_6777012: "无效的商品标识符",
  IapticError_6777013: "无法完成交易或确认购买",
  IapticError_6777014: "服务器通信失败",
  IapticError_6777015: "订阅不可用",
  IapticError_6777016: "购买信息缺少令牌",
  IapticError_6777017: "商店数据验证失败",
  IapticError_6777018: "服务器返回错误响应",
  IapticError_6777019: "更新商店失败",
  IapticError_6777020: "支付已过期",
  IapticError_6777021: "内容下载失败",
  IapticError_6777022: "订阅更新失败",
  IapticError_6777023: "请求的商品在商店中不可用",
  IapticError_6777024: "用户未允许访问云服务信息",
  IapticError_6777025: "设备无法连接网络",
  IapticError_6777026: "用户已撤销云服务使用权限",
  IapticError_6777027: "用户尚未同意Apple隐私政策",
  IapticError_6777028: "应用尝试使用未授权的属性",
  IapticError_6777029: "无效的优惠标识符",
  IapticError_6777030: "App Store Connect中指定的价格已失效",
  IapticError_6777031: "支付折扣中的签名无效",
  IapticError_6777032: "支付折扣缺少参数",
  IapticError_6778003: "订阅已过期",
  IapticError_UnsupportedPlatform: "不支持的平台",
  ValidationError_MissingTransactionId: "缺少交易ID",
  ActiveSubscription_WillCancel: "{0} {1}取消",
  ActiveSubscription_WillRenew: "{0} {1}自动续订",
  ActiveSubscription_Status_Active: "有效",
  ActiveSubscription_Status_Expired: "已过期",
  ActiveSubscription_Tag_Trial: "试用期",
  ActiveSubscription_Tag_Retry: "付款重试",
  ActiveSubscription_ManageSubscriptions: "管理订阅",
  BillingCycle_Finite: "{cycles}次 {duration}",
  BillingCycle_NonRecurring: "为期{duration}",
  BillingCycle_Infinite: "每{duration}",
  Duration_D_singular: "天",
  Duration_D_plural: "天",
  Duration_W_singular: "周",
  Duration_W_plural: "周",
  Duration_M_singular: "个月",
  Duration_M_plural: "个月",
  Duration_Y_singular: "年",
  Duration_Y_plural: "年",
  ProductPrice_StartingAt: "每月仅需{0}起",
  SubscriptionView_Title: "选择您的计划",
  SubscriptionView_Close: "关闭",
  ActiveSubscription_ManageBilling: "支付方式",
  SubscriptionView_ChangePlan: "更改计划",
  SubscriptionView_CurrentSubscription: "您的订阅",
  SubscriptionView_Back: "返回",
  SubscriptionView_Includes: "包含:",
  SubscriptionView_BillingOptions: "计费选项:",
  SubscriptionView_Continue: "订阅",
  SubscriptionView_Processing: "处理中...",
  EntitlementGrid_Checkmark: "✓",
  DateFormatter_Date: "{0}",
  DateFormatter_Time: "{0}",
  SubscriptionView_CurrentPlan: "当前计划",
  SubscriptionView_UpdatePlan: "更新计划",
  SubscriptionView_ProcessingTitle: "处理购买中",
  SubscriptionView_PleaseWait: "请稍候...",
  SubscriptionView_Cancel: "取消",
  SubscriptionView_ProcessingStatus_purchasing: "处理中...",
  SubscriptionView_ProcessingStatus_processing: "处理中...",
  SubscriptionView_ProcessingStatus_validating: "验证中...",
  SubscriptionView_ProcessingStatus_finishing: "完成中...",
  SubscriptionView_ProcessingStatus_completed: "完成...",
  SubscriptionView_ProcessingStatus_cancelled: "取消中...",
  SubscriptionView_TermsPrefix: "订阅即表示您同意我们的",
  SubscriptionView_TermsLink: "条款和条件",
  SubscriptionView_RestorePurchase: "恢复购买",
  SubscriptionView_RestoringTitle: "恢复中...",
  SubscriptionView_RestoreProgress: "处理中 {0} 件 / 合計 {1} 件",
};

/**
 * Portuguese (Brazil) locale.
 */
const PT: IapticLocale = {
  Error: "Erro",
  ProgrammingError: "Erro de programação",
  IapticError_StoreNotInitialized: "IapticRN.store não está inicializado, chame IapticRN.initialize() primeiro",
  IapticError_StoreAlreadyInitialized: "IapticRN.store já está inicializado, chame IapticRN.destroy() primeiro",
  ValidationError: "Erro de validação de recibo",
  PurchaseError_title: "Erro de Compra #{0}",
  PurchaseError_E_UNKNOWN: "Ocorreu um erro desconhecido.",
  PurchaseError_E_USER_CANCELLED: "O usuário cancelou a compra.",
  PurchaseError_E_ITEM_UNAVAILABLE: "O produto solicitado não está disponível.",
  PurchaseError_E_NETWORK_ERROR: "Ocorreu um erro de rede.",
  PurchaseError_E_SERVICE_ERROR: "O serviço retornou um erro.",
  PurchaseError_E_RECEIPT_FAILED: "Falha ao carregar o recibo de compra",  // Updated from "Falha ao validar o recibo"
  PurchaseError_E_NOT_PREPARED: "A compra não pode ser concluída porque não foi preparada.",
  PurchaseError_E_DEVELOPER_ERROR: "Ocorreu um erro no aplicativo.",
  PurchaseError_E_ALREADY_OWNED: "Este item já foi comprado.",
  PurchaseError_E_DEFERRED_PAYMENT: "O pagamento foi adiado.",
  PurchaseError_E_USER_ERROR: "Ocorreu um erro no aplicativo.",
  PurchaseError_E_REMOTE_ERROR: "Ocorreu um erro remoto.",
  PurchaseError_E_RECEIPT_FINISHED_FAILED: "Falha ao finalizar a transação.",
  PurchaseError_E_NOT_ENDED: "A transação não foi finalizada.",
  PurchaseError_E_BILLING_RESPONSE_JSON_PARSE_ERROR: "Falha ao analisar a resposta de faturamento.",
  PurchaseError_E_INTERRUPTED: "A operação foi interrompida.",
  PurchaseError_E_IAP_NOT_AVAILABLE: "Compras dentro do aplicativo não estão disponíveis.",
  UnknownError_title: "Erro Desconhecido",
  UnknownError: "Ocorreu um erro desconhecido.",
  IapticRN_initialized_called: "IapticRN.initialize() só pode ser chamado uma vez",
  IapticError_6777001: "Falha ao inicializar a biblioteca de compras no aplicativo",
  IapticError_6777002: "Falha ao carregar metadados dos produtos",
  IapticError_6777003: "Falha ao realizar a compra",
  IapticError_6777004: "Falha ao carregar o recibo de compra",
  IapticError_6777005: "O cliente não tem permissão para fazer esta solicitação",
  IapticError_6777006: "O fluxo de compra foi cancelado pelo usuário",
  IapticError_6777007: "Algo parece suspeito nesta compra",
  IapticError_6777008: "O usuário não tem permissão para fazer pagamentos",
  IapticError_6777010: "Erro desconhecido",
  IapticError_6777011: "Falha ao atualizar o recibo de compra",
  IapticError_6777012: "Identificador do produto inválido",
  IapticError_6777013: "Não é possível finalizar a transação ou confirmar a compra",
  IapticError_6777014: "Falha na comunicação com o servidor",
  IapticError_6777015: "Assinaturas não estão disponíveis",
  IapticError_6777016: "Informações de compra estão sem token",
  IapticError_6777017: "Falha na verificação dos dados da loja",
  IapticError_6777018: "Resposta inválida do servidor",
  IapticError_6777019: "Falha ao atualizar a loja",
  IapticError_6777020: "O pagamento expirou",
  IapticError_6777021: "Falha ao baixar o conteúdo",
  IapticError_6777022: "Falha ao atualizar uma assinatura",
  IapticError_6777023: "O produto solicitado não está disponível na loja",
  IapticError_6777024: "O usuário não permitiu acesso às informações do serviço de nuvem",
  IapticError_6777025: "O dispositivo não conseguiu se conectar à rede",
  IapticError_6777026: "O usuário revogou a permissão para usar este serviço de nuvem",
  IapticError_6777027: "O usuário ainda não aceitou a política de privacidade da Apple",
  IapticError_6777028: "O aplicativo está tentando usar uma propriedade sem a permissão necessária",
  IapticError_6777029: "Identificador de oferta inválido",
  IapticError_6777030: "O preço especificado no App Store Connect não é mais válido",
  IapticError_6777031: "Assinatura no desconto de pagamento não é válida",
  IapticError_6777032: "Parâmetros faltando no desconto de pagamento",
  IapticError_6778003: "A assinatura expirou",
  IapticError_UnsupportedPlatform: "Plataforma não suportada",
  ValidationError_MissingTransactionId: "ID da transação faltando",
  ActiveSubscription_WillCancel: "Será cancelado em {0} às {1}",
  ActiveSubscription_WillRenew: "Renovação automática em {0} às {1}",
  ActiveSubscription_Status_Active: "Ativa",
  ActiveSubscription_Status_Expired: "Expirada",
  ActiveSubscription_Tag_Trial: "Período de teste",
  ActiveSubscription_Tag_Retry: "Tentar pagamento novamente",
  ActiveSubscription_ManageSubscriptions: "Gerenciar assinaturas",
  BillingCycle_Finite: "{cycles}x {duration}",
  BillingCycle_NonRecurring: "por {duration}",
  BillingCycle_Infinite: "cada {duration}",
  Duration_D_singular: "dia",
  Duration_D_plural: "dias",
  Duration_W_singular: "semana",
  Duration_W_plural: "semanas",
  Duration_M_singular: "mês",
  Duration_M_plural: "meses",
  Duration_Y_singular: "ano",
  Duration_Y_plural: "anos",
  ProductPrice_StartingAt: "a partir de {0} por mês",
  SubscriptionView_Title: "Escolha seu plano",
  SubscriptionView_Close: "Fechar",
  ActiveSubscription_ManageBilling: "Métodos de pagamento",
  SubscriptionView_Back: "Voltar",
  SubscriptionView_CurrentSubscription: "Sua Assinatura",
  SubscriptionView_ChangePlan: "Mudar Plano",
  SubscriptionView_Includes: "Inclui:",
  SubscriptionView_BillingOptions: "Opções:",
  SubscriptionView_Continue: "Assinar",
  SubscriptionView_Processing: "Processando...",
  EntitlementGrid_Checkmark: "✓",
  DateFormatter_Date: "{0}",
  DateFormatter_Time: "{0}",
  SubscriptionView_CurrentPlan: "Plano Atual",
  SubscriptionView_UpdatePlan: "Atualizar Plano",
  SubscriptionView_ProcessingTitle: "Processando Compra",
  SubscriptionView_PleaseWait: "Por favor aguarde...",
  SubscriptionView_Cancel: "Cancelar",
  SubscriptionView_ProcessingStatus_purchasing: "processando...",
  SubscriptionView_ProcessingStatus_processing: "processando...",
  SubscriptionView_ProcessingStatus_validating: "validando...",
  SubscriptionView_ProcessingStatus_finishing: "finalizando...",
  SubscriptionView_ProcessingStatus_completed: "completo...",
  SubscriptionView_ProcessingStatus_cancelled: "cancelado...",
  SubscriptionView_TermsPrefix: "Ao assinar, você concorda com nossos",
  SubscriptionView_TermsLink: "Termos e Condições",
  SubscriptionView_RestorePurchase: "Restaurar Compras",
  SubscriptionView_RestoringTitle: "Restaurando...",
  SubscriptionView_RestoreProgress: "Processado {0} de {1} compras",
};

/**
 * List of supported languages.
 */
export type IapticSupportedLocales = 'en' | 'en_uk' | 'en_au' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'pt';

/**
 * List of supported languages.
 */
export const IapticLanguages: Record<IapticSupportedLocales, IapticLocale> = {
  en: EN,
  en_uk: EN_UK,
  en_au: EN_AU,
  es: ES,
  fr: FR,
  de: DE,
  ja: JA,
  zh: ZH,
  pt: PT
};

/**
 * Handles localized messages for the iaptic React Native plugin
 * 
 * Supported languages:
 * - English (en)
 * - English (United Kingdom) (en_uk)
 * - English (Australia) (en_au)
 * - Spanish (es)
 * - French (fr)
 * - German (de)
 * - Japanese (ja)
 * - Chinese (zh)
 * - Portuguese (pt)
 * 
 * @internal
 */
export class Locales {
  
  private static currentLanguage: IapticSupportedLocales = 'en';
  private static fallbackLanguage: IapticSupportedLocales = 'en';

  /**
   * Adds a new language to the locales
   * 
   * @param language The language code to add
   * @param messages The messages for the language
   */
  static addLanguage(language: string, messages: IapticLocale) {
    IapticLanguages[language as IapticSupportedLocales] = messages;
  }

  /**
   * Sets the current language for messages
   * 
   * @param language The language code to use
   * @param fallbackLanguage The fallback language code to use if the current language is not supported
   */
  static setLanguage(language: string, fallbackLanguage: string = 'en') {
    this.currentLanguage = language as IapticSupportedLocales;
    this.fallbackLanguage = fallbackLanguage as IapticSupportedLocales;
  }

  /**
   * @param keyPrefix
   * @param count 
   * @param args 
   * @returns 
   */
  static getForCount(keyPrefix: string, count: number, args: string[] = []): string {
    const pluralForm = this.getPluralForm(this.currentLanguage, count);
    const key = `${keyPrefix}_${pluralForm}`;
    return this.get(key as keyof IapticLocale, args, count.toString());
  }

  private static getPluralForm(language: string, count: number): string {
    switch(language.split('_')[0]) {
      default:
        return count === 1 ? 'singular' : 'plural';
    }
  }

  static get(key: keyof IapticLocale, args: string[] = [], fallbackMessage: string = '', placeholders: string[] = []): string {
    if (!placeholders?.length) {
      placeholders = ['0', '1', '2', '3']; // Default to numeric placeholders
    }
    let value = IapticLanguages[this.currentLanguage][key] || IapticLanguages[this.fallbackLanguage as IapticSupportedLocales][key];
    if (!value) {
      logger.warn(`Locale key ${key} not found for language ${this.currentLanguage}`);
      value = fallbackMessage;
    }
    if (args.length > 0) {
      return value.replace(/{([^}]+)}/g, (match, placeholder) => {
        const index = placeholders.indexOf(placeholder);
        return index !== -1 && index < args.length ? args[index] : match;
      });
    }
    return value;
  }

  /**
   * Gets the device language and returns a supported language code
   * Defaults to 'en' if the device language is not supported
   */
  static getDeviceLanguage(): [IapticSupportedLocales, IapticSupportedLocales] {
    // Get device language
    const deviceLanguage = 
      (Platform.OS === 'ios'
        ? NativeModules.SettingsManager?.settings?.AppleLocale || // iOS
          NativeModules.SettingsManager?.settings?.AppleLanguages[0] // iOS fallback
        : NativeModules.I18nManager?.localeIdentifier) || 'en'; // Android
    const fallbackLanguage = (Platform.OS === 'ios'
      ? NativeModules.SettingsManager?.settings?.AppleLanguages[0] ||
        NativeModules.SettingsManager?.settings?.AppleLanguages[1] ||
        'en' // iOS fallback
      : 'en'); // Android fallback
    
    const fullCode = deviceLanguage.toLowerCase().replace(/[_-]/g, '_');
    const shortCode = fullCode.split('_')[0];
    // Return the language if supported, otherwise return 'en'
    const primary = IapticLanguages.hasOwnProperty(fullCode) ? fullCode : IapticLanguages.hasOwnProperty(shortCode) ? shortCode : 'en';
    return [
      primary as IapticSupportedLocales,
      fallbackLanguage as IapticSupportedLocales
    ];
  }

  /**
   * Initializes the locales with the device language
   */
  static initialize() {
    const [primary, fallback] = this.getDeviceLanguage();
    this.currentLanguage = primary;
    this.fallbackLanguage = fallback;
  }
}

// Initialize the locales with the device language at startup
Locales.initialize();