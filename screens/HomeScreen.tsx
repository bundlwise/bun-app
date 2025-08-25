import React, { useMemo, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Dimensions, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import TreeMap, { TreeMapItem } from '../components/TreeMap';

const { height: screenHeight } = Dimensions.get('window');

const data: TreeMapItem[] = [
  { name: 'Figma', value: 42, change: '+8.2%', meta: { monthly: 30, threeMonths: 85, sixMonths: 165, category: 'Design', owner: 'Design Team', seats: 25, paymentDate: '2024-01-15' } },
  { name: 'Sketch', value: 28, change: '-4.5%', meta: { monthly: 20, threeMonths: 58, sixMonths: 112, category: 'Design', seats: 12 } },
  { name: 'Slack', value: 55, change: '+3.4%', meta: { monthly: 240, threeMonths: 720, sixMonths: 1440, category: 'Collaboration', seats: 120, paymentDate: '2024-01-25' } },
  { name: 'Jira', value: 30, change: '-2.1%', meta: { monthly: 210, threeMonths: 630, sixMonths: 1260, category: 'PM', seats: 150, paymentDate: '2024-01-18' } },
  { name: 'Datadog', value: 14, change: '-3.6%', meta: { monthly: 320, threeMonths: 960, sixMonths: 1920, category: 'Monitoring', seats: 8, paymentDate: '2024-01-30' } },
  { name: 'Netflix', value: 25, change: '+0%', meta: { monthly: 15.99, threeMonths: 48, sixMonths: 96, category: 'Entertainment', owner: 'Personal', seats: 1, paymentDate: '2024-01-28' } },
  { name: 'Prime', value: 18, change: '+0%', meta: { monthly: 12.99, threeMonths: 39, sixMonths: 78, category: 'Entertainment', owner: 'Personal', seats: 1, paymentDate: '2024-01-29' } },
  { name: 'Swiggy', value: 22, change: '+5.2%', meta: { monthly: 15, threeMonths: 45, sixMonths: 90, category: 'Food', owner: 'Food Team', seats: 50, paymentDate: '2024-01-26' } },
  { name: 'Zomato', value: 20, change: '+3.1%', meta: { monthly: 12, threeMonths: 36, sixMonths: 72, category: 'Food', owner: 'Food Team', seats: 45, paymentDate: '2024-01-27' } },
  { name: 'Uber Eats', value: 19, change: '+2.8%', meta: { monthly: 18, threeMonths: 54, sixMonths: 108, category: 'Food', owner: 'Food Team', seats: 40, paymentDate: '2024-01-24' } },
];

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedName, setSelectedName] = useState<string | null>(null);
  
  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }
    return data.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meta?.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);
  
  const sorted = useMemo(() => [...filteredData].sort((a,b) => b.value - a.value), [filteredData]);

  // Calculate total monthly amount
  const totalMonthlyAmount = useMemo(() => {
    return filteredData.reduce((total, item) => total + (item.meta?.monthly || 0), 0);
  }, [filteredData]);

  const handleItemSelect = (item: TreeMapItem) => {
    // Check if this is the "Add" action
    if (item.meta?.isAddAction) {
      console.log('Add new subscription action triggered');
      // Handle add action - navigate to add screen or show modal
      // For example:
      // navigation.navigate('AddSubscription');
      return;
    }
    
    setSelectedName(item.name);
    navigation.navigate('AppDetail', { app: item });
  };

  // Calculate TreeMap height based on percentages of screen height
  // Use percentages to ensure proper scaling across different screen sizes
  const headerPercent = 0.12; // Header takes approximately 12% of screen
  const safeAreaPercent = 0.06; // SafeArea insets take about 6% of screen
  const bottomPaddingPercent = 0.08; // Increase bottom padding to 8% of screen to prevent cutoff
  const availableHeightPercent = 0.64; // Reduce TreeMap height to 64% of screen height
  const adjustedHeight = screenHeight * availableHeightPercent;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.amountContainer}>
        <Text style={styles.totalAmount}>${totalMonthlyAmount.toLocaleString()}</Text>
      </View>
      <View style={styles.chartWrapper}>
        <TreeMap 
          data={sorted}
          onSelect={handleItemSelect}
          selectedName={selectedName}
          height={adjustedHeight}
        />
      </View>
      
      {/* Search Bar at the bottom */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search apps or categories..."
          placeholderTextColor="#64748b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#07080a'},
  header:{ paddingTop:40, paddingHorizontal:20, paddingBottom:16 },
  title:{ fontSize:26, fontWeight:'700', color:'#f8fafc', textAlign:'center', marginBottom:4 },
  amountContainer:{ paddingTop:65, paddingHorizontal:20, paddingBottom:0, alignItems:'flex-start' },
  totalAmount:{ fontSize:48, fontWeight:'900', color:'#f8fafc', textAlign:'left' },
  chartWrapper:{ flex:1, paddingHorizontal:12, paddingTop:0, paddingBottom:20, marginBottom: 0 },
  searchContainer:{ paddingHorizontal:20, paddingBottom:20 },
  searchInput:{ 
    backgroundColor:'#1e293b',
    borderRadius:12,
    paddingHorizontal:16,
    paddingVertical:12,
    fontSize:16,
    color:'#f8fafc',
    borderWidth:1,
    borderColor:'#374151',
    height: 60,
    width: 350,
    marginLeft:10,
    marginTop:-70,
  },
});

export default HomeScreen;