import { Platform } from 'react-native';
import { IapticPurchasePlatform } from "../types";

/**
 * Get the platform of the purchase
 * 
 * @param os - The operating system
 * @returns The platform of the purchase
 */
export function getPlatform(os?: string): IapticPurchasePlatform {
  return (os ?? Platform.OS) === 'android' ? IapticPurchasePlatform.GOOGLE_PLAY : IapticPurchasePlatform.APPLE_APPSTORE;
}  
