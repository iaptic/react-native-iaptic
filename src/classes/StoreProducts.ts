import * as IAP from 'react-native-iap';
import { IapticProductDefinition, IapticProduct, IapticOffer, IapticPricingPhase, IapticProductType, IapticRecurrenceMode, IapticPaymentMode, IapticPurchasePlatform } from '../types';
import { getPlatform } from '../functions/getPlatform';
import { logger } from './IapticLogger';
import { IapticEvents } from './IapticEvents';

/** Manages the catalog of available in-app purchase products */
export class StoreProducts {

  /** List of product definitions */
  private definitions: IapticProductDefinition[] = [];
  /** List of subscription products */
  private subscriptions: IAP.Subscription[] = [];
  /** List of non-subscription products */
  private products: IAP.Product[] = [];

  /**
   * Creates a new product catalog
   * @param definitions - Initial product definitions
   * @param subscriptions - Initial subscription products
   * @param products - Initial non-subscription products
   */
  constructor(definitions: IapticProductDefinition[], subscriptions: IAP.Subscription[], products: IAP.Product[], private readonly events: IapticEvents) {
    this.definitions = definitions;
    this.subscriptions = subscriptions;
    this.products = products;
    this.events.emit('products.updated', this.all());
  }

  /**
   * @internal
   */
  getIapProduct(productId: string): IAP.Product | undefined {
    return this.products.find(p => p.productId === productId);
  }

  /**
   * @internal
   */
  getIapSubscription(productId: string): IAP.Subscription | undefined {
    return this.subscriptions.find(s => s.productId === productId);
  }

  /**
   * Get a product by its identifier
   * @param productId - The product identifier
   * @returns The product
   */
  get(productId: string): IapticProduct | undefined {
    const definition = this.definitions.find(p => p.id === productId);
    return definition ? this.toIapticProduct(definition) : undefined;
  }

  /**
   * Get a product definition by its identifier
   * @param productId - The product identifier
   * @returns The product definition
   */
  getDefinition(productId: string): IapticProductDefinition | undefined {
    return this.definitions.find(p => p.id === productId);
  }

  /**
   * Adds products to the catalog
   * 
   * @param definitions - Product definitions to add
   * @param subscriptions - Subscription products to add
   * @param products - Non-subscription products to add
   */
  add(definitions: IapticProductDefinition[], subscriptions: IAP.Subscription[], products: IAP.Product[]): IapticProduct[] {
    for (const definition of definitions) {
      if (!this.definitions.find(d => d.id === definition.id)) {
        this.definitions.push(definition);
      }
    }
    for (const subscription of subscriptions) {
      if (!this.subscriptions.find(s => s.productId === subscription.productId)) {
        this.subscriptions.push(subscription);
      }
    }
    for (const product of products) {
      if (!this.products.find(p => p.productId === product.productId)) {
        this.products.push(product);
      }
    }
    const updatedProducts = this.all();
    this.events.emit('products.updated', updatedProducts);
    return updatedProducts;
  }

  /**
   * Load some products from the store, add them to the catalog and return them.
   * 
   * @param definitions - The product definitions to load
   * @returns The loaded products
   */
  async load(definitions?: IapticProductDefinition[]): Promise<IapticProduct[]> {
    if (!definitions) {
      definitions = this.definitions;
    }
    logger.info(`load: ${definitions.map(d => d.id).join(', ')}`);
    let subscriptions: IAP.Subscription[] = [];
    let products: IAP.Product[] = [];
    const subscriptionIds = definitions.filter(d => d.type === 'paid subscription').map(d => d.id);
    if (subscriptionIds.length > 0) {
      logger.debug(`subscriptions to load: ${subscriptionIds.join(', ')}`);
      subscriptions = await IAP.getSubscriptions({
        skus: subscriptionIds
      });
      logger.debug(`subscriptions loaded: ${JSON.stringify(subscriptions)}`);
    }
    const productIds = definitions.filter(d => d.type !== 'paid subscription').map(d => d.id);
    if (productIds.length > 0) {
      logger.debug(`products to load: ${productIds.join(', ')}`);
      products = await IAP.getProducts({
        skus: productIds
      });
      logger.debug(`products loaded: ${JSON.stringify(products)}`);
    }
    this.add(definitions, subscriptions, products);
    return this.definitions.map(d => this.toIapticProduct(d)).filter(p => p !== undefined);
  }

  /**
   * Gets the type of a product
   * @param productId - The product identifier
   * @returns The type of the product
   */
  getType(productId: string): IapticProductType {
    const product = this.definitions.find(p => p.id === productId);
    if (!product) {
      // let's assume it's a subscription
      return 'paid subscription';
    }
    return product.type;
  }

  /**
   * On Google Play, the title is formatted as "product name (app name)"
   * This function removes the app name from the title
   */
  private cleanupTitle(title: string): string {
    if (getPlatform() === IapticPurchasePlatform.GOOGLE_PLAY) {
      return title.replace(/ \(.*\)$/, '');
    }
    return title;
  }

  /**
   * Convert native product fields to iaptic unified product format
   * 
   * @param d - Product definition
   * @returns The iaptic product
   */
  private toIapticProduct(d: IapticProductDefinition): IapticProduct | undefined {
    switch (d.type) {
      case 'paid subscription':
        const sub = this.subscriptions.find(s => s.productId === d.id);
        if (!sub) return;
        return {
          type: d.type,
          id: d.id,
          offers: this.subscriptionOffers(sub),
          title: this.cleanupTitle(sub.title),
          description: sub.description,
          platform: getPlatform(),
          entitlements: d.entitlements,
          tokenType: d.tokenType,
          tokenValue: d.tokenValue,
        }
      default:
        const product = this.products.find(p => p.productId === d.id);
        if (!product) return;
        return {
          type: d.type,
          id: d.id,
          offers: this.productOffers(product),
          title: this.cleanupTitle(product.title),
          description: product.description,
          platform: getPlatform(),
          entitlements: d.entitlements,
          tokenType: d.tokenType,
          tokenValue: d.tokenValue,
        }
    }
  }

  /**
   * Return the list of all products in iaptic unified format
   */
  all(): IapticProduct[] {
    return this.definitions
      .map((d: IapticProductDefinition): IapticProduct | undefined => this.toIapticProduct(d))
      .filter(p => p !== undefined);
  }

  /**
   * Convert native product fields to iaptic offers format
   * 
   * @param product - The native product
   * @returns The iaptic offers
   */
  private productOffers(product: IAP.Product): IapticOffer[] {
    // For non-subscription products, we create a single offer with a single pricing phase
    const pricingPhase: IapticPricingPhase = {
      price: product.localizedPrice ?? `${(parseFloat(product.price ?? '0') / 1000000)} ${product.currency}`,
      priceMicros: parseFloat(product.price ?? '0') * 1000000,
      currency: product.currency,
      recurrenceMode: "NON_RECURRING",
      paymentMode: "UpFront"
    };

    // Create a single offer for the product
    const offer: IapticOffer = {
      id: product.productId,
      platform: getPlatform(),
      productId: product.productId,
      pricingPhases: [pricingPhase],
      offerType: 'Default'
    };

    return [offer];
  }

  /**
   * Convert native subscription fields to iaptic offers format
   * 
   * @param product - The native subscription
   * @returns The iaptic offers
   */
  private subscriptionOffers(product: IAP.Subscription): IapticOffer[] {
    const offers: IapticOffer[] = [];

    if (product.platform === 'android') {
      // Helper function to find base plan
      const findBasePlan = (basePlanId: string | null): IAP.SubscriptionOfferAndroid | undefined => {
        if (!basePlanId) return undefined;
        return product.subscriptionOfferDetails?.find(offer =>
          offer.basePlanId === basePlanId && !offer.offerId
        );
      };

      // Process each subscription offer
      product.subscriptionOfferDetails?.forEach(offerDetails => {
        // Handle finite recurring offers by appending base plan phases
        const lastPhase = offerDetails.pricingPhases.pricingPhaseList.slice(-1)[0];
        if (lastPhase?.recurrenceMode === 2) {
          const basePlan = findBasePlan(offerDetails.basePlanId);
          if (basePlan && basePlan !== offerDetails) {
            offerDetails.pricingPhases.pricingPhaseList.push(
              ...basePlan.pricingPhases.pricingPhaseList
            );
          }
        }

        offers.push({
          id: makeOfferIdAndroid(product.productId, offerDetails),
          platform: IapticPurchasePlatform.GOOGLE_PLAY,
          productId: product.productId,
          pricingPhases: offerDetails.pricingPhases.pricingPhaseList.map(phase =>
            formatPricingPhaseAndroid(phase)
          ),
          offerType: 'Subscription',
          offerToken: offerDetails.offerToken,
        });
      });
    }
    if (product.platform === 'ios') {
      const finalPhase: IapticPricingPhase = {
        price: product.price,
        priceMicros: parseFloat(product.introductoryPriceAsAmountIOS ?? '0') * 1000000,
        currency: product.currency,
        billingPeriod: formatBillingPeriodIOS(parseInt(product.subscriptionPeriodNumberIOS ?? '0'), product.subscriptionPeriodUnitIOS),
        paymentMode: "PayAsYouGo",
        recurrenceMode: "INFINITE_RECURRING",
      }
      if (product.introductoryPrice) {
        const introPhase: IapticPricingPhase = {
          price: product.introductoryPrice,
          priceMicros: parseFloat(product.introductoryPriceAsAmountIOS ?? '0') * 1000000,
          billingPeriod: formatBillingPeriodIOS(parseInt(product.introductoryPriceNumberOfPeriodsIOS ?? '0'), product.introductoryPriceSubscriptionPeriodIOS),
          paymentMode: formatPaymentModeIOS(product.introductoryPricePaymentModeIOS),
          recurrenceMode: "FINITE_RECURRING",
        }
        offers.push({
          id: 'introductory',
          platform: getPlatform(),
          productId: product.productId,
          pricingPhases: [introPhase, finalPhase],
          offerType: 'Introductory',
        });
      }
      // TODO: handle discounts
      product.discounts?.forEach(discount => {
        const discountPhase: IapticPricingPhase = {
          price: discount.localizedPrice,
          priceMicros: parseFloat(discount.price) * 1000000,
          currency: product.currency,
          billingPeriod: formatBillingPeriodIOS(parseInt(discount.numberOfPeriods ?? '0'), discount.subscriptionPeriod as IAP.SubscriptionIosPeriod),
          paymentMode: formatPaymentModeIOS(discount.paymentMode),
          recurrenceMode: "FINITE_RECURRING",
        }
        offers.push({
          id: discount.identifier,
          platform: getPlatform(),
          productId: product.productId,
          pricingPhases: [discountPhase, finalPhase],
          offerType: 'Subscription',
        });
      });
      offers.push({
        id: '$',
        platform: getPlatform(),
        productId: product.productId,
        pricingPhases: [finalPhase],
        offerType: 'Default',
      });
    }
    return offers;
  }
}

/**
 * Return ISO form of an IPeriodUnit + number of periods
 */
function formatBillingPeriodIOS(numPeriods?: number, period?: IAP.SubscriptionIosPeriod): string | undefined {
  if (numPeriods && period)
    return `P${numPeriods}${period[0]}`;
  else
    return undefined;
}

/**
 * Convert native payment mode to iaptic payment mode format
 * 
 * @param mode - The native payment mode
 * @returns The iaptic payment mode
 */
function formatPaymentModeIOS(mode: '' | 'FREETRIAL' | 'PAYASYOUGO' | 'PAYUPFRONT' | undefined): IapticPaymentMode | undefined {
  switch (mode) {
    case 'FREETRIAL': return 'FreeTrial';
    case 'PAYASYOUGO': return 'PayAsYouGo';
    case 'PAYUPFRONT': return 'UpFront';
    default: return undefined;
  }
}

/**
 * Convert native pricing phase to iaptic pricing phase format
 * 
 * @param phase - The native pricing phase
 * @returns The iaptic pricing phase
 */
function formatPricingPhaseAndroid(phase: IAP.PricingPhaseAndroid): IapticPricingPhase {
  return {
    price: phase.formattedPrice,
    priceMicros: parseInt(phase.priceAmountMicros),
    currency: phase.priceCurrencyCode,
    billingPeriod: phase.billingPeriod,
    billingCycles: phase.billingCycleCount,
    recurrenceMode: toRecurrenceModeAndroid(phase.recurrenceMode),
    paymentMode: toPaymentModeAndroid(phase),
  };
}

function toPaymentModeAndroid(phase: IAP.PricingPhaseAndroid): IapticPaymentMode {
  return (!phase.priceAmountMicros || parseInt(phase.priceAmountMicros) === 0)
    ? "FreeTrial"
    : phase.recurrenceMode === 3
      ? "UpFront"
      : "PayAsYouGo";
}

function toRecurrenceModeAndroid(mode: number): IapticRecurrenceMode {
  switch (mode) {
    case 1: return "INFINITE_RECURRING";
    case 2: return "FINITE_RECURRING";
    case 3: return "NON_RECURRING";
    default: return "NON_RECURRING";
  }
}

function makeOfferIdAndroid(productId: string, productOffer: IAP.SubscriptionOfferAndroid): string {
  let id = productId;
  if (productOffer.basePlanId) {
    if (productOffer.offerId) {
      return productId + '@' + productOffer.basePlanId + '@' + productOffer.offerId;
    }
    return productId + '@' + productOffer.basePlanId;
  }
  return productId + '@' + productOffer.offerToken;
}
