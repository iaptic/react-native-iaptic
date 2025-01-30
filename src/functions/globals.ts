/**
 * Internal utility functions for managing global state in the iaptic React Native SDK.
 * These functions provide a controlled way to store and retrieve values in a dedicated
 * global namespace to avoid polluting the global scope.
 */

interface IapticGlobalInternals {
  active_iap_events_processor?: string;
}

interface IapticGlobal {
  _iaptic_rn_internals?: IapticGlobalInternals;
}

// This is necessary as we're extending the actual global object
declare const global: IapticGlobal;

/**
 * Sets a value in the iaptic global namespace
 * @param key - The key under which to store the value
 * @param value - The value to store
 */
export function globalsSet<K extends keyof IapticGlobalInternals>(key: K, value: IapticGlobalInternals[K]): void {
  globalObject()[key] = value;
}

/**
 * Retrieves a value from the iaptic global namespace
 * @param key - The key of the value to retrieve
 * @returns The stored value, or undefined if not found
 */
export function globalsGet<K extends keyof IapticGlobalInternals>(key: K): IapticGlobalInternals[K] | undefined {
  return globalObject()[key];
}

/**
 * Gets or creates the internal global object used for storing iaptic-specific values
 * @returns The internal global object
 * @internal
 */
function globalObject(): IapticGlobalInternals {
  if (typeof global !== 'object' || global === null) {
    throw new Error('Global object is not available');
  }

  const internals = global._iaptic_rn_internals;
  if (!internals) {
    return global._iaptic_rn_internals = {};
  }
  return internals;
}
