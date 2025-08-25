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
import TreeMap from '../components/TreeMap';
import Button from '../components/Button';

type Props = NativeStackScreenProps<RootStackParamList, 'AppDetail'>;

const { width: screenWidth } = Dimensions.get('window');

const AppDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { app } = route.params;

  // Get current month name
  const getCurrentMonth = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    return months[currentDate.getMonth()];
  };

  // Get last month name
  const getLastMonth = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    return months[lastMonth.getMonth()];
  };

  // Create TreeMap data for the 4 cards (Last Month, 3 Months, 6 Months, Add)
  const fourCardsData: TreeMapItem[] = [
    {
      name: getLastMonth(),
      value: Math.round((app.meta?.monthly || 0) * 0.9),
      change: '+5.2%',
      meta: { 
        monthly: Math.round((app.meta?.monthly || 0) * 0.9),
        category: 'Last Month',
        showTitle: true,
        showLabel: true,
        label: 'Last Month',
        paymentDate: 'Last Month' // This will show "Last Month" in bottom right
      }
    },
    {
      name: '3 Month',
      value: app.meta?.threeMonths || 0,
      change: '+12.5%',
      meta: { 
        monthly: app.meta?.threeMonths || 0,
        category: '3 Months',
        showTitle: false,
        showLabel: true,
        label: '3 Month'
      }
    },
    {
      name: '6 Month',
      value: app.meta?.sixMonths || 0,
      change: '+8.3%',
      meta: { 
        monthly: app.meta?.sixMonths || 0,
        category: '6 Months',
        showTitle: false,
        showLabel: true,
        label: '6 Month'
      }
    },
    {
      name: 'Add',
      value: 0.1, // Very small value to ensure it appears last
      change: '+0%',
      color: '#ffffff',
      meta: { 
        monthly: 0,
        category: 'Add',
        isAddAction: true,
        showTitle: false,
        showLabel: false
      }
    }
  ];

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
      Entertainment: '#f43f5e',
      Food: '#06b6d4',
    };
    return colors[category] || '#64748b';
  }, []);

  // Calculate total amount spent (assuming it's the monthly cost * some multiplier)
  const totalAmountSpent = React.useMemo(() => {
    const monthlyCost = app.meta?.monthly || 0;
    // For demo purposes, let's assume total spent is monthly cost * 12 (annual)
    return monthlyCost * 12;
  }, [app.meta?.monthly]);

  const handleCancel = () => {
    // Handle cancel action
    console.log('Cancel pressed');
    navigation.goBack();
  };

  const handlePay = () => {
    // Handle pay action
    console.log('Pay pressed');
    // You can navigate to payment screen or show payment modal
  };

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
          {/* App Header with Total Amount */}
          <View style={styles.appHeader}>
            <View style={[styles.appIcon, { backgroundColor: getCategoryColor(app.meta?.category || '') }]}>
              <Text style={styles.appIconText}>{app.name.charAt(0)}</Text>
            </View>
            <View style={styles.appInfo}>
              <Text style={styles.appName}>{app.name}</Text>
              <Text style={styles.totalAmount}>${totalAmountSpent.toLocaleString()}</Text>
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

          {/* Current Month Amount Card */}
          <View style={[
            styles.monthCard,
            getCurrentMonth() === 'Aug' && styles.augustCard
          ]}>
            <View style={styles.monthCardTopLeft}>
              <Text style={styles.monthTitle}>{getCurrentMonth()}</Text>
            </View>
            <View style={styles.monthCardCenter}>
              <Text style={styles.monthAmount}>${app.meta?.monthly || 0}</Text>
            </View>
            <View style={styles.monthCardBottomRight}>
              <Text style={styles.monthLabel}>Current Month</Text>
            </View>
          </View>

          {/* TreeMap for 4 Cards */}
          <View style={styles.treeMapContainer}>
            <TreeMap 
              data={fourCardsData}
              onSelect={(item) => {
                if (item.meta?.isAddAction) {
                  console.log('Add action triggered');
                  // Handle add action
                } else {
                  console.log('Selected:', item.name);
                  // Handle card selection
                }
              }}
              height={300}
              hideFilterRow={true}
              transparentBackground={true}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <Button
              title="Cancel"
              onPress={handleCancel}
              backgroundColor="transparent"
              borderColor="#374151"
              borderWidth={2}
              textStyle={styles.cancelButtonText}
              width="48%"
            />
            
            <Button
              title="Pay"
              onPress={handlePay}
              backgroundColor="#6366f1"
              textStyle={styles.payButtonText}
              width="48%"
            />
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  backButtonText: {
    fontSize: 24,
    color: '#f8fafc',
    fontWeight: '700',
    top: -4,
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
    alignItems: 'center',
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: '#000000',
    borderRadius: 0,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ffffff',
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
    marginBottom: 4,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '600',
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
  monthCard: {
    backgroundColor: '#000000',
    borderRadius: 0,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffffff',
    position: 'relative',
  },
  monthCardTopLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  monthCardCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  monthCardBottomRight: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
  augustCard: {
    borderRadius: 0,
    height: 260,
    width: 370,
    marginBottom: 0,
    marginTop: -20, // 👈 ye bhi chalega (upar shift hoga)
  },
  
  julyCard: {
    borderRadius: 0,
    width: '48%',
    height: 150,
    marginLeft: 7,
  },
  lastMonthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: -5,
    alignSelf: 'flex-start',
    marginLeft: -3,
  },
  addCard: {
    width: '46%',
    height: 120,
    backgroundColor: '#ffffff',
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    top: -10,
    left: -6,
  },
  fourCardsGrid: {
    width: '100%',
    marginBottom: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  threeMonthsCard: {
    backgroundColor: '#000000',
    borderRadius: 0,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ffffff',
    position: 'relative',
    width: '46%',
    height: 180,
    left:-6,
  },
  sixMonthsCard: {
    backgroundColor: '#000000',
    borderRadius: 0,
    padding: 20,
    borderWidth: 1,
    borderColor: '#ffffff',
    position: 'relative',
    width: '48%',
    height: 150,
    top: -40,
    marginLeft: 7,
  },
  plusSign: {
    fontSize: 48,
    color: '#000000',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  // decemberCard: {
  //   width: '50%',
  // },
  monthTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f8fafc',
    marginBottom: 8,
  },
  monthAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#f8fafc',
    marginBottom: 4,
  },
  monthLabel: {
    fontSize: 12,
    color: '#94a3b8',
  },
  treeMapContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12, // match Home screen horizontal padding
    marginTop: -6,   // bring closer, avoid overlap
    marginBottom: 0,
    backgroundColor: 'transparent', // make sure not covering
  },
  treeMapBox: {
    width: '48%',   // 2 column layout
    height: 100,
    marginBottom: 10,
    backgroundColor: '#000',  // ya jo bhi color
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff',
  },
  
  
  
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 20,
    width: '100%',
    marginTop: -110,   // 👈 isse buttons aur upar shift ho jayenge
    marginBottom: 0,  // neeche ke safe area se bachane ke liye
  },
  
  actionButton: {
    flex: 1,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#374151',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f8fafc',
  },
  payButton: {
    backgroundColor: '#6366f1',
  },
  payButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default AppDetailScreen;
