// src/screens/ManagementDashboardScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { useTheme } from '../hooks/useTheme';
import RouteAssignmentModal from '../components/RouteAssignmentModal';
import { StatItem } from '../components/StatItem';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TeamMember, Route } from '../types/firestore';

export default function ManagementDashboardScreen() {
  const { colors } = useTheme();
  const db = getFirestore();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [isAssignmentModalVisible, setIsAssignmentModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const teamSnapshot = await getDocs(collection(db, 'teamMembers'));
      const fetchedTeamMembers: TeamMember[] = teamSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as TeamMember));

      const routesSnapshot = await getDocs(collection(db, 'routes'));
      const fetchedRoutes: Route[] = routesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Route));

      setTeamMembers(fetchedTeamMembers);
      setRoutes(fetchedRoutes);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Alert.alert('Error', 'Failed to fetch data for the dashboard.');
    } finally {
      setLoading(false);
    }
  }, [db]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleRouteAssignment = (routeNumber: string) => {
    setSelectedRoute(routeNumber);
    setIsAssignmentModalVisible(true);
  };

  const handleAssignRoute = async (teamMemberId: string) => {
    if (!selectedRoute) return;
    try {
      const routeRef = doc(db, 'routes', selectedRoute);
      await updateDoc(routeRef, {
        assignedTo: teamMemberId,
        lastUpdated: serverTimestamp(),
      });

      setRoutes((prevRoutes) =>
        prevRoutes.map((route) =>
          route.id === selectedRoute ? { ...route, assignedTo: teamMemberId } : route
        )
      );
      setIsAssignmentModalVisible(false);
    } catch (error) {
      console.error('Error assigning route:', error);
      Alert.alert('Error', 'Failed to assign the route.');
    }
  };

  // Render components
  const renderTeamOverview = () => {
    const totalStores = routes.reduce((acc, route) => acc + route.storeCount, 0);

    return (
      <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Team Overview</Text>
        <View style={styles.teamStats}>
          <StatItem value={teamMembers.length.toString()} label="Team Members" />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatItem value={routes.length.toString()} label="Routes" />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <StatItem value={totalStores.toString()} label="Total Stores" />
        </View>
      </View>
    );
  };

  const renderTeamActivity = () => (
    <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
      <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Team Activity</Text>
      {teamMembers.map((member) => (
        <View
          key={member.id}
          style={[styles.teamMemberItem, { borderBottomColor: colors.border }]}
        >
          <View>
            <Text style={[styles.memberName, { color: colors.textPrimary }]}>{member.name}</Text>
            <Text style={[styles.memberDetails, { color: colors.textSecondary }]}>
              Routes: {member.assignedRoutes.join(', ') || 'None'}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );

  const renderRouteAssignments = () => (
    <View style={[styles.card, { backgroundColor: colors.cardBg }]}>
      <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Route Assignments</Text>
      {routes.map((route) => (
        <View
          key={route.id}
          style={[styles.routeItem, { borderBottomColor: colors.border }]}
        >
          <View>
            <Text style={[styles.routeText, { color: colors.textPrimary }]}>
              Route {route.number}
            </Text>
            <Text style={[styles.routeDetails, { color: colors.textSecondary }]}>
              {route.storeCount} stores
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.assignButton, { backgroundColor: colors.primary }]}
            onPress={() => handleRouteAssignment(route.id)}
          >
            <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
              {route.assignedTo ? `Assigned to ${route.assignedTo}` : 'Assign'}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      <View style={[styles.header, { backgroundColor: colors.primary, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Management Dashboard</Text>
      </View>

      <ScrollView style={[styles.content, { backgroundColor: colors.background }]}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <>
            {renderTeamOverview()}
            {renderRouteAssignments()}
            {renderTeamActivity()}
          </>
        )}
      </ScrollView>

      <RouteAssignmentModal
        visible={isAssignmentModalVisible}
        onClose={() => setIsAssignmentModalVisible(false)}
        routeNumber={selectedRoute || ''}
        teamMembers={teamMembers}
        onAssign={handleAssignRoute}
      />
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  teamStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 40,
  },
  routeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  routeDetails: {
    fontSize: 14,
    marginTop: 4,
  },
  assignButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  teamMemberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  memberDetails: {
    fontSize: 14,
    color: '#6b7280', // Optional: Adjust color based on your theme
  },
});