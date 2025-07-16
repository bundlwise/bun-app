import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  FlatList,
  StatusBar,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

const formatINR = (amount: number) =>
  `₹${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Define types for category and monthly data
interface Category {
  name: string;
  value: string;
  paidVia?: string;
}

interface MonthlyData {
  total: number;
  chartData: {
    labels: string[];
    datasets: { data: number[] }[];
  };
  categories: Category[];
}

const ExpenseTracker = () => {
  const [selectedMonth, setSelectedMonth] = useState('Jul 2024');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const monthlyData: Record<string, MonthlyData> = {
    'Jul 2024': {
      total: 2082.12,
      chartData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{ data: [520, 530, 510, 522.12] }],
      },
      categories: [
        { name: 'Renewal Date', value: '20 Jul 2024', paidVia: 'Google Pay' },
        { name: 'Next Renewal', value: '23 Jul 2024' },
        { name: 'App Usage', value: '72% usage' },
      ],
    },
    'Jun 2024': {
      total: 1975.0,
      chartData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{ data: [480, 500, 490, 505] }],
      },
      categories: [
        { name: 'Renewal Date', value: '20 Jun 2024', paidVia: 'Google Pay' },
        { name: 'Next Renewal', value: '23 Jun 2024' },
        { name: 'App Usage', value: '69% usage' },
      ],
    },
    'May 2024': {
      total: 1900.25,
      chartData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{ data: [460, 480, 470, 490.25] }],
      },
      categories: [
        { name: 'Renewal Date', value: '20 May 2024', paidVia: 'Google Pay' },
        { name: 'Next Renewal', value: '23 May 2024' },
        { name: 'App Usage', value: '66% usage' },
      ],
    },
    'Apr 2024': {
      total: 1825.75,
      chartData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{ data: [450, 460, 455, 460.75] }],
      },
      categories: [
        { name: 'Renewal Date', value: '20 Apr 2024', paidVia: 'Google Pay' },
        { name: 'Next Renewal', value: '23 Apr 2024' },
        { name: 'App Usage', value: '63% usage' },
      ],
    },
    'Mar 2024': {
      total: 1750.0,
      chartData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{ data: [430, 440, 435, 445] }],
      },
      categories: [
        { name: 'Renewal Date', value: '20 Mar 2024', paidVia: 'Google Pay' },
        { name: 'Next Renewal', value: '23 Mar 2024' },
        { name: 'App Usage', value: '61% usage' },
      ],
    },
    'Feb 2024': {
      total: 1650.8,
      chartData: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{ data: [410, 415, 410.5, 415.3] }],
      },
      categories: [
        { name: 'Renewal Date', value: '20 Feb 2024', paidVia: 'Google Pay' },
        { name: 'Next Renewal', value: '23 Feb 2024' },
        { name: 'App Usage', value: '59% usage' },
      ],
    },
  };

  const months = Object.keys(monthlyData);
  const currentData = monthlyData[selectedMonth as keyof typeof monthlyData];

  const chartConfig = {
    backgroundGradientFrom: '#1f1f27',
    backgroundGradientTo: '#1f1f27',
    color: (opacity = 1) => `rgba(132, 204, 22, ${opacity})`,
    strokeWidth: 3,
    decimalPlaces: 0,
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#84cc16',
    },
    propsForBackgroundLines: {
      strokeDasharray: '3,3',
      stroke: '#2e2e2e',
    },
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <View style={styles.categoryItem}>
      <View style={styles.categoryLeft}>
        <View style={styles.categoryDot} />
        <View>
          <Text style={styles.categoryName}>{item.name}</Text>
          {item.paidVia && (
            <Text style={styles.paidViaText}>Paid via {item.paidVia}</Text>
          )}
        </View>
      </View>
      <Text style={styles.categoryAmount}>{item.value}</Text>
    </View>
  );

  const renderMonthItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.monthItem,
        selectedMonth === item && styles.selectedMonthItem,
      ]}
      onPress={() => {
        setSelectedMonth(item);
        setIsDropdownOpen(false);
      }}
    >
      <Text
        style={[
          styles.monthText,
          selectedMonth === item && styles.selectedMonthText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#292734', '#1E1B23', '#121118', '#000000']}
      locations={[0, 0.5, 0.6, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={StyleSheet.absoluteFill}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <View style={styles.innerWrapper}>
        <View style={styles.appHeader}>
          <View style={styles.appIconPlaceholder} />
          <Text style={styles.appName}>My App</Text>
        </View>

        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.expenseTitle}>Expense</Text>
            <View style={styles.monthSelectorRow}>
              <TouchableOpacity style={styles.openAppButton}>
                <Text style={styles.openAppButtonText}>Open App</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.monthSelector}
                onPress={() => setIsDropdownOpen(true)}
              >
                <Text style={styles.monthSelectorText}>{selectedMonth}</Text>
                <Text style={styles.chevron}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.expenseAmount}>−{formatINR(currentData.total)}</Text>
        </View>

        <View style={styles.chartContainer}>
          <LineChart
            data={currentData.chartData}
            width={screenWidth - 60}
            height={180}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            withDots={true}
            withShadow={false}
            fromZero={false}
            yAxisInterval={1}
            segments={4}
          />
        </View>

        <View style={styles.categoriesContainer}>
          <FlatList
            data={currentData.categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.name}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.changeButton}>
            <Text style={styles.buttonText}>Change Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton}>
            <Text style={styles.buttonText}>Cancel Plan</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={isDropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsDropdownOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={months}
              renderItem={renderMonthItem}
              keyExtractor={(item) => item}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  innerWrapper: {
    flex: 1,
    justifyContent: 'flex-start', // changed from 'space-between' to 'flex-start'
    paddingHorizontal: 20,
    paddingTop: 80, // increased from 60 to 80 to move content down
    paddingBottom: 30,
  },
  appHeader: {
    alignItems: 'center',
    marginBottom: 30, // increased from 20 to 40 to move My App lower
    marginTop: 20,
  },
  appIconPlaceholder: {
    width: 60,
    height: 60,
    marginBottom: 6,
    backgroundColor: '#4b5563',
    borderRadius: 12,
    marginTop: -26,
  },
  appName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#f3f4f6',
  },
  header: {
    backgroundColor: 'transparent',
    paddingBottom: 15,
    marginTop: 0, // ensure no extra margin at top
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expenseTitle: {
    fontSize: 24,
    fontWeight: '300',
    color: '#d1d5db',
    marginRight:20
  },
  expenseAmount: {
    fontSize: 36,
    fontWeight: '300',
    color: '#ffffff',
    marginTop: 12,
  },
  monthSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: 40, // push the row to the right
    gap: 4,
  },
  openAppButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: -40,
  },
  openAppButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4b5563',
    marginLeft: 40, // add margin to move it right
  },
  monthSelectorText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f9fafb',
    marginRight: 8,
  },
  chevron: {
    fontSize: 12,
    color: '#d1d5db',
  },
  chartContainer: {
    backgroundColor: '#1f1f27',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 8,
    elevation: 3,
    alignItems: 'center',
  },
  chart: { borderRadius: 16 },
  categoriesContainer: {
    backgroundColor: '#1f1f27',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    elevation: 3,
    marginTop: 10,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#84cc16',
    marginRight: 12,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#f3f4f6',
  },
  paidViaText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  categoryAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16, // reduced from 30 to 16 to move buttons up
    gap: 12,
  },
  changeButton: {
    flex: 1,
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 160,
    maxHeight: 300,
    elevation: 5,
  },
  monthItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectedMonthItem: {
    backgroundColor: '#374151',
  },
  monthText: {
    fontSize: 16,
    color: '#f9fafb',
  },
  selectedMonthText: {
    color: '#3b82f6',
    fontWeight: '600',
  },
});

export default ExpenseTracker; 