import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Text, ScrollView } from 'react-native';
import { AppStateManager, initialAppState } from './src/AppState';
import { AppService } from './src/AppService';
import { IapticActiveSubscription, IapticLogger, IapticLoggerVerbosityLevel, IapticUtils } from './src/iaptic-rn';

IapticLogger.VERBOSITY = IapticLoggerVerbosityLevel.DEBUG;

// Create stable references outside component
let appStateManagerInstance: AppStateManager | null = null;
let iapServiceInstance: AppService | null = null;
let utilsInstance: IapticUtils | null = null;

function App(): React.JSX.Element {
  const [appState, setAppState] = useState(initialAppState);
  
  // Initialize singleton instances once
  const appStateManager = useRef<AppStateManager>(
    appStateManagerInstance || (appStateManagerInstance = new AppStateManager([appState, setAppState]))
  ).current;
  
  const iapService = useRef<AppService>(
    iapServiceInstance || (iapServiceInstance = new AppService(appStateManager))
  ).current;

  const utils = useRef<IapticUtils>(
    utilsInstance || (utilsInstance = new IapticUtils())
  ).current;

  // One-time initialization with proper cleanup
  useEffect(() => iapService.onAppStartup(), []);

  const restorePurchasesInProgress = appState.restorePurchasesInProgress;
  const pendingPurchase = appState.pendingPurchase;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.productsContainer}>
        <Text style={styles.subscriptionText}>Subscription</Text>
        
        <IapticActiveSubscription iaptic={iapService.iaptic} />

        {/* A feature that will only be available if the user has any subscription */}
        <TouchableOpacity
          onPress={() => iapService.checkFeatureAccess("basic")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Basic Access: {appState.entitlements.includes('basic') ? 'Granted' : 'Locked'}</Text>
        </TouchableOpacity>

        {/* A feature that will only be available if the user has a premium subscription */}
        <TouchableOpacity
          onPress={() => iapService.checkFeatureAccess("premium")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Premium Access: {appState.entitlements.includes('premium') ? 'Granted' : 'Locked'}</Text>
        </TouchableOpacity>

        {/* Liste des produits disponibles */}
        {appState.availableProducts.map((product) => (
          <View key={product.id} style={styles.productContainer}>
            <Text style={styles.productTitle}>{product.title}</Text>
            <View style={styles.offersContainer}>
              {product.offers.map(offer => (
                <View key={offer.id} style={styles.offerContainer}>
                  <TouchableOpacity
                    disabled={pendingPurchase?.productId === product.id}
                    style={[
                      styles.button,
                      pendingPurchase?.productId === product.id && styles.buttonDisabled
                    ]}
                    onPress={() => {
                      iapService.handleSubscribeButton(offer);
                    }}
                  >
                    <Text style={styles.buttonText}>
                      {pendingPurchase?.productId === product.id && (pendingPurchase?.offerId === offer.id || !pendingPurchase?.offerId)
                        ? `${pendingPurchase.status}...`
                        : `${offer.pricingPhases[0].price} ${utils.formatBillingCycleEN(offer.pricingPhases[0])}`}
                    </Text>
                  </TouchableOpacity>
                  
                  {offer.pricingPhases.length > 1 && (
                    <Text style={styles.pricingPhasesText}>
                      {offer.pricingPhases.slice(1).map((phase, index) => (
                        `then ${phase.price} ${utils.formatBillingCycleEN(phase)}`
                      )).join('\n')}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
        
        <Text style={styles.restoreText}>
          Previously purchased items? Restore them here:
        </Text>
        <TouchableOpacity
          style={[
            styles.button, 
            styles.restoreButton,
            restorePurchasesInProgress && styles.buttonDisabled
          ]}
          disabled={!!restorePurchasesInProgress}
          onPress={() => {
            iapService.restorePurchases();
          }}
        >
          <Text style={styles.buttonText}>
            {restorePurchasesInProgress 
              ? restorePurchasesInProgress.numDone <= 0 || restorePurchasesInProgress.total < 0
                ? '...'
                : `${restorePurchasesInProgress.numDone}/${restorePurchasesInProgress.total}`
              : 'Restore Purchases'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Rendered: {new Date().toISOString().slice(11, 23)}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  productsContainer: {
    padding: 10,
    gap: 10,
    paddingBottom: 20, // Add some padding at the bottom for better scrolling
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
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
  restoreText: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color: '#666',
  },
  restoreButton: {
    backgroundColor: '#5856D6', // Different color to distinguish from purchase buttons
  },
  subscriptionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
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
  pricingPhasesText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginLeft: 8,
    textAlign: 'right',
  },
});

export default App;

