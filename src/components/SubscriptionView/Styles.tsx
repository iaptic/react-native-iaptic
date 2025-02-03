import { TextStyle, ViewStyle } from "react-native";

/**
 * Style definitions for the IapticSubscriptionView component
 * 
 * For advanced customization of the IapticSubscriptionView component.
 * 
 * @example
 * // Basic style override example:
 * {
 *   modalContainer: { backgroundColor: 'rgba(0,0,0,0.8)' },
 *   productTitle: { fontSize: 22, color: '#2C3E50' },
 *   ctaButton: { backgroundColor: '#4CD964', borderRadius: 14 }
 * }
 * 
 * @internal
 */
export interface IapticSubscriptionViewStyles {
  /** 
   * Style for the outer modal container (covers entire screen)
   * @example { backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center' }
   */
  modalContainer?: ViewStyle;
  
  /** 
   * Style for the main content container (white card)
   * @example { backgroundColor: '#F5F5F5', borderTopLeftRadius: 32 }
   */
  contentContainer?: ViewStyle;

  /** 
   * Style for the header container (title + close button row)
   * @example { paddingHorizontal: 20, marginBottom: 32 }
   */
  header?: ViewStyle;

  /** 
   * Style for the title text
   * @example { fontSize: 24, fontWeight: '600', color: '#1a1a1a' }
   */
  title?: TextStyle;

  /** 
   * Style for the close button
   * @example { padding: 8 }
   */
  closeButton?: ViewStyle;

  /** 
   * Style for the close button text
   * @example { fontSize: 18, color: '#007AFF' }
   */
  closeButtonText?: TextStyle;

  /** 
   * Style for the product card
   * @example { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginHorizontal: 8, marginBottom: 8, width: windowWidth * 0.75 }
   */
  productCard?: ViewStyle;

  /** 
   * Style for the selected product card
   * @example { borderWidth: 2, borderColor: '#007AFF' }
   */
  productCardSelected?: ViewStyle;

  /** 
   * Style for the product title text
   * @example { fontSize: 20, fontWeight: '600', marginBottom: 8, color: '#1a1a1a' }
   */
  productTitle?: TextStyle;

  /** 
   * Style for the product price text
   * @example { fontSize: 24, fontWeight: '700', color: '#007AFF', marginBottom: 8 }
   */
  productPrice?: TextStyle;

  /** 
   * Style for the product price sentence text
   * @example { fontSize: 16, color: '#666', marginBottom: 8 }
   */
  productPriceSentence?: TextStyle;

  /** 
   * Style for the product description text
   * @example { fontSize: 14, color: '#666', marginBottom: 16 }
   */
  productDescription?: TextStyle;

  /** 
   * Style for the billing selector container
   * @example { marginVertical: 16, gap: 8 }
   */
  billingSelector?: ViewStyle;

  /** 
   * Style for the billing option
   * @example { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginHorizontal: 4 }
   */
  billingOption?: ViewStyle;

  /** 
   * Style for the selected billing option
   * @example { borderColor: '#007AFF', backgroundColor: '#e6f3ff' }
   */
  billingOptionSelected?: ViewStyle;

  /** 
   * Style for the billing option text
   * @example { color: '#333', fontWeight: '500' }
   */
  billingOptionText?: TextStyle;

  /** 
   * Style for the CTA button
   * @example { backgroundColor: '#007AFF', borderRadius: 12, padding: 20, alignItems: 'center', marginTop: 24 }
   */
  ctaButton?: ViewStyle;

  /** 
   * Style for the CTA button text
   * @example { color: 'white', fontSize: 18, fontWeight: '600' }
   */
  ctaButtonText?: TextStyle;

  /** 
   * Style for the features title text
   * @example { fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginVertical: 16 }
   */
  featuresTitle?: TextStyle;

  /** 
   * Style for the disabled CTA button
   * @example { backgroundColor: '#999', opacity: 0.7 }
   */
  ctaButtonDisabled?: ViewStyle;
}
