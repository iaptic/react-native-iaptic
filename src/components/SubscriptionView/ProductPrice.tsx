import React from 'react';
import { Text } from 'react-native';
import { IapticOffer, IapticProduct } from '../../types';
import { IapticSubscriptionViewStyles } from './Styles';
import { utils } from '../../classes/Utils';
import { Locales } from '../../classes/Locales';

/**
 * Props for the ProductPrice component
 * 
 * @internal
 */
export interface ProductPriceProps {
  product: IapticProduct;
  styles?: IapticSubscriptionViewStyles;
}

/**
 * Product price component
 * 
 * @remarks React Component
 * 
 * @internal
 */
export const ProductPrice = (props: ProductPriceProps) => {
  const { product, styles } = props;
  if (product.offers.length === 0) {
    return null;
  }
  else if (product.offers.length > 1) {
    const cheapest = utils.cheapestOffer(product);
    const monthlyPrice = utils.monthlyPriceMicros(cheapest);
    const currency = cheapest.pricingPhases[0].currency;
    const formattedPrice = utils.formatCurrency(monthlyPrice, currency ?? 'USD');
    
    // Get localized string and split around placeholder
    const localizedString = Locales.get('ProductPrice_StartingAt');
    const [before, after] = localizedString.split('{0}');

    return (
      <Text style={styles?.productPriceSentence}>
        {before}
        <Text style={styles?.productPrice}>{formattedPrice}</Text>
        {after}
      </Text>
    );
  }
  else {
    return <OfferPrice offer={product.offers[0]} styles={styles} />;
  }
}

const OfferPrice = ({ offer, styles }: { offer: IapticOffer, styles?: IapticSubscriptionViewStyles }) => {
  return <Text style={styles?.productPriceSentence}><Text style={styles?.productPrice}>{offer.pricingPhases[0].price}</Text> {utils.formatBillingCycle(offer.pricingPhases[0])}</Text>;
}