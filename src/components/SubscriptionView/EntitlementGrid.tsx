import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Locales } from '../../classes/Locales';
import { defaultTheme, IapticTheme } from '../../IapticTheme';

/**
 * Props for the EntitlementGrid component
 * 
 * @internal
 */
export interface EntitlementGridProps {
  /**
   * Entitlements to display
   */
  entitlements: string[];
  /**
   * Labels for each entitlement
   */
  labels: Record<string, {
    label: string;
    detail?: string;
  }>;
  /**
   * Theme configuration
   */
  theme?: Partial<IapticTheme>;
}

/**
 * Grid of entitlements with checkmarks and labels
 * 
 * @remarks React Component
 * 
 * @internal
 */
export const EntitlementGrid = (props: EntitlementGridProps) => {
  const { entitlements, labels, theme: customTheme } = props;
  const theme = { ...defaultTheme, ...customTheme };

  return (
    <View style={styles(theme).grid}>
      {entitlements.map(entitlement => {
        const { label, detail } = labels[entitlement] || { label: entitlement };
        return (
          <View key={entitlement} style={styles(theme).gridItem}>
            <Text style={styles(theme).check}>
              {Locales.get('EntitlementGrid_Checkmark')}
            </Text>
            <View style={styles(theme).textContainer}>
              <Text style={styles(theme).label}>{label}</Text>
              {detail && <Text style={styles(theme).detail}>{detail}</Text>}
            </View>
          </View>
        );
      })}
    </View>
  );
}

/**
 * Styles for the EntitlementGrid component
 * 
 * @internal
 */
const styles = (theme: IapticTheme) => StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${theme.primaryColor}08`, // 8% opacity
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: '48%',
  },
  check: {
    color: theme.primaryColor,
    marginRight: 8,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    color: theme.textColor,
    fontSize: 14,
    fontWeight: '500',
  },
  detail: {
    color: theme.secondaryTextColor,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
});