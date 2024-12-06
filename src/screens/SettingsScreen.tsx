// src/screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { ComponentProps } from 'react'; // Import for Ionicons name type
import { useTheme } from '../context/ThemeContext';
import { RootParamList } from '../types';
import { Alert } from 'react-native';

type SettingsScreenNavigationProp = StackNavigationProp<RootParamList, 'Settings'>;
type IconName = ComponentProps<typeof Ionicons>['name']; // Type for Ionicons name

export default function SettingsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const renderSettingItem = (
    icon: IconName,
    label: string,
    action: () => void,
    value?: boolean
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: colors.border }]}
      onPress={action}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color={colors.primary} />
        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>{label}</Text>
      </View>
      {typeof value !== 'undefined' ? (
        <Switch
          value={value}
          onValueChange={action}
          trackColor={{ false: colors.border, true: colors.primary }}
        />
      ) : (
        <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.cardBg,
            borderBottomColor: colors.border,
            paddingTop: Platform.OS === 'ios' ? 60 : 40,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Dashboard', { initialView: 'operator' })}
        >
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>
      </View>

      {/* Settings Content */}
      <View style={styles.content}>
        {renderSettingItem('notifications', 'Notification Settings', () =>
          navigation.navigate('NotificationSettings')
        )}
        {renderSettingItem('person', 'Account Settings', () =>
          navigation.navigate('AccountSettings')
        )}
        {renderSettingItem('key', 'Change Password', () =>
          navigation.navigate('ChangePassword')
        )}
        {renderSettingItem('log-out', 'Logout', () => {
          Alert.alert('Logout', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', onPress: () => navigation.navigate('Login') },
          ]);
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
});
