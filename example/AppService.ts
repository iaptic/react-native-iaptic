import { Platform, Alert, ToastAndroid } from 'react-native';
import { IapticError, IapticErrorSeverity, IapticLoggerVerbosityLevel, IapticOffer, IapticRN, IapticConfig } from '../src';
import { AppStateManager } from './AppState';

export const config = {
  iaptic: {
    appName: 'test',
    publicKey: '',
    iosBundleId: 'com.example.app',
    verbosity: IapticLoggerVerbosityLevel.DEBUG,
    products: [{
      id: 'com.example.app.pro',
      type: 'paid subscription',
      entitlements: ['pro_feature'],
    }, {
      id: 'com.example.app.premium',
      type: 'non consumable',
      entitlements: ['premium_feature'],
    }],
  } as IapticConfig
};

export class AppService {

  log(message: string, severity: IapticErrorSeverity = IapticErrorSeverity.INFO) {
    const SYMBOLS = ['💡', '🔔', '❌'];
    console.log(`${new Date().toISOString()} ${SYMBOLS[severity]} ${message}`);
  }

  /** Stateful app state returned by useState */
  private appState: AppStateManager;

  constructor(appState: AppStateManager) {
    this.appState = appState;
  }

  /**
   * Called when the app starts up.
   * 
   * @returns a destructor function that should be called when the app is closed
   */
  onAppStartup() {
    this.log('onAppStartup');    
    this.initIaptic();
    return () => {
      IapticRN.removeAllEventListeners();
    }
  }

  async initIaptic() {
    try {
      await IapticRN.initialize(config.iaptic);
      IapticRN.setApplicationUsername(this.appState.getState().applicationUsername);

      IapticRN.addEventListener('pendingPurchase.updated', purchase => {
        this.log('🔄 Pending purchase updated: ' + JSON.stringify(purchase));
        this.appState.updatePendingPurchase(purchase);
      });
  
      IapticRN.addEventListener('subscription.updated', (reason, purchase) => {
        this.log('🔄 Subscription updated: ' + reason + ' for ' + JSON.stringify(purchase));
        this.appState.set({ entitlements: IapticRN.listEntitlements() });
      });

      this.appState.set({
        availableProducts: IapticRN.getProducts(),
        entitlements: IapticRN.listEntitlements(),
      });
    }
    catch (err: any) {
      this.showError(err);
    }
  }

  /**
   * Show an error to the user
   */
  showError(error: Error | IapticError) {

    if (error instanceof IapticError) {
      this.log(`IapticRN #${error.code}: ${error.message}`, error.severity);
      if (error.severity === IapticErrorSeverity.INFO) return;
      if (error.severity === IapticErrorSeverity.WARNING && Platform.OS === 'android') {
        ToastAndroid.show(error.localizedMessage, ToastAndroid.SHORT);
      }
      else {
        Alert.alert(error.localizedTitle, error.localizedMessage);
      }
    }
    else {
      this.log(error.message, IapticErrorSeverity.ERROR);
      Alert.alert('Error', error.message);
    }
  }

  /**
   * Called when the user presses the subscribe button for a given subscription product
   */
  async handleSubscribeButton(offer: IapticOffer) {
    try {
      await IapticRN.order(offer);
    }
    catch (err: any) {
      this.showError(err);
    }
  }

  /**
   * - Process the historical record of valid purchases
   * - Useful for restoring purchases when:
   *   - User reinstalls the app
   *   - User switches devices
   *   - App starts fresh (no local storage)
   *   - Purchase succeeded but app crashed before purchaseUpdatedListener could process it
   *   - Any interruption during purchase flow (network issues, app crash, device shutdown)
   * - Acts as a safety net to ensure no purchases are lost
   */
  public async restorePurchases() {
    try {
      const numRestored = await IapticRN.restorePurchases((processed, total) => {
        this.appState.setRestorePurchasesProgress(processed, total);
      });
      Alert.alert(`${numRestored} purchases restored.`);
    } catch (error: any) {
      this.showError(error);
    }
  }

  /**
   * Check if a feature is unlocked
   * 
   * @param featureId - The feature ID to check
   */
  public checkFeatureAccess(featureId: string) {
    if (IapticRN.checkEntitlement(featureId)) {
      Alert.alert(`"${featureId}" feature is unlocked.`);
    }
    else {
      Alert.alert(`Please subscribe to the app to unlock feature "${featureId}".`);
    }
  }
}

