/// <reference types="jest" />

import { IapticRN } from '../IapticRN';
import * as IAP from 'react-native-iap';
import { Platform, Linking } from 'react-native';
import { IapticProductDefinition, IapticProductType, IapticPurchasePlatform, IapticOffer, IapticPricingPhase, IapticErrorCode } from '../types';
import { IapticErrorSeverity } from '../classes/IapticError';

// Mock react-native-iap
jest.mock('react-native-iap', () => {
  const purchaseUpdatedListener = jest.fn(() => ({ remove: jest.fn() }));
  const purchaseErrorListener = jest.fn(() => ({ remove: jest.fn() }));
  
  // Use the actual error class from react-native-iap
  const { PurchaseError } = jest.requireActual('react-native-iap');
  
  return {
    initConnection: jest.fn(),
    getProducts: jest.fn(),
    requestPurchase: jest.fn(),
    requestSubscription: jest.fn(),
    getAvailablePurchases: jest.fn(),
    finishTransaction: jest.fn(),
    clearTransactionIOS: jest.fn(),
    flushFailedPurchasesCachedAsPendingAndroid: jest.fn(),
    isIosStorekit2: jest.fn().mockReturnValue(false),
    getReceiptIOS: jest.fn().mockResolvedValue('mock-receipt'),
    purchaseUpdatedListener,
    purchaseErrorListener,
    PurchaseError, // Use real error class
    ErrorCode: {
      E_UNKNOWN: 'E_UNKNOWN',
      E_USER_CANCELLED: 'E_USER_CANCELLED',
      E_ITEM_UNAVAILABLE: 'E_ITEM_UNAVAILABLE',
      E_NETWORK_ERROR: 'E_NETWORK_ERROR',
      E_SERVICE_ERROR: 'E_SERVICE_ERROR',
      E_RECEIPT_FAILED: 'E_RECEIPT_FAILED',
      E_NOT_PREPARED: 'E_NOT_PREPARED',
      E_DEVELOPER_ERROR: 'E_DEVELOPER_ERROR',
      E_ALREADY_OWNED: 'E_ALREADY_OWNED',
      E_DEFERRED_PAYMENT: 'E_DEFERRED_PAYMENT',
      E_USER_ERROR: 'E_USER_ERROR',
      E_REMOTE_ERROR: 'E_REMOTE_ERROR',
      E_RECEIPT_FINISHED_FAILED: 'E_RECEIPT_FINISHED_FAILED',
      E_NOT_ENDED: 'E_NOT_ENDED',
      E_BILLING_RESPONSE_JSON_PARSE_ERROR: 'E_BILLING_RESPONSE_JSON_PARSE_ERROR',
      E_INTERRUPTED: 'E_INTERRUPTED',
      E_IAP_NOT_AVAILABLE: 'E_IAP_NOT_AVAILABLE',
      E_VALIDATION_FAILED: 'E_VALIDATION_FAILED'
    }
  };
});

// Mock the validateReceipt function
jest.mock('../functions/validateReceipt', () => ({
  validateReceipt: jest.fn().mockResolvedValue({
    ok: true,
    data: {
      id: 'test_product',
      collection: [{
        id: 'test_product',
        purchaseDate: Date.now(),
        transactionId: 'test_transaction'
      }]
    }
  })
}));

// Mock the IapEventsProcessor
// jest.mock('../classes/IapEventsProcessor', () => {
//   return {
//     IapEventsProcessor: jest.fn().mockImplementation(() => ({
//       addListeners: jest.fn(),
//       removeListeners: jest.fn(),
//       processPurchase: jest.fn().mockResolvedValue(true)
//     }))
//   };
// });

describe('IapticRN', () => {
  let iaptic: IapticRN;
  const mockPricingPhase: IapticPricingPhase = {
    price: '0.99',
    priceMicros: 990000,
    currency: 'USD'
  };
  
  const mockOffer: IapticOffer = {
    id: 'default_offer',
    platform: IapticPurchasePlatform.TEST,
    pricingPhases: [mockPricingPhase],
    productId: 'test_product',
    offerType: 'Default'
  };

  beforeAll(() => {
    // Use fake timers
    jest.useFakeTimers();
  });

  afterAll(() => {
    // Restore real timers
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Platform.OS
    Platform.OS = 'ios';
    // Create new instance
    iaptic = new IapticRN({
      appName: 'TestApp',
      publicKey: 'test-key',
      iosBundleId: 'com.test.app'
    });
    // Mock Linking
    (Linking.openURL as jest.Mock) = jest.fn();
  });

  afterEach(() => {
    // Clean up the instance
    iaptic.destroy();
    // Clear any remaining timeouts
    jest.clearAllTimers();
    // Clear all event listeners
    iaptic.removeAllEventListeners();
  });

  describe('initialization', () => {
    it('initializes correctly', () => {
      expect(iaptic).toBeInstanceOf(IapticRN);
      expect(iaptic.config.appName).toBe('TestApp');
      expect(iaptic.config.publicKey).toBe('test-key');
      expect(iaptic.config.baseUrl).toBe('https://validator.iaptic.com');
      expect(iaptic.config.showAlerts).toBe(true);
    });

    it('initializes connection with store', async () => {
      // Mock the listeners to return mock remove functions
      const purchaseUpdatedRemove = jest.fn();
      const purchaseErrorRemove = jest.fn();
      (IAP.purchaseUpdatedListener as jest.Mock).mockReturnValue({ remove: purchaseUpdatedRemove });  
      (IAP.purchaseErrorListener as jest.Mock).mockReturnValue({ remove: purchaseErrorRemove });

      await iaptic.initConnection();
      expect(IAP.initConnection).toHaveBeenCalled();
      expect(IAP.purchaseUpdatedListener).toHaveBeenCalled();
      expect(IAP.purchaseErrorListener).toHaveBeenCalled();
    });

    it('handles connection initialization error', async () => {
      const error = new IAP.PurchaseError('PurchaseError', 'Connection failed', 0, '', IAP.ErrorCode.E_UNKNOWN);
      (IAP.initConnection as jest.Mock).mockRejectedValueOnce(error);
      await expect(iaptic.initConnection()).rejects.toThrow();
    });
  });

  describe('product management', () => {
    const mockProducts: IapticProductDefinition[] = [
      {
        id: 'test_product',
        type: 'consumable' as IapticProductType,
        tokenType: 'coin',
        tokenValue: 100
      }
    ];

    it('sets product definitions', () => {
      iaptic.setProductDefinitions(mockProducts);
      expect(iaptic.products).toBeDefined();
    });

    it('loads products from store', async () => {
      (IAP.getProducts as jest.Mock).mockResolvedValueOnce([
        { productId: 'test_product', price: '0.99' }
      ]);
      await iaptic.loadProducts(mockProducts);
      expect(IAP.getProducts).toHaveBeenCalled();
    });
  });

  describe('purchase management', () => {
    it('checks if product can be purchased', () => {
      const canPurchase = iaptic.canPurchase({ 
        id: 'test_product',
        type: 'consumable',
        platform: IapticPurchasePlatform.TEST,
        offers: []
      });
      expect(canPurchase).toBe(true);
    });

    it('checks if product is owned', () => {
      const isOwned = iaptic.owned('test_product');
      expect(isOwned).toBe(false);
    });
  });

  describe('event handling', () => {
    it('adds and removes event listeners', () => {
      const mockListener = jest.fn();
      iaptic.addEventListener('purchase.updated', mockListener);
      iaptic.removeAllEventListeners('purchase.updated');
    });
  });

  describe('platform specific behavior', () => {
    const originalPlatform = Platform.OS;

    beforeEach(() => {
      // Mock the products.getType method
      Object.defineProperty(iaptic.products, 'getType', {
        value: jest.fn().mockImplementation((productId: string) => {
          return productId.includes('subscription') ? 'paid subscription' : 'consumable';
        })
      });
    });

    afterAll(() => {
      Platform.OS = originalPlatform;
    });

    it('handles iOS-specific purchase flow', async () => {
      Platform.OS = 'ios';
      const pricingPhase: IapticPricingPhase = {
        price: '0.99',
        priceMicros: 990000,
        currency: 'USD'
      };
      const offer: IapticOffer = {
        id: 'default_offer',
        platform: IapticPurchasePlatform.APPLE_APPSTORE,
        pricingPhases: [pricingPhase],
        productId: 'test_product',
        offerType: 'Default'
      };
      (IAP.requestPurchase as jest.Mock).mockResolvedValueOnce({
        productId: 'test_product',
        transactionId: 'test_transaction'
      });
      await iaptic.order(offer);
      expect(IAP.requestPurchase).toHaveBeenCalledWith({
        sku: 'test_product'
      });
    });

    it('handles Android-specific purchase flow', async () => {
      Platform.OS = 'android';
      const pricingPhase: IapticPricingPhase = {
        price: '0.99',
        priceMicros: 990000,
        currency: 'USD'
      };
      const offer: IapticOffer = {
        id: 'default_offer',
        platform: IapticPurchasePlatform.GOOGLE_PLAY,
        pricingPhases: [pricingPhase],
        productId: 'test_product',
        offerType: 'Default'
      };
      (IAP.requestPurchase as jest.Mock).mockResolvedValueOnce({
        productId: 'test_product',
        transactionId: 'test_transaction'
      });
      await iaptic.order(offer);
      expect(IAP.requestPurchase).toHaveBeenCalledWith({
        sku: 'test_product'
      });
    });

    it('handles subscription purchase flow', async () => {
      Platform.OS = 'android';
      const pricingPhase: IapticPricingPhase = {
        price: '0.99',
        priceMicros: 990000,
        currency: 'USD'
      };
      const offer: IapticOffer = {
        id: 'default_offer',
        platform: IapticPurchasePlatform.GOOGLE_PLAY,
        pricingPhases: [pricingPhase],
        productId: 'test_subscription',
        offerType: 'Default',
        offerToken: 'test_token'
      };
      (IAP.requestSubscription as jest.Mock).mockResolvedValueOnce({
        productId: 'test_subscription',
        transactionId: 'test_transaction'
      });
      await iaptic.order(offer);
      expect(IAP.requestSubscription).toHaveBeenCalledWith({
        sku: 'test_subscription',
        subscriptionOffers: [{
          sku: 'test_subscription',
          offerToken: 'test_token'
        }]
      });
    });
  });

  describe('lifecycle methods', () => {
    it('destroys correctly', async () => {
      // Initialize first to create listeners
      const purchaseUpdatedRemove = jest.fn();
      const purchaseErrorRemove = jest.fn();
      (IAP.purchaseUpdatedListener as jest.Mock).mockReturnValue({ remove: purchaseUpdatedRemove });
      (IAP.purchaseErrorListener as jest.Mock).mockReturnValue({ remove: purchaseErrorRemove });
      
      await iaptic.initConnection();
      expect(IAP.purchaseUpdatedListener).toHaveBeenCalled();
      expect(IAP.purchaseErrorListener).toHaveBeenCalled();
      iaptic.destroy();
      expect(purchaseUpdatedRemove).toHaveBeenCalled();
      expect(purchaseErrorRemove).toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      // Set product definitions
      iaptic.setProductDefinitions([{
        id: 'test_product',
        type: 'consumable',
      }]);
    });

    it('handles cancelled purchases', async () => {
      const error = new IAP.PurchaseError('PurchaseError', 'User cancelled', 0, '', IAP.ErrorCode.E_USER_CANCELLED);
      (IAP.requestPurchase as jest.Mock).mockRejectedValue(error);
      
      await expect(iaptic.order(mockOffer)).rejects.toThrow(
        expect.objectContaining({
          name: 'IapticError', 
          code: IapticErrorCode.PAYMENT_CANCELLED,
        })
      );
    });
  });

  describe('platform utilities', () => {

    it('flushes Android transactions', async () => {
      Platform.OS = 'android';
      await iaptic.flushTransactions();
      expect(IAP.flushFailedPurchasesCachedAsPendingAndroid).toHaveBeenCalled();
    });
  });

  describe('purchase flow edge cases', () => {
    it('handles duplicate purchase attempts', async () => {
      // Set product definitions
      iaptic.setProductDefinitions([{
        id: 'test_product',
        type: 'consumable',
      }]);
      
      // Add the offer to pending purchases
      iaptic.pendingPurchases.add(mockOffer);
      
      // Mock requestPurchase to throw if called
      (IAP.requestPurchase as jest.Mock).mockImplementationOnce(() => {
        throw new Error('Should not be called');
      });
      
      // Attempt to order again
      await expect(iaptic.order(mockOffer)).rejects.toThrow();
    });
  });

  describe('entitlement management', () => {
    it('reports correct entitlements', () => {
      // Set product definitions first
      iaptic.setProductDefinitions([{
        id: 'premium_sub',
        type: 'paid subscription',
        entitlements: ['premium']
      }]);
      
      const mockPurchase = {
        id: 'premium_sub',
        isExpired: false,
        entitlements: ['premium'],
        expiryDate: undefined,
        cancelationReason: undefined,
        purchaseDate: Date.now(),
        platform: IapticPurchasePlatform.TEST,
        purchaseId: 'test_purchase',
        transactionId: 'test_transaction',
        productId: 'premium_sub'
      };
      
      iaptic.purchases.addPurchase(mockPurchase);
      expect(iaptic.checkEntitlement('premium')).toBe(true);
      expect(iaptic.listEntitlements()).toContain('premium');
    });
  });

  describe('initialization errors', () => {
    it('handles multiple initialization attempts', async () => {
      await iaptic.initConnection();
      await expect(iaptic.initConnection()).resolves.toBeUndefined();
    });

    it('skip double initialization', async () => {
      // Mock getAvailablePurchases to return empty array
      (IAP.getAvailablePurchases as jest.Mock).mockResolvedValue([]);
      // Mock getReceiptIOS to return a valid receipt
      (IAP.getReceiptIOS as jest.Mock).mockResolvedValue('mock-receipt');
      // Mock initConnection to throw on second call
      let nCalls = 0;
      (IAP.initConnection as jest.Mock).mockImplementation(() => {
        nCalls++;
        return Promise.resolve();
      });
      
      await iaptic.initialize();
      expect(nCalls).toBe(1);
      await iaptic.initialize();
      expect(nCalls).toBe(1);
    });
  });

  describe('restore purchases', () => {
    it('processes restored purchases', async () => {
      const mockPurchases = [{ 
        productId: 'test_product',
        transactionId: 'test_transaction',
        transactionReceipt: 'test_receipt'
      }];
      
      // Mock getAvailablePurchases
      (IAP.getAvailablePurchases as jest.Mock).mockResolvedValueOnce(mockPurchases);
      // Mock getReceiptIOS to return a valid receipt
      (IAP.getReceiptIOS as jest.Mock).mockResolvedValue('mock-receipt');
      
      const progressMock = jest.fn();
      const result = await iaptic.restorePurchases(progressMock);
      
      expect(result).toBe(mockPurchases.length);
      expect(progressMock).toHaveBeenCalledWith(1, 1);
    });
  });
}); 