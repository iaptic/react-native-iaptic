/**
 * List of keys a locale must provide.
 * 
 * @external IapticLocale
 */
export interface IapticLocale {
  /** Programming Error */
  ProgrammingError: string;
  /** IapticRN.store is not initialized, call IapticRN.initialize() first */
  IapticError_StoreNotInitialized: string;
  /** IapticRN.store is already initialized, call IapticRN.destroy() first */
  IapticError_StoreAlreadyInitialized: string;
  /** Error */
  Error: string;
  /** Receipt Validation Error */
  ValidationError: string;
  /** Purchase Error #{0} */
  PurchaseError_title: string;
  /** An unknown error occurred. */
  PurchaseError_E_UNKNOWN: string;
  /** The user cancelled the purchase. */
  PurchaseError_E_USER_CANCELLED: string;
  /** The requested product is not available. */
  PurchaseError_E_ITEM_UNAVAILABLE: string;
  /** A network error occurred. */
  PurchaseError_E_NETWORK_ERROR: string;
  /** The service returned an error. */
  PurchaseError_E_SERVICE_ERROR: string;
  /** Failed to validate receipt. */
  PurchaseError_E_RECEIPT_FAILED: string;
  /** The purchase cannot be completed because it has not been prepared. */
  PurchaseError_E_NOT_PREPARED: string;
  /** An error occurred in the application. */
  PurchaseError_E_DEVELOPER_ERROR: string;
  /** This item has already been purchased. */
  PurchaseError_E_ALREADY_OWNED: string;
  /** The payment has been deferred. */
  PurchaseError_E_DEFERRED_PAYMENT: string;
  /** An error occurred in the application. */
  PurchaseError_E_USER_ERROR: string;
  /** A remote error occurred. */
  PurchaseError_E_REMOTE_ERROR: string;
  /** Failed to finish the transaction. */
  PurchaseError_E_RECEIPT_FINISHED_FAILED: string;
  /** The transaction has not been ended. */
  PurchaseError_E_NOT_ENDED: string;
  /** Failed to parse the billing response. */
  PurchaseError_E_BILLING_RESPONSE_JSON_PARSE_ERROR: string;
  /** The operation was interrupted. */
  PurchaseError_E_INTERRUPTED: string;
  /** In-app purchases are not available. */
  PurchaseError_E_IAP_NOT_AVAILABLE: string;
  /** Unknown Error */
  UnknownError_title: string;
  /** An unknown error occurred. */
  UnknownError: string;
  /** IapticRN.initialize() can only be called once */
  IapticRN_initialized_called: string;
  /** Failed to initialize the in-app purchase library */
  IapticError_6777001: string;
  /** Failed to load in-app products metadata */
  IapticError_6777002: string;
  /** Failed to make a purchase */
  IapticError_6777003: string;
  /** Failed to load the purchase receipt */
  IapticError_6777004: string;
  /** Client is not allowed to issue the request */
  IapticError_6777005: string;
  /** Purchase flow has been cancelled by user */
  IapticError_6777006: string;
  /** Something is suspicious about a purchase */
  IapticError_6777007: string;
  /** The user is not allowed to make a payment */
  IapticError_6777008: string;
  /** Unknown error */
  IapticError_6777010: string;
  /** Failed to refresh the purchase receipt */
  IapticError_6777011: string;
  /** The product identifier is invalid */
  IapticError_6777012: string;
  /** Cannot finalize a transaction or acknowledge a purchase */
  IapticError_6777013: string;
  /** Failed to communicate with the server */
  IapticError_6777014: string;
  /** Subscriptions are not available */
  IapticError_6777015: string;
  /** Purchase information is missing token */
  IapticError_6777016: string;
  /** Verification of store data failed */
  IapticError_6777017: string;
  /** Bad response from the server */
  IapticError_6777018: string;
  /** Failed to refresh the store */
  IapticError_6777019: string;
  /** Payment has expired */
  IapticError_6777020: string;
  /** Failed to download the content */
  IapticError_6777021: string;
  /** Failed to update a subscription */
  IapticError_6777022: string;
  /** The requested product is not available in the store */
  IapticError_6777023: string;
  /** The user has not allowed access to Cloud service information */
  IapticError_6777024: string;
  /** The device could not connect to the network */
  IapticError_6777025: string;
  /** The user has revoked permission to use this cloud service */
  IapticError_6777026: string;
  /** The user has not yet acknowledged Apple's privacy policy */
  IapticError_6777027: string;
  /** The app is attempting to use a property without required entitlement */
  IapticError_6777028: string;
  /** The offer identifier is invalid */
  IapticError_6777029: string;
  /** The price specified in App Store Connect is no longer valid */
  IapticError_6777030: string;
  /** The signature in a payment discount is not valid */
  IapticError_6777031: string;
  /** Parameters are missing in a payment discount */
  IapticError_6777032: string;
  /** Subscription has expired */
  IapticError_6778003: string;
  /** Unsupported platform */
  IapticError_UnsupportedPlatform: string;
  /** Transaction ID is missing */
  ValidationError_MissingTransactionId: string;

  // Active Subscription Component
  /** Will be cancelled on {0} at {1} */
  ActiveSubscription_WillCancel: string;
  /** Auto-renewing on {0} at {1} */
  ActiveSubscription_WillRenew: string;
  /** Active */
  ActiveSubscription_Status_Active: string;
  /** Expired */
  ActiveSubscription_Status_Expired: string;
  /** Trial Period */
  ActiveSubscription_Tag_Trial: string;
  /** Payment Retry */
  ActiveSubscription_Tag_Retry: string;
  /** Manage Subscriptions */
  ActiveSubscription_ManageSubscriptions: string;
  /** Manage Billing */
  ActiveSubscription_ManageBilling: string;

  // Billing cycle templates
  /** {cycles}x {duration} */
  BillingCycle_Finite: string;
  /** for {duration} */
  BillingCycle_NonRecurring: string;
  /** every {duration} */
  BillingCycle_Infinite: string;

  // Duration units
  /** day */
  Duration_D_singular: string;
  /** days */
  Duration_D_plural: string;
  /** week */
  Duration_W_singular: string;
  /** weeks */
  Duration_W_plural: string;
  /** month */
  Duration_M_singular: string;
  /** months */
  Duration_M_plural: string;
  /** year */
  Duration_Y_singular: string;
  /** years */
  Duration_Y_plural: string;

  /** "starting at {0} per month" - {0} will be replaced with price component */
  ProductPrice_StartingAt: string;
  /** "Choose Your Plan" */
  SubscriptionView_Title: string;
  /** "Close" */
  SubscriptionView_Close: string;
  /** "Includes:" */
  SubscriptionView_Includes: string;
  /** "Billing Options" */
  SubscriptionView_BillingOptions: string;
  /** "Continue" */
  SubscriptionView_Continue: string;
  /** "Processing..." */
  SubscriptionView_Processing: string;
  /** "Current Plan" */
  SubscriptionView_CurrentPlan: string;
  /** "Update Plan" */
  SubscriptionView_UpdatePlan: string;
  /** "Date" */
  DateFormatter_Date: string;
  /** "Time" */
  DateFormatter_Time: string;
  /** "✓" */
  EntitlementGrid_Checkmark: string;
  /** Purchasing... */
  SubscriptionView_ProcessingTitle: string;
  /** Please wait... */
  SubscriptionView_PleaseWait: string;
  /** Cancel */
  SubscriptionView_Cancel: string;
  /** Purchasing... */
  SubscriptionView_ProcessingStatus_purchasing: string;
  /** Processing... */
  SubscriptionView_ProcessingStatus_processing: string;
  /** Validating receipt... */
  SubscriptionView_ProcessingStatus_validating: string;
  /** Finalizing purchase... */
  SubscriptionView_ProcessingStatus_finishing: string;
  /** Completed */
  SubscriptionView_ProcessingStatus_completed: string;

  /** "By subscribing, you agree to our" */
  SubscriptionView_TermsPrefix: string;
  /** "Terms and Conditions" */
  SubscriptionView_TermsLink: string;
  /** "Restore Purchases" */
  SubscriptionView_RestorePurchase: string;

  /** "Restoring..." */
  SubscriptionView_RestoringTitle: string;
  /** "Processed {0} of {1} purchases" */
  SubscriptionView_RestoreProgress: string;
  /** "Cancelled" */
  SubscriptionView_ProcessingStatus_cancelled: string;
}
