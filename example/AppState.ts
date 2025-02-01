import { IapticProduct } from '../src';

/**
 * The state of the app
 */
export interface AppState {

  /** Pseudo-identifier of the user logged in the app, for demo purposes */
  applicationUsername: string;

  /** List of products available for purchase */
  availableProducts: IapticProduct[];

  /** Entitlements of the user */
  entitlements: string[];

  /** Progress of restoring purchases */
  restorePurchasesInProgress?: {
    numDone: number;
    total: number;
  };
}

/**
 * The initial state of the app
 */
export const initialAppState: AppState = {
  applicationUsername: 'iaptic-rn-demo-user',
  availableProducts: [],
  restorePurchasesInProgress: undefined,
  entitlements: [],
}

/**
 * Manages the app state
 */
export class AppStateManager {

  private _state: AppState;

  /** The app state */
  private appState: AppState;

  /** The function to update the app state */
  private setAppState: (appState: AppState) => void;

  constructor([appState, setAppState]: [AppState, (appState: AppState) => void]) {
    console.log('AppStateManager constructor');
    this._state = {...appState};
    this.appState = appState;
    this.setAppState = setAppState;
  }

  /**
   * Update part of the app state
   * 
   * @param value - Fields to update
   */
  set(value: Partial<AppState>) {
    this._state = { ...this._state, ...value };
    this.setAppState(this._state);
  }

  setRestorePurchasesProgress(numDone: number, total: number) {
    if (numDone >= total) {
      this.set({ restorePurchasesInProgress: undefined });
    } else {
      this.set({ restorePurchasesInProgress: { numDone, total } });
    }
  }

  /**
   * Get the app state
   */
  getState() { 
    return this.appState;
  }
}