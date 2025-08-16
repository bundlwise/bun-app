import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { TreeMapItem } from '../components/TreeMap';

type Props = NativeStackScreenProps<RootStackParamList, 'AppDetail'>;

const { width: screenWidth } = Dimensions.get('window');

const AppDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { app } = route.params;

  const handleGoBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const getChangeColor = React.useCallback((change: string) => {
    return change.startsWith('+') ? '#22c55e' : '#ef4444';
  }, []);

  const getCategoryColor = React.useCallback((category: string) => {
    const colors: Record<string, string> = {
      Design: '#6366f1',
      Knowledge: '#0ea5e9',
      Collaboration: '#10b981',
      PM: '#f59e0b',
      Dev: '#ec4899',
      Infra: '#84cc16',
      Monitoring: '#8b5cf6',
    };
    return colors[category] || '#64748b';
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>App Details</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.content}>
          {/* App Header */}
          <View style={styles.appHeader}>
            <View style={[styles.appIcon, { backgroundColor: getCategoryColor(app.meta?.category || '') }]}>
              <Text style={styles.appIconText}>{app.name.charAt(0)}</Text>
            </View>
            <View style={styles.appInfo}>
              <Text style={styles.appName}>{app.name}</Text>
              <Text style={styles.appCategory}>{app.meta?.category || 'Uncategorized'}</Text>
            </View>
          </View>

          {/* Key Metrics */}
          <View style={styles.metricsContainer}>
            <Text style={styles.sectionTitle}>Key Metrics</Text>
            
            <View style={styles.metricsGrid}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{app.value}</Text>
                <Text style={styles.metricLabel}>Usage Score</Text>
              </View>
              
              <View style={styles.metricCard}>
                <Text style={[styles.metricValue, { color: getChangeColor(app.change) }]}>
                  {app.change}
                </Text>
                <Text style={styles.metricLabel}>Change</Text>
              </View>
              
              {app.meta?.monthly && (
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>${app.meta.monthly}</Text>
                  <Text style={styles.metricLabel}>Monthly Cost</Text>
                </View>
              )}
              
              {app.meta?.seats && (
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{app.meta.seats}</Text>
                  <Text style={styles.metricLabel}>Active Seats</Text>
                </View>
              )}
            </View>
          </View>

          {/* Additional Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Details</Text>
            
            {app.meta?.owner && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Owner</Text>
                <Text style={styles.detailValue}>{app.meta.owner}</Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <View style={styles.categoryBadge}>
                <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(app.meta?.category || '') }]} />
                <Text style={styles.categoryText}>{app.meta?.category || 'Uncategorized'}</Text>
              </View>
            </View>
            
            {app.meta?.monthly && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Cost per Seat</Text>
                <Text style={styles.detailValue}>
                  ${app.meta.seats ? (app.meta.monthly / app.meta.seats).toFixed(2) : app.meta.monthly}
                </Text>
              </View>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>View Usage Analytics</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Manage Subscription</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07080a',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 20,
    color: '#f8fafc',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 20,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  appIconText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  appCategory: {
    fontSize: 16,
    color: '#64748b',
  },
  metricsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    minWidth: (screenWidth - 56) / 2,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  detailsContainer: {
    marginBottom: 30,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  detailLabel: {
    fontSize: 16,
    color: '#94a3b8',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f8fafc',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f8fafc',
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#374151',
  },
  secondaryButtonText: {
    color: '#f8fafc',
  },
});

export default AppDetailScreen;
