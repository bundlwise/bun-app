import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import WalletHeader from './components/WalletHeader';

export default function App() {
  const bars = [
  {
    color: '#33C48D',
    label: 'Netflix',
    width: 120,
    fontSize: 12,
    marginRight: 10, // space between boxes
    labelPosition: { top: 62, left: 10 },
  },
  {
    color: '#6464FF',
    label: 'Prime',
    width: 100,
    fontSize: 12,
    marginRight: 10,
    labelPosition: { top: 62, left: 10 },
  },
  {
    color: '#D965C7',
    label: 'Hotstar',
    width: 70,
    fontSize: 12,
    labelPosition: { top: 62, left: 10 }, // last one: no marginRight
  },

];

  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <WalletHeader
        walletAddress="Subscribed Apps"
        userName="Om Sawant"
        balanceAmount="₹7000"
        bars={bars} // 👉 xOffset is passed for custom X-position
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },
});

