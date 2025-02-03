import React, { useState, useEffect, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, useWindowDimensions, Linking, ActivityIndicator, GestureResponderEvent, findNodeHandle, UIManager, Alert } from 'react-native';
import { IapticProduct, IapticOffer, IapticPendingPurchase, IapticProductDefinition, IapticPurchasePlatform } from '../../types';
import { EntitlementGrid } from './EntitlementGrid';
import { IapticRN } from '../../IapticRN';
import EventEmitter from 'react-native/Libraries/vendor/emitter/EventEmitter';
import { logger } from '../../classes/IapticLogger';
import { IapticSubscriptionViewStyles } from './Styles';
import { ProductPrice } from './ProductPrice';
import { Locales } from '../../classes/Locales';
import { IapticError, IapticSeverity } from '../../classes/IapticError';
import { IapticActiveSubscription } from '../ActiveSubscription';
import { IapticTheme, defaultTheme } from '../../IapticTheme';

/**
 * Props for IapticSubscriptionView Component
 * 
 * @example
 * // Basic usage example:
 * <IapticSubscriptionView
 *   entitlementLabels={{ premium: 'Premium Features' }}
 *   styles={{ productCard: { backgroundColor: '#FFF' }}}
 * />
 */
export interface IapticSubscriptionViewProps {

  /** 
   * Controls visibility of the modal
   * @default false
   */
  visible?: boolean;

  /** 
   * Callback when a purchase is complete (show a thank you message or whatever)
   * 
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
   * @see IapticRN.listEntitlements
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
  styles?: Partial<IapticSubscriptionViewStyles>;

  /** 
   * Sort products by number of entitlements (most first)
   * @default true
   * @example sortProducts={false} // Disable automatic sorting
   */
  sortProducts?: boolean;

  /** 
   * URL to Terms & Conditions (optional)
   * @example termsUrl="https://example.com/terms"
   */
  termsUrl?: string;

  /** 
   * Show restore purchases button when there's no active subscription
   * @default true
   */
  showRestorePurchase?: boolean;

  /** 
   * Theme configuration for colors
   * @example theme={{ primaryColor: '#FF3B30', backgroundColor: '#F5F5F5' }}
   */
  theme?: Partial<IapticTheme>;
}

// Convert defaultStyles to a function that accepts theme
const defaultStyles = (theme: IapticTheme) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  contentContainer: {
    backgroundColor: theme.backgroundColor,
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
    color: theme.textColor,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 18,
    color: theme.primaryColor,
  },
  productCard: {
    backgroundColor: theme.backgroundColor,
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
    borderColor: theme.primaryColor,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: theme.textColor,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.primaryColor,
    marginBottom: 8,
  },
  productPriceSentence: {
    fontSize: 16,
    color: theme.secondaryTextColor,
    marginBottom: 8,
  },
  productDescription: {
    fontSize: 14,
    color: theme.secondaryTextColor,
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
    borderColor: theme.borderColor,
    marginHorizontal: 4,
  },
  billingOptionSelected: {
    borderColor: theme.primaryColor,
    backgroundColor: `${theme.primaryColor}10`,
  },
  billingOptionText: {
    color: theme.textColor,
    fontWeight: '500',
  },
  ctaButton: {
    backgroundColor: theme.primaryColor,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  changePlanButton: {
    backgroundColor: theme.primaryColor,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  offersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textColor,
    marginTop: 16,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.textColor,
    marginVertical: 16,
  },
  ctaButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.7,
  },
  currentPlanCard: {
    borderColor: theme.secondaryColor,
    borderWidth: 2,
  },
  currentPlanBadge: {
    position: 'absolute',
    top: -3,
    right: 8,
    backgroundColor: theme.secondaryColor,
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
    backgroundColor: theme.secondaryColor,
  },
  processingContainer: {
    // flex: 1,
    padding: 24,
    justifyContent: 'center',
    minHeight: '40%',
  },
  processingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.textColor,
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
    backgroundColor: theme.primaryColor,
    borderRadius: 4,
    width: '33%', // Will be updated based on status
  },
  statusText: {
    fontSize: 16,
    color: theme.secondaryTextColor,
    textAlign: 'center',
    marginBottom: 16,
  },
  cancelButton: {
    marginTop: 32,
    padding: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: theme.primaryColor,
    fontSize: 16,
    fontWeight: '600',
  },
  termsContainer: {
    marginTop: 0,
    marginBottom: 0,
  },
  termsText: {
    fontSize: 12,
    color: theme.secondaryTextColor,
    textAlign: 'center',
  },
  termsLink: {
    textDecorationLine: 'underline',
    color: theme.primaryColor,
  },
  fixedFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.borderColor,
  },
  restoreButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: theme.primaryColor,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  restoringContainer: {
    backgroundColor: '#FFFFFF',
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: 200,
  },
  restoringTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: theme.textColor,
  },
  restoringProgress: {
    fontSize: 14,
    color: theme.secondaryTextColor,
    marginTop: 8,
  },
});

/**
 * Subscription modal UI component
 * 
 * @remarks React Component
 * 
 * @param props Propertis
 * 
 * @example
 * ```tsx
 * <IapticSubscriptionView
 *   entitlementLabels={{
 *     premium: { label: 'Premium Features', detail: 'Unlimited Downloads' },
 *     adFree: { label: 'Ad-Free', detail: 'Remove All Ads While Watching Videos' }
 *   }},
 *   termsUrl="https://example.com/terms"
 * />
 * ```
 */
export const IapticSubscriptionView = (props: IapticSubscriptionViewProps) => {
  const {
    onPurchaseComplete,
    entitlementLabels = {},
    styles: customStyles = {},
    sortProducts = true,
    termsUrl,
    showRestorePurchase = true,
    theme: customTheme = {},
  } = props;

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isLandscape = windowWidth > windowHeight;
  const [visible, setVisible] = useState(false);
  const theme = { ...defaultTheme, ...customTheme };
  const styles = { 
    ...defaultStyles(theme), 
    ...StyleSheet.create(customStyles) 
  };
  const portraitScrollRef = useRef<ScrollView>(null);
  const landscapeScrollRef = useRef<ScrollView>(null);
  const productRefs = useRef<Array<React.RefObject<TouchableOpacity>>>([]);

  const [products, setProducts] = useState<IapticProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IapticProduct>();
  const [selectedOffer, setSelectedOffer] = useState<IapticOffer>();
  const [pendingPurchase, setPendingPurchase] = useState<IapticPendingPurchase | null>(null);
  const [restoreProgress, setRestoreProgress] = useState<{ processed: number; total: number } | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [viewMode, setViewMode] = useState<'view-active' | 'select-plan'>('select-plan');
  const activeSubscription = IapticRN.getActiveSubscription();

  function updateProducts() {
    const subsProducts = IapticRN.getProducts().filter(p =>
      p.type === 'paid subscription' || p.type === 'non renewing subscription'
    );
    if (sortProducts) {
      subsProducts.sort((a, b) => (a.entitlements?.length || 0) - (b.entitlements?.length || 0));
    }
    if (subsProducts.length > 0) {
      setProducts(subsProducts);
      setSelectedProduct(subsProducts[0]);
      setSelectedOffer(subsProducts[0].offers[0]);
    }
  }

  //
  // Effects
  //

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

  // Load subscription products
  useEffect(() => {
    updateProducts();
    setPendingPurchase(IapticRN.getPendingPurchases()[0] ?? null);
  }, [sortProducts]);

  // Listen to purchase updates
  useEffect(() => {
    const listeners = [
      IapticRN.addEventListener('pendingPurchase.updated', purchase => {
        setPendingPurchase((purchase.status === 'completed' || purchase.status === 'cancelled') ? null : purchase);
        if (purchase.status === 'completed') {
          if (onPurchaseComplete) onPurchaseComplete();
          dismissSubscriptionView();
        }
      }),
      IapticRN.addEventListener('products.updated', () => {
        updateProducts();
      })
    ];
    return () => listeners.forEach(listener => listener.remove());
  }, []);

  // Update when products change
  useEffect(() => {
    productRefs.current = products.map((_, i) => productRefs.current[i] ?? React.createRef());
  }, [products]);

  // Update view mode when products load
  useEffect(() => {
    setViewMode(activeSubscription ? 'view-active' : 'select-plan');
  }, [activeSubscription]);

  //
  // Button handlers
  //

  const handlePurchase = async () => {
    if (!selectedOffer) return;
    try {
      await IapticRN.order(selectedOffer);
    } catch (error) {
      if (error instanceof IapticError) {
        if (error.severity === IapticSeverity.INFO) return;
        Alert.alert(error.localizedTitle, error.localizedMessage);
        console.error('Purchase failed:', error);
      }
      else {
        Alert.alert('ERROR', (error as any).message ?? 'Unknown error');
      }
    }
  };

  const dismissSubscriptionView = () => {
    setVisible(false);
    if (activeSubscription) {
      setViewMode('view-active');
    }
    subscriptionViewEvents.emit('subscription.dismiss');
  };

  // New helper function to handle product selection
  const handleProductSelect = (product: IapticProduct) => {
    setSelectedProduct(product);
    setSelectedOffer(product.offers[0]);

    const index = products.findIndex(p => p.id === product.id);
    if (index === -1) return;

    // Calculate scroll positions
    setTimeout(() => {
      const productRef = productRefs.current[index];
      productRef?.current?.measure((x, y, width, height, pageX, pageY) => {
        if (isLandscape) {
          landscapeScrollRef.current?.scrollTo({
            y: Math.max(0, y - 20),
            animated: true
          });
        }
        else {
          portraitScrollRef.current?.scrollTo({
            x: Math.max(0, x - 20),
            animated: true
          });
        }
      });
    }, 100);
  };

  const handleRestorePurchases = async () => {
    try {
      setIsRestoring(true);
      setRestoreProgress(null);
      
      const result = await IapticRN.restorePurchases((processed, total) => {
        setRestoreProgress({ processed, total });
      });

      if (result > 0) {
        // Refresh products after restore
        updateProducts();
      }
    } finally {
      setTimeout(() => {
        setIsRestoring(false);
        setRestoreProgress(null);
      }, 1000); // Give some time to the user to see the restoring progress
    }
  };

  //
  // Render
  //

  if (!selectedProduct || !selectedOffer) return null;
  const isCurrentPlan = activeSubscription?.productId === selectedProduct?.id;

  const state: 'pending-purchase' | 'restoring' | 'view-active' | 'select-plan' =
    pendingPurchase ? 'pending-purchase'
      : isRestoring ? 'restoring'
        : activeSubscription && viewMode === 'view-active' ? 'view-active'
          : 'select-plan';

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalContainer}>

        {state === 'view-active' && (
          <View style={[styles.contentContainer, { padding: 24 }]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>
                {Locales.get('SubscriptionView_CurrentSubscription')}
              </Text>
              <TouchableOpacity style={styles.closeButton} onPress={dismissSubscriptionView}>
                <Text style={styles.closeButtonText}>
                  {Locales.get('SubscriptionView_Close')}
                </Text>
              </TouchableOpacity>
            </View>

            <IapticActiveSubscription styles={customStyles} entitlementLabels={entitlementLabels} theme={theme} />

            <TouchableOpacity
              style={[styles.changePlanButton, { marginTop: 8 }]}
              onPress={() => setViewMode('select-plan')}>
              <Text style={styles.ctaButtonText}>
                {Locales.get('SubscriptionView_ChangePlan')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {state === 'select-plan' && (
          <View style={styles.contentContainer}>
            {/* Header */}
            {!isLandscape &&
              <View style={styles.header}>
                <Text style={styles.title}>
                  {Locales.get('SubscriptionView_Title')}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={activeSubscription ? () => setViewMode('view-active') : dismissSubscriptionView}>
                  <Text style={styles.closeButtonText}>
                    {activeSubscription
                      ? Locales.get('SubscriptionView_Back')
                      : Locales.get('SubscriptionView_Close')}
                  </Text>
                </TouchableOpacity>
              </View>}

            <View style={[
              isLandscape ? {
                flexDirection: 'row',
                maxHeight: '100%',
                paddingHorizontal: 16,
                minHeight: 400
              } : {
                maxHeight: '90%',
                paddingHorizontal: 0
              }
            ]}>
              {/* Landscape mode columns */}
              {isLandscape && (
                <ScrollView
                  ref={landscapeScrollRef}
                  style={{ width: '50%', marginRight: 16 }}
                  contentContainerStyle={{ paddingVertical: 16 }}
                >
                  {products.map((product, index) => {
                    const isCurrentPlan = activeSubscription?.productId === product.id;
                    return (
                      <TouchableOpacity
                        key={product.id}
                        ref={productRefs.current[index]}
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
                {/* Portrait product carousel */}
                {!isLandscape && (
                  <ScrollView
                    ref={portraitScrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingLeft: 16, paddingRight: 32 }}
                  >
                    {products.map((product, index) => {
                      const isCurrentPlan = activeSubscription?.productId === product.id;
                      return (
                        <TouchableOpacity
                          key={product.id}
                          ref={productRefs.current[index]}
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

                {/* Features and CTA */}
                <Text style={styles.featuresTitle}>
                  {Locales.get('SubscriptionView_Includes')}
                </Text>
                <EntitlementGrid
                  entitlements={selectedProduct.entitlements || []}
                  labels={entitlementLabels ?? {}}
                  theme={theme}
                />

                {/* Billing Options */
                  selectedProduct.offers.length > 1 && (
                    <Text style={styles.offersTitle}>
                      {Locales.get('SubscriptionView_BillingOptions')}
                    </Text>
                  )
                }
                <ScrollView
                  horizontal={!isLandscape}
                  showsHorizontalScrollIndicator={false}
                  style={styles.billingSelector}
                  contentContainerStyle={{
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
              </ScrollView>

              {/* Fixed footer outside scroll */}
              <View style={isLandscape ? {} : styles.fixedFooter}>
                {isLandscape && (
                  <TouchableOpacity style={styles.closeButton} onPress={activeSubscription ? () => setViewMode('view-active') : dismissSubscriptionView}>
                    <Text style={[
                      styles.closeButtonText,
                      {
                        marginBottom: 16,
                        alignSelf: 'flex-end'
                      }
                    ]}>
                      {activeSubscription
                        ? Locales.get('SubscriptionView_Back')
                        : Locales.get('SubscriptionView_Close')}
                    </Text>
                  </TouchableOpacity>
                )}

                {termsUrl && isLandscape && (
                  <View style={styles.termsContainer}>
                    <Text style={styles.termsText}>
                      {Locales.get('SubscriptionView_TermsPrefix') + ' '}
                    </Text>
                    <Text
                      style={styles.termsLink}
                      onPress={() => Linking.openURL(termsUrl)}
                    >
                      {Locales.get('SubscriptionView_TermsLink')}
                    </Text>
                  </View>
                )}
                {termsUrl && !isLandscape && (
                  <View style={styles.termsContainer}>
                    <Text style={styles.termsText}>
                      {Locales.get('SubscriptionView_TermsPrefix') + ' '}
                      <Text
                        style={styles.termsLink}
                        onPress={() => Linking.openURL(termsUrl)}
                      >
                        {Locales.get('SubscriptionView_TermsLink')}
                      </Text>
                    </Text>
                  </View>
                )}
                <TouchableOpacity
                  style={[
                    styles.ctaButton,
                    pendingPurchase && styles.ctaButtonDisabled,
                    isCurrentPlan && styles.ctaButtonCurrentPlan,
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

                {showRestorePurchase && !activeSubscription && (
                  <TouchableOpacity
                    style={styles.restoreButton}
                    onPress={handleRestorePurchases}
                    disabled={isRestoring}
                  >
                    <Text style={styles.restoreButtonText}>
                      {isRestoring ?
                        Locales.get('SubscriptionView_Processing') :
                        Locales.get('SubscriptionView_RestorePurchase')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        )}

        {state === 'pending-purchase' && pendingPurchase && (
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
                  width:
                    pendingPurchase.status === 'purchasing' ? '10%' :
                      pendingPurchase.status === 'processing' ? '30%' :
                        pendingPurchase.status === 'validating' ? '60%' :
                          pendingPurchase.status === 'finishing' ? '85%' : '100%'
                }
              ]} />
            </View>

            {/* Status Text */}
            <Text style={styles.statusText}>
              {Locales.get(`SubscriptionView_ProcessingStatus_${pendingPurchase.status}`)}
            </Text>

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

        {state === 'restoring' && (
          <View style={[styles.contentContainer, styles.restoringContainer]}>
            <Text style={styles.restoringTitle}>
              {Locales.get('SubscriptionView_RestoringTitle')}
              </Text>
              
              <ActivityIndicator size="large" color={theme.primaryColor} />
              
              {restoreProgress && restoreProgress.processed >= 0 && restoreProgress.total > 0 && (
                <Text style={styles.restoringProgress}>
                  {Locales.get('SubscriptionView_RestoreProgress')
                    .replace('{0}', restoreProgress.processed.toString())
                    .replace('{1}', restoreProgress.total.toString())}
                </Text>
              )}
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
 * 
 * @internal
 */
export const subscriptionViewEvents = new EventEmitter();