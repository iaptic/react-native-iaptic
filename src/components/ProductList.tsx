import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { IapticOffer, IapticPendingPurchase, IapticProduct } from '../types';
import { IapticRN } from '../IapticRN';

/**
 * @internal
 */
export interface ProductListStyles {
  container?: ViewStyle;
  productContainer?: ViewStyle;
  productTitle?: TextStyle;
  offersContainer?: ViewStyle;
  offerContainer?: ViewStyle;
  button?: ViewStyle;
  buttonDisabled?: ViewStyle;
  buttonText?: TextStyle;
  pricingPhasesText?: TextStyle;
}

/**
 * ProductList component props
 * 
 * @internal
 */
export interface ProductListProps {
  /**
   * Filter the products to display (optional)
   */
  productIds?: string[];
  /**
   * Handlers when the user request purchasing a given offer
   */
  onOrder: (offer: IapticOffer) => void;
  /**
   * Custom styles
   */
  styles?: { [K in keyof ProductListStyles]?: ViewStyle | TextStyle };
}

const defaultStyles = StyleSheet.create({
  productContainer: {
    marginBottom: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  offersContainer: {
    gap: 12,
  },
  offerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  pricingPhasesText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginLeft: 8,
    textAlign: 'right',
  },
});

/**
 * ProductList component
 * 
 * @remarks React Component
 * 
 * @internal
 */
export const ProductList = ({
  productIds,
  onOrder: onSubscribe,
  styles: customStyles = {},
}: ProductListProps) => {
  const styles = {
    ...defaultStyles,
    ...StyleSheet.create(customStyles),
  };

  const [products, setProducts] = useState<IapticProduct[]>([]);
  const [pendingPurchase, setPendingPurchase] = useState<IapticPendingPurchase | null>(null);

  useEffect(() => {
    const listeners = [
      IapticRN.addEventListener('pendingPurchase.updated', purchase => {
        if (purchase.status === 'completed' || purchase.status === 'cancelled') {
          setPendingPurchase(null);
        } else {
          setPendingPurchase(purchase);
        }
      }),
      IapticRN.addEventListener('products.updated', products => {
        if (productIds) {
          setProducts(products.filter(product => productIds.includes(product.id)));
        } else {
          setProducts(products);
        }
      })
    ];
    return () => {
      listeners.forEach(listener => listener.remove());
    }
  }, []);


  return (
    <>
      {products.map((product) => (
        <View key={product.id} style={styles.productContainer}>
          <Text style={styles.productTitle}>{product.title}</Text>
          <View style={styles.offersContainer}>
            {product.offers.map((offer) => (
              <View key={offer.id} style={styles.offerContainer}>
                <TouchableOpacity
                  disabled={pendingPurchase?.productId === product.id}
                  style={[
                    styles.button,
                    pendingPurchase?.productId === product.id && styles.buttonDisabled,
                  ]}
                  onPress={() => onSubscribe(offer)}
                >
                  <Text style={styles.buttonText}>
                    {pendingPurchase?.productId === product.id &&
                    (pendingPurchase?.offerId === offer.id || !pendingPurchase?.offerId)
                      ? `${pendingPurchase.status}...`
                      : `${offer.pricingPhases[0].price} ${IapticRN.utils.formatBillingCycle(offer.pricingPhases[0])}`}
                  </Text>
                </TouchableOpacity>

                {offer.pricingPhases.length > 1 && (
                  <Text style={styles.pricingPhasesText}>
                    {offer.pricingPhases
                      .slice(1)
                      .map(
                        (phase) =>
                          `then ${phase.price} ${IapticRN.utils.formatBillingCycle(phase)}`
                      )
                      .join('\n')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>
      ))}
    </>
  );
};

export default ProductList; 