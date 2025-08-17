import React, { useMemo, useState } from 'react';
import { StyleSheet, SafeAreaView, View, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import TreeMap, { TreeMapItem } from '../components/TreeMap';

const { height: screenHeight } = Dimensions.get('window');

const data: TreeMapItem[] = [
  { name: 'Figma', value: 42, change: '+8.2%', meta: { monthly: 30, category: 'Design', owner: 'Design Team', seats: 25 } },
  { name: 'Sketch', value: 28, change: '-4.5%', meta: { monthly: 20, category: 'Design', seats: 12 } },
  { name: 'Notion', value: 35, change: '+12.1%', meta: { monthly: 18, category: 'Knowledge', seats: 40 } },
  { name: 'Slack', value: 55, change: '+3.4%', meta: { monthly: 240, category: 'Collaboration', seats: 120 } },
  { name: 'Linear', value: 22, change: '+6.7%', meta: { monthly: 80, category: 'PM', seats: 35 } },
  { name: 'Jira', value: 30, change: '-2.1%', meta: { monthly: 210, category: 'PM', seats: 150 } },
  { name: 'GitHub', value: 50, change: '+1.5%', meta: { monthly: 400, category: 'Dev', seats: 60 } },
  { name: 'Vercel', value: 18, change: '+9.9%', meta: { monthly: 65, category: 'Infra', seats: 10 } },
  { name: 'Sentry', value: 16, change: '+5.0%', meta: { monthly: 90, category: 'Monitoring', seats: 10 } },
  { name: 'Datadog', value: 14, change: '-3.6%', meta: { monthly: 320, category: 'Monitoring', seats: 8 } },
];

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const sorted = useMemo(() => [...data].sort((a,b) => b.value - a.value), []);
  const [selectedName, setSelectedName] = useState<string | null>(null);

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
      <View style={styles.header}> 
        <Text style={styles.title}>Subscription Analytics</Text>
        <Text style={styles.subtitle}>Cost distribution visualization • Tap for details</Text>
      </View>
      <View style={styles.chartWrapper}>
        <TreeMap 
          data={sorted}
          onSelect={handleItemSelect}
          selectedName={selectedName}
          height={adjustedHeight}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{ flex:1, backgroundColor:'#07080a'},
  header:{ paddingTop:40, paddingHorizontal:20, paddingBottom:16 },
  title:{ fontSize:26, fontWeight:'700', color:'#f8fafc', textAlign:'center', marginBottom:4 },
  subtitle:{ fontSize:14, color:'#64748b', textAlign:'center' },
  chartWrapper:{ flex:1, paddingHorizontal:12, paddingBottom:40, marginBottom: 20 },
});

export default HomeScreen;
