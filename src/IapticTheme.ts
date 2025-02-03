/**
 * Theme configuration for Iaptic components
 * 
 * @example
 * {
 *   primaryColor: '#007AFF',
 *   secondaryColor: '#4CAF50',
 *   backgroundColor: '#FFFFFF',
 *   textColor: '#1A1A1A',
 *   secondaryTextColor: '#666666',
 *   borderColor: '#EEEEEE',
 *   successColor: '#4CAF50',
 *   warningColor: '#FF9800',
 *   errorColor: '#FF3B30'
 * }
 */
export interface IapticTheme {
  /** Primary brand color for buttons, highlights */
  primaryColor: string;
  /** Secondary color for current plan badges, success states */
  secondaryColor: string;
  /** Background color for modals/cards */
  backgroundColor: string;
  /** Primary text color */
  textColor: string;
  /** Secondary/subdued text color */
  secondaryTextColor: string;
  /** Border and divider colors */
  borderColor: string;
  /** Success states color */
  successColor?: string;
  /** Warning states color */
  warningColor?: string;
  /** Error states color */
  errorColor?: string;
}

/** Default theme values */
export const defaultTheme: IapticTheme = {
  primaryColor: '#007AFF',
  secondaryColor: '#4CAF50',
  backgroundColor: '#FFFFFF',
  textColor: '#1A1A1A',
  secondaryTextColor: '#666666',
  borderColor: '#EEEEEE',
  successColor: '#4CAF50',
  warningColor: '#FF9800',
  errorColor: '#FF3B30',
}; 