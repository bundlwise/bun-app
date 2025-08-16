import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import TreeMap from '../components/TreeMap';

// Sample data matching the design you showed
const treeMapData = [
  { name: 'Sketch', value: 40, color: '#FF6B6B', change: '-16.52%' },
  { name: 'Zeplin', value: 25, color: '#4ECDC4', change: '+3.20%' },
  { name: 'Figma', value: 60, color: '#45B7D1', change: '+8.20%' },
  { name: 'Avocode', value: 20, color: '#96CEB4', change: '+6.18%' },
  { name: 'Studio', value: 18, color: '#FFEAA7', change: '-19.1%' },
  { name: 'Adobe XD', value: 35, color: '#DDA0DD', change: '+2.14%' },
  { name: 'Photoshop', value: 15, color: '#FFB6C1', change: '+1.25%' },
  { name: 'Axure', value: 12, color: '#B8E6B8', change: '+3.09%' },
  { name: 'Mockflow', value: 14, color: '#FFA07A', change: '-19.1%' },
  { name: 'Mockups', value: 22, color: '#20B2AA', change: '-4.8%' },
  { name: 'CanvasFlip', value: 10, color: '#87CEEB', change: '+4.06%' },
  { name: 'Atomic.io', value: 8, color: '#98FB98', change: '+6.6%' },
];

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Design Tools Usage</Text>
          <Text style={styles.subtitle}>Market share and growth trends</Text>
          
          <View style={styles.treeMapContainer}>
            <TreeMap data={treeMapData} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#a0aec0",
    textAlign: "center",
    marginBottom: 30,
  },
  treeMapContainer: {
    backgroundColor: "#1a1d23",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#2d3748",
  },
});

export default HomeScreen;
