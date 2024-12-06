// src/screens/OperatorDashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useTheme } from '../hooks/useTheme';

interface ExpiringItem {
  description: string;
  expiryDate: string;
  product?: string;
  daysLeft?: number;
  isShortCoded?: boolean;
  orderNumber?: string;
}

interface OperatorDashboardProps {
  primaryRoute: string | null;
}

export default function OperatorDashboard({ primaryRoute }: OperatorDashboardProps) {
  const { colors } = useTheme();
  const [routeData, setRouteData] = useState<{ expiringItems: ExpiringItem[] } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRouteData = async () => {
      console.log('[OperatorDashboard] Attempting to fetch route data for:', primaryRoute);
      
      if (!primaryRoute) {
        console.log('[OperatorDashboard] No primary route provided');
        setLoading(false);
        return;
      }

      try {
        const db = getFirestore();
        console.log('[OperatorDashboard] Fetching route doc:', `routes/${primaryRoute}`);
        
        const routeDoc = await getDoc(doc(db, 'routes', primaryRoute));
        console.log('[OperatorDashboard] Route doc exists:', routeDoc.exists());
        
        if (routeDoc.exists()) {
          const data = routeDoc.data();
          console.log('[OperatorDashboard] Route data:', JSON.stringify(data, null, 2));
          setRouteData(data as { expiringItems: ExpiringItem[] });
        } else {
          console.log('[OperatorDashboard] Route document not found');
        }
      } catch (error) {
        console.error('[OperatorDashboard] Error fetching route data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteData();
  }, [primaryRoute]);

  const getStatusStyle = (daysLeft: number, isShortCoded: boolean) => {
    if (isShortCoded) {
      if (daysLeft <= 3) return { color: colors.error, label: 'Credit Eligible' };
      if (daysLeft <= 5) return { color: colors.warning, label: 'Short-Coded' };
    }
    if (daysLeft <= 5) return { color: colors.warning, label: 'Expiring Soon' };
    return { color: colors.primary, label: 'Upcoming' };
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!primaryRoute) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>No route assigned</Text>
      </View>
    );
  }

  // Calculate stats
  const stats = {
    needingAction: routeData?.expiringItems?.filter(item => item.daysLeft && item.daysLeft <= 5).length || 0,
    shortCoded: routeData?.expiringItems?.filter(item => item.isShortCoded).length || 0,
    totalActive: routeData?.expiringItems?.length || 0,
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Route {primaryRoute}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Last updated: {new Date().toLocaleTimeString()}
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.scanButton, { backgroundColor: colors.primary }]}
          onPress={() => {/* Handle scan */}}
        >
          <Text style={styles.scanButtonText}>New Scan</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats.needingAction}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Need Action</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats.shortCoded}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Short Coded</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.cardBg }]}>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>{stats.totalActive}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Items</Text>
        </View>
      </View>

      {/* Items List */}
      <View style={[styles.itemsCard, { backgroundColor: colors.cardBg }]}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Active Items</Text>
        
        {(!routeData || routeData.expiringItems.length === 0) ? (
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No items expiring soon
          </Text>
        ) : (
          routeData.expiringItems.map((item, index) => {
            const status = getStatusStyle(item.daysLeft || 0, item.isShortCoded || false);
            return (
              <View 
                key={index} 
                style={[styles.itemCard, { backgroundColor: colors.backgroundAlt }]}
              >
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemTitle, { color: colors.textPrimary }]}>
                    {item.description}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: colors.cardBg }]}>
                    <Text style={[styles.statusText, { color: status.color }]}>
                      {status.label}
                    </Text>
                  </View>
                </View>
                <View style={styles.itemDetails}>
                  <Text style={[styles.itemDetail, { color: colors.textSecondary }]}>
                    Product: {item.product || 'N/A'}
                  </Text>
                  <Text style={[styles.itemDetail, { color: colors.textSecondary }]}>
                    Order: {item.orderNumber || 'N/A'}
                  </Text>
                  <Text style={[styles.itemDetail, { color: status.color }]}>
                    {item.daysLeft || 0} days left
                  </Text>
                  <Text style={[styles.itemDetail, { color: colors.textSecondary }]}>
                    Best Before: {item.expiryDate}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  scanButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  itemsCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    padding: 16,
  },
  itemCard: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  itemDetails: {
    gap: 4,
  },
  itemDetail: {
    fontSize: 14,
  },
});