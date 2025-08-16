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
              <View style={styles.categoryBadge}>
                <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(app.meta?.category || '') }]} />
                <Text style={styles.categoryText}>{app.meta?.category || 'Uncategorized'}</Text>
              </View>
            </View>
            <View style={styles.changeIndicator}>
              <Text style={[styles.changeValue, { color: getChangeColor(app.change) }]}>
                {app.change}
              </Text>
              <Text style={styles.changeLabel}>vs last month</Text>
            </View>
          </View>

          {/* Analytics Overview - Top Section */}
          <View style={styles.analyticsContainer}>
            <Text style={styles.sectionTitle}>Analytics Overview</Text>
            
            {/* Primary Metrics Row */}
            <View style={styles.primaryMetricsRow}>
              <View style={[styles.primaryMetric, styles.primaryMetricLeft]}>
                <Text style={styles.primaryMetricValue}>{app.value}</Text>
                <Text style={styles.primaryMetricLabel}>Usage Score</Text>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { 
                    width: `${(app.value / 100) * 100}%`,
                    backgroundColor: getCategoryColor(app.meta?.category || '') 
                  }]} />
                </View>
              </View>
              
              {app.meta?.monthly && (
                <View style={[styles.primaryMetric, styles.primaryMetricRight]}>
                  <Text style={styles.primaryMetricValue}>${app.meta.monthly}</Text>
                  <Text style={styles.primaryMetricLabel}>Monthly Cost</Text>
                  <Text style={styles.costPerSeat}>
                    ${app.meta.seats ? (app.meta.monthly / app.meta.seats).toFixed(2) : app.meta.monthly}/seat
                  </Text>
                </View>
              )}
            </View>

            {/* Analytics Grid */}
            <View style={styles.analyticsGrid}>
              {app.meta?.seats && (
                <View style={styles.analyticsCard}>
                  <View style={styles.analyticsCardHeader}>
                    <Text style={styles.analyticsIcon}>👥</Text>
                    <Text style={styles.analyticsValue}>{app.meta.seats}</Text>
                  </View>
                  <Text style={styles.analyticsLabel}>Active Seats</Text>
                  <Text style={styles.analyticsSubtext}>
                    {Math.round((app.meta.seats / (app.meta.seats + 5)) * 100)}% utilization
                  </Text>
                </View>
              )}
              
              <View style={styles.analyticsCard}>
                <View style={styles.analyticsCardHeader}>
                  <Text style={styles.analyticsIcon}>📊</Text>
                  <Text style={styles.analyticsValue}>{Math.round(app.value * 1.2)}%</Text>
                </View>
                <Text style={styles.analyticsLabel}>Efficiency</Text>
                <Text style={styles.analyticsSubtext}>
                  {app.value > 50 ? 'Above average' : 'Below average'}
                </Text>
              </View>
              
              <View style={styles.analyticsCard}>
                <View style={styles.analyticsCardHeader}>
                  <Text style={styles.analyticsIcon}>⚡</Text>
                  <Text style={styles.analyticsValue}>{Math.round(app.value / 7)}</Text>
                </View>
                <Text style={styles.analyticsLabel}>Daily Users</Text>
                <Text style={styles.analyticsSubtext}>
                  Last 7 days avg
                </Text>
              </View>
              
              <View style={styles.analyticsCard}>
                <View style={styles.analyticsCardHeader}>
                  <Text style={styles.analyticsIcon}>🎯</Text>
                  <Text style={styles.analyticsValue}>{85 + Math.round(app.value / 10)}%</Text>
                </View>
                <Text style={styles.analyticsLabel}>ROI Score</Text>
                <Text style={styles.analyticsSubtext}>
                  Value delivered
                </Text>
              </View>
            </View>

            {/* Usage Trend Chart */}
            <View style={styles.trendContainer}>
              <Text style={styles.trendTitle}>7-Day Usage Trend</Text>
              <View style={styles.trendChart}>
                {[65, 72, 68, 85, 92, 88, app.value].map((value, index) => (
                  <View key={index} style={styles.trendBar}>
                    <View style={[styles.trendBarFill, { 
                      height: `${value}%`,
                      backgroundColor: index === 6 ? getCategoryColor(app.meta?.category || '') : '#374151'
                    }]} />
                    <Text style={styles.trendDay}>
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Detailed Usage Analytics */}
          <View style={styles.detailedAnalyticsContainer}>
            <Text style={styles.sectionTitle}>Detailed Usage Analytics</Text>
            
            {/* Usage Patterns */}
            <View style={styles.usagePatternContainer}>
              <Text style={styles.subsectionTitle}>Usage Patterns</Text>
              <View style={styles.patternGrid}>
                <View style={styles.patternCard}>
                  <Text style={styles.patternValue}>{Math.round(app.value * 0.8)}</Text>
                  <Text style={styles.patternLabel}>Peak Hours</Text>
                  <Text style={styles.patternTime}>9AM - 5PM</Text>
                </View>
                <View style={styles.patternCard}>
                  <Text style={styles.patternValue}>{Math.round(app.value * 0.6)}</Text>
                  <Text style={styles.patternLabel}>Off Hours</Text>
                  <Text style={styles.patternTime}>6PM - 8AM</Text>
                </View>
                <View style={styles.patternCard}>
                  <Text style={styles.patternValue}>{Math.round(app.value * 0.3)}</Text>
                  <Text style={styles.patternLabel}>Weekend</Text>
                  <Text style={styles.patternTime}>Sat - Sun</Text>
                </View>
                <View style={styles.patternCard}>
                  <Text style={styles.patternValue}>{Math.round(app.value * 1.1)}</Text>
                  <Text style={styles.patternLabel}>Weekdays</Text>
                  <Text style={styles.patternTime}>Mon - Fri</Text>
                </View>
              </View>
            </View>

            {/* Feature Usage */}
            <View style={styles.featureUsageContainer}>
              <Text style={styles.subsectionTitle}>Feature Utilization</Text>
              <View style={styles.featureList}>
                {[
                  { name: 'Core Features', usage: 85, color: '#22c55e' },
                  { name: 'Advanced Tools', usage: 62, color: '#3b82f6' },
                  { name: 'Integrations', usage: 43, color: '#f59e0b' },
                  { name: 'Admin Panel', usage: 28, color: '#8b5cf6' },
                ].map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={styles.featureInfo}>
                      <Text style={styles.featureName}>{feature.name}</Text>
                      <Text style={styles.featurePercentage}>{feature.usage}%</Text>
                    </View>
                    <View style={styles.featureProgressBar}>
                      <View style={[styles.featureProgressFill, { 
                        width: `${feature.usage}%`,
                        backgroundColor: feature.color 
                      }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Cost Analysis */}
            <View style={styles.costAnalysisContainer}>
              <Text style={styles.subsectionTitle}>Cost Analysis</Text>
              <View style={styles.costGrid}>
                <View style={styles.costCard}>
                  <Text style={styles.costIcon}>💰</Text>
                  <Text style={styles.costValue}>${app.meta?.monthly || 0}</Text>
                  <Text style={styles.costLabel}>Current Monthly</Text>
                </View>
                <View style={styles.costCard}>
                  <Text style={styles.costIcon}>📊</Text>
                  <Text style={styles.costValue}>${Math.round((app.meta?.monthly || 0) * 12)}</Text>
                  <Text style={styles.costLabel}>Annual Cost</Text>
                </View>
                <View style={styles.costCard}>
                  <Text style={styles.costIcon}>💡</Text>
                  <Text style={styles.costValue}>${Math.round((app.meta?.monthly || 0) * 0.85)}</Text>
                  <Text style={styles.costLabel}>Optimized Est.</Text>
                </View>
                <View style={styles.costCard}>
                  <Text style={styles.costIcon}>📈</Text>
                  <Text style={[styles.costValue, { color: getChangeColor(app.change) }]}>
                    ${Math.round((app.meta?.monthly || 0) * (parseFloat(app.change.replace(/[+%-]/g, '')) || 0) / 100)}
                  </Text>
                  <Text style={styles.costLabel}>Monthly Change</Text>
                </View>
              </View>
            </View>

            {/* Performance Metrics */}
            <View style={styles.performanceContainer}>
              <Text style={styles.subsectionTitle}>Performance Metrics</Text>
              <View style={styles.performanceGrid}>
                <View style={styles.performanceCard}>
                  <View style={styles.performanceHeader}>
                    <Text style={styles.performanceIcon}>⚡</Text>
                    <Text style={styles.performanceTitle}>Response Time</Text>
                  </View>
                  <Text style={styles.performanceValue}>{Math.round(100 - app.value * 0.5)}ms</Text>
                  <Text style={styles.performanceStatus}>Excellent</Text>
                </View>
                <View style={styles.performanceCard}>
                  <View style={styles.performanceHeader}>
                    <Text style={styles.performanceIcon}>🔍</Text>
                    <Text style={styles.performanceTitle}>Uptime</Text>
                  </View>
                  <Text style={styles.performanceValue}>{(99.5 + app.value * 0.005).toFixed(2)}%</Text>
                  <Text style={styles.performanceStatus}>Stable</Text>
                </View>
                <View style={styles.performanceCard}>
                  <View style={styles.performanceHeader}>
                    <Text style={styles.performanceIcon}>👥</Text>
                    <Text style={styles.performanceTitle}>User Satisfaction</Text>
                  </View>
                  <Text style={styles.performanceValue}>{Math.round(80 + app.value * 0.2)}%</Text>
                  <Text style={styles.performanceStatus}>High</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Subscription Details */}
          <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Subscription Details</Text>
            
            <View style={styles.detailsGrid}>
              {app.meta?.owner && (
                <View style={styles.detailCard}>
                  <View style={styles.detailIconContainer}>
                    <Text style={styles.detailIcon}>👤</Text>
                  </View>
                  <View style={styles.detailInfo}>
                    <Text style={styles.detailLabel}>Owner</Text>
                    <Text style={styles.detailValue}>{app.meta.owner}</Text>
                  </View>
                </View>
              )}
              
              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Text style={styles.detailIcon}>🏷️</Text>
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Category</Text>
                  <Text style={styles.detailValue}>{app.meta?.category || 'Uncategorized'}</Text>
                </View>
              </View>
              
              {app.meta?.monthly && app.meta?.seats && (
                <View style={styles.detailCard}>
                  <View style={styles.detailIconContainer}>
                    <Text style={styles.detailIcon}>💰</Text>
                  </View>
                  <View style={styles.detailInfo}>
                    <Text style={styles.detailLabel}>Cost per Seat</Text>
                    <Text style={styles.detailValue}>
                      ${(app.meta.monthly / app.meta.seats).toFixed(2)}
                    </Text>
                  </View>
                </View>
              )}
              
              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Text style={styles.detailIcon}>📅</Text>
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Billing Cycle</Text>
                  <Text style={styles.detailValue}>Monthly</Text>
                </View>
              </View>
              
              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Text style={styles.detailIcon}>🔄</Text>
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Next Renewal</Text>
                  <Text style={styles.detailValue}>
                    {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.detailCard}>
                <View style={styles.detailIconContainer}>
                  <Text style={styles.detailIcon}>📈</Text>
                </View>
                <View style={styles.detailInfo}>
                  <Text style={styles.detailLabel}>Growth Rate</Text>
                  <Text style={[styles.detailValue, { color: getChangeColor(app.change) }]}>
                    {app.change}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
              <Text style={styles.actionButtonIcon}>⚙️</Text>
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Manage Subscription</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.tertiaryButton]}>
              <Text style={styles.actionButtonIcon}>📤</Text>
              <Text style={[styles.actionButtonText, styles.tertiaryButtonText]}>Export Analytics</Text>
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
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
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
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 8,
  },
  changeIndicator: {
    alignItems: 'flex-end',
  },
  changeValue: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  changeLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
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
  analyticsContainer: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 20,
  },
  primaryMetricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  primaryMetric: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    flex: 1,
  },
  primaryMetricLeft: {
    marginRight: 6,
  },
  primaryMetricRight: {
    marginLeft: 6,
  },
  primaryMetricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  primaryMetricLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  costPerSeat: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  analyticsCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    width: (screenWidth - 68) / 2,
  },
  analyticsCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  analyticsIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  analyticsValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
  },
  analyticsLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 4,
  },
  analyticsSubtext: {
    fontSize: 12,
    color: '#64748b',
  },
  trendContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 16,
  },
  trendChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
  },
  trendBar: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  trendBarFill: {
    width: 24,
    borderRadius: 12,
    marginBottom: 8,
    minHeight: 4,
  },
  trendDay: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 30,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    width: (screenWidth - 68) / 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  detailIcon: {
    fontSize: 18,
  },
  detailInfo: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  actionsContainer: {
    gap: 12,
    paddingBottom: 20,
  },
  actionButton: {
    backgroundColor: '#6366f1',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#374151',
  },
  secondaryButtonText: {
    color: '#f8fafc',
  },
  tertiaryButton: {
    backgroundColor: '#1e293b',
    borderWidth: 0,
  },
  tertiaryButtonText: {
    color: '#94a3b8',
  },
  // Detailed Analytics Styles
  detailedAnalyticsContainer: {
    marginBottom: 30,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 16,
  },
  // Usage Patterns
  usagePatternContainer: {
    marginBottom: 24,
  },
  patternGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  patternCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    width: (screenWidth - 68) / 2,
    alignItems: 'center',
  },
  patternValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  patternLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 2,
  },
  patternTime: {
    fontSize: 12,
    color: '#64748b',
  },
  // Feature Usage
  featureUsageContainer: {
    marginBottom: 24,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
  },
  featureInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f8fafc',
  },
  featurePercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  featureProgressBar: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    overflow: 'hidden',
  },
  featureProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  // Cost Analysis
  costAnalysisContainer: {
    marginBottom: 24,
  },
  costGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  costCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    width: (screenWidth - 68) / 2,
    alignItems: 'center',
  },
  costIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  costValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  costLabel: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  // Performance Metrics
  performanceContainer: {
    marginBottom: 24,
  },
  performanceGrid: {
    gap: 12,
  },
  performanceCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
  },
  performanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  performanceIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f8fafc',
  },
  performanceValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  performanceStatus: {
    fontSize: 14,
    color: '#22c55e',
    fontWeight: '500',
  },
});

export default AppDetailScreen;
