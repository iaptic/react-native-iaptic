# Iaptic React Native SDK

[![npm version](https://img.shields.io/npm/v/iaptic-rn)](https://www.npmjs.com/package/iaptic-rn)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust in-app purchase library for React Native that simplifies receipt validation and subscription management through the Iaptic service.

## ✨ Features

### Cross-Platform Support
- 🛒 **Unified Purchasing API** - Single interface for iOS and Android
- 🔄 **Subscription Management** - Easy status tracking and renewal handling

### Security & Reliability
- 🔒 **Secure Receipt Validation** - Server-side validation via Iaptic
- 🛡 **Error Handling** - Comprehensive error codes and localization

### Product Management
- 📦 **Product Catalog** - Structured product definitions with pricing phases
- 📊 **Entitlement Tracking** - Real-time purchase state management

## 📦 Installation

```bash
npm install iaptic-rn
# or
yarn add iaptic-rn
```

> **Note**  
> Follow [react-native-iap setup instructions](https://github.com/dooboolab-community/react-native-iap) 
> for platform-specific configuration. Requires React Native 0.63+.

## 🚀 Quick Start

```typescript
import { IapticRN } from 'iaptic-rn';

// Initialize with your configuration
const iaptic = new IapticRN({
  appName: 'MyApp',
  publicKey: 'YOUR_IAPTIC_PUBLIC_KEY',
  iosBundleId: 'com.yourcompany.yourapp',
});

// Initialize connection
await iaptic.initialize();

// Fetch available products
const products = await iaptic.listProducts();
```

## 💡 Core Functionality

### Product Listing
```typescript
const products = await iaptic.listProducts();
products.forEach(product => {
  console.log(`Product: ${product.title}`);
  product.offers.forEach(offer => {
    console.log(`- Offer: ${offer.pricingPhases[0].price}`);
  });
});
```

### Purchase Flow
```typescript
try {
  const purchase = await iaptic.order(selectedOffer);
  console.log('Purchase successful:', purchase);
} catch (error) {
  if (error.code === 'E_USER_CANCELLED') {
    console.log('User cancelled purchase');
  } else {
    console.error('Purchase failed:', error.message);
  }
}
```

## 📚 API Reference

### Core Methods
| Method                | Description                               |
|-----------------------|-------------------------------------------|
| `initialize()`        | Initialize IAP connections               |
| `listProducts()`      | Fetch available products                  |
| `order(offer)`        | Initiate purchase flow                    |
| `restorePurchases()`  | Restore previous purchases                |
| `listEntitlements()`  | Get current valid purchases               |
| `manageSubscriptions()` | Open platform subscription management  |

### Configuration Options
```typescript
interface IapticConfig {
  appName: string;          // Your application name
  publicKey: string;        // Iaptic public key
  iosBundleId?: string;     // iOS bundle ID (required for iOS)
  baseUrl?: string;         // Iaptic API endpoint (default: production)
  autoRefresh?: boolean;    // Auto-refresh entitlements (default: true)
  validationTimeout?: number; // Receipt validation timeout in ms (default: 5000)
}
```

## 🔍 Demo Implementation

See complete implementation in our [demo app repository](https://github.com/iaptic/react-native-demo-app):

```tsx
function ProductList({ products }) {
  return (
    <View>
      {products.map(product => (
        <View key={product.id}>
          <Text>{product.title}</Text>
          {product.offers.map(offer => (
            <Button
              key={offer.id}
              title={`Buy for ${offer.pricingPhases[0].price}`}
              onPress={() => handlePurchase(offer)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
```

---

📘 **License**  
MIT © [Iaptic](https://www.iaptic.com)  
📮 **Support**  
Need help? Contact support@iaptic.com
