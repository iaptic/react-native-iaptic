import { IapticError } from "./classes/IapticError";

/**
 * Configuration for the iaptic validator
 * 
 * @internal
 */
export interface IapticStoreConfig {
  iosBundleId?: string;
  appName: string;
  publicKey: string;
  /** The base URL of the iaptic validator */
  baseUrl?: string;
  /**
   * Disable alert by setting this to false.
   * 
   * By default, IapticRN will display relevant alerts to the user when something goes wrong.
   * 
   * Default is true.
   */
  showAlerts?: boolean;
}

/** Interface defining an in-app purchase product */
export interface IapticProductDefinition {
  /** Unique identifier of the product */
  id: string;
  /** Type of the product (subscription, consumable, or non-consumable) */
  type: IapticProductType;

  /**
   * Entitlements this product will give to the user, can be used for subscription and non-consumable products.
   * 
   * Use iapticRN.checkEntitlement("my-entitlement") to check if the user owns any product that provides this entitlement.
   */
  entitlements?: string[];

  /**
   * Type of token this product will give to the user for consumable products.
   * 
   * For example: "coin", "gem", "silver", etc.
   */
  tokenType?: string;

  /**
   * Amount of tokens this product will give to the user for consumable products.
   * 
   * @example
   * ```typescript
   * { id: 'coins_100', type: 'consumable', tokenType: 'coin', tokenValue: 100 },
   * ```
   */
  tokenValue?: number;
}


/**
 * Data needed to validate a purchase
 * 
 * @internal
 */ 
export interface IapticValidationData {
  productId: string,
  transactionId: string,
  receipt: string,
  receiptSignature: string,
  productType: IapticProductType,
  applicationUsername?: string;
}

/**
 * Product types supported by the iaptic validator
 */
export type IapticProductType = 'application' | 'paid subscription' | 'non renewing subscription' | 'consumable' | 'non consumable';

//
// VALIDATOR SUCCESS RESPONSE DEFINITIONS
//

/**
 * Response from the iaptic validator endpoint
 * 
 * @internal
 */
export type IapticValidateResponse = IapticValidateSuccessPayload | IapticValidateErrorPayload;

/**
 * Success response from iaptic validator endpoint
 * 
 * @internal
 */
export interface IapticValidateSuccessPayload {

  /** Indicates a successful request */
  ok: true;

  data: {
    /** The collection of purchases in this receipt.
     *
     * An array of ValidatorPurchase */
    collection?: IapticVerifiedPurchase[];
    /** List of product ids for which intro price isn't available anymore */
    ineligible_for_intro_price?: string[];
    /** Id of the product that have been validated */
    id: string;
    /** Tell the plugin that we've used the latest receipt */
    latest_receipt: boolean;
    /** Native transaction detail */
    transaction: any;
    /** A warning message about this validation.
     *
     * It might be present when the server had to fallback to a backup validation solution. */
    warning?: string;
    /** Date and time the receipt was validated.
     *
     * It will provide the client with a more reliable clock time
     * than the user's device when needed. */
    date?: ISODate;
  }
}

/**
 * Dates stored as a ISO formatted string
 */
type ISODate = string;

/**
 * Purchase verified by the receipt validator.
 */
export interface IapticVerifiedPurchase {

  /**
   * Product identifier
   * @deprecated Use `productId` instead
   */
  id: string;

  /** Product identifier */
  productId: string

  /** Platform this purchase was made on */
  platform?: IapticPurchasePlatform;

  /** Purchase identifier (optional) */
  purchaseId?: string;

  /** Identifier of the last transaction (optional) */
  transactionId?: string;

  /** Date of first purchase (timestamp). */
  purchaseDate?: number;

  /** Date of expiry for a subscription. */
  expiryDate?: number;

  /** True when a subscription is expired. */
  isExpired?: boolean;

  /**
   * Whether or not the user intends to let the subscription auto-renew.
   * 
   * Possible values:
   * - `"Renew"` - The user intends to renew the subscription.
   * - `"Lapse"` - The user intends to let the subscription expire without renewing.
   */
  renewalIntent?: 'Renew' | 'Lapse';

  /** Date the renewal intent was updated by the user. */
  renewalIntentChangeDate?: number;

  /** The reason a subscription or purchase was cancelled. */
  cancelationReason?: IapticCancelationReason;

  /** True when a subscription a subscription is in the grace period after a failed attempt to collect payment */
  isBillingRetryPeriod?: boolean;

  /** True when a subscription is in trial period */
  isTrialPeriod?: boolean;

  /** True when a subscription is in introductory pricing period */
  isIntroPeriod?: boolean;

  /** True when a purchase has been acknowledged */
  isAcknowledged?: boolean;

  /** Identifier of the discount currently applied to a purchase.
   *
   * Correspond to the product's offerId. When undefined it means there is only one offer for the given product. */
  discountId?: string;

  /** Whether or not the user agreed or has been notified of a price change. */
  priceConsentStatus?: IapticPriceConsentStatus;

  /** Last time a subscription was renewed. */
  lastRenewalDate?: number;
}

/** Reason why a subscription has been canceled */
export enum IapticCancelationReason {
  /** Not canceled */
  NOT_CANCELED = '',
  /** Subscription canceled by the developer. */
  DEVELOPER = 'Developer',
  /** Subscription canceled by the system for an unspecified reason. */
  SYSTEM = 'System',
  /** Subscription upgraded or downgraded to a new subscription. */
  SYSTEM_REPLACED = 'System.Replaced',
  /** Product not available for purchase at the time of renewal. */
  SYSTEM_PRODUCT_UNAVAILABLE = 'System.ProductUnavailable',
  /** Billing error; for example customer's payment information is no longer valid. */
  SYSTEM_BILLING_ERROR = 'System.BillingError',
  /** Transaction is gone; It has been deleted. */
  SYSTEM_DELETED = 'System.Deleted',
  /** Subscription canceled by the user for an unspecified reason. */
  CUSTOMER = 'Customer',
  /** Customer canceled their transaction due to an actual or perceived issue within your app. */
  CUSTOMER_TECHNICAL_ISSUES = 'Customer.TechnicalIssues',
  /** Customer did not agree to a recent price increase. See also priceConsentStatus. */
  CUSTOMER_PRICE_INCREASE = 'Customer.PriceIncrease',
  /** Customer canceled for cost-related reasons. */
  CUSTOMER_COST = 'Customer.Cost',
  /** Customer claimed to have found a better app. */
  CUSTOMER_FOUND_BETTER_APP = 'Customer.FoundBetterApp',
  /** Customer did not feel he is using this service enough. */
  CUSTOMER_NOT_USEFUL_ENOUGH = 'Customer.NotUsefulEnough',
  /** Subscription canceled for another reason; for example, if the customer made the purchase accidentally. */
  CUSTOMER_OTHER_REASON = 'Customer.OtherReason',
  /** Subscription canceled for unknown reasons. */
  UNKNOWN = 'Unknown'
}

/** Whether or not the user was notified or agreed to a price change */
export enum IapticPriceConsentStatus {
  NOTIFIED = 'Notified',
  AGREED = 'Agreed',
}

/**
 * Purchase platforms supported by the plugin
 */
export enum IapticPurchasePlatform {

  /** Apple AppStore */
  APPLE_APPSTORE = 'ios-appstore',

  /** Google Play */
  GOOGLE_PLAY = 'android-playstore',

  /** Windows Store */
  WINDOWS_STORE = 'windows-store-transaction',

  /** Braintree */
  BRAINTREE = 'braintree',

  // /** Stripe */
  // STRIPE = 'stripe',

  /** Test platform */
  TEST = 'test',
}

//
// VALIDATOR FAILURE RESPONSE DEFINITIONS
//

/**
 * Error response from the validator endpoint
 * 
 * @internal
 */
export interface IapticValidateErrorPayload {
  /** Value `false` indicates that the request returned an error */
  ok: false;
  /** Error status (HTTP status) */
  status?: number;
  /** An ErrorCode */
  code?: IapticErrorCode;
  /** Human readable description of the error */
  message?: string;

  data?: {
    /** We validated using the latest version of the receipt, not need to refresh it. */
    latest_receipt?: boolean;
  };
}

export const ERROR_CODES_BASE = 6777000;

/**
 * Error codes
 */
export enum IapticErrorCode {

  /** Error: Failed to intialize the in-app purchase library */
  SETUP = ERROR_CODES_BASE + 1,
  /** Error: Failed to load in-app products metadata */
  LOAD = ERROR_CODES_BASE + 2,
  /** Error: Failed to make a purchase */
  PURCHASE = ERROR_CODES_BASE + 3,
  /** Error: Failed to load the purchase receipt */
  LOAD_RECEIPTS = ERROR_CODES_BASE + 4,
  /** Error: Client is not allowed to issue the request */
  CLIENT_INVALID = ERROR_CODES_BASE + 5,
  /** Error: Purchase flow has been cancelled by user */
  PAYMENT_CANCELLED = ERROR_CODES_BASE + 6,
  /** Error: Something is suspicious about a purchase */
  PAYMENT_INVALID = ERROR_CODES_BASE + 7,
  /** Error: The user is not allowed to make a payment */
  PAYMENT_NOT_ALLOWED = ERROR_CODES_BASE + 8,
  /** Error: Unknown error */
  UNKNOWN = ERROR_CODES_BASE + 10,
  /** Error: Failed to refresh the purchase receipt */
  REFRESH_RECEIPTS = ERROR_CODES_BASE + 11,
  /** Error: The product identifier is invalid */
  INVALID_PRODUCT_ID = ERROR_CODES_BASE + 12,
  /** Error: Cannot finalize a transaction or acknowledge a purchase */
  FINISH = ERROR_CODES_BASE + 13,
  /** Error: Failed to communicate with the server */
  COMMUNICATION = ERROR_CODES_BASE + 14,
  /** Error: Subscriptions are not available */
  SUBSCRIPTIONS_NOT_AVAILABLE = ERROR_CODES_BASE + 15,
  /** Error: Purchase information is missing token */
  MISSING_TOKEN = ERROR_CODES_BASE + 16,
  /** Error: Verification of store data failed */
  VERIFICATION_FAILED = ERROR_CODES_BASE + 17,
  /** Error: Bad response from the server */
  BAD_RESPONSE = ERROR_CODES_BASE + 18,
  /** Error: Failed to refresh the store */
  REFRESH = ERROR_CODES_BASE + 19,
  /** Error: Payment has expired */
  PAYMENT_EXPIRED = ERROR_CODES_BASE + 20,
  /** Error: Failed to download the content */
  DOWNLOAD = ERROR_CODES_BASE + 21,
  /** Error: Failed to update a subscription */
  SUBSCRIPTION_UPDATE_NOT_AVAILABLE = ERROR_CODES_BASE + 22,
  /** Error: The requested product is not available in the store. */
  PRODUCT_NOT_AVAILABLE = ERROR_CODES_BASE + 23,
  /** Error: The user has not allowed access to Cloud service information */
  CLOUD_SERVICE_PERMISSION_DENIED = ERROR_CODES_BASE + 24,
  /** Error: The device could not connect to the network. */
  CLOUD_SERVICE_NETWORK_CONNECTION_FAILED = ERROR_CODES_BASE + 25,
  /** Error: The user has revoked permission to use this cloud service. */
  CLOUD_SERVICE_REVOKED = ERROR_CODES_BASE + 26,
  /** Error: The user has not yet acknowledged Apple's privacy policy */
  PRIVACY_ACKNOWLEDGEMENT_REQUIRED = ERROR_CODES_BASE + 27,
  /** Error: The app is attempting to use a property for which it does not have the required entitlement. */
  UNAUTHORIZED_REQUEST_DATA = ERROR_CODES_BASE + 28,
  /** Error: The offer identifier is invalid. */
  INVALID_OFFER_IDENTIFIER = ERROR_CODES_BASE + 29,
  /** Error: The price you specified in App Store Connect is no longer valid. */
  INVALID_OFFER_PRICE = ERROR_CODES_BASE + 30,
  /** Error: The signature in a payment discount is not valid. */
  INVALID_SIGNATURE = ERROR_CODES_BASE + 31,
  /** Error: Parameters are missing in a payment discount. */
  MISSING_OFFER_PARAMS = ERROR_CODES_BASE + 32,

  /**
   * Server code used when a subscription expired.
   *
   * @deprecated Validator should now return the transaction in the collection as expired.
   */
  VALIDATOR_SUBSCRIPTION_EXPIRED = 6778003
}

/**
 * All possible event types that can be listened to.
 * 
 * - `products.updated` - When any product metadata is updated (title, price, description, etc.)
 * - `purchase.updated` - When any purchase is updated (subscription, consumable, non-consumable)
 * - `subscription.updated` - When a subscription is updated (renewed, cancelled, expired, changed)
 * - `subscription.renewed` - When a subscription is renewed
 * - `subscription.cancelled` - When a subscription is cancelled
 * - `subscription.expired` - When a subscription is expired
 * - `subscription.changed` - When a subscription is changed
 * - `pendingPurchase.updated` - When a pending purchase status changes
 * - `nonConsumable.updated` - When a non-consumable status changes (owned, unowned)
 * - `nonConsumable.owned` - When a non-consumable purchase is owned
 * - `nonConsumable.unowned` - When a non-consumable purchase is no longer owned
 * - `consumable.purchased` - When a consumable purchase is purchased
 * - `consumable.refunded` - When a consumable purchase is refunded
 * - `error` - When an error occurs in the background
 */
export type IapticEventType = 
  | 'products.updated'
  | 'purchase.updated'
  | 'subscription.updated'
  | 'subscription.renewed'
  | 'subscription.cancelled'
  | 'subscription.expired'
  | 'subscription.changed'
  | 'pendingPurchase.updated'
  | 'nonConsumable.updated'
  | 'nonConsumable.owned'
  | 'nonConsumable.unowned'
  | 'consumable.purchased'
  | 'consumable.refunded'
  | 'error'
  ;

/**
 * Event argument types mapped to their event names
 */
export interface IapticEventMap {
  'products.updated': [products: IapticProduct[]];
  'purchase.updated': [purchase: IapticVerifiedPurchase];
  'subscription.updated': [reason: IapticSubscriptionReason, purchase: IapticVerifiedPurchase];
  'subscription.renewed': [purchase: IapticVerifiedPurchase];
  'subscription.cancelled': [purchase: IapticVerifiedPurchase];
  'subscription.expired': [purchase: IapticVerifiedPurchase];
  'subscription.changed': [purchase: IapticVerifiedPurchase];
  'pendingPurchase.updated': [purchase: IapticPendingPurchase];
  'nonConsumable.updated': [purchase: IapticVerifiedPurchase];
  'nonConsumable.owned': [purchase: IapticVerifiedPurchase];
  'nonConsumable.unowned': [purchase: IapticVerifiedPurchase];
  'consumable.purchased': [purchase: IapticVerifiedPurchase];
  'consumable.refunded': [purchase: IapticVerifiedPurchase];
  'error': [error: IapticError];
}

/**
 * Type-safe event listener function
 */
export type IapticEventListener<T extends IapticEventType> = (...args: IapticEventMap[T]) => void;

/** Reason why a subscription status changed */
export type IapticSubscriptionReason = 'renewed' | 'cancelled' | 'expired' | 'changed';

/**
 * Body of a receipt validation request,
 * 
 * @internal
 */
export interface IapticValidateRequest {

  /**
   * Identifier of the product you want to validate. On iOS, can be set to your application identifier. @required
   */
  id?: string;

  /**
   * Type of product being validated. Possible values:
   *
   * <ul>
   * <li>`application` – Validate the application download (Apple only).</li>
   * <li>`paid subscription` – An auto-renewing subscription.</li>
   * <li>`non renewing subscription` – A non renewing subscription.</li>
   * <li>`consumable` – A consumable product.</li>
   * <li>`non consumable` – A non-consumable product.</li>
   * </ul>
   *
   * @required
   */
  type?: IapticProductType;

  /**
   * Details about the native transaction.
   *
   * Can be:
   * <ul>
   *  <li>An <a href="#api-Types-Validate.TransactionApple">Apple Transaction</a></li>
   *  <li>A <a href="#api-Types-Validate.TransactionGoogle">Google Transaction</a></li>
   *  <li>A <a href="#api-Types-Validate.TransactionWindows">Windows Transaction</a></li>
   *  <li>A <a href="#api-Types-Validate.TransactionStripe">Stripe Transaction</a></li>
   * </ul>
   *
   * @required
   */
  transaction?: IapticValidateRequestTransaction;

  /** Additional data about the purchase */
  additionalData?: {
    /** Attach the purchases to the given application user. Should be a string.
     *
     * See [/documentation/application-username](/documentation/application-username) for more information.
     *
     * @optional */
    applicationUsername?: string | number;
  };

  device?: {
    [key: string]: string;
  }
  /** List of products available in the store */
  products: IapticProduct[];

  /** List of offers available for this product */
  offers?: IapticOffer[];
}

/**
 * Transaction definition for a specific platforms
 * 
 * @internal
 */
export type IapticValidateRequestTransaction =
  IapticValidateRequestTransactionApple |
  IapticValidateRequestTransactionGoogle;

/**
 * Product metadata from the store
 */
export interface IapticProduct {

  /** Type of product (subscription, consumable, etc.) */
  type: IapticProductType;

  /** Product identifier on the store (unique per platform) */
  id: string;

  /** List of offers available for this product */
  offers: IapticOffer[];

  /** Title of the product provided by the store */
  title?: string;

  /** Description of the product provided by the store */
  description?: string;

  /** Platform of the product */
  platform: IapticPurchasePlatform;

  /** Country code of the product */
  countryCode?: string;

  /**
   * Entitlements this product will give to the user, can be used for subscription and non-consumable products.
   * 
   * Use iapticRN.checkEntitlement("my-entitlement") to check if the user owns any product that provides this entitlement.
   */
  entitlements?: string[];

  /**
   * Type of token this product will give to the user for consumable products.
   * 
   * For example: "coin", "gem", "silver", etc.
   */
  tokenType?: string;

  /**
   * Amount of tokens this product will give to the user for consumable products.
   * 
   * @example
   * ```typescript
   * { id: 'coins_100', type: 'consumable', tokenType: 'coin', tokenValue: 100 },
   * ```
   */
  tokenValue?: number;
}

/**
 * Transaction definition for an Apple powered device 
 * 
 * @internal
 */
export interface IapticValidateRequestTransactionApple {

  /** Value `"ios-appstore"` */
  type: 'ios-appstore';

  /** Identifier of the transaction to evaluate, or set it to your application identifier if id has been set so. @required */
  id: string;

  /** Apple appstore receipt, base64 encoded. @required */
  appStoreReceipt: string;
}

/**
 * Transaction definition for a Google powered device 
 * 
 * @internal
 */
export interface IapticValidateRequestTransactionGoogle {
  /** Value `"android-playstore"` */
  type: 'android-playstore';

  /** Identifier of the transaction to evaluate.
   *
   * Corresponds to:
   * - the `orderId` in the receipt from Google.
   * - the `transactionId` in the receipt from Apple (or bundleID for the application receipt).
   *
   * @required */
  id: string;

  /** Google purchase token. @required */
  purchaseToken: string;

  /** Google receipt in a JSON-encoded string. @required */
  receipt: string;

  /** Google receipt signature (used to validate the local receipt). @required */
  signature: string;
}

/**
 * Pricing offer for an In-App Product
 */
export interface IapticOffer {
  /** Offer identifier */
  id: string;
  /** Platform of the product */
  platform: IapticPurchasePlatform;
  /** Pricing phases for this offer */
  pricingPhases: IapticPricingPhase[];
  /** Product identifier */
  productId: string;
  /** Type of product (subscription, consumable, etc.) */
  productType?: IapticProductType;
  /** Type of offer */
  offerType: "Default" | "Introductory" | "Subscription";
  /** Subscription group (if any) */
  productGroup?: string | null;
  /** Offer token (if any) */
  offerToken?: string;
}

/**
 * Description of a phase for the pricing of a purchase.
 *
 * @see {@link IapticOffer.pricingPhases}
 */
export interface IapticPricingPhase {
  // Price formatted for humans
  price: string;
  /** Price in micro-units (divide by 1000000 to get numeric price) */
  priceMicros: number;
  /** Currency code */
  currency?: string;
  /** ISO 8601 duration of the period (https://en.wikipedia.org/wiki/ISO_8601#Durations) */
  billingPeriod?: string;
  /** Number of recurrence cycles (if recurrenceMode is FINITE_RECURRING) */
  billingCycles?: number;
  /** Type of recurring payment */
  recurrenceMode?: IapticRecurrenceMode;
  /** Payment mode for the pricing phase ("PayAsYouGo", "UpFront", or "FreeTrial") */
  paymentMode?: IapticPaymentMode;
}

/**
 * Type of recurring payment
 *
 * - FINITE_RECURRING: Payment recurs for a fixed number of billing period set in `paymentPhase.cycles`.
 * - INFINITE_RECURRING: Payment recurs for infinite billing periods unless cancelled.
 * - NON_RECURRING: A one time charge that does not repeat.
 */
export type IapticRecurrenceMode =
  | "NON_RECURRING"
  | "FINITE_RECURRING"
  | "INFINITE_RECURRING"
  ;

/** Mode of payment */
export type IapticPaymentMode =
  /** Used for subscriptions, pay at the beginning of each billing period */
  | "PayAsYouGo"
  /** Pay the whole amount up front */
  | "UpFront"
  /** Nothing to be paid */
  | "FreeTrial"
  ;

/**
 * Status of a purchase being processed.
 */
export type IapticPendingPurchaseState = 'purchasing' | 'processing' |  'validating' | 'finishing' | 'completed' | 'cancelled';

/** Keep the state of a potential purchase in progress */
export interface IapticPendingPurchase {

  /** Product identifier */
  productId: string;

  /** Status of the purchase */
  status: IapticPendingPurchaseState;

  /** Identifier of the offer that is being purchased */
  offerId?: string;
}

export enum IapticVerbosity {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

