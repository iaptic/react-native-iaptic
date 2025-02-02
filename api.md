[**react-native-iaptic**](README.md)

***

# react-native-iaptic

Iaptic React Native SDK

Provides in-app purchase functionality with integrated receipt validation
through the Iaptic service.

The API entry point is [IapticRN](#iapticrn).

## Examples

```typescript
import { IapticSubscriptionView } from 'react-native-iaptic';
const app = (props) => {
  useEffect(() => {
    IapticRN.initialize({
      appName: 'com.example.app',
      publicKey: 'YOUR_API_KEY',
      iosBundleId: 'com.yourcompany.app',
      products: [{
        id: 'premium_subscription',
        type: 'paid subscription',
        entitlements: ['premium']
      }, {
        id: 'basic_subscription',
        type: 'paid subscription',
        entitlements: ['basic']
      }],
    });
  }, []);
  return (
    <View> // your root node
      <TouchableOpacity onPress={() => IapticRN.presentSubscriptionView()}>
        <Text>Subscribe</Text>
      </TouchableOpacity>
      <IapticSubscriptionView entitlementLabels={{
        premium: 'Premium Features',
        basic: 'Basic Features',
      }} />
    </View>
  );
};
```

```typescript
// 1. Initialize with your configuration
await IapticRN.initialize({
  appName: 'com.example.app',
  publicKey: 'YOUR_API_KEY',
  iosBundleId: 'com.yourcompany.app',
  products: [{
    id: 'premium_monthly',
    type: 'paid subscription',
    entitlements: ['premium']
  }, {
    id: 'coins_100',
    type: 'consumable',
    tokenType: 'coins',
    tokenValue: 100
  }]);

// 4. Handle purchases
const offer = IapticRN.getProduct('premium_monthly')?.offers[0];
if (offer) {
  await IapticRN.order(offer); 
}

// 5. Check access
if (IapticRN.checkEntitlement('premium')) {
  // Unlock premium features
}
```

## Enumerations

### IapticCancelationReason


Reason why a subscription has been canceled

#### Enumeration Members

##### CUSTOMER

> **CUSTOMER**: `"Customer"`


Subscription canceled by the user for an unspecified reason.

##### CUSTOMER\_COST

> **CUSTOMER\_COST**: `"Customer.Cost"`


Customer canceled for cost-related reasons.

##### CUSTOMER\_FOUND\_BETTER\_APP

> **CUSTOMER\_FOUND\_BETTER\_APP**: `"Customer.FoundBetterApp"`


Customer claimed to have found a better app.

##### CUSTOMER\_NOT\_USEFUL\_ENOUGH

> **CUSTOMER\_NOT\_USEFUL\_ENOUGH**: `"Customer.NotUsefulEnough"`


Customer did not feel he is using this service enough.

##### CUSTOMER\_OTHER\_REASON

> **CUSTOMER\_OTHER\_REASON**: `"Customer.OtherReason"`


Subscription canceled for another reason; for example, if the customer made the purchase accidentally.

##### CUSTOMER\_PRICE\_INCREASE

> **CUSTOMER\_PRICE\_INCREASE**: `"Customer.PriceIncrease"`


Customer did not agree to a recent price increase. See also priceConsentStatus.

##### CUSTOMER\_TECHNICAL\_ISSUES

> **CUSTOMER\_TECHNICAL\_ISSUES**: `"Customer.TechnicalIssues"`


Customer canceled their transaction due to an actual or perceived issue within your app.

##### DEVELOPER

> **DEVELOPER**: `"Developer"`


Subscription canceled by the developer.

##### NOT\_CANCELED

> **NOT\_CANCELED**: `""`


Not canceled

##### SYSTEM

> **SYSTEM**: `"System"`


Subscription canceled by the system for an unspecified reason.

##### SYSTEM\_BILLING\_ERROR

> **SYSTEM\_BILLING\_ERROR**: `"System.BillingError"`


Billing error; for example customer's payment information is no longer valid.

##### SYSTEM\_DELETED

> **SYSTEM\_DELETED**: `"System.Deleted"`


Transaction is gone; It has been deleted.

##### SYSTEM\_PRODUCT\_UNAVAILABLE

> **SYSTEM\_PRODUCT\_UNAVAILABLE**: `"System.ProductUnavailable"`


Product not available for purchase at the time of renewal.

##### SYSTEM\_REPLACED

> **SYSTEM\_REPLACED**: `"System.Replaced"`


Subscription upgraded or downgraded to a new subscription.

##### UNKNOWN

> **UNKNOWN**: `"Unknown"`


Subscription canceled for unknown reasons.

***

### IapticErrorCode


Error codes

#### Enumeration Members

##### BAD\_RESPONSE

> **BAD\_RESPONSE**: `6777018`


Error: Bad response from the server

##### CLIENT\_INVALID

> **CLIENT\_INVALID**: `6777005`


Error: Client is not allowed to issue the request

##### CLOUD\_SERVICE\_NETWORK\_CONNECTION\_FAILED

> **CLOUD\_SERVICE\_NETWORK\_CONNECTION\_FAILED**: `6777025`


Error: The device could not connect to the network.

##### CLOUD\_SERVICE\_PERMISSION\_DENIED

> **CLOUD\_SERVICE\_PERMISSION\_DENIED**: `6777024`


Error: The user has not allowed access to Cloud service information

##### CLOUD\_SERVICE\_REVOKED

> **CLOUD\_SERVICE\_REVOKED**: `6777026`


Error: The user has revoked permission to use this cloud service.

##### COMMUNICATION

> **COMMUNICATION**: `6777014`


Error: Failed to communicate with the server

##### DOWNLOAD

> **DOWNLOAD**: `6777021`


Error: Failed to download the content

##### FINISH

> **FINISH**: `6777013`


Error: Cannot finalize a transaction or acknowledge a purchase

##### INVALID\_OFFER\_IDENTIFIER

> **INVALID\_OFFER\_IDENTIFIER**: `6777029`


Error: The offer identifier is invalid.

##### INVALID\_OFFER\_PRICE

> **INVALID\_OFFER\_PRICE**: `6777030`


Error: The price you specified in App Store Connect is no longer valid.

##### INVALID\_PRODUCT\_ID

> **INVALID\_PRODUCT\_ID**: `6777012`


Error: The product identifier is invalid

##### INVALID\_SIGNATURE

> **INVALID\_SIGNATURE**: `6777031`


Error: The signature in a payment discount is not valid.

##### LOAD

> **LOAD**: `6777002`


Error: Failed to load in-app products metadata

##### LOAD\_RECEIPTS

> **LOAD\_RECEIPTS**: `6777004`


Error: Failed to load the purchase receipt

##### MISSING\_OFFER\_PARAMS

> **MISSING\_OFFER\_PARAMS**: `6777032`


Error: Parameters are missing in a payment discount.

##### MISSING\_TOKEN

> **MISSING\_TOKEN**: `6777016`


Error: Purchase information is missing token

##### PAYMENT\_CANCELLED

> **PAYMENT\_CANCELLED**: `6777006`


Error: Purchase flow has been cancelled by user

##### PAYMENT\_EXPIRED

> **PAYMENT\_EXPIRED**: `6777020`


Error: Payment has expired

##### PAYMENT\_INVALID

> **PAYMENT\_INVALID**: `6777007`


Error: Something is suspicious about a purchase

##### PAYMENT\_NOT\_ALLOWED

> **PAYMENT\_NOT\_ALLOWED**: `6777008`


Error: The user is not allowed to make a payment

##### PRIVACY\_ACKNOWLEDGEMENT\_REQUIRED

> **PRIVACY\_ACKNOWLEDGEMENT\_REQUIRED**: `6777027`


Error: The user has not yet acknowledged Apple's privacy policy

##### PRODUCT\_NOT\_AVAILABLE

> **PRODUCT\_NOT\_AVAILABLE**: `6777023`


Error: The requested product is not available in the store.

##### PURCHASE

> **PURCHASE**: `6777003`


Error: Failed to make a purchase

##### REFRESH

> **REFRESH**: `6777019`


Error: Failed to refresh the store

##### REFRESH\_RECEIPTS

> **REFRESH\_RECEIPTS**: `6777011`


Error: Failed to refresh the purchase receipt

##### SETUP

> **SETUP**: `6777001`


Error: Failed to intialize the in-app purchase library

##### SUBSCRIPTION\_UPDATE\_NOT\_AVAILABLE

> **SUBSCRIPTION\_UPDATE\_NOT\_AVAILABLE**: `6777022`


Error: Failed to update a subscription

##### SUBSCRIPTIONS\_NOT\_AVAILABLE

> **SUBSCRIPTIONS\_NOT\_AVAILABLE**: `6777015`


Error: Subscriptions are not available

##### UNAUTHORIZED\_REQUEST\_DATA

> **UNAUTHORIZED\_REQUEST\_DATA**: `6777028`


Error: The app is attempting to use a property for which it does not have the required entitlement.

##### UNKNOWN

> **UNKNOWN**: `6777010`


Error: Unknown error

##### ~~VALIDATOR\_SUBSCRIPTION\_EXPIRED~~

> **VALIDATOR\_SUBSCRIPTION\_EXPIRED**: `6778003`


Server code used when a subscription expired.

###### Deprecated

Validator should now return the transaction in the collection as expired.

##### VERIFICATION\_FAILED

> **VERIFICATION\_FAILED**: `6777017`


Error: Verification of store data failed

***

### IapticPriceConsentStatus


Whether or not the user was notified or agreed to a price change

#### Enumeration Members

##### AGREED

> **AGREED**: `"Agreed"`


##### NOTIFIED

> **NOTIFIED**: `"Notified"`


***

### IapticPurchasePlatform


Purchase platforms supported by the plugin

#### Enumeration Members

##### APPLE\_APPSTORE

> **APPLE\_APPSTORE**: `"ios-appstore"`


Apple AppStore

##### BRAINTREE

> **BRAINTREE**: `"braintree"`


Braintree

##### GOOGLE\_PLAY

> **GOOGLE\_PLAY**: `"android-playstore"`


Google Play

##### TEST

> **TEST**: `"test"`


Test platform

##### WINDOWS\_STORE

> **WINDOWS\_STORE**: `"windows-store-transaction"`


Windows Store

***

### IapticSeverity


Error severity

- INFO: The error is not critical and can be ignored, not worth reporting to the user, can be logged to your server or ignored.
- WARNING: The error is important and can be reported to the user as a toast message.
- ERROR: The error is critical and should be reported to the user as a pop-up alert.

#### Enumeration Members

##### ERROR

> **ERROR**: `2`


##### INFO

> **INFO**: `0`


##### WARNING

> **WARNING**: `1`


***

### IapticVerbosity


#### Enumeration Members

##### DEBUG

> **DEBUG**: `3`


##### ERROR

> **ERROR**: `0`


##### INFO

> **INFO**: `2`


##### WARN

> **WARN**: `1`


## Classes

### IapticError


Represents an error in the Iaptic purchase flow

#### Example

```typescript
try {
  await iaptic.order(productOffer);
} catch (error) {
  if (error instanceof IapticError) {
    trackAnalyticsEvent(error.code);
    if (error.severity === IapticErrorSeverity.INFO) {
      console.log('Info:', error.localizedMessage);
      return;
    }
    Alert.alert(error.localizedTitle, error.localizedMessage);
  } else {
    Alert.alert('Unknown error', error.message);
  }
}
```

#### Extends

- `Error`

#### Properties

##### cause?

> `optional` **cause**: `unknown`


###### Inherited from

`Error.cause`

##### code

> `readonly` **code**: [`IapticErrorCode`](#iapticerrorcode)


##### debugMessage

> `readonly` **debugMessage**: `string`


##### localizedMessage

> `readonly` **localizedMessage**: `string`


##### localizedTitle

> `readonly` **localizedTitle**: `string`


##### message

> **message**: `string`


###### Inherited from

`Error.message`

##### name

> **name**: `string`


###### Inherited from

`Error.name`

##### severity

> `readonly` **severity**: [`IapticSeverity`](#iapticseverity)


##### stack?

> `optional` **stack**: `string`


###### Inherited from

`Error.stack`

##### status

> `readonly` **status**: `undefined` \| `number`


##### prepareStackTrace()?

> `static` `optional` **prepareStackTrace**: (`err`, `stackTraces`) => `any`


Optional override for formatting stack traces

###### Parameters

###### err

`Error`

###### stackTraces

`CallSite`[]

###### Returns

`any`

###### See

https://v8.dev/docs/stack-trace-api#customizing-stack-traces

###### Inherited from

`Error.prepareStackTrace`

##### stackTraceLimit

> `static` **stackTraceLimit**: `number`


###### Inherited from

`Error.stackTraceLimit`

#### Methods

##### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`, `constructorOpt`?): `void`


Create .stack property on a target object

###### Parameters

###### targetObject

`object`

###### constructorOpt?

`Function`

###### Returns

`void`

###### Inherited from

`Error.captureStackTrace`

***

### IapticRN


Iaptic React Native SDK

#### Constructors

##### new IapticRN()

> **new IapticRN**(): [`IapticRN`](#iapticrn)

###### Returns

[`IapticRN`](#iapticrn)

#### Properties

##### store

> `static` **store**: `undefined` \| `IapticStore`


Singleton instance of IapticStore

##### utils

> `readonly` `static` **utils**: [`IapticUtils`](#iapticutils)


Utility functions

#### Methods

##### addEventListener()

> `static` **addEventListener**\<`T`\>(`eventType`, `listener`): `object`


Add an event listener for iaptic events

To remove a listener, call the returned object's `remove()` method.

###### Type Parameters

• **T** *extends* [`IapticEventType`](#iapticeventtype)

###### Parameters

###### eventType

`T`

Type of event to listen for

###### listener

[`IapticEventListener`](#iapticeventlistenert)\<`T`\>

Callback function that will be called when the event occurs

###### Returns

`object`

###### remove()

> **remove**: () => `void`

###### Returns

`void`

###### Examples

```typescript
// Listen for subscription updates
IapticRN.addEventListener('subscription.updated', (reason, purchase) => {
  console.log(`Subscription ${purchase.id} ${reason}`);
});

// Listen for pending purchase updates
IapticRN.addEventListener('pendingPurchase.updated', (pendingPurchase) => {
  console.log(`Purchase ${pendingPurchase.productId} is now ${pendingPurchase.status}`);
});

// Listen for purchase updates
IapticRN.addEventListener('purchase.updated', (purchase) => {
  console.log(`Purchase ${purchase.id} ${purchase.status}`);
});

// Listen for non-consumable purchases
IapticRN.addEventListener('nonConsumable.owned', (purchase) => {
  console.log(`Non-consumable purchase ${purchase.id} is now owned`);
});
```

```typescript
const listener = IapticRN.addEventListener('purchase.updated', (purchase) => {
  console.log(`Purchase ${purchase.id} ${purchase.status}`);
});
listener.remove();
```

###### See

[IapticEventType](#iapticeventtype) for all possible event types

##### addLocale()

> `static` **addLocale**(`code`, `messages`): `void`


Add a locale for Iaptic provided components and error messages.

###### Parameters

###### code

`string`

The language code

###### messages

[`IapticLocale`](#iapticlocale)

The locale messages

###### Returns

`void`

###### Example

```typescript
IapticRN.addLocale('fr', {...});
```

##### checkEntitlement()

> `static` **checkEntitlement**(`featureId`): `boolean`


Check if the user has active access to a specific feature or content.

Entitlements represent features/content that users unlock through purchases.
They are defined in product definitions and automatically tracked when purchases are validated.

###### Parameters

###### featureId

`string`

The unique identifier for the feature/content (e.g. "premium", "gold_status")

###### Returns

`boolean`

True if the user has active access to the specified feature

###### See

[setProductDefinitions](#setproductdefinitions)

###### Example

```typescript
// Check premium access
if (IapticRN.checkEntitlement('premium')) {
  showPremiumContent();
} else {
  showUpgradePrompt();
}

// Check specific feature access
const hasCoolFeature = IapticRN.checkEntitlement('cool_feature');
```

##### consume()

> `static` **consume**(`purchase`): `Promise`\<`void`\>


Consume a purchase. Only for consumable products.

###### Parameters

###### purchase

[`IapticVerifiedPurchase`](#iapticverifiedpurchase)

The purchase to consume

###### Returns

`Promise`\<`void`\>

###### Example

```typescript
IapticRN.consume(purchase);
```

###### See

TokensManager for a convenient way to handle your consumable products.

##### createStore()

> `static` **createStore**(`config`): `IapticStore`


Instanciate the singleton instance of IapticStore

For advanced use-cases only.

###### Parameters

###### config

[`IapticConfig`](#iapticconfig)

###### Returns

`IapticStore`

##### destroy()

> `static` **destroy**(): `void`


Destroy the IapticRN singleton, cleanup everything.

###### Returns

`void`

##### getActiveSubscription()

> `static` **getActiveSubscription**(): `undefined` \| [`IapticVerifiedPurchase`](#iapticverifiedpurchase)


Get the active subscription (if any)

For **apps that sell multiple subscriptions** that can be active at the same time,
this returns the first one. To check if there is any active subscription:
- [getPurchases](#getpurchases) to manually parse and find all active subscriptions.
- [isOwned](#isowned) with all your product ids to check if there is any active subscription.

###### Returns

`undefined` \| [`IapticVerifiedPurchase`](#iapticverifiedpurchase)

The active subscription or undefined if there is no active subscription

###### See

[IapticVerifiedPurchase](#iapticverifiedpurchase) for more information on the purchase object

###### Example

```typescript
const activeSubscription = IapticRN.getActiveSubscription();
if (activeSubscription) {
  console.log(`Active subscription: ${activeSubscription.productId}`);
  if (activeSubscription.renewalIntent === 'Renew') {
    console.log('Will renew on: ' + new Date(activeSubscription.expiryDate).toLocaleDateString());
  }
  else {
    console.log('Will expire on: ' + new Date(activeSubscription.expiryDate).toLocaleDateString());
  }
}
```

##### getPendingPurchases()

> `static` **getPendingPurchases**(): [`IapticPendingPurchase`](#iapticpendingpurchase)[]


Get all pending purchases.

###### Returns

[`IapticPendingPurchase`](#iapticpendingpurchase)[]

List of pending purchases

##### getProduct()

> `static` **getProduct**(`productId`): `undefined` \| [`IapticProduct`](#iapticproduct)


Get a product from the product catalog

###### Parameters

###### productId

`string`

The product identifier

###### Returns

`undefined` \| [`IapticProduct`](#iapticproduct)

The product or undefined if not found

###### Example

```typescript
const product = IapticRN.getProduct('premium_monthly');
```

###### See

[IapticProduct](#iapticproduct) for more information on the product object

##### getProducts()

> `static` **getProducts**(): [`IapticProduct`](#iapticproduct)[]


Get all products from the product catalog

###### Returns

[`IapticProduct`](#iapticproduct)[]

List of products

###### Example

```typescript
const products = IapticRN.getProducts();
```

###### See

[IapticProduct](#iapticproduct) for more information on the product object

##### getPurchases()

> `static` **getPurchases**(): [`IapticVerifiedPurchase`](#iapticverifiedpurchase)[]


Get all verified purchases.

###### Returns

[`IapticVerifiedPurchase`](#iapticverifiedpurchase)[]

List of purchases, most recent first

###### Example

```typescript
const purchases = IapticRN.getPurchases();
```

###### See

[IapticVerifiedPurchase](#iapticverifiedpurchase) for more information on the purchase object

##### getStore()

> `static` **getStore**(): `IapticStore`


Get the singleton instance of IapticStore

###### Returns

`IapticStore`

###### Throws

If the store is not initialized

##### getStoreSync()

> `static` **getStoreSync**(): `Promise`\<`IapticStore`\>


###### Returns

`Promise`\<`IapticStore`\>

##### initialize()

> `static` **initialize**(`config`): `Promise`\<`void`\>


Initialize the IapticRN singleton

###### Parameters

###### config

[`IapticConfig`](#iapticconfig)

The configuration for the IapticRN singleton

###### Returns

`Promise`\<`void`\>

###### Example

```typescript
IapticRN.initialize({
  appName: 'com.example.app',
  publicKey: '1234567890',
  iosBundleId: 'com.example.app',
});
```

##### isOwned()

> `static` **isOwned**(`productId`): `boolean`


Check if a product is owned.

- For non-consumable products, this checks if the product is owned.
- For paid subscriptions, this checks if there is an active subscription.
- For consumables, this always returns false.

###### Parameters

###### productId

`string`

The product identifier

###### Returns

`boolean`

True if the product is owned

###### Example

```typescript
if (IapticRN.isOwned('premium_subscription')) {
  console.log('User has an active subscription');
}
```

##### listEntitlements()

> `static` **listEntitlements**(): `string`[]


Get all currently active entitlements for the user.

This aggregates entitlements from all non-expired purchases, including:
- Active subscriptions
- Non-consumable purchases
- Non-consumed consumables

Entitlements are defined in product definitions and automatically tracked when purchases are validated.

###### Returns

`string`[]

Array of entitlement IDs the user currently has access to

###### See

[setProductDefinitions](#setproductdefinitions)

###### Example

```typescript
// Get all unlocked features
const unlockedFeatures = IapticRN.listEntitlements();
// ['basic', 'premium', 'dark_theme']
```

##### loadProducts()

> `static` **loadProducts**(`definitions`?): `Promise`\<[`IapticProduct`](#iapticproduct)[]\>


Load products from the Store.

###### Parameters

###### definitions?

[`IapticProductDefinition`](#iapticproductdefinition)[]

The products to load

###### Returns

`Promise`\<[`IapticProduct`](#iapticproduct)[]\>

###### Example

```typescript
await IapticRN.loadProducts([
  { id: 'basic_subscription', type: 'paid subscription', entitlements: [ 'basic' ] },
  { id: 'premium_subscription', type: 'paid subscription', entitlements: [ 'basic', 'premium' ] },
  { id: 'premium_lifetime', type: 'non consumable', entitlements: [ 'basic', 'premium' ] },
  { id: 'coins_100', type: 'consumable', tokenType: 'coins', tokenValue: 100 },
]);
```

##### loadPurchases()

> `static` **loadPurchases**(): `Promise`\<[`IapticVerifiedPurchase`](#iapticverifiedpurchase)[]\>


Load and validate active purchases details from the Store and Iaptic using their receipts

Notice that this is done when initialize the Store already.

###### Returns

`Promise`\<[`IapticVerifiedPurchase`](#iapticverifiedpurchase)[]\>

List of verified purchases.

###### Example

```typescript
const purchases = await IapticRN.loadPurchases();
```

##### manageBilling()

> `static` **manageBilling**(): `Promise`\<`void`\>


Opens the platform-specific billing management page.

###### Returns

`Promise`\<`void`\>

##### manageSubscriptions()

> `static` **manageSubscriptions**(): `Promise`\<`void`\>


Opens the platform-specific subscription management page.

###### Returns

`Promise`\<`void`\>

##### order()

> `static` **order**(`offer`): `Promise`\<`void`\>


Order a product with an offer.

###### Parameters

###### offer

[`IapticOffer`](#iapticoffer)

The offer to order

###### Returns

`Promise`\<`void`\>

###### Example

```typescript
const offer = IapticRN.getProduct('premium_monthly')?.offers[0];
if (offer) {
  try {
    await IapticRN.order(offer);
    console.log('Purchase started successfully');
  } catch (error) {
    console.error('Purchase failed:', error);
  }
}
```

##### presentSubscriptionView()

> `static` **presentSubscriptionView**(): `void`


Present a subscription comparison view with product cards and feature grid

###### Returns

`void`

###### Examples

```typescript
// Show subscription view with feature labels
IapticRN.presentSubscriptionView({
  entitlementLabels: {
    premium: 'Premium Content',
    adfree: 'Ad-Free Experience',
    downloads: 'Unlimited Downloads'
  }
});
```

```typescript
// Customize the appearance
IapticRN.presentSubscriptionView({
  entitlementLabels: {...},
  styles: {
    productCard: {
      backgroundColor: '#f8f9fa',
      borderWidth: 1,
      borderColor: '#dee2e6'
    },
    ctaButton: {
      backgroundColor: '#4CAF50'
    }
  }
});
```

###### Note

This is a singleton component - render it once at your root component:
```tsx
// In your App.tsx
export default function App() {
  return (
    <>
      <MainComponent />
      <IapticSubscriptionView />
    </>
  );
}
```

##### removeAllEventListeners()

> `static` **removeAllEventListeners**(`eventType`?): `void`


Remove all event listeners for a specific event type
If no event type is specified, removes all listeners for all events

###### Parameters

###### eventType?

[`IapticEventType`](#iapticeventtype)

Optional event type to remove listeners for

###### Returns

`void`

##### restorePurchases()

> `static` **restorePurchases**(`progressCallback`): `Promise`\<`number`\>


Restore purchases from the Store.

###### Parameters

###### progressCallback

(`processed`, `total`) => `void`

Callback function that will be called with the progress of the restore operation
                          - An initial call with -1, 0 when the operation starts.
                          - Subsequent calls are with the current progress (processed, total).
                          - The final call will have processed === total, you know the operation is complete.

###### Returns

`Promise`\<`number`\>

The number of purchases restored

###### Example

```typescript
// Restore purchases with progress updates
const numRestored = await IapticRN.restorePurchases((processed, total) => {
  console.log(`Processed ${processed} of ${total} purchases`);
});
```

##### setApplicationUsername()

> `static` **setApplicationUsername**(`username`): `Promise`\<`void`\>


Set the application username for the iaptic service.

This is used to track which user is making the purchase and associate it with the user's account.

- On iOS, the application username is also added as an appAccountToken in the form of a UUID formatted MD5 (md5UUID).
- On Android, the application username is added as an obfuscatedAccountIdAndroid in the form of a 64 characters string (md5).

Don't forget to update the username in the app service if the user changes (login/logout).

###### Parameters

###### username

`undefined` | `string`

###### Returns

`Promise`\<`void`\>

###### Examples

```typescript
IapticRN.setApplicationUsername('user_123');
```

```typescript
IapticRN.setApplicationUsername(undefined);
```

##### setLocale()

> `static` **setLocale**(`code`, `fallbackCode`): `void`


Set the current locale for Iaptic provided components and error messages.

It's automatically set to the device's language, but you can override it.

###### Parameters

###### code

`string`

The language code

###### fallbackCode

`string` = `'en'`

###### Returns

`void`

###### Example

```typescript
IapticRN.setLocale('fr');
```

##### setProductDefinitions()

> `static` **setProductDefinitions**(`productDefinitions`): `void`


Add product definitions to the product catalog.

Entitlements define what features/content a product unlocks. They can be shared
across multiple products (e.g. a subscription and lifetime purchase both granting "premium" access).

###### Parameters

###### productDefinitions

[`IapticProductDefinition`](#iapticproductdefinition)[]

###### Returns

`void`

###### Examples

```typescript
IapticRN.setProductDefinitions([
  { 
    id: 'premium_monthly',
    type: 'paid subscription',
    entitlements: ['premium'] // Unlocks premium features
  },
  {
    id: 'dark_theme',
    type: 'non consumable',
    entitlements: ['dark_theme'] // Unlocks visual feature
  }
]);
```

```typescript
IapticRN.setProductDefinitions([
  { id: 'coins_100', type: 'consumable', tokenType: 'coins', tokenValue: 100 },
  { id: 'coins_500', type: 'consumable', tokenType: 'coins', tokenValue: 500 },
]);
```

```typescript
// Define a subscription and consumable product
IapticRN.setProductDefinitions([
  {
    id: 'premium_monthly',
    type: 'paid subscription',
    entitlements: ['premium'],
  },
  {
    id: 'coins_1000',
    type: 'consumable',
    tokenType: 'coins',
    tokenValue: 1000,
  }
]);

##### setVerbosity()

> `static` **setVerbosity**(`verbosity`): `void`


Set the verbosity level for the iaptic service.

###### Parameters

###### verbosity

[`IapticVerbosity`](#iapticverbosity)

###### Returns

`void`

###### Example

```typescript
IapticRN.setVerbosity(IapticLoggerVerbosityLevel.DEBUG);
```

***

### IapticTokensManager


Simple token balance manager that uses localStorage to store transactions.

To do this, this class the list of all transactions and their corresponding amounts.

When a transaction is added, it is added to the list.
When a transaction is removed, it is removed from the list.

The balance is the sum of all the amounts in the list.

#### See

 - IapticProductDefinition.tokenType
 - IapticProductDefinition.tokenValue

#### Example

```typescript
const tokensManager = new TokensManager(iaptic);
// ... tokensManager is now tracking consumable purchases that have a tokenType defined.
const balance = tokensManager.getBalance('coin');
```

#### Constructors

##### new IapticTokensManager()

> **new IapticTokensManager**(`consumePurchases`): [`IapticTokensManager`](#iaptictokensmanager)


###### Parameters

###### consumePurchases

`boolean` = `true`

###### Returns

[`IapticTokensManager`](#iaptictokensmanager)

#### Methods

##### addTransaction()

> **addTransaction**(`transactionId`, `type`, `amount`): `Promise`\<`void`\>


Add a transaction to the map and persist it

###### Parameters

###### transactionId

`string`

Unique identifier for the transaction

###### type

`string`

Type of token (e.g., 'gems', 'coins', 'credits')

###### amount

`number`

Number of tokens earned (positive) or spent (negative)

###### Returns

`Promise`\<`void`\>

##### getAllBalances()

> **getAllBalances**(): `Map`\<`string`, `number`\>


Get all balances as a map of token type to amount

###### Returns

`Map`\<`string`, `number`\>

##### getBalance()

> **getBalance**(`tokenType`): `number`


Get balance for a specific token type

###### Parameters

###### tokenType

`string`

###### Returns

`number`

##### getTransactions()

> **getTransactions**(`tokenType`?): `TokenTransaction`[]


Get transaction history for a specific token type

###### Parameters

###### tokenType?

`string`

###### Returns

`TokenTransaction`[]

##### hasTransaction()

> **hasTransaction**(`transactionId`): `boolean`


Helper method to check if we've already processed a transaction
This can be used before processing a purchase to avoid double-counting

###### Parameters

###### transactionId

`string`

###### Returns

`boolean`

##### removeTransaction()

> **removeTransaction**(`transactionId`): `Promise`\<`void`\>


Remove a transaction and update storage

###### Parameters

###### transactionId

`string`

###### Returns

`Promise`\<`void`\>

***

### IapticUtils


Utility methods for users of the iaptic library.

#### Constructors

##### new IapticUtils()

> **new IapticUtils**(): [`IapticUtils`](#iapticutils)

###### Returns

[`IapticUtils`](#iapticutils)

#### Methods

##### cheapestOffer()

> **cheapestOffer**(`product`): [`IapticOffer`](#iapticoffer)


###### Parameters

###### product

[`IapticProduct`](#iapticproduct)

###### Returns

[`IapticOffer`](#iapticoffer)

##### fixedRecurrenceMode()

> **fixedRecurrenceMode**(`pricingPhase`): `undefined` \| [`IapticRecurrenceMode`](#iapticrecurrencemode)


FINITE_RECURRING with billingCycles=1 is like NON_RECURRING
FINITE_RECURRING with billingCycles=0 is like INFINITE_RECURRING

###### Parameters

###### pricingPhase

[`IapticPricingPhase`](#iapticpricingphase)

###### Returns

`undefined` \| [`IapticRecurrenceMode`](#iapticrecurrencemode)

##### formatBillingCycle()

> **formatBillingCycle**(`pricingPhase`): `string`


Generate a localized version of the billing cycle in a pricing phase.

For supported languages, check Locales.

Example outputs:

- "3x 1 month": for `FINITE_RECURRING`, 3 cycles, period "P1M"
- "for 1 year": for `NON_RECURRING`, period "P1Y"
- "every week": for `INFINITE_RECURRING, period "P1W"

###### Parameters

###### pricingPhase

[`IapticPricingPhase`](#iapticpricingphase)

###### Returns

`string`

###### Example

```typescript
IapticRN.utils.formatBillingCycle(offer.pricingPhases[0])
```

##### formatCurrency()

> **formatCurrency**(`amountMicros`, `currency`): `string`


Format a currency amount from micros with proper localization

###### Parameters

###### amountMicros

`number`

Amount in micros (1/1,000,000 of currency unit)

###### currency

`string`

ISO 4217 currency code (e.g., 'USD', 'EUR')

###### Returns

`string`

Formatted currency string

###### Example

```ts
Utils.formatCurrency(1990000, 'USD') // Returns "$1.99"
Utils.formatCurrency(1000000, 'EUR') // Returns "€1"
```

##### formatDuration()

> **formatDuration**(`iso`, `count`, `includeCount`?): `string`


###### Parameters

###### iso

`` `P${number}D` `` | `` `P${number}W` `` | `` `P${number}M` `` | `` `P${number}Y` ``

###### count

`number`

###### includeCount?

`boolean`

###### Returns

`string`

##### getBillingCycleTemplate()

> **getBillingCycleTemplate**(`cycles`, `duration`): `string`


Format a simple ISO 8601 duration to plain English.

This works for non-composite durations, i.e. that have a single unit with associated amount. For example: "P1Y" or "P3W".

See https://en.wikipedia.org/wiki/ISO_8601#Durations

This method is provided as a utility for getting simple things done quickly. In your application, you'll probably
need some other method that supports multiple locales.

###### Parameters

###### cycles

`number`

###### duration

`string`

###### Returns

`string`

The duration in plain english. Example: "1 year" or "3 weeks".

formatDurationEN(iso?: string, options?: { omitOne?: boolean }): string {
 if (!iso) return '';
 const l = iso.length;
 const n = iso.slice(1, l - 1);
 if (n === '1') {
   if (options?.omitOne) {
     return ({ 'D': 'day', 'W': 'week', 'M': 'month', 'Y': 'year', }[iso[l - 1]]) || iso[l - 1];
   }
   else {
     return ({ 'D': '1 day', 'W': '1 week', 'M': '1 month', 'Y': '1 year', }[iso[l - 1]]) || iso[l - 1];
   }
 }
 else {
   const u = ({ 'D': 'days', 'W': 'weeks', 'M': 'months', 'Y': 'years', }[iso[l - 1]]) || iso[l - 1];
   return `${n} ${u}`;
 }
}

##### getBillingCycleTemplateInfinite()

> **getBillingCycleTemplateInfinite**(`cycles`, `duration`): `string`


###### Parameters

###### cycles

`number`

###### duration

`string`

###### Returns

`string`

##### getBillingCycleTemplateNonRecurring()

> **getBillingCycleTemplateNonRecurring**(`cycles`, `duration`): `string`


###### Parameters

###### cycles

`number`

###### duration

`string`

###### Returns

`string`

##### monthlyPriceMicros()

> **monthlyPriceMicros**(`offer`): `number`


###### Parameters

###### offer

[`IapticOffer`](#iapticoffer)

###### Returns

`number`

## Interfaces

### IapticConfig


Configuration for Iaptic React Native SDK

#### Extends

- `IapticStoreConfig`

#### Properties

##### applicationUsername?

> `optional` **applicationUsername**: `string`


##### appName

> **appName**: `string`


###### Inherited from

`IapticStoreConfig.appName`

##### baseUrl?

> `optional` **baseUrl**: `string`


The base URL of the iaptic validator

###### Inherited from

`IapticStoreConfig.baseUrl`

##### iosBundleId?

> `optional` **iosBundleId**: `string`


###### Inherited from

`IapticStoreConfig.iosBundleId`

##### products?

> `optional` **products**: [`IapticProductDefinition`](#iapticproductdefinition)[]


##### publicKey

> **publicKey**: `string`


###### Inherited from

`IapticStoreConfig.publicKey`

##### showAlerts?

> `optional` **showAlerts**: `boolean`


Disable alert by setting this to false.

By default, IapticRN will display relevant alerts to the user when something goes wrong.

Default is true.

###### Inherited from

`IapticStoreConfig.showAlerts`

##### verbosity?

> `optional` **verbosity**: [`IapticVerbosity`](#iapticverbosity)


***

### IapticEventMap


Event argument types mapped to their event names

#### Properties

##### consumable.purchased

> **purchased**: \[[`IapticVerifiedPurchase`](#iapticverifiedpurchase)\]


##### consumable.refunded

> **refunded**: \[[`IapticVerifiedPurchase`](#iapticverifiedpurchase)\]


##### error

> **error**: \[[`IapticError`](#iapticerror)\]


##### nonConsumable.owned

> **owned**: \[[`IapticVerifiedPurchase`](#iapticverifiedpurchase)\]


##### nonConsumable.unowned

> **unowned**: \[[`IapticVerifiedPurchase`](#iapticverifiedpurchase)\]


##### nonConsumable.updated

> **updated**: \[[`IapticVerifiedPurchase`](#iapticverifiedpurchase)\]


##### pendingPurchase.updated

> **updated**: \[[`IapticPendingPurchase`](#iapticpendingpurchase)\]


##### products.updated

> **updated**: \[[`IapticProduct`](#iapticproduct)[]\]


##### purchase.updated

> **updated**: \[[`IapticVerifiedPurchase`](#iapticverifiedpurchase)\]


##### subscription.cancelled

> **cancelled**: \[[`IapticVerifiedPurchase`](#iapticverifiedpurchase)\]


##### subscription.changed

> **changed**: \[[`IapticVerifiedPurchase`](#iapticverifiedpurchase)\]


##### subscription.expired

> **expired**: \[[`IapticVerifiedPurchase`](#iapticverifiedpurchase)\]


##### subscription.renewed

> **renewed**: \[[`IapticVerifiedPurchase`](#iapticverifiedpurchase)\]


##### subscription.updated

> **updated**: \[[`IapticSubscriptionReason`](#iapticsubscriptionreason), [`IapticVerifiedPurchase`](#iapticverifiedpurchase)\]


***

### IapticLocale


List of keys a locale must provide.

#### External

IapticLocale

#### Properties

##### ActiveSubscription\_ManageBilling

> **ActiveSubscription\_ManageBilling**: `string`


Manage Billing

##### ActiveSubscription\_ManageSubscriptions

> **ActiveSubscription\_ManageSubscriptions**: `string`


Manage Subscriptions

##### ActiveSubscription\_Status\_Active

> **ActiveSubscription\_Status\_Active**: `string`


Active

##### ActiveSubscription\_Status\_Expired

> **ActiveSubscription\_Status\_Expired**: `string`


Expired

##### ActiveSubscription\_Tag\_Retry

> **ActiveSubscription\_Tag\_Retry**: `string`


Payment Retry

##### ActiveSubscription\_Tag\_Trial

> **ActiveSubscription\_Tag\_Trial**: `string`


Trial Period

##### ActiveSubscription\_WillCancel

> **ActiveSubscription\_WillCancel**: `string`


Will be cancelled on {0} at {1}

##### ActiveSubscription\_WillRenew

> **ActiveSubscription\_WillRenew**: `string`


Auto-renewing on {0} at {1}

##### BillingCycle\_Finite

> **BillingCycle\_Finite**: `string`


{cycles}x {duration}

##### BillingCycle\_Infinite

> **BillingCycle\_Infinite**: `string`


every {duration}

##### BillingCycle\_NonRecurring

> **BillingCycle\_NonRecurring**: `string`


for {duration}

##### DateFormatter\_Date

> **DateFormatter\_Date**: `string`


"Date"

##### DateFormatter\_Time

> **DateFormatter\_Time**: `string`


"Time"

##### Duration\_D\_plural

> **Duration\_D\_plural**: `string`


days

##### Duration\_D\_singular

> **Duration\_D\_singular**: `string`


day

##### Duration\_M\_plural

> **Duration\_M\_plural**: `string`


months

##### Duration\_M\_singular

> **Duration\_M\_singular**: `string`


month

##### Duration\_W\_plural

> **Duration\_W\_plural**: `string`


weeks

##### Duration\_W\_singular

> **Duration\_W\_singular**: `string`


week

##### Duration\_Y\_plural

> **Duration\_Y\_plural**: `string`


years

##### Duration\_Y\_singular

> **Duration\_Y\_singular**: `string`


year

##### EntitlementGrid\_Checkmark

> **EntitlementGrid\_Checkmark**: `string`


"✓"

##### Error

> **Error**: `string`


Error

##### IapticError\_6777001

> **IapticError\_6777001**: `string`


Failed to initialize the in-app purchase library

##### IapticError\_6777002

> **IapticError\_6777002**: `string`


Failed to load in-app products metadata

##### IapticError\_6777003

> **IapticError\_6777003**: `string`


Failed to make a purchase

##### IapticError\_6777004

> **IapticError\_6777004**: `string`


Failed to load the purchase receipt

##### IapticError\_6777005

> **IapticError\_6777005**: `string`


Client is not allowed to issue the request

##### IapticError\_6777006

> **IapticError\_6777006**: `string`


Purchase flow has been cancelled by user

##### IapticError\_6777007

> **IapticError\_6777007**: `string`


Something is suspicious about a purchase

##### IapticError\_6777008

> **IapticError\_6777008**: `string`


The user is not allowed to make a payment

##### IapticError\_6777010

> **IapticError\_6777010**: `string`


Unknown error

##### IapticError\_6777011

> **IapticError\_6777011**: `string`


Failed to refresh the purchase receipt

##### IapticError\_6777012

> **IapticError\_6777012**: `string`


The product identifier is invalid

##### IapticError\_6777013

> **IapticError\_6777013**: `string`


Cannot finalize a transaction or acknowledge a purchase

##### IapticError\_6777014

> **IapticError\_6777014**: `string`


Failed to communicate with the server

##### IapticError\_6777015

> **IapticError\_6777015**: `string`


Subscriptions are not available

##### IapticError\_6777016

> **IapticError\_6777016**: `string`


Purchase information is missing token

##### IapticError\_6777017

> **IapticError\_6777017**: `string`


Verification of store data failed

##### IapticError\_6777018

> **IapticError\_6777018**: `string`


Bad response from the server

##### IapticError\_6777019

> **IapticError\_6777019**: `string`


Failed to refresh the store

##### IapticError\_6777020

> **IapticError\_6777020**: `string`


Payment has expired

##### IapticError\_6777021

> **IapticError\_6777021**: `string`


Failed to download the content

##### IapticError\_6777022

> **IapticError\_6777022**: `string`


Failed to update a subscription

##### IapticError\_6777023

> **IapticError\_6777023**: `string`


The requested product is not available in the store

##### IapticError\_6777024

> **IapticError\_6777024**: `string`


The user has not allowed access to Cloud service information

##### IapticError\_6777025

> **IapticError\_6777025**: `string`


The device could not connect to the network

##### IapticError\_6777026

> **IapticError\_6777026**: `string`


The user has revoked permission to use this cloud service

##### IapticError\_6777027

> **IapticError\_6777027**: `string`


The user has not yet acknowledged Apple's privacy policy

##### IapticError\_6777028

> **IapticError\_6777028**: `string`


The app is attempting to use a property without required entitlement

##### IapticError\_6777029

> **IapticError\_6777029**: `string`


The offer identifier is invalid

##### IapticError\_6777030

> **IapticError\_6777030**: `string`


The price specified in App Store Connect is no longer valid

##### IapticError\_6777031

> **IapticError\_6777031**: `string`


The signature in a payment discount is not valid

##### IapticError\_6777032

> **IapticError\_6777032**: `string`


Parameters are missing in a payment discount

##### IapticError\_6778003

> **IapticError\_6778003**: `string`


Subscription has expired

##### IapticError\_StoreAlreadyInitialized

> **IapticError\_StoreAlreadyInitialized**: `string`


IapticRN.store is already initialized, call IapticRN.destroy() first

##### IapticError\_StoreNotInitialized

> **IapticError\_StoreNotInitialized**: `string`


IapticRN.store is not initialized, call IapticRN.initialize() first

##### IapticError\_UnsupportedPlatform

> **IapticError\_UnsupportedPlatform**: `string`


Unsupported platform

##### IapticRN\_initialized\_called

> **IapticRN\_initialized\_called**: `string`


IapticRN.initialize() can only be called once

##### ProductPrice\_StartingAt

> **ProductPrice\_StartingAt**: `string`


"starting at {0} per month" - {0} will be replaced with price component

##### ProgrammingError

> **ProgrammingError**: `string`


Programming Error

##### PurchaseError\_E\_ALREADY\_OWNED

> **PurchaseError\_E\_ALREADY\_OWNED**: `string`


This item has already been purchased.

##### PurchaseError\_E\_BILLING\_RESPONSE\_JSON\_PARSE\_ERROR

> **PurchaseError\_E\_BILLING\_RESPONSE\_JSON\_PARSE\_ERROR**: `string`


Failed to parse the billing response.

##### PurchaseError\_E\_DEFERRED\_PAYMENT

> **PurchaseError\_E\_DEFERRED\_PAYMENT**: `string`


The payment has been deferred.

##### PurchaseError\_E\_DEVELOPER\_ERROR

> **PurchaseError\_E\_DEVELOPER\_ERROR**: `string`


An error occurred in the application.

##### PurchaseError\_E\_IAP\_NOT\_AVAILABLE

> **PurchaseError\_E\_IAP\_NOT\_AVAILABLE**: `string`


In-app purchases are not available.

##### PurchaseError\_E\_INTERRUPTED

> **PurchaseError\_E\_INTERRUPTED**: `string`


The operation was interrupted.

##### PurchaseError\_E\_ITEM\_UNAVAILABLE

> **PurchaseError\_E\_ITEM\_UNAVAILABLE**: `string`


The requested product is not available.

##### PurchaseError\_E\_NETWORK\_ERROR

> **PurchaseError\_E\_NETWORK\_ERROR**: `string`


A network error occurred.

##### PurchaseError\_E\_NOT\_ENDED

> **PurchaseError\_E\_NOT\_ENDED**: `string`


The transaction has not been ended.

##### PurchaseError\_E\_NOT\_PREPARED

> **PurchaseError\_E\_NOT\_PREPARED**: `string`


The purchase cannot be completed because it has not been prepared.

##### PurchaseError\_E\_RECEIPT\_FAILED

> **PurchaseError\_E\_RECEIPT\_FAILED**: `string`


Failed to validate receipt.

##### PurchaseError\_E\_RECEIPT\_FINISHED\_FAILED

> **PurchaseError\_E\_RECEIPT\_FINISHED\_FAILED**: `string`


Failed to finish the transaction.

##### PurchaseError\_E\_REMOTE\_ERROR

> **PurchaseError\_E\_REMOTE\_ERROR**: `string`


A remote error occurred.

##### PurchaseError\_E\_SERVICE\_ERROR

> **PurchaseError\_E\_SERVICE\_ERROR**: `string`


The service returned an error.

##### PurchaseError\_E\_UNKNOWN

> **PurchaseError\_E\_UNKNOWN**: `string`


An unknown error occurred.

##### PurchaseError\_E\_USER\_CANCELLED

> **PurchaseError\_E\_USER\_CANCELLED**: `string`


The user cancelled the purchase.

##### PurchaseError\_E\_USER\_ERROR

> **PurchaseError\_E\_USER\_ERROR**: `string`


An error occurred in the application.

##### PurchaseError\_title

> **PurchaseError\_title**: `string`


Purchase Error #{0}

##### SubscriptionView\_Back

> **SubscriptionView\_Back**: `string`


"Back"

##### SubscriptionView\_BillingOptions

> **SubscriptionView\_BillingOptions**: `string`


"Billing Options"

##### SubscriptionView\_Cancel

> **SubscriptionView\_Cancel**: `string`


Cancel

##### SubscriptionView\_ChangePlan

> **SubscriptionView\_ChangePlan**: `string`


"Change Plan"

##### SubscriptionView\_Close

> **SubscriptionView\_Close**: `string`


"Close"

##### SubscriptionView\_Continue

> **SubscriptionView\_Continue**: `string`


"Continue"

##### SubscriptionView\_CurrentPlan

> **SubscriptionView\_CurrentPlan**: `string`


"Current Plan"

##### SubscriptionView\_CurrentSubscription

> **SubscriptionView\_CurrentSubscription**: `string`


"Your Subscription"

##### SubscriptionView\_Includes

> **SubscriptionView\_Includes**: `string`


"Includes:"

##### SubscriptionView\_PleaseWait

> **SubscriptionView\_PleaseWait**: `string`


Please wait...

##### SubscriptionView\_Processing

> **SubscriptionView\_Processing**: `string`


"Processing..."

##### SubscriptionView\_ProcessingStatus\_cancelled

> **SubscriptionView\_ProcessingStatus\_cancelled**: `string`


"Cancelled"

##### SubscriptionView\_ProcessingStatus\_completed

> **SubscriptionView\_ProcessingStatus\_completed**: `string`


Completed

##### SubscriptionView\_ProcessingStatus\_finishing

> **SubscriptionView\_ProcessingStatus\_finishing**: `string`


Finalizing purchase...

##### SubscriptionView\_ProcessingStatus\_processing

> **SubscriptionView\_ProcessingStatus\_processing**: `string`


Processing...

##### SubscriptionView\_ProcessingStatus\_purchasing

> **SubscriptionView\_ProcessingStatus\_purchasing**: `string`


Purchasing...

##### SubscriptionView\_ProcessingStatus\_validating

> **SubscriptionView\_ProcessingStatus\_validating**: `string`


Validating receipt...

##### SubscriptionView\_ProcessingTitle

> **SubscriptionView\_ProcessingTitle**: `string`


Purchasing...

##### SubscriptionView\_RestoreProgress

> **SubscriptionView\_RestoreProgress**: `string`


"Processed {0} of {1} purchases"

##### SubscriptionView\_RestorePurchase

> **SubscriptionView\_RestorePurchase**: `string`


"Restore Purchases"

##### SubscriptionView\_RestoringTitle

> **SubscriptionView\_RestoringTitle**: `string`


"Restoring..."

##### SubscriptionView\_TermsLink

> **SubscriptionView\_TermsLink**: `string`


"Terms and Conditions"

##### SubscriptionView\_TermsPrefix

> **SubscriptionView\_TermsPrefix**: `string`


"By subscribing, you agree to our"

##### SubscriptionView\_Title

> **SubscriptionView\_Title**: `string`


"Choose Your Plan"

##### SubscriptionView\_UpdatePlan

> **SubscriptionView\_UpdatePlan**: `string`


"Update Plan"

##### UnknownError

> **UnknownError**: `string`


An unknown error occurred.

##### UnknownError\_title

> **UnknownError\_title**: `string`


Unknown Error

##### ValidationError

> **ValidationError**: `string`


Receipt Validation Error

##### ValidationError\_MissingTransactionId

> **ValidationError\_MissingTransactionId**: `string`


Transaction ID is missing

***

### IapticOffer


Pricing offer for an In-App Product

#### Properties

##### id

> **id**: `string`


Offer identifier

##### offerToken?

> `optional` **offerToken**: `string`


Offer token (if any)

##### offerType

> **offerType**: `"Default"` \| `"Introductory"` \| `"Subscription"`


Type of offer

##### platform

> **platform**: [`IapticPurchasePlatform`](#iapticpurchaseplatform)


Platform of the product

##### pricingPhases

> **pricingPhases**: [`IapticPricingPhase`](#iapticpricingphase)[]


Pricing phases for this offer

##### productGroup?

> `optional` **productGroup**: `null` \| `string`


Subscription group (if any)

##### productId

> **productId**: `string`


Product identifier

##### productType?

> `optional` **productType**: [`IapticProductType`](#iapticproducttype)


Type of product (subscription, consumable, etc.)

***

### IapticPendingPurchase


Keep the state of a potential purchase in progress

#### Properties

##### offerId?

> `optional` **offerId**: `string`


Identifier of the offer that is being purchased

##### productId

> **productId**: `string`


Product identifier

##### status

> **status**: [`IapticPendingPurchaseState`](#iapticpendingpurchasestate)


Status of the purchase

***

### IapticPricingPhase


Description of a phase for the pricing of a purchase.

#### See

[IapticOffer.pricingPhases](#pricingphases)

#### Properties

##### billingCycles?

> `optional` **billingCycles**: `number`


Number of recurrence cycles (if recurrenceMode is FINITE_RECURRING)

##### billingPeriod?

> `optional` **billingPeriod**: `string`


ISO 8601 duration of the period (https://en.wikipedia.org/wiki/ISO_8601#Durations)

##### currency?

> `optional` **currency**: `string`


Currency code

##### paymentMode?

> `optional` **paymentMode**: [`IapticPaymentMode`](#iapticpaymentmode)


Payment mode for the pricing phase ("PayAsYouGo", "UpFront", or "FreeTrial")

##### price

> **price**: `string`


##### priceMicros

> **priceMicros**: `number`


Price in micro-units (divide by 1000000 to get numeric price)

##### recurrenceMode?

> `optional` **recurrenceMode**: [`IapticRecurrenceMode`](#iapticrecurrencemode)


Type of recurring payment

***

### IapticProduct


Product metadata from the store

#### Properties

##### countryCode?

> `optional` **countryCode**: `string`


Country code of the product

##### description?

> `optional` **description**: `string`


Description of the product provided by the store

##### entitlements?

> `optional` **entitlements**: `string`[]


Entitlements this product will give to the user, can be used for subscription and non-consumable products.

Use iapticRN.checkEntitlement("my-entitlement") to check if the user owns any product that provides this entitlement.

##### id

> **id**: `string`


Product identifier on the store (unique per platform)

##### offers

> **offers**: [`IapticOffer`](#iapticoffer)[]


List of offers available for this product

##### platform

> **platform**: [`IapticPurchasePlatform`](#iapticpurchaseplatform)


Platform of the product

##### title?

> `optional` **title**: `string`


Title of the product provided by the store

##### tokenType?

> `optional` **tokenType**: `string`


Type of token this product will give to the user for consumable products.

For example: "coin", "gem", "silver", etc.

##### tokenValue?

> `optional` **tokenValue**: `number`


Amount of tokens this product will give to the user for consumable products.

###### Example

```typescript
{ id: 'coins_100', type: 'consumable', tokenType: 'coin', tokenValue: 100 },
```

##### type

> **type**: [`IapticProductType`](#iapticproducttype)


Type of product (subscription, consumable, etc.)

***

### IapticProductDefinition


Interface defining an in-app purchase product

#### Properties

##### entitlements?

> `optional` **entitlements**: `string`[]


Entitlements this product will give to the user, can be used for subscription and non-consumable products.

Use iapticRN.checkEntitlement("my-entitlement") to check if the user owns any product that provides this entitlement.

##### id

> **id**: `string`


Unique identifier of the product

##### tokenType?

> `optional` **tokenType**: `string`


Type of token this product will give to the user for consumable products.

For example: "coin", "gem", "silver", etc.

##### tokenValue?

> `optional` **tokenValue**: `number`


Amount of tokens this product will give to the user for consumable products.

###### Example

```typescript
{ id: 'coins_100', type: 'consumable', tokenType: 'coin', tokenValue: 100 },
```

##### type

> **type**: [`IapticProductType`](#iapticproducttype)


Type of the product (subscription, consumable, or non-consumable)

***

### IapticProductListProps


ProductList component

#### Properties

##### onOrder()

> **onOrder**: (`offer`) => `void`


Handlers when the user request purchasing a given offer

###### Parameters

###### offer

[`IapticOffer`](#iapticoffer)

###### Returns

`void`

##### productIds?

> `optional` **productIds**: `string`[]


Filter the products to display (optional)

##### styles?

> `optional` **styles**: `object`


Custom styles

###### button?

> `optional` **button**: `ViewStyle` \| `TextStyle`

###### buttonDisabled?

> `optional` **buttonDisabled**: `ViewStyle` \| `TextStyle`

###### buttonText?

> `optional` **buttonText**: `ViewStyle` \| `TextStyle`

###### container?

> `optional` **container**: `ViewStyle` \| `TextStyle`

###### offerContainer?

> `optional` **offerContainer**: `ViewStyle` \| `TextStyle`

###### offersContainer?

> `optional` **offersContainer**: `ViewStyle` \| `TextStyle`

###### pricingPhasesText?

> `optional` **pricingPhasesText**: `ViewStyle` \| `TextStyle`

###### productContainer?

> `optional` **productContainer**: `ViewStyle` \| `TextStyle`

###### productTitle?

> `optional` **productTitle**: `ViewStyle` \| `TextStyle`

***

### IapticProductListStyles


#### Properties

##### button?

> `optional` **button**: `ViewStyle`


##### buttonDisabled?

> `optional` **buttonDisabled**: `ViewStyle`


##### buttonText?

> `optional` **buttonText**: `TextStyle`


##### container?

> `optional` **container**: `ViewStyle`


##### offerContainer?

> `optional` **offerContainer**: `ViewStyle`


##### offersContainer?

> `optional` **offersContainer**: `ViewStyle`


##### pricingPhasesText?

> `optional` **pricingPhasesText**: `TextStyle`


##### productContainer?

> `optional` **productContainer**: `ViewStyle`


##### productTitle?

> `optional` **productTitle**: `TextStyle`


***

### IapticSubscriptionViewProps


Component props for SubscriptionView
 SubscriptionViewProps

#### Example

```ts
// Basic usage example:
<SubscriptionView
  visible={true}
  onClose={() => setIsVisible(false)}
  entitlementLabels={{ premium: 'Premium Features' }}
  styles={{ productCard: { backgroundColor: '#FFF' }}}
/>
```

#### Properties

##### entitlementLabels?

> `optional` **entitlementLabels**: `Record`\<`string`, \{ `detail`: `string`; `label`: `string`; \}\>


Localized descriptions for each entitlement/feature

###### Default

```ts
{}
```

###### Example

```ts
{ 
   *   premium: { label: 'Premium Features', detail: 'Unlimited Downloads' },
   *   adFree: { label: 'Ad-Free', detail: 'Remove All Ads While Watching Videos' }
   * }
```

###### See

 - IapticRN.listEntitlements()
 - IapticProductDefinition.entitlements

##### onClose()?

> `optional` **onClose**: () => `void`


Callback when modal is closed (either via button or backdrop tap)

###### Returns

`void`

###### Example

```ts
onClose={() => console.log('Modal closed')}
```

##### onPurchaseComplete()?

> `optional` **onPurchaseComplete**: () => `void`


Callback when a purchase is complete (you should show a thank you message)

###### Returns

`void`

###### Example

```ts
onPurchaseComplete={() => console.log('Purchase complete')}
```

##### showRestorePurchase?

> `optional` **showRestorePurchase**: `boolean`


Show restore purchases button when there's no active subscription

###### Default

```ts
true
```

##### sortProducts?

> `optional` **sortProducts**: `boolean`


Sort products by number of entitlements (most first)

###### Default

```ts
true
```

###### Example

```ts
sortProducts={false} // Disable automatic sorting
```

##### styles?

> `optional` **styles**: `Partial`\<[`IapticSubscriptionViewStyles`](#iapticsubscriptionviewstyles)\>


Custom styles for component elements (merges with defaults)

###### Example

```ts
styles={{
  modalContainer: { backgroundColor: 'rgba(0,0,0,0.8)' },
  ctaButton: { backgroundColor: '#FF3B30' }
}}
```

##### termsUrl?

> `optional` **termsUrl**: `string`


URL to Terms & Conditions (optional)

###### Example

```ts
termsUrl="https://example.com/terms"
```

##### visible?

> `optional` **visible**: `boolean`


Controls visibility of the modal

###### Default

```ts
false
```

###### Example

```ts
<SubscriptionView visible={true} />
```

***

### IapticSubscriptionViewStyles


Style definitions for the SubscriptionView component
 SubscriptionViewStyles

#### Example

```ts
// Basic style override example:
{
  modalContainer: { backgroundColor: 'rgba(0,0,0,0.8)' },
  productTitle: { fontSize: 22, color: '#2C3E50' },
  ctaButton: { backgroundColor: '#4CD964', borderRadius: 14 }
}
```

#### Properties

##### billingOption?

> `optional` **billingOption**: `ViewStyle`


Style for the billing option

###### Style Property

###### Example

```ts
{ paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginHorizontal: 4 }
```

##### billingOptionSelected?

> `optional` **billingOptionSelected**: `ViewStyle`


Style for the selected billing option

###### Style Property

###### Example

```ts
{ borderColor: '#007AFF', backgroundColor: '#e6f3ff' }
```

##### billingOptionText?

> `optional` **billingOptionText**: `TextStyle`


Style for the billing option text

###### Style Property

###### Example

```ts
{ color: '#333', fontWeight: '500' }
```

##### billingSelector?

> `optional` **billingSelector**: `ViewStyle`


Style for the billing selector container

###### Style Property

###### Example

```ts
{ marginVertical: 16, gap: 8 }
```

##### closeButton?

> `optional` **closeButton**: `ViewStyle`


Style for the close button

###### Style Property

###### Example

```ts
{ padding: 8 }
```

##### closeButtonText?

> `optional` **closeButtonText**: `TextStyle`


Style for the close button text

###### Style Property

###### Example

```ts
{ fontSize: 18, color: '#007AFF' }
```

##### contentContainer?

> `optional` **contentContainer**: `ViewStyle`


Style for the main content container (white card)

###### Style Property

###### Example

```ts
{ backgroundColor: '#F5F5F5', borderTopLeftRadius: 32 }
```

##### ctaButton?

> `optional` **ctaButton**: `ViewStyle`


Style for the CTA button

###### Style Property

###### Example

```ts
{ backgroundColor: '#007AFF', borderRadius: 12, padding: 20, alignItems: 'center', marginTop: 24 }
```

##### ctaButtonDisabled?

> `optional` **ctaButtonDisabled**: `ViewStyle`


Style for the disabled CTA button

###### Style Property

###### Example

```ts
{ backgroundColor: '#999', opacity: 0.7 }
```

##### ctaButtonText?

> `optional` **ctaButtonText**: `TextStyle`


Style for the CTA button text

###### Style Property

###### Example

```ts
{ color: 'white', fontSize: 18, fontWeight: '600' }
```

##### featuresTitle?

> `optional` **featuresTitle**: `TextStyle`


Style for the features title text

###### Style Property

###### Example

```ts
{ fontSize: 16, fontWeight: '600', color: '#1a1a1a', marginVertical: 16 }
```

##### header?

> `optional` **header**: `ViewStyle`


Style for the header container (title + close button row)

###### Style Property

###### Example

```ts
{ paddingHorizontal: 20, marginBottom: 32 }
```

##### modalContainer?

> `optional` **modalContainer**: `ViewStyle`


Style for the outer modal container (covers entire screen)

###### Style Property

###### Example

```ts
{ backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center' }
```

##### productCard?

> `optional` **productCard**: `ViewStyle`


Style for the product card

###### Style Property

###### Example

```ts
{ backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginHorizontal: 8, marginBottom: 8, width: windowWidth * 0.75 }
```

##### productCardSelected?

> `optional` **productCardSelected**: `ViewStyle`


Style for the selected product card

###### Style Property

###### Example

```ts
{ borderWidth: 2, borderColor: '#007AFF' }
```

##### productDescription?

> `optional` **productDescription**: `TextStyle`


Style for the product description text

###### Style Property

###### Example

```ts
{ fontSize: 14, color: '#666', marginBottom: 16 }
```

##### productPrice?

> `optional` **productPrice**: `TextStyle`


Style for the product price text

###### Style Property

###### Example

```ts
{ fontSize: 24, fontWeight: '700', color: '#007AFF', marginBottom: 8 }
```

##### productPriceSentence?

> `optional` **productPriceSentence**: `TextStyle`


Style for the product price sentence text

###### Style Property

###### Example

```ts
{ fontSize: 16, color: '#666', marginBottom: 8 }
```

##### productTitle?

> `optional` **productTitle**: `TextStyle`


Style for the product title text

###### Style Property

###### Example

```ts
{ fontSize: 20, fontWeight: '600', marginBottom: 8, color: '#1a1a1a' }
```

##### title?

> `optional` **title**: `TextStyle`


Style for the title text

###### Style Property

###### Example

```ts
{ fontSize: 24, fontWeight: '600', color: '#1a1a1a' }
```

***

### IapticVerifiedPurchase


Purchase verified by the receipt validator.

#### Properties

##### cancelationReason?

> `optional` **cancelationReason**: [`IapticCancelationReason`](#iapticcancelationreason)


The reason a subscription or purchase was cancelled.

##### discountId?

> `optional` **discountId**: `string`


Identifier of the discount currently applied to a purchase.

Correspond to the product's offerId. When undefined it means there is only one offer for the given product.

##### expiryDate?

> `optional` **expiryDate**: `number`


Date of expiry for a subscription.

##### ~~id~~

> **id**: `string`


Product identifier

###### Deprecated

Use `productId` instead

##### isAcknowledged?

> `optional` **isAcknowledged**: `boolean`


True when a purchase has been acknowledged

##### isBillingRetryPeriod?

> `optional` **isBillingRetryPeriod**: `boolean`


True when a subscription a subscription is in the grace period after a failed attempt to collect payment

##### isExpired?

> `optional` **isExpired**: `boolean`


True when a subscription is expired.

##### isIntroPeriod?

> `optional` **isIntroPeriod**: `boolean`


True when a subscription is in introductory pricing period

##### isTrialPeriod?

> `optional` **isTrialPeriod**: `boolean`


True when a subscription is in trial period

##### lastRenewalDate?

> `optional` **lastRenewalDate**: `number`


Last time a subscription was renewed.

##### platform?

> `optional` **platform**: [`IapticPurchasePlatform`](#iapticpurchaseplatform)


Platform this purchase was made on

##### priceConsentStatus?

> `optional` **priceConsentStatus**: [`IapticPriceConsentStatus`](#iapticpriceconsentstatus)


Whether or not the user agreed or has been notified of a price change.

##### productId

> **productId**: `string`


Product identifier

##### purchaseDate?

> `optional` **purchaseDate**: `number`


Date of first purchase (timestamp).

##### purchaseId?

> `optional` **purchaseId**: `string`


Purchase identifier (optional)

##### renewalIntent?

> `optional` **renewalIntent**: `"Renew"` \| `"Lapse"`


Whether or not the user intends to let the subscription auto-renew.

Possible values:
- `"Renew"` - The user intends to renew the subscription.
- `"Lapse"` - The user intends to let the subscription expire without renewing.

##### renewalIntentChangeDate?

> `optional` **renewalIntentChangeDate**: `number`


Date the renewal intent was updated by the user.

##### transactionId?

> `optional` **transactionId**: `string`


Identifier of the last transaction (optional)

## Type Aliases

### IapticEventListener()\<T\>

> **IapticEventListener**\<`T`\>: (...`args`) => `void`


Type-safe event listener function

#### Type Parameters

• **T** *extends* [`IapticEventType`](#iapticeventtype)

#### Parameters

##### args

...[`IapticEventMap`](#iapticeventmap)\[`T`\]

#### Returns

`void`

***

### IapticEventType

> **IapticEventType**: `"products.updated"` \| `"purchase.updated"` \| `"subscription.updated"` \| `"subscription.renewed"` \| `"subscription.cancelled"` \| `"subscription.expired"` \| `"subscription.changed"` \| `"pendingPurchase.updated"` \| `"nonConsumable.updated"` \| `"nonConsumable.owned"` \| `"nonConsumable.unowned"` \| `"consumable.purchased"` \| `"consumable.refunded"` \| `"error"`


All possible event types that can be listened to.

- `purchase.updated` - When any purchase is updated (subscription, consumable, non-consumable)
- `subscription.updated` - When a subscription is updated (renewed, cancelled, expired, changed)
- `subscription.renewed` - When a subscription is renewed
- `subscription.cancelled` - When a subscription is cancelled
- `subscription.expired` - When a subscription is expired
- `subscription.changed` - When a subscription is changed
- `pendingPurchase.updated` - When a pending purchase status changes
- `nonConsumable.updated` - When a non-consumable status changes (owned, unowned)
- `nonConsumable.owned` - When a non-consumable purchase is owned
- `nonConsumable.unowned` - When a non-consumable purchase is no longer owned
- `consumable.purchased` - When a consumable purchase is purchased
- `consumable.refunded` - When a consumable purchase is refunded
- `error` - When an error occurs in the background

***

### IapticPaymentMode

> **IapticPaymentMode**: `"PayAsYouGo"` \| `"UpFront"` \| `"FreeTrial"`


Mode of payment

***

### IapticPendingPurchaseState

> **IapticPendingPurchaseState**: `"purchasing"` \| `"processing"` \| `"validating"` \| `"finishing"` \| `"completed"` \| `"cancelled"`


Status of a purchase being processed.

***

### IapticProductType

> **IapticProductType**: `"application"` \| `"paid subscription"` \| `"non renewing subscription"` \| `"consumable"` \| `"non consumable"`


Product types supported by the iaptic validator

***

### IapticRecurrenceMode

> **IapticRecurrenceMode**: `"NON_RECURRING"` \| `"FINITE_RECURRING"` \| `"INFINITE_RECURRING"`


Type of recurring payment

- FINITE_RECURRING: Payment recurs for a fixed number of billing period set in `paymentPhase.cycles`.
- INFINITE_RECURRING: Payment recurs for infinite billing periods unless cancelled.
- NON_RECURRING: A one time charge that does not repeat.

***

### IapticSubscriptionReason

> **IapticSubscriptionReason**: `"renewed"` \| `"cancelled"` \| `"expired"` \| `"changed"`


Reason why a subscription status changed

## Variables

### ERROR\_CODES\_BASE

> `const` **ERROR\_CODES\_BASE**: `6777000` = `6777000`


## Functions

### IapticActiveSubscription()

> **IapticActiveSubscription**(`props`, `deprecatedLegacyContext`?): `ReactNode`


Subscription status component that automatically updates when subscription changes.

#### Parameters

##### props

`ActiveSubscriptionProps`

##### deprecatedLegacyContext?

`any`

**Deprecated**

**See**

[React Docs](https://legacy.reactjs.org/docs/legacy-context.html#referencing-context-in-lifecycle-methods)

#### Returns

`ReactNode`

#### Component

#### Example

```ts
// Full example with entitlements
<ActiveSubscription
  iaptic={iapticInstance}
  entitlementLabels={{
    pro: { label: 'Pro Features', detail: 'Unlimited access to premium features' },
    premium: { label: 'Premium Access', detail: 'Unlimited downloads and priority support' }
  }}
  styles={{
    entitlementTag: { 
      backgroundColor: '#e3f2fd',
      color: '#1976d2'
    }
  }}
/>
```

***

### IapticProductList()

> **IapticProductList**(`__namedParameters`): `Element`


#### Parameters

##### \_\_namedParameters

[`IapticProductListProps`](#iapticproductlistprops)

#### Returns

`Element`

***

### IapticProductPrice()

> **IapticProductPrice**(`__namedParameters`): `null` \| `Element`


#### Parameters

##### \_\_namedParameters

###### product

[`IapticProduct`](#iapticproduct)

###### styles

[`IapticSubscriptionViewStyles`](#iapticsubscriptionviewstyles)

#### Returns

`null` \| `Element`

***

### IapticSubscriptionView()

> **IapticSubscriptionView**(`__namedParameters`): `null` \| `Element`


#### Parameters

##### \_\_namedParameters

[`IapticSubscriptionViewProps`](#iapticsubscriptionviewprops)

#### Returns

`null` \| `Element`
