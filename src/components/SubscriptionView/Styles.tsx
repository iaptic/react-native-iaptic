import { TextStyle, ViewStyle } from "react-native";

/**
 * Style definitions for the SubscriptionView component
 * @interface SubscriptionViewStyles
 * @example
 * // Basic style override example:
 * {
 *   modalContainer: { backgroundColor: 'rgba(0,0,0,0.8)' },
 *   productTitle: { fontSize: 22, color: '#2C3E50' },
 *   ctaButton: { backgroundColor: '#4CD964', borderRadius: 14 }
 * }
 */
export interface SubscriptionViewStyles {
  /** 
   * Style for the outer modal container (covers entire screen)
   * @styleProperty
   * @example { backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center' }
   */
  modalContainer?: ViewStyle;
  
  /** 
   * Style for the main content container (white card)
   * @styleProperty
   * @example { backgroundColor: '#F5F5F5', borderTopLeftRadius: 32 }
   */
  contentContainer?: ViewStyle;

  /** 
   * Style for the header container (title + close button row)
   * @styleProperty
   * @example { paddingHorizontal: 20, marginBottom: 32 }
   */
  header?: ViewStyle;

  /** 
   * Style for the title text
   * @styleProperty
   * @example { fontSize: 24, fontWeight: '600', color: '#1a1a1a' }
   */
  title?: TextStyle;

  /** 
   * Style for the close button
   * @styleProperty
   * @example { padding: 8 }
   */
  closeButton?: ViewStyle;

  /** 
   * Style for the close button text
   * @styleProperty
   * @example { fontSize: 18, color: '#007AFF' }
   */
  closeButtonText?: TextStyle;

  /** 
   * Style for the product card
   * @styleProperty
   * @example { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginHorizontal: 8, marginBottom: 8, width: windowWidth * 0.75 }
   */
  productCard?: ViewStyle;

  /** 
   * Style for the selected product card
   * @styleProperty
   * @example { borderWidth: 2, borderColor: '#007AFF' }
   */
  productCardSelected?: ViewStyle;

  /** 
   * Style for the product title text
   * @styleProperty
   * @example { fontSize: 20, fontWeight: '600', marginBottom: 8, color: '#1a1a1a' }
   */
  productTitle?: TextStyle;

  /** 
   * Style for the product price text
   * @styleProperty
   * @example { fontSize: 24, fontWeight: '700', color: '#007AFF', marginBottom: 8 }
   */
  productPrice?: TextStyle;

  /** 
   * Style for the product price sentence text
   * @styleProperty
   * @example { fontSize: 16, color: '#666', marginBottom: 8 }
   */
  productPriceSentence?: TextStyle;

  /** 
   * Style for the product description text
   * @styleProperty
   * @example { fontSize: 14, color: '#666', marginBottom: 16 }
   */
  productDescription?: TextStyle;

  /** 
   * Style for the billing selector container
   * @styleProperty
   * @example { marginVertical: 16, gap: 8 }
   */
  billingSelector?: ViewStyle;

  /** 
   * Style for the billing option
   * @styleProperty
   * @example { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginHorizontal: 4 }
   */
  billingOption?: ViewStyle;

  /** 
   * Style for the selected billing option
   * @styleProperty
   * @example { borderColor: '#007AFF', backgroundColor: '#e6f3ff' }
   */
  billingOptionSelected?: ViewStyle;

  /** 
   * Style for the billing option text
   * @styleProperty
   * @example { color: '#333', fontWeight: '500' }
   */
  billingOptionText?: TextStyle;

  /** 
   * Style for the CTA button
   * @styleProperty
   * @example { backgroundColor: '#007AFF', borderRadius: 12, padding: 20, alignItems: 'center', marginTop: 24 }
   */
  ctaButton?: ViewStyle;

  /** 
   * Style for the CTA button text
   * @styleProperty
   * @example { color: 'white', fontSize: 18, fontWeight: '600' }
   */
  ctaButtonText?: TextStyle;

  /** 
   * Style for the features title text
   * @styleProperty
   * @example { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginVertical: 16 }
   */
  featuresTitle?: TextStyle;

  /** 
   * Style for the disabled CTA button
   * @styleProperty
   * @example { backgroundColor: '#999', opacity: 0.7 }
   */
  ctaButtonDisabled?: ViewStyle;
}
