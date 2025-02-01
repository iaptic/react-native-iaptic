import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Locales } from '../../classes/Locales';

export interface EntitlementGridProps {
  entitlements: string[];
  labels: Record<string, {
    label: string;
    detail?: string;
  }>;
}

const EntitlementGrid = ({ entitlements, labels }: EntitlementGridProps) => (
  <View style={styles.grid}>
    {entitlements.map(entitlement => {
      const { label, detail } = labels[entitlement] || { label: entitlement };
      return (
        <View key={entitlement} style={styles.gridItem}>
          <Text style={styles.check}>
            {Locales.get('EntitlementGrid_Checkmark')}
          </Text>
          <View style={styles.textContainer}>
            <Text style={styles.label}>{label}</Text>
            {detail && <Text style={styles.detail}>{detail}</Text>}
          </View>
        </View>
      );
    })}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: '48%',
  },
  check: {
    color: '#007AFF',
    marginRight: 8,
    fontWeight: 'bold',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  detail: {
    color: '#666',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
});

export { EntitlementGrid }; 