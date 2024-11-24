import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '../navigation';
import { Ionicons } from '@expo/vector-icons';

interface ExpiringItem {
  productNumber: string; // Changed from `name`
  description: string; // Changed from `location`
  expiryDate: string; // Expected as mm/dd/yyyy
  daysUntilExpiry: number;
}

export default function DashboardScreen() {
  const { navigate } = useNavigation();

  const expiringItems: ExpiringItem[] = [
    {
      productNumber: '34117',
      description: 'Mission 7" Yellow Corn 10ct',
      expiryDate: '11/25/2024', // Adjusted format
      daysUntilExpiry: 2,
    },
    {
      productNumber: '31032',
      description: 'Mission Yellow Corn 24ct',
      expiryDate: '11/26/2024', // Adjusted format
      daysUntilExpiry: 3,
    },
    {
      productNumber: '22882',
      description: 'Mission Whole Wheat Soft Taco',
      expiryDate: '11/27/2024', // Adjusted format
      daysUntilExpiry: 4,
    },
  ];

  const getExpiryColor = (days: number): string => {
    if (days <= 1) return '#ef4444';
    if (days <= 3) return '#f59e0b';
    return '#10b981';
  };

  const formatDate = (dateStr: string): string => {
    // Input date format is mm/dd/yyyy, return in desired display format
    const [month, day, year] = dateStr.split('/');
    return `${month}/${day}/${year}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Expiring Soon</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Today</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>23</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>

        <View style={styles.expiryList}>
          <Text style={styles.sectionTitle}>Items to Check</Text>
          {expiringItems.map((item, index) => (
            <View key={index} style={styles.expiryItem}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.productNumber}</Text>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemDescription}>
                    {item.description}
                  </Text>
                  <Text style={styles.expiryDate}>
                    <Ionicons name="calendar" size={12} color="#94a3b8" /> {formatDate(item.expiryDate)}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.expiryBadge,
                  { backgroundColor: getExpiryColor(item.daysUntilExpiry) + '20' },
                ]}
              >
                <Text
                  style={[
                    styles.expiryText,
                    { color: getExpiryColor(item.daysUntilExpiry) },
                  ]}
                >
                  {item.daysUntilExpiry} {item.daysUntilExpiry === 1 ? 'day' : 'days'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.navButton} onPress={() => navigate('Search')}>
          <Ionicons name="search" size={24} color="#e2e8f0" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.scanButton} onPress={() => navigate('Scan')}>
          <Ionicons name="scan" size={32} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => navigate('Settings')}>
          <Ionicons name="settings-outline" size={24} color="#e2e8f0" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Styles remain the same as before
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#660000',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e2e8f0',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 16,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e2e8f0',
  },
  statLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#334155',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginBottom: 16,
  },
  expiryList: {
    flex: 1,
  },
  expiryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemDescription: {
    fontSize: 14,
    color: '#94a3b8',
  },
  expiryDate: {
    fontSize: 14,
    color: '#94a3b8',
  },
  expiryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  expiryText: {
    fontSize: 14,
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  navButton: {
    padding: 12,
  },
  scanButton: {
    backgroundColor: '#660000',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
