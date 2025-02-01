import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, useWindowDimensions } from 'react-native';
import { IapticProduct, IapticOffer, IapticPendingPurchase, IapticProductDefinition } from '../../types';
import { EntitlementGrid } from './EntitlementGrid';
import { IapticRN } from '../../IapticRN';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import { logger } from '../../classes/IapticLogger';
import { SubscriptionViewStyles } from './Styles';
import { ProductPrice } from './ProductPrice';
import { Locales } from '../../classes/Locales';

/**
 * Component props for SubscriptionView
 * @interface SubscriptionViewProps
 * @example
 * // Basic usage example:
 * <SubscriptionView
 *   visible={true}
 *   onClose={() => setIsVisible(false)}
 *   entitlementLabels={{ premium: 'Premium Features' }}
 *   styles={{ productCard: { backgroundColor: '#FFF' }}}
 * />
 */
export interface SubscriptionViewProps {
  /** 
   * Controls visibility of the modal
   * @default false
   * @example <SubscriptionView visible={true} />
   */
  visible?: boolean;

  /** 
   * Callback when modal is closed (either via button or backdrop tap)
   * @example onClose={() => console.log('Modal closed')}
   */
  onClose?: () => void;

  /** 
   * Callback when a purchase is complete (you should show a thank you message)
   * @example onPurchaseComplete={() => console.log('Purchase complete')}
   */
  onPurchaseComplete?: () => void;

  /** 
   * Localized descriptions for each entitlement/feature
   * 
   * @default {}
   * @example { 
   *   premium: { label: 'Premium Features', detail: 'Unlimited Downloads' },
   *   adFree: { label: 'Ad-Free', detail: 'Remove All Ads While Watching Videos' }
   * }
   * @see IapticRN.listEntitlements()
   * @see IapticProductDefinition.entitlements
   */
  entitlementLabels?: Record<string, { label: string, detail?: string }>;

  /** 
   * Custom styles for component elements (merges with defaults)
   * @example styles={{
   *   modalContainer: { backgroundColor: 'rgba(0,0,0,0.8)' },
   *   ctaButton: { backgroundColor: '#FF3B30' }
   * }}
   */
  styles?: Partial<SubscriptionViewStyles>;

  /** 
   * Sort products by number of entitlements (most first)
   * @default true
   * @example sortProducts={false} // Disable automatic sorting
   */
  sortProducts?: boolean;
}

const defaultStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#007AFF',
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 8,
    width: Dimensions.get('window').width * 0.75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  productCardSelected: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  productTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a1a1a',
  },
  productPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 8,
  },
  productPriceSentence: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  billingSelector: {
    marginVertical: 16,
    gap: 8,
  },
  billingOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 4,
  },
  billingOptionSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#e6f3ff',
  },
  billingOptionText: {
    color: '#333',
    fontWeight: '500',
  },
  ctaButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginTop: 24,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginVertical: 16,
  },
  ctaButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.7,
  },
  currentPlanCard: {
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  currentPlanBadge: {
    position: 'absolute',
    top: -3,
    right: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  currentPlanBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  ctaButtonCurrentPlan: {
    backgroundColor: '#4CAF50',
  },
  processingContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  processingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 24,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginVertical: 24,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
    width: '33%', // Will be updated based on status
  },
  statusText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  cancelButton: {
    marginTop: 32,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});


// Add type for component reference
// export interface SubscriptionViewHandle {
//   show: () => void;
//   hide: () => void;
// }

export const SubscriptionView = ({
  onClose,
  onPurchaseComplete,
  entitlementLabels = {},
  styles: customStyles = {},
  sortProducts = true,
}: SubscriptionViewProps) => {
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight;
  const [visible, setVisible] = useState(false);
  const styles = { ...defaultStyles, ...StyleSheet.create(customStyles) };
  const portraitScrollRef = useRef<ScrollView>(null);
  const landscapeScrollRef = useRef<ScrollView>(null);

  // Expose show/hide methods via ref
  // useImperativeHandle(ref, () => ({
  //   show: () => setVisible(true),
  //   hide: () => setVisible(false)
  // }));

  function updateProducts() {
    const subsProducts = IapticRN.getProducts().filter(p =>
      p.type === 'paid subscription' || p.type === 'non renewing subscription'
    );

    if (sortProducts) {
      subsProducts.sort((a, b) => (a.entitlements?.length || 0) - (b.entitlements?.length || 0));
    }

    setProducts(subsProducts);
    if (subsProducts.length > 0) {
      setSelectedProduct(subsProducts[0]);
      setSelectedOffer(subsProducts[0].offers[0]);
    }
  }

  // Keep the existing useEffect for event listeners
  useEffect(() => {
    const showListener = subscriptionViewEvents.addListener('present', () => {
      logger.info('SubscriptionView: present');
      updateProducts();
      setVisible(true);
      subscriptionViewEvents.emit('presented');
    });
    const hideListener = subscriptionViewEvents.addListener('dismiss', () => {
      logger.info('SubscriptionView: dismiss');
      setVisible(false);
      subscriptionViewEvents.emit('dismissed');
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const [products, setProducts] = useState<IapticProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IapticProduct>();
  const [selectedOffer, setSelectedOffer] = useState<IapticOffer>();
  const [pendingPurchase, setPendingPurchase] = useState<IapticPendingPurchase | null>(null);

  // Load subscription products
  useEffect(() => {
    updateProducts();
    setPendingPurchase(IapticRN.getPendingPurchases()[0] ?? null);
  }, [sortProducts]);

  // Listen to purchase updates
  useEffect(() => {
    const listeners = [
      IapticRN.addEventListener('pendingPurchase.updated', purchase => {
        setPendingPurchase(purchase.status === 'completed' ? null : purchase);
        if (purchase.status === 'completed') {
          if (onPurchaseComplete) onPurchaseComplete();
        }
      }),
      IapticRN.addEventListener('products.updated', () => {
        updateProducts();
      })
    ];
    return () => listeners.forEach(listener => listener.remove());
  }, []);

  const handlePurchase = async () => {
    if (!selectedOffer) return;
    try {
      await IapticRN.order(selectedOffer);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  const dismissSubscriptionView = () => {
    setVisible(false);
    subscriptionViewEvents.emit('subscription.dismiss');
  };

  const activeSubscription = IapticRN.getActiveSubscription();

  if (!selectedProduct || !selectedOffer) return null;

  const isCurrentPlan = activeSubscription?.productId === selectedProduct?.id;

  // New helper function to handle product selection
  const handleProductSelect = (product: IapticProduct) => {
    setSelectedProduct(product);
    setSelectedOffer(product.offers[0]);

    const index = products.findIndex(p => p.id === product.id);
    if (index === -1) return;

    // Calculate scroll positions
    if (!isLandscape) {
      // Portrait mode (horizontal scroll)
      const itemWidth = windowWidth * 0.7;
      const scrollViewWidth = windowWidth - 48; // Account for parent padding
      const x = (itemWidth + 16) * index - (scrollViewWidth - itemWidth) / 2;
      portraitScrollRef.current?.scrollTo({ x, animated: true });
    } else {
      // Landscape mode (vertical scroll)
      const itemHeight = 200; // Approximate card height
      const y = itemHeight * index - (windowHeight * 0.4 - itemHeight / 2);
      landscapeScrollRef.current?.scrollTo({ y, animated: true });
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        {!pendingPurchase && (
          <View style={[
            styles.contentContainer,
            isLandscape ? {
              flexDirection: 'row',
              maxHeight: Math.min(windowHeight * 0.8, 600),
              paddingHorizontal: 16,
              minHeight: 400
            } : {
              maxHeight: '90%',
              paddingHorizontal: 24
            }
          ]}>
            {/* Landscape mode columns */}
            {isLandscape && (
              <ScrollView
                ref={landscapeScrollRef}
                style={{ width: '50%', marginRight: 16 }}
                contentContainerStyle={{ paddingVertical: 16 }}
              >
                {products.map(product => {
                  const isCurrentPlan = activeSubscription?.productId === product.id;
                  return (
                    <TouchableOpacity
                      key={product.id}
                      style={[
                        styles.productCard,
                        {
                          width: '100%',
                          minWidth: 0,
                          marginHorizontal: 0,
                          marginBottom: 16,
                          ...(product.id === selectedProduct?.id && styles.productCardSelected),
                          ...(isCurrentPlan && styles.currentPlanCard)
                        }
                      ]}
                      onPress={() => handleProductSelect(product)}
                    >
                      {isCurrentPlan && (
                        <View style={styles.currentPlanBadge}>
                          <Text style={styles.currentPlanBadgeText}>
                            {Locales.get('SubscriptionView_CurrentPlan')}
                          </Text>
                        </View>
                      )}
                      <Text style={styles.productTitle}>{product.title}</Text>
                      {product.offers[0] && (
                        <Text style={styles.productPrice}>
                          <ProductPrice product={product} styles={styles} />
                        </Text>
                      )}
                      <Text style={styles.productDescription}>
                        {product.description}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {/* Main content */}
            <ScrollView
              style={isLandscape ? { width: '50%' } : { width: '100%' }}
              contentContainerStyle={{
                paddingBottom: 24,
                paddingHorizontal: isLandscape ? 8 : 0
              }}
            >
              {/* Header */}
              <View style={styles.header}>
                <Text style={[
                  styles.title,
                  isLandscape ? { maxWidth: '85%' } : { maxWidth: windowWidth * 0.6 }
                ]}>
                  {Locales.get('SubscriptionView_Title')}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={dismissSubscriptionView}>
                  <Text style={styles.closeButtonText}>
                    {Locales.get('SubscriptionView_Close')}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Portrait product carousel */}
              {!isLandscape && (
                <ScrollView
                  ref={portraitScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                >
                  {products.map(product => {
                    const isCurrentPlan = activeSubscription?.productId === product.id;
                    return (
                      <TouchableOpacity
                        key={product.id}
                        style={[
                          styles.productCard,
                          {
                            width: windowWidth * 0.7,
                            minWidth: 280,
                            ...(product.id === selectedProduct?.id && styles.productCardSelected),
                            ...(isCurrentPlan && styles.currentPlanCard)
                          }
                        ]}
                        onPress={() => handleProductSelect(product)}
                      >
                        {isCurrentPlan && (
                          <View style={styles.currentPlanBadge}>
                            <Text style={styles.currentPlanBadgeText}>
                              {Locales.get('SubscriptionView_CurrentPlan')}
                            </Text>
                          </View>
                        )}
                        <Text style={styles.productTitle}>{product.title}</Text>
                        {product.offers[0] && (
                          <Text style={styles.productPrice}>
                            <ProductPrice product={product} styles={styles} />
                          </Text>
                        )}
                        <Text style={styles.productDescription}>
                          {product.description}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}

              {/* Billing Options */}
              <ScrollView
                horizontal={!isLandscape}
                showsHorizontalScrollIndicator={false}
                style={styles.billingSelector}
                contentContainerStyle={{
                  paddingHorizontal: isLandscape ? 0 : 16,
                  flexDirection: isLandscape ? 'column' : 'row',
                  gap: 8
                }}
              >
                {selectedProduct.offers.map(offer => (
                  <TouchableOpacity
                    key={offer.id}
                    style={[
                      styles.billingOption,
                      {
                        minWidth: isLandscape ? '50%' : 120,
                        paddingVertical: isLandscape ? 12 : 8
                      },
                      offer.id === selectedOffer?.id && styles.billingOptionSelected
                    ]}
                    onPress={() => setSelectedOffer(offer)}
                  >
                    <Text style={styles.billingOptionText}>
                      {offer.pricingPhases[0].price} {IapticRN.utils.formatBillingCycle(offer.pricingPhases[0])}
                      {offer.pricingPhases.length > 1 && (
                        <>
                          {'\n'}
                          <Text style={{ fontSize: 12 }}>
                            {offer.pricingPhases
                              .slice(1)
                              .map(p => `then ${p.price} ${IapticRN.utils.formatBillingCycle(p)}`)
                              .join('\n')}
                          </Text>
                        </>
                      )}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Features and CTA */}
              <Text style={styles.featuresTitle}>
                {Locales.get('SubscriptionView_Includes')}
              </Text>
              <EntitlementGrid
                entitlements={selectedProduct.entitlements || []}
                labels={entitlementLabels ?? {}}
              />


              <TouchableOpacity
                style={[
                  styles.ctaButton,
                  pendingPurchase && styles.ctaButtonDisabled,
                  isCurrentPlan && styles.ctaButtonCurrentPlan,
                  isLandscape && { marginTop: 16 }
                ]}
                onPress={handlePurchase}
                disabled={!!pendingPurchase || (isCurrentPlan && selectedProduct.offers.length === 1)}
              >
                <Text style={styles.ctaButtonText}>
                  {isCurrentPlan ?
                    (selectedProduct.offers.length > 1
                      ? Locales.get('SubscriptionView_UpdatePlan')
                      : Locales.get('SubscriptionView_CurrentPlan')) :
                    (pendingPurchase ? Locales.get('SubscriptionView_Processing') : Locales.get('SubscriptionView_Continue'))
                  }
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
        {pendingPurchase && (
          <View style={[styles.contentContainer, styles.processingContainer]}>
            <Text style={styles.processingTitle}>
              {Locales.get('SubscriptionView_ProcessingTitle')}
            </Text>

            {/* Product Details */}
            {products.find(p => p.id === pendingPurchase.productId) && (
              <>
                <Text style={styles.statusText}>
                  {products.find(p => p.id === pendingPurchase.productId)!.title}
                </Text>
              </>
            )}

            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                {
                  width: pendingPurchase.status === 'processing' ? '25%' :
                    pendingPurchase.status === 'validating' ? '50%' :
                      pendingPurchase.status === 'finishing' ? '75%' : '100%'
                }
              ]} />
            </View>

            {/* Status Text */}
            <Text style={styles.statusText}>
              {Locales.get(`SubscriptionView_ProcessingStatus_${pendingPurchase.status}`)}
            </Text>

            {/* <Text style={styles.statusText}>
              {Locales.get('SubscriptionView_PleaseWait')}
            </Text> */}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                dismissSubscriptionView();
                setPendingPurchase(null);
              }}
            >
              <Text style={styles.cancelButtonText}>
                {Locales.get('SubscriptionView_Cancel')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

/**
 * Event emitter to communicate with the SubscriptionView component
 * 
 * Supported events:
 * - 'present' - Present the subscription view
 * - 'dismiss' - Dismiss the subscription view
 * - 'presented' - the subscription view has been presented
 * - 'dismissed' - the subscription view has been dismissed
 * 
 * @example
 * subscriptionViewEvents.emit('dismiss');
 * subscriptionViewEvents.emit('present');
 */
export const subscriptionViewEvents = new EventEmitter();