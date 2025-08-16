import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TreeMap, { TreeMapItem } from '../components/TreeMap';
import { RootStackParamList } from '../navigation/AppNavigator';

// Example subscription data (replace with real backend/store data)
const treeMapData: TreeMapItem[] = [
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

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [selected, setSelected] = React.useState<TreeMapItem | null>(null);
  const sorted = React.useMemo(() => [...treeMapData].sort((a, b) => b.value - a.value), []);
  const total = React.useMemo(() => sorted.reduce((s, i) => s + i.value, 0), [sorted]);

  const handleAppSelect = (item: TreeMapItem) => {
    setSelected(item);
    // Navigate immediately for smooth transition
    navigation.navigate('AppDetail', { app: item });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Subscriptions Overview</Text>
          <Text style={styles.subtitle}>Cost / usage weighted layout · tap a block to inspect details</Text>

          <TreeMap
            data={sorted}
            onSelect={handleAppSelect}
            selectedName={selected?.name || null}
            height={420}
          />

          {/* Detail panel removed - inline labels now */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Legend removed

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#07080a",
  },
  scrollContainer: {
    flex: 1,
  },
  innerContainer: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#f8fafc',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  // removed treeMapContainer wrapper
  // removed detail styles
});

export default HomeScreen;
