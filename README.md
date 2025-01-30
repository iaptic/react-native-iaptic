# Iaptic React Native SDK

[![npm version](https://img.shields.io/npm/v/iaptic-rn)](https://www.npmjs.com/package/iaptic-rn)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A robust in-app purchase library for React Native that simplifies receipt validation and subscription management through the Iaptic service.

## Features

- 🛒 **Unified Purchasing API** - Single interface for iOS and Android
- 🔒 **Secure Receipt Validation** - Server-side validation via Iaptic
- 🔄 **Subscription Management** - Easy status tracking and renewal handling
- 🛡 **Error Handling** - Comprehensive error codes and localization
- 📦 **Product Catalog** - Structured product definitions with pricing phases
- 📊 **Entitlement Tracking** - Real-time purchase state management

## Installation

```bash
npm install iaptic-rn
```

or:

```bash
yarn add iaptic-rn
```


Follow [react-native-iap setup instructions](https://github.com/dooboolab-community/react-native-iap) for platform-specific configuration.

## Quick Start

```typescript
import { IapticRN } from 'iaptic-rn';
// Initialize with your configuration
const iaptic = new IapticRN({
appName: 'MyApp',
publicKey: 'YOUR_IAPTIC_PUBLIC_KEY',
iosBundleId: 'com.yourcompany.yourapp',
baseUrl: 'https://api.iaptic.com',
});
// Initialize connection
await iaptic.initialize();
// Fetch available products
const products = await iaptic.listProducts();
```


## Core Functionality

### Fetching Products

```typescript
const products = await iaptic.listProducts();
products.forEach(product => {
console.log(Product: ${product.title});
product.offers.forEach(offer => {
console.log(- Offer: ${offer.pricingPhases[0].price});
});
});
```

### Making a Purchase

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

### Subscription Management

```typescript
// Get active subscription
const activeSub = iaptic.listEntitlements()
.find(e => e.productType === 'paid subscription' && !e.isExpired);
// Manage subscriptions
iaptic.manageSubscriptions();
```

## Error Handling

Handle errors using the `IapticError` class:

```typescript
import { IapticError, IapticErrorSeverity } from 'iaptic-rn';
try {
// Purchase logic
} catch (error) {
if (error instanceof IapticError) {
Alert.alert(
error.localizedTitle || 'Error',
error.localizedMessage || error.message
);
if (error.severity === IapticErrorSeverity.ERROR) {
// Report critical errors to your error tracking
}
}
}
```

## API Reference

### Core Methods
| Method               | Description                              |
|----------------------|------------------------------------------|
| `initialize()`       | Initialize IAP connections               |
| `listProducts()`     | Fetch available products                 |
| `order(offer)`       | Initiate purchase flow                   |
| `restorePurchases()` | Restore previous purchases               |
| `listEntitlements()` | Get current valid purchases              |
| `manageSubscriptions()` | Open platform subscription management |

### Configuration Options

```typescript
interface IapticConfig {
appName: string;
publicKey: string;
iosBundleId?: string;
baseUrl?: string;
autoRefresh?: boolean;
validationTimeout?: number;
}
```


## Demo Implementation

See a complete implementation example in our [demo app](https://github.com/iaptic/react-native-demo-app):

```tsx
// Simplified product display component
function ProductList({ products }) {
return (
<View>
{products.map(product => (
<View key={product.id}>
<Text>{product.title}</Text>
{product.offers.map(offer => (
<Button
key={offer.id}
title={Buy for ${offer.pricingPhases[0].price}}
onPress={() => handlePurchase(offer)}
/>
))}
</View>
))}
</View>
);
}
```


## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) before submitting pull requests.

## License

MIT © [Iaptic](https://www.iaptic.com)

---

Need help? Contact our support team at support@iaptic.com
