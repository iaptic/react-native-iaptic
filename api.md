[**react-native-iaptic**](README.md)

***

# react-native-iaptic

Iaptic React Native SDK

Provides in-app purchase functionality with integrated receipt validation
through the Iaptic service.

## Example

```typescript
// 1. Initialize with your configuration
const iaptic = new IapticRN({
  appName: 'com.example.app',
  publicKey: 'YOUR_API_KEY',
  iosBundleId: 'com.yourcompany.app',
});

// 2. Define your products
iaptic.setProductDefinitions([
  {
    id: 'premium_monthly',
    type: 'paid subscription',
    entitlements: ['premium']
  },
  {
    id: 'coins_100',
    type: 'consumable',
    tokenType: 'coins',
    tokenValue: 100
  }
]);

// 3. Initialize connection and load products/purchases
await iaptic.initialize();

// 4. Handle purchases
const offer = iaptic.products.get('premium_monthly')?.offers[0];
if (offer) {
  await iaptic.order(offer); 
}

// 5. Check access
if (iaptic.checkEntitlement('premium')) {
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

### IapticErrorSeverity


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

### IapticLoggerVerbosityLevel


#### Enumeration Members

##### DEBUG

> **DEBUG**: `3`


##### ERROR

> **ERROR**: `0`


##### INFO

> **INFO**: `2`


##### WARN

> **WARN**: `1`


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

## Classes

### IapticConsumables


Manages consumable purchases

Note: This class is currently a placeholder for future implementation
of consumable purchase management functionality.

#### Constructors

##### new IapticConsumables()

> **new IapticConsumables**(`purchases`, `products`, `events`): [`IapticConsumables`](globals.md#iapticconsumables)


Creates a new consumables manager

###### Parameters

###### purchases

[`IapticPurchases`](globals.md#iapticpurchases)

The purchases manager

###### products

[`IapticStoreProducts`](globals.md#iapticstoreproducts)

###### events

`IapticEvents`

###### Returns

[`IapticConsumables`](globals.md#iapticconsumables)

***

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

#### Constructors

##### new IapticError()

> **new IapticError**(`message`, `options`): [`IapticError`](globals.md#iapticerror)


###### Parameters

###### message

`string`

###### options

###### code

[`IapticErrorCode`](globals.md#iapticerrorcode)

###### debugMessage

`string`

###### localizedMessage

`string`

###### localizedTitle

`string`

###### severity

[`IapticErrorSeverity`](globals.md#iapticerrorseverity)

###### status

`number`

###### Returns

[`IapticError`](globals.md#iapticerror)

###### Overrides

`Error.constructor`

#### Properties

##### code

> `readonly` **code**: [`IapticErrorCode`](globals.md#iapticerrorcode)


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

> `readonly` **severity**: [`IapticErrorSeverity`](globals.md#iapticerrorseverity)


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

### IapticLocales


Handles localized messages for the iaptic React Native plugin

#### Constructors

##### new IapticLocales()

> **new IapticLocales**(): [`IapticLocales`](globals.md#iapticlocales)

###### Returns

[`IapticLocales`](globals.md#iapticlocales)

#### Methods

##### addLanguage()

> `static` **addLanguage**(`language`, `messages`): `void`


Adds a new language to the locales

###### Parameters

###### language

`string`

The language code to add

###### messages

The messages for the language

###### ActiveSubscription_ManageBilling

`string` = `"Manage Billing"`

###### ActiveSubscription_ManageSubscriptions

`string` = `"Manage Subscriptions"`

###### ActiveSubscription_Status_Active

`string` = `"Active"`

###### ActiveSubscription_Status_Expired

`string` = `"Expired"`

###### ActiveSubscription_Tag_Retry

`string` = `"Payment Retry"`

###### ActiveSubscription_Tag_Trial

`string` = `"Trial Period"`

###### ActiveSubscription_WillCancel

`string` = `"Will be cancelled on {0} at {1}"`

###### ActiveSubscription_WillRenew

`string` = `"Auto-renewing on {0} at {1}"`

###### Error

`string` = `"Error"`

###### IapticError_6777001

`string` = `"Failed to initialize the in-app purchase library"`

###### IapticError_6777002

`string` = `"Failed to load in-app products metadata"`

###### IapticError_6777003

`string` = `"Failed to make a purchase"`

###### IapticError_6777004

`string` = `"Failed to load the purchase receipt"`

###### IapticError_6777005

`string` = `"Client is not allowed to issue the request"`

###### IapticError_6777006

`string` = `"Purchase flow has been cancelled by user"`

###### IapticError_6777007

`string` = `"Something is suspicious about a purchase"`

###### IapticError_6777008

`string` = `"The user is not allowed to make a payment"`

###### IapticError_6777010

`string` = `"Unknown error"`

###### IapticError_6777011

`string` = `"Failed to refresh the purchase receipt"`

###### IapticError_6777012

`string` = `"The product identifier is invalid"`

###### IapticError_6777013

`string` = `"Cannot finalize a transaction or acknowledge a purchase"`

###### IapticError_6777014

`string` = `"Failed to communicate with the server"`

###### IapticError_6777015

`string` = `"Subscriptions are not available"`

###### IapticError_6777016

`string` = `"Purchase information is missing token"`

###### IapticError_6777017

`string` = `"Verification of store data failed"`

###### IapticError_6777018

`string` = `"Bad response from the server"`

###### IapticError_6777019

`string` = `"Failed to refresh the store"`

###### IapticError_6777020

`string` = `"Payment has expired"`

###### IapticError_6777021

`string` = `"Failed to download the content"`

###### IapticError_6777022

`string` = `"Failed to update a subscription"`

###### IapticError_6777023

`string` = `"The requested product is not available in the store"`

###### IapticError_6777024

`string` = `"The user has not allowed access to Cloud service information"`

###### IapticError_6777025

`string` = `"The device could not connect to the network"`

###### IapticError_6777026

`string` = `"The user has revoked permission to use this cloud service"`

###### IapticError_6777027

`string` = `"The user has not yet acknowledged Apple's privacy policy"`

###### IapticError_6777028

`string` = `"The app is attempting to use a property without required entitlement"`

###### IapticError_6777029

`string` = `"The offer identifier is invalid"`

###### IapticError_6777030

`string` = `"The price specified in App Store Connect is no longer valid"`

###### IapticError_6777031

`string` = `"The signature in a payment discount is not valid"`

###### IapticError_6777032

`string` = `"Parameters are missing in a payment discount"`

###### IapticError_6778003

`string` = `"Subscription has expired"`

###### IapticError_UnsupportedPlatform

`string` = `"Unsupported platform"`

###### IapticRN_initialized_called

`string` = `"IapticRN.initialize() can only be called once"`

###### PurchaseError_E_ALREADY_OWNED

`string` = `"This item has already been purchased."`

###### PurchaseError_E_BILLING_RESPONSE_JSON_PARSE_ERROR

`string` = `"Failed to parse the billing response."`

###### PurchaseError_E_DEFERRED_PAYMENT

`string` = `"The payment has been deferred."`

###### PurchaseError_E_DEVELOPER_ERROR

`string` = `"An error occurred in the application."`

###### PurchaseError_E_IAP_NOT_AVAILABLE

`string` = `"In-app purchases are not available."`

###### PurchaseError_E_INTERRUPTED

`string` = `"The operation was interrupted."`

###### PurchaseError_E_ITEM_UNAVAILABLE

`string` = `"The requested product is not available."`

###### PurchaseError_E_NETWORK_ERROR

`string` = `"A network error occurred."`

###### PurchaseError_E_NOT_ENDED

`string` = `"The transaction has not been ended."`

###### PurchaseError_E_NOT_PREPARED

`string` = `"The purchase cannot be completed because it has not been prepared."`

###### PurchaseError_E_RECEIPT_FAILED

`string` = `"Failed to validate receipt."`

###### PurchaseError_E_RECEIPT_FINISHED_FAILED

`string` = `"Failed to finish the transaction."`

###### PurchaseError_E_REMOTE_ERROR

`string` = `"A remote error occurred."`

###### PurchaseError_E_SERVICE_ERROR

`string` = `"The service returned an error."`

###### PurchaseError_E_UNKNOWN

`string` = `"An unknown error occurred."`

###### PurchaseError_E_USER_CANCELLED

`string` = `"The user cancelled the purchase."`

###### PurchaseError_E_USER_ERROR

`string` = `"An error occurred in the application."`

###### PurchaseError_title

`string` = `"Purchase Error #{0}"`

###### UnknownError

`string` = `"An unknown error occurred."`

###### UnknownError_title

`string` = `"Unknown Error"`

###### ValidationError

`string` = `"Receipt Validation Error"`

###### ValidationError_MissingTransactionId

`string` = `"Transaction ID is missing"`

###### Returns

`void`

##### get()

> `static` **get**(`key`, `args`, `fallbackMessage`): `string`


###### Parameters

###### key

`"Error"` | `"ValidationError"` | `"PurchaseError_title"` | `"PurchaseError_E_UNKNOWN"` | `"PurchaseError_E_USER_CANCELLED"` | `"PurchaseError_E_ITEM_UNAVAILABLE"` | `"PurchaseError_E_NETWORK_ERROR"` | `"PurchaseError_E_SERVICE_ERROR"` | `"PurchaseError_E_RECEIPT_FAILED"` | `"PurchaseError_E_NOT_PREPARED"` | `"PurchaseError_E_DEVELOPER_ERROR"` | `"PurchaseError_E_ALREADY_OWNED"` | `"PurchaseError_E_DEFERRED_PAYMENT"` | `"PurchaseError_E_USER_ERROR"` | `"PurchaseError_E_REMOTE_ERROR"` | `"PurchaseError_E_RECEIPT_FINISHED_FAILED"` | `"PurchaseError_E_NOT_ENDED"` | `"PurchaseError_E_BILLING_RESPONSE_JSON_PARSE_ERROR"` | `"PurchaseError_E_INTERRUPTED"` | `"PurchaseError_E_IAP_NOT_AVAILABLE"` | `"UnknownError_title"` | `"UnknownError"` | `"IapticRN_initialized_called"` | `"IapticError_6777001"` | `"IapticError_6777002"` | `"IapticError_6777003"` | `"IapticError_6777004"` | `"IapticError_6777005"` | `"IapticError_6777006"` | `"IapticError_6777007"` | `"IapticError_6777008"` | `"IapticError_6777010"` | `"IapticError_6777011"` | `"IapticError_6777012"` | `"IapticError_6777013"` | `"IapticError_6777014"` | `"IapticError_6777015"` | `"IapticError_6777016"` | `"IapticError_6777017"` | `"IapticError_6777018"` | `"IapticError_6777019"` | `"IapticError_6777020"` | `"IapticError_6777021"` | `"IapticError_6777022"` | `"IapticError_6777023"` | `"IapticError_6777024"` | `"IapticError_6777025"` | `"IapticError_6777026"` | `"IapticError_6777027"` | `"IapticError_6777028"` | `"IapticError_6777029"` | `"IapticError_6777030"` | `"IapticError_6777031"` | `"IapticError_6777032"` | `"IapticError_6778003"` | `"IapticError_UnsupportedPlatform"` | `"ValidationError_MissingTransactionId"` | `"ActiveSubscription_WillCancel"` | `"ActiveSubscription_WillRenew"` | `"ActiveSubscription_Status_Active"` | `"ActiveSubscription_Status_Expired"` | `"ActiveSubscription_Tag_Trial"` | `"ActiveSubscription_Tag_Retry"` | `"ActiveSubscription_ManageSubscriptions"` | `"ActiveSubscription_ManageBilling"`

###### args

`string`[] = `[]`

###### fallbackMessage

`string` = `''`

###### Returns

`string`

##### getDeviceLanguage()

> `static` **getDeviceLanguage**(): `string`


Gets the device language and returns a supported language code
Defaults to 'en' if the device language is not supported

###### Returns

`string`

##### initialize()

> `static` **initialize**(): `void`


Initializes the locales with the device language

###### Returns

`void`

##### setLanguage()

> `static` **setLanguage**(`language`): `void`


Sets the current language for messages

###### Parameters

###### language

`string`

The language code to use

###### Returns

`void`

***

### IapticLogger


#### Constructors

##### new IapticLogger()

> **new IapticLogger**(`verbosity`): [`IapticLogger`](globals.md#iapticlogger)


###### Parameters

###### verbosity

[`IapticLoggerVerbosityLevel`](globals.md#iapticloggerverbositylevel)

###### Returns

[`IapticLogger`](globals.md#iapticlogger)

#### Properties

##### verbosity

> **verbosity**: [`IapticLoggerVerbosityLevel`](globals.md#iapticloggerverbositylevel) = `IapticLogger.VERBOSITY`


##### VERBOSITY

> `static` **VERBOSITY**: [`IapticLoggerVerbosityLevel`](globals.md#iapticloggerverbositylevel) = `IapticLoggerVerbosityLevel.WARN`


#### Methods

##### \_message()

> **\_message**(`message`, `severity`): `string`


###### Parameters

###### message

`string`

###### severity

[`IapticLoggerVerbosityLevel`](globals.md#iapticloggerverbositylevel)

###### Returns

`string`

##### debug()

> **debug**(`message`): `void`


###### Parameters

###### message

`string`

###### Returns

`void`

##### error()

> **error**(`message`): `void`


###### Parameters

###### message

`string`

###### Returns

`void`

##### info()

> **info**(`message`): `void`


###### Parameters

###### message

`string`

###### Returns

`void`

##### warn()

> **warn**(`message`): `void`


###### Parameters

###### message

`string`

###### Returns

`void`

***

### IapticNonConsumables


Manages non-consumable purchases

#### Constructors

##### new IapticNonConsumables()

> **new IapticNonConsumables**(`purchases`, `products`, `events`): [`IapticNonConsumables`](globals.md#iapticnonconsumables)


Creates a new non-consumables manager

###### Parameters

###### purchases

[`IapticPurchases`](globals.md#iapticpurchases)

The purchases manager

###### products

[`IapticStoreProducts`](globals.md#iapticstoreproducts)

The product catalog

###### events

`IapticEvents`

###### Returns

[`IapticNonConsumables`](globals.md#iapticnonconsumables)

#### Methods

##### get()

> **get**(`productId`): `undefined` \| [`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)


Gets a non-consumable purchase by product ID

###### Parameters

###### productId

`string`

The product identifier

###### Returns

`undefined` \| [`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)

The verified purchase if found

##### owned()

> **owned**(`productId`): `boolean`


Checks if a non-consumable product is owned

###### Parameters

###### productId

`string`

The product identifier

###### Returns

`boolean`

True if the product is owned

***

### IapticPendingPurchases


Keep track of the state of pending purchases.

#### Constructors

##### new IapticPendingPurchases()

> **new IapticPendingPurchases**(`events`): [`IapticPendingPurchases`](globals.md#iapticpendingpurchases)


###### Parameters

###### events

`IapticEvents`

###### Returns

[`IapticPendingPurchases`](globals.md#iapticpendingpurchases)

#### Methods

##### add()

> **add**(`offer`): `void`


###### Parameters

###### offer

[`IapticOffer`](globals.md#iapticoffer)

###### Returns

`void`

##### get()

> **get**(): [`IapticPendingPurchase`](globals.md#iapticpendingpurchase)[]


###### Returns

[`IapticPendingPurchase`](globals.md#iapticpendingpurchase)[]

##### getStatus()

> **getStatus**(`productId`, `offerId`?): `undefined` \| [`IapticPendingPurchaseState`](globals.md#iapticpendingpurchasestate)


###### Parameters

###### productId

`string`

###### offerId?

`string`

###### Returns

`undefined` \| [`IapticPendingPurchaseState`](globals.md#iapticpendingpurchasestate)

##### remove()

> **remove**(`productId`, `offerId`?): `void`


###### Parameters

###### productId

`string`

###### offerId?

`string`

###### Returns

`void`

##### update()

> **update**(`productId`, `status`, `offerId`?): `void`


###### Parameters

###### productId

`string`

###### status

[`IapticPendingPurchaseState`](globals.md#iapticpendingpurchasestate)

###### offerId?

`string`

###### Returns

`void`

***

### IapticPurchases


Manages the collection of verified purchases

#### Constructors

##### new IapticPurchases()

> **new IapticPurchases**(`events`): [`IapticPurchases`](globals.md#iapticpurchases)


###### Parameters

###### events

`IapticEvents`

###### Returns

[`IapticPurchases`](globals.md#iapticpurchases)

#### Methods

##### addPurchase()

> **addPurchase**(`purchase`): `void`


Adds a new verified purchase

###### Parameters

###### purchase

[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)

The verified purchase to add

###### Returns

`void`

##### getPurchase()

> **getPurchase**(`productId`, `transactionId`?): `undefined` \| [`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)


Gets a specific purchase by product ID and optional transaction ID

###### Parameters

###### productId

`string`

The product identifier

###### transactionId?

`string`

Optional transaction identifier

###### Returns

`undefined` \| [`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)

The verified purchase if found

##### list()

> **list**(): [`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)[]


Lists all verified purchases

###### Returns

[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)[]

Array of verified purchases

##### sorted()

> **sorted**(): [`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)[]


Returns a sorted list of verified purchases, with the most recent first

###### Returns

[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)[]

Array of verified purchases

***

### IapticRN


Main class for handling in-app purchases with iaptic

#### Constructors

##### new IapticRN()

> **new IapticRN**(`config`): [`IapticRN`](globals.md#iapticrn)


Creates a new instance of IapticRN

###### Parameters

###### config

[`IapticConfig`](globals.md#iapticconfig)

Configuration for the iaptic service

###### Returns

[`IapticRN`](globals.md#iapticrn)

###### Example

```typescript
const iaptic = new IapticRN({
  apiKey: 'prod_123456789',
  iosBundleId: 'com.yourcompany.app',
  androidPackageName: 'com.yourcompany.app',
});
```

#### Properties

##### config

> `readonly` **config**: [`IapticConfig`](globals.md#iapticconfig)


Configuration for the iaptic service

##### consumables

> `readonly` **consumables**: [`IapticConsumables`](globals.md#iapticconsumables)


Manages consumable purchases

##### nonConsumables

> `readonly` **nonConsumables**: [`IapticNonConsumables`](globals.md#iapticnonconsumables)


Manages non-consumable purchases

##### pendingPurchases

> `readonly` **pendingPurchases**: [`IapticPendingPurchases`](globals.md#iapticpendingpurchases)


Manages pending purchases

##### products

> `readonly` **products**: [`IapticStoreProducts`](globals.md#iapticstoreproducts)


Product catalog containing all available products

##### purchases

> `readonly` **purchases**: [`IapticPurchases`](globals.md#iapticpurchases)


Manages all verified purchases

##### subscriptions

> `readonly` **subscriptions**: [`IapticSubscriptions`](globals.md#iapticsubscriptions)


Manages subscription-specific functionality

##### utils

> `readonly` **utils**: [`IapticUtils`](globals.md#iapticutils)


Utility functions

#### Methods

##### addEventListener()

> **addEventListener**\<`T`\>(`eventType`, `listener`, `context`): `IapticRegisteredEventListener`


Add an event listener for iaptic events

###### Type Parameters

• **T** *extends* [`IapticEventType`](globals.md#iapticeventtype)

###### Parameters

###### eventType

`T`

Type of event to listen for

###### listener

[`IapticEventListener`](globals.md#iapticeventlistenert)\<`T`\>

Callback function that will be called when the event occurs

###### context

`string` = `'User'`

Optional context to identify the listener (helpful for debugging)

###### Returns

`IapticRegisteredEventListener`

###### Example

```typescript
// Listen for subscription updates
iaptic.addEventListener('subscription.updated', (reason, purchase) => {
  console.log(`Subscription ${purchase.id} ${reason}`);
});

// Listen for pending purchase updates
iaptic.addEventListener('pendingPurchase.updated', (pendingPurchase) => {
  console.log(`Purchase ${pendingPurchase.productId} is now ${pendingPurchase.status}`);
});

// Listen for purchase updates
iaptic.addEventListener('purchase.updated', (purchase) => {
  console.log(`Purchase ${purchase.id} ${purchase.status}`);
});

// Listen for non-consumable purchases
iaptic.addEventListener('nonConsumable.owned', (purchase) => {
  console.log(`Non-consumable purchase ${purchase.id} is now owned`);
});
```

##### canPurchase()

> **canPurchase**(`product`): `boolean`


Check if a product can be purchased.

###### Parameters

###### product

[`IapticProduct`](globals.md#iapticproduct)

The product to check

###### Returns

`boolean`

True if the product can be purchased, false otherwise

##### checkEntitlement()

> **checkEntitlement**(`featureId`): `boolean`


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

[setProductDefinitions](globals.md#setproductdefinitions)

###### Example

```typescript
// Check premium access
if (iaptic.checkEntitlement('premium')) {
  showPremiumContent();
} else {
  showUpgradePrompt();
}

// Check specific feature access
const hasCoolFeature = iaptic.checkEntitlement('cool_feature');
```

##### consume()

> **consume**(`purchase`): `void`


Consume a purchase. Only for consumable products.

###### Parameters

###### purchase

[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)

The purchase to consume

###### Returns

`void`

##### destroy()

> **destroy**(): `void`


Destroys the iaptic service

###### Returns

`void`

##### flushTransactions()

> **flushTransactions**(): `Promise`\<`void`\>


Function used in developement to cleanup the cache of pending transactions.

###### Returns

`Promise`\<`void`\>

##### initConnection()

> **initConnection**(): `Promise`\<`undefined` \| `null`\>


###### Returns

`Promise`\<`undefined` \| `null`\>

##### initialize()

> **initialize**(): `Promise`\<`void`\>


Initializes the In-App Purchase component.

- prepare the connection with the store.
- load products defined with setProductDefinitions()
- load available purchases

###### Returns

`Promise`\<`void`\>

###### Example

```typescript
try {
  await iaptic.initialize();
  console.log('Products loaded:', iaptic.products.all());
  console.log('Active purchases:', iaptic.purchases.list());
} catch (error) {
  console.error('Initialization failed:', error);
}

##### listEntitlements()

> **listEntitlements**(): `string`[]


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

[setProductDefinitions](globals.md#setproductdefinitions)

###### Example

```typescript
// Get all unlocked features
const unlockedFeatures = iaptic.listEntitlements();
// ['basic', 'premium', 'dark_theme']
```

##### loadProducts()

> **loadProducts**(`definitions`?): `Promise`\<[`IapticProduct`](globals.md#iapticproduct)[]\>


Load products from the Store.

###### Parameters

###### definitions?

[`IapticProductDefinition`](globals.md#iapticproductdefinition)[]

The products to load

###### Returns

`Promise`\<[`IapticProduct`](globals.md#iapticproduct)[]\>

###### Example

```typescript
await iaptic.loadProducts([
  { id: 'basic_subscription', type: 'paid subscription', entitlements: [ 'basic' ] },
  { id: 'premium_subscription', type: 'paid subscription', entitlements: [ 'basic', 'premium' ] },
  { id: 'premium_lifetime', type: 'non consumable', entitlements: [ 'basic', 'premium' ] },
  { id: 'coins_100', type: 'consumable', tokenType: 'coins', tokenValue: 100 },
]);
```

##### loadPurchases()

> **loadPurchases**(): `Promise`\<[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)[]\>


Load and validate active purchases details from the Store and Iaptic using their receipts

###### Returns

`Promise`\<[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)[]\>

List of verified purchases.

###### Example

```typescript
const purchases = await iaptic.loadPurchases();
```

##### manageBilling()

> **manageBilling**(): `Promise`\<`void`\>


Opens the platform-specific billing management page in the default browser

###### Returns

`Promise`\<`void`\>

##### manageSubscriptions()

> **manageSubscriptions**(): `Promise`\<`void`\>


Opens the platform-specific subscription management page in the default browser

###### Returns

`Promise`\<`void`\>

##### order()

> **order**(`offer`): `Promise`\<`void`\>


Order a product with an offer.

###### Parameters

###### offer

[`IapticOffer`](globals.md#iapticoffer)

The offer to order

###### Returns

`Promise`\<`void`\>

###### Example

```typescript
// Order a subscription offer
const subscriptionOffer = iaptic.products.get('premium_monthly')?.offers[0];
if (subscriptionOffer) {
  try {
    await iaptic.order(subscriptionOffer);
    console.log('Purchase started successfully');
  } catch (error) {
    console.error('Purchase failed:', error);
  }
}

##### owned()

> **owned**(`productId`): `boolean`


Check if a product is owned.

###### Parameters

###### productId

`string`

The product identifier

###### Returns

`boolean`

True if the product is owned, false otherwise

##### removeAllEventListeners()

> **removeAllEventListeners**(`eventType`?): `void`


Remove all event listeners for a specific event type
If no event type is specified, removes all listeners for all events

###### Parameters

###### eventType?

[`IapticEventType`](globals.md#iapticeventtype)

Optional event type to remove listeners for

###### Returns

`void`

##### restorePurchases()

> **restorePurchases**(`progressCallback`): `Promise`\<`number`\>


Restore purchases from the Store.

###### Parameters

###### progressCallback

(`processed`, `total`) => `void`

Callback function that will be called with the progress of the restore operation
                          - The initial call is with -1, 0
                          - Subsequent calls are with the current progress
                          - The final call will have processed === total

###### Returns

`Promise`\<`number`\>

The number of purchases restored

###### Example

```typescript
// Restore purchases with progress updates
iaptic.restorePurchases((processed, total) => {
  console.log(`Processed ${processed} of ${total} purchases`);
})
.then(numRestored => {
  console.log(`Restored ${numRestored} purchases`);
})
.catch(error => {
  console.error('Restore failed:', error);
});

##### setApplicationUsername()

> **setApplicationUsername**(`value`): `void`


Set the application username

###### Parameters

###### value

`string`

###### Returns

`void`

##### setProductDefinitions()

> **setProductDefinitions**(`definitions`): `void`


Add product definitions to the product catalog.

Entitlements define what features/content a product unlocks. They can be shared
across multiple products (e.g. a subscription and lifetime purchase both granting "premium" access).

###### Parameters

###### definitions

[`IapticProductDefinition`](globals.md#iapticproductdefinition)[]

###### Returns

`void`

###### Examples

```typescript
iaptic.setProductDefinitions([
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
iaptic.setProductDefinitions([
  { id: 'coins_100', type: 'consumable', tokenType: 'coins', tokenValue: 100 },
  { id: 'coins_500', type: 'consumable', tokenType: 'coins', tokenValue: 500 },
]);
```

```typescript
// Define a subscription and consumable product
iaptic.setProductDefinitions([
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

> **setVerbosity**(`verbosity`): `void`


Set iaptic plugin's verbosity level

###### Parameters

###### verbosity

[`IapticLoggerVerbosityLevel`](globals.md#iapticloggerverbositylevel)

###### Returns

`void`

##### validate()

> **validate**(`purchase`): `Promise`\<`undefined` \| [`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)\>


Validate and register a purchase with iaptic receipt validator.

###### Parameters

###### purchase

`ProductPurchase`

The purchase to validate

###### Returns

`Promise`\<`undefined` \| [`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)\>

The validated purchase or undefined if the purchase is not valid

***

### IapticStoreProducts


Manages the catalog of available in-app purchase products

#### Constructors

##### new IapticStoreProducts()

> **new IapticStoreProducts**(`definitions`, `subscriptions`, `products`): [`IapticStoreProducts`](globals.md#iapticstoreproducts)


Creates a new product catalog

###### Parameters

###### definitions

[`IapticProductDefinition`](globals.md#iapticproductdefinition)[]

Initial product definitions

###### subscriptions

`Subscription`[]

Initial subscription products

###### products

`Product`[]

Initial non-subscription products

###### Returns

[`IapticStoreProducts`](globals.md#iapticstoreproducts)

#### Methods

##### add()

> **add**(`definitions`, `subscriptions`, `products`): [`IapticProduct`](globals.md#iapticproduct)[]


Adds products to the catalog

###### Parameters

###### definitions

[`IapticProductDefinition`](globals.md#iapticproductdefinition)[]

Product definitions to add

###### subscriptions

`Subscription`[]

Subscription products to add

###### products

`Product`[]

Non-subscription products to add

###### Returns

[`IapticProduct`](globals.md#iapticproduct)[]

##### all()

> **all**(): [`IapticProduct`](globals.md#iapticproduct)[]


Return the list of all products in iaptic unified format

###### Returns

[`IapticProduct`](globals.md#iapticproduct)[]

##### get()

> **get**(`productId`): `undefined` \| [`IapticProduct`](globals.md#iapticproduct)


Get a product by its identifier

###### Parameters

###### productId

`string`

The product identifier

###### Returns

`undefined` \| [`IapticProduct`](globals.md#iapticproduct)

The product

##### getDefinition()

> **getDefinition**(`productId`): `undefined` \| [`IapticProductDefinition`](globals.md#iapticproductdefinition)


Get a product definition by its identifier

###### Parameters

###### productId

`string`

The product identifier

###### Returns

`undefined` \| [`IapticProductDefinition`](globals.md#iapticproductdefinition)

The product definition

##### getIapProduct()

> **getIapProduct**(`productId`): `undefined` \| `Product`


**`Internal`**

###### Parameters

###### productId

`string`

###### Returns

`undefined` \| `Product`

##### getIapSubscription()

> **getIapSubscription**(`productId`): `undefined` \| `Subscription`


**`Internal`**

###### Parameters

###### productId

`string`

###### Returns

`undefined` \| `Subscription`

##### getType()

> **getType**(`productId`): [`IapticProductType`](globals.md#iapticproducttype)


Gets the type of a product

###### Parameters

###### productId

`string`

The product identifier

###### Returns

[`IapticProductType`](globals.md#iapticproducttype)

The type of the product

##### load()

> **load**(`definitions`?): `Promise`\<[`IapticProduct`](globals.md#iapticproduct)[]\>


Load some products from the store, add them to the catalog and return them.

###### Parameters

###### definitions?

[`IapticProductDefinition`](globals.md#iapticproductdefinition)[]

The product definitions to load

###### Returns

`Promise`\<[`IapticProduct`](globals.md#iapticproduct)[]\>

The loaded products

***

### IapticSubscriptions


Manages subscription-specific functionality

#### Constructors

##### new IapticSubscriptions()

> **new IapticSubscriptions**(`purchases`, `products`, `events`): [`IapticSubscriptions`](globals.md#iapticsubscriptions)


Creates a new subscriptions manager

###### Parameters

###### purchases

[`IapticPurchases`](globals.md#iapticpurchases)

The purchases manager

###### products

[`IapticStoreProducts`](globals.md#iapticstoreproducts)

The product catalog

###### events

`IapticEvents`

###### Returns

[`IapticSubscriptions`](globals.md#iapticsubscriptions)

#### Methods

##### active()

> **active**(): `undefined` \| [`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)


Return one of the active subscriptions
When you don't sell multiple subscriptions that can be all in parallel, that's all you need.

###### Returns

`undefined` \| [`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)

##### activesOnly()

> **activesOnly**(): [`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)[]


Lists only active subscription purchases

###### Returns

[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)[]

Array of active subscription purchases

##### all()

> **all**(): [`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)[]


Lists all subscription purchases

###### Returns

[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)[]

Array of subscription purchases

##### hasActive()

> **hasActive**(): `boolean`


Checks if there are any active subscriptions

###### Returns

`boolean`

True if there are active subscriptions

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

> **new IapticTokensManager**(`iaptic`, `consumePurchases`): [`IapticTokensManager`](globals.md#iaptictokensmanager)


###### Parameters

###### iaptic

[`IapticRN`](globals.md#iapticrn)

###### consumePurchases

`boolean` = `true`

###### Returns

[`IapticTokensManager`](globals.md#iaptictokensmanager)

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


#### Constructors

##### new IapticUtils()

> **new IapticUtils**(): [`IapticUtils`](globals.md#iapticutils)

###### Returns

[`IapticUtils`](globals.md#iapticutils)

#### Methods

##### fixedRecurrenceMode()

> **fixedRecurrenceMode**(`pricingPhase`): `undefined` \| [`IapticRecurrenceMode`](globals.md#iapticrecurrencemode)


FINITE_RECURRING with billingCycles=1 is like NON_RECURRING
FINITE_RECURRING with billingCycles=0 is like INFINITE_RECURRING

###### Parameters

###### pricingPhase

[`IapticPricingPhase`](globals.md#iapticpricingphase)

###### Returns

`undefined` \| [`IapticRecurrenceMode`](globals.md#iapticrecurrencemode)

##### formatBillingCycleEN()

> **formatBillingCycleEN**(`pricingPhase`): `string`


Generate a plain english version of the billing cycle in a pricing phase.

Example outputs:

- "3x 1 month": for `FINITE_RECURRING`, 3 cycles, period "P1M"
- "for 1 year": for `NON_RECURRING`, period "P1Y"
- "every week": for `INFINITE_RECURRING, period "P1W"

###### Parameters

###### pricingPhase

[`IapticPricingPhase`](globals.md#iapticpricingphase)

###### Returns

`string`

###### Example

```ts
Utils.formatBillingCycleEN(offer.pricingPhases[0])
```

##### formatDurationEN()

> **formatDurationEN**(`iso`?, `options`?): `string`


Format a simple ISO 8601 duration to plain English.

This works for non-composite durations, i.e. that have a single unit with associated amount. For example: "P1Y" or "P3W".

See https://en.wikipedia.org/wiki/ISO_8601#Durations

This method is provided as a utility for getting simple things done quickly. In your application, you'll probably
need some other method that supports multiple locales.

###### Parameters

###### iso?

`string`

Duration formatted in IS0 8601

###### options?

###### omitOne

`boolean`

###### Returns

`string`

The duration in plain english. Example: "1 year" or "3 weeks".

## Interfaces

### IapticConfig


Configuration for the iaptic validator

#### Properties

##### appName

> **appName**: `string`


##### baseUrl?

> `optional` **baseUrl**: `string`


The base URL of the iaptic validator

##### iosBundleId?

> `optional` **iosBundleId**: `string`


##### publicKey

> **publicKey**: `string`


##### showAlerts?

> `optional` **showAlerts**: `boolean`


Disable alert by setting this to false.

By default, IapticRN will display relevant alerts to the user when something goes wrong.

Default is true.

***

### IapticEventMap


Event argument types mapped to their event names

#### Properties

##### consumable.purchased

> **purchased**: \[[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)\]


##### consumable.refunded

> **refunded**: \[[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)\]


##### error

> **error**: \[[`IapticError`](globals.md#iapticerror)\]


##### nonConsumable.owned

> **owned**: \[[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)\]


##### nonConsumable.unowned

> **unowned**: \[[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)\]


##### nonConsumable.updated

> **updated**: \[[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)\]


##### pendingPurchase.updated

> **updated**: \[[`IapticPendingPurchase`](globals.md#iapticpendingpurchase)\]


##### purchase.updated

> **updated**: \[[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)\]


##### subscription.cancelled

> **cancelled**: \[[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)\]


##### subscription.changed

> **changed**: \[[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)\]


##### subscription.expired

> **expired**: \[[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)\]


##### subscription.renewed

> **renewed**: \[[`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)\]


##### subscription.updated

> **updated**: \[[`IapticSubscriptionReason`](globals.md#iapticsubscriptionreason), [`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)\]


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

> **platform**: [`IapticPurchasePlatform`](globals.md#iapticpurchaseplatform)


Platform of the product

##### pricingPhases

> **pricingPhases**: [`IapticPricingPhase`](globals.md#iapticpricingphase)[]


Pricing phases for this offer

##### productGroup?

> `optional` **productGroup**: `null` \| `string`


Subscription group (if any)

##### productId

> **productId**: `string`


Product identifier

##### productType?

> `optional` **productType**: [`IapticProductType`](globals.md#iapticproducttype)


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

> **status**: [`IapticPendingPurchaseState`](globals.md#iapticpendingpurchasestate)


Status of the purchase

***

### IapticPricingPhase


Description of a phase for the pricing of a purchase.

#### See

[IapticOffer.pricingPhases](globals.md#pricingphases)

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

> `optional` **paymentMode**: [`IapticPaymentMode`](globals.md#iapticpaymentmode)


Payment mode for the pricing phase ("PayAsYouGo", "UpFront", or "FreeTrial")

##### price

> **price**: `string`


##### priceMicros

> **priceMicros**: `number`


Price in micro-units (divide by 1000000 to get numeric price)

##### recurrenceMode?

> `optional` **recurrenceMode**: [`IapticRecurrenceMode`](globals.md#iapticrecurrencemode)


Type of recurring payment

***

### IapticProduct


#### Properties

##### countryCode?

> `optional` **countryCode**: `string`


Country code of the product

##### id

> **id**: `string`


Product identifier on the store (unique per platform)

##### offers

> **offers**: [`IapticOffer`](globals.md#iapticoffer)[]


List of offers available for this product

##### platform

> **platform**: [`IapticPurchasePlatform`](globals.md#iapticpurchaseplatform)


Platform of the product

##### title?

> `optional` **title**: `string`


Title of the product

##### type

> **type**: [`IapticProductType`](globals.md#iapticproducttype)


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

> **type**: [`IapticProductType`](globals.md#iapticproducttype)


Type of the product (subscription, consumable, or non-consumable)

***

### IapticValidateErrorPayload


Error response from the validator endpoint

#### Properties

##### code?

> `optional` **code**: [`IapticErrorCode`](globals.md#iapticerrorcode)


An ErrorCode

##### data?

> `optional` **data**: `object`


###### latest\_receipt?

> `optional` **latest\_receipt**: `boolean`

We validated using the latest version of the receipt, not need to refresh it.

##### message?

> `optional` **message**: `string`


Human readable description of the error

##### ok

> **ok**: `false`


Value `false` indicates that the request returned an error

##### status?

> `optional` **status**: `number`


Error status (HTTP status)

***

### IapticValidateRequest


Body of a receipt validation request,

#### Properties

##### additionalData?

> `optional` **additionalData**: `object`


Additional data about the purchase

###### applicationUsername?

> `optional` **applicationUsername**: `string` \| `number`

Attach the purchases to the given application user. Should be a string.

See [/documentation/application-username](/documentation/application-username) for more information.

###### Optional

##### device?

> `optional` **device**: `object`


###### Index Signature

\[`key`: `string`\]: `string`

##### id?

> `optional` **id**: `string`


Identifier of the product you want to validate. On iOS, can be set to your application identifier.

###### Required

##### offers?

> `optional` **offers**: [`IapticOffer`](globals.md#iapticoffer)[]


List of offers available for this product

##### products

> **products**: [`IapticProduct`](globals.md#iapticproduct)[]


List of products available in the store

##### transaction?

> `optional` **transaction**: [`IapticValidateRequestTransaction`](globals.md#iapticvalidaterequesttransaction)


Details about the native transaction.

Can be:
<ul>
 <li>An <a href="#api-Types-Validate.TransactionApple">Apple Transaction</a></li>
 <li>A <a href="#api-Types-Validate.TransactionGoogle">Google Transaction</a></li>
 <li>A <a href="#api-Types-Validate.TransactionWindows">Windows Transaction</a></li>
 <li>A <a href="#api-Types-Validate.TransactionStripe">Stripe Transaction</a></li>
</ul>

###### Required

##### type?

> `optional` **type**: [`IapticProductType`](globals.md#iapticproducttype)


Type of product being validated. Possible values:

<ul>
<li>`application` – Validate the application download (Apple only).</li>
<li>`paid subscription` – An auto-renewing subscription.</li>
<li>`non renewing subscription` – A non renewing subscription.</li>
<li>`consumable` – A consumable product.</li>
<li>`non consumable` – A non-consumable product.</li>
</ul>

###### Required

***

### IapticValidateRequestTransactionApple


Transaction type from an Apple powered device

#### Properties

##### appStoreReceipt

> **appStoreReceipt**: `string`


Apple appstore receipt, base64 encoded.

###### Required

##### id

> **id**: `string`


Identifier of the transaction to evaluate, or set it to your application identifier if id has been set so.

###### Required

##### type

> **type**: `"ios-appstore"`


Value `"ios-appstore"`

***

### IapticValidateRequestTransactionGoogle


Transaction type from a google powered device

#### Properties

##### id

> **id**: `string`


Identifier of the transaction to evaluate.

Corresponds to:
- the `orderId` in the receipt from Google.
- the `transactionId` in the receipt from Apple (or bundleID for the application receipt).

###### Required

##### purchaseToken

> **purchaseToken**: `string`


Google purchase token.

###### Required

##### receipt

> **receipt**: `string`


Google receipt in a JSON-encoded string.

###### Required

##### signature

> **signature**: `string`


Google receipt signature (used to validate the local receipt).

###### Required

##### type

> **type**: `"android-playstore"`


Value `"android-playstore"`

***

### IapticValidateSuccessPayload


Success response from iaptic validator endpoint

#### Properties

##### data

> **data**: `object`


###### collection?

> `optional` **collection**: [`IapticVerifiedPurchase`](globals.md#iapticverifiedpurchase)[]

The collection of purchases in this receipt.

An array of ValidatorPurchase

###### date?

> `optional` **date**: `string`

Date and time the receipt was validated.

It will provide the client with a more reliable clock time
than the user's device when needed.

###### id

> **id**: `string`

Id of the product that have been validated

###### ineligible\_for\_intro\_price?

> `optional` **ineligible\_for\_intro\_price**: `string`[]

List of product ids for which intro price isn't available anymore

###### latest\_receipt

> **latest\_receipt**: `boolean`

Tell the plugin that we've used the latest receipt

###### transaction

> **transaction**: `any`

Native transaction detail

###### warning?

> `optional` **warning**: `string`

A warning message about this validation.

It might be present when the server had to fallback to a backup validation solution.

##### ok

> **ok**: `true`


Indicates a successful request

***

### IapticValidationData


Data needed to validate a purchase

#### Properties

##### applicationUsername?

> `optional` **applicationUsername**: `string`


##### productId

> **productId**: `string`


##### productType

> **productType**: [`IapticProductType`](globals.md#iapticproducttype)


##### receipt

> **receipt**: `string`


##### receiptSignature

> **receiptSignature**: `string`


##### transactionId

> **transactionId**: `string`


***

### IapticVerifiedPurchase


A purchase object returned by the receipt validator.

#### Properties

##### cancelationReason?

> `optional` **cancelationReason**: [`IapticCancelationReason`](globals.md#iapticcancelationreason)


The reason a subscription or purchase was cancelled.

##### discountId?

> `optional` **discountId**: `string`


Identifier of the discount currently applied to a purchase.

Correspond to the product's offerId. When undefined it means there is only one offer for the given product.

##### expiryDate?

> `optional` **expiryDate**: `number`


Date of expiry for a subscription.

##### id

> **id**: `string`


Product identifier

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

> `optional` **platform**: [`IapticPurchasePlatform`](globals.md#iapticpurchaseplatform)


Platform this purchase was made on

##### priceConsentStatus?

> `optional` **priceConsentStatus**: [`IapticPriceConsentStatus`](globals.md#iapticpriceconsentstatus)


Whether or not the user agreed or has been notified of a price change.

##### purchaseDate?

> `optional` **purchaseDate**: `number`


Date of first purchase (timestamp).

##### purchaseId?

> `optional` **purchaseId**: `string`


Purchase identifier (optional)

##### renewalIntent?

> `optional` **renewalIntent**: `string`


Renewal intent.

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

• **T** *extends* [`IapticEventType`](globals.md#iapticeventtype)

#### Parameters

##### args

...[`IapticEventMap`](globals.md#iapticeventmap)\[`T`\]

#### Returns

`void`

***

### IapticEventType

> **IapticEventType**: `"purchase.updated"` \| `"subscription.updated"` \| `"subscription.renewed"` \| `"subscription.cancelled"` \| `"subscription.expired"` \| `"subscription.changed"` \| `"pendingPurchase.updated"` \| `"nonConsumable.updated"` \| `"nonConsumable.owned"` \| `"nonConsumable.unowned"` \| `"consumable.purchased"` \| `"consumable.refunded"` \| `"error"`


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

> **IapticPendingPurchaseState**: `"purchasing"` \| `"processing"` \| `"validating"` \| `"finishing"` \| `"completed"`


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

***

### IapticValidateRequestTransaction

> **IapticValidateRequestTransaction**: [`IapticValidateRequestTransactionApple`](globals.md#iapticvalidaterequesttransactionapple) \| [`IapticValidateRequestTransactionGoogle`](globals.md#iapticvalidaterequesttransactiongoogle)


***

### IapticValidateResponse

> **IapticValidateResponse**: [`IapticValidateSuccessPayload`](globals.md#iapticvalidatesuccesspayload) \| [`IapticValidateErrorPayload`](globals.md#iapticvalidateerrorpayload)


Response from the iaptic validator endpoint

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
  styles={{
    entitlementTag: { 
      backgroundColor: '#e3f2fd',
      color: '#1976d2'
    }
  }}
/>
```
