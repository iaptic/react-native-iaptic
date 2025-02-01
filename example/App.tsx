import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, TouchableOpacity, Text, ScrollView } from 'react-native';
import { IapticActiveSubscription } from '../src'; // 'react-native-iaptic'
import { AppStateManager, initialAppState } from './AppState';
import { AppService } from './AppService';
import ProductList from '../src/components/ProductList';
import { SubscriptionView } from '../src/components/SubscriptionView/Modal';

// Create stable references outside component
let appStateManagerInstance: AppStateManager | null = null;
let iapServiceInstance: AppService | null = null;

function App(): React.JSX.Element {
  const [appState, setAppState] = useState(initialAppState);
  
  // Initialize singleton instances once
  const appStateManager = useRef<AppStateManager>(
    appStateManagerInstance || (appStateManagerInstance = new AppStateManager([appState, setAppState]))
  ).current;
  
  const iapService = useRef<AppService>(
    iapServiceInstance || (iapServiceInstance = new AppService(appStateManager))
  ).current;

  // One-time initialization with proper cleanup
  useEffect(() => iapService.onAppStartup(), []);

  const restorePurchasesInProgress = appState.restorePurchasesInProgress;

  return (
    <SafeAreaView style={styles.container}>
      <SubscriptionView 
        entitlementLabels={{
          pro_feature: { label: 'Professional Features', detail: 'Access to professional features' },
          premium_feature: { label: 'Premium Content', detail: 'Access to premium content' }
        }}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.productsContainer}>
        <Text style={styles.subscriptionText}>Subscription</Text>
        
        <IapticActiveSubscription />

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

        <ProductList 
          onOrder={(offer) => iapService.handleSubscribeButton(offer)}
        />
        
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
    paddingBottom: 20,
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
  restoreText: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color: '#666',
  },
  restoreButton: {
    backgroundColor: '#5856D6',
  },
  subscriptionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});

export default App;

