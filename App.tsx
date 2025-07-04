// App.tsx
import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import WalletHeader, { BarItem } from './components/WalletHeader';

const bars: BarItem[] = [
  {
    color: '#33C48D',
    label: 'Netflix',
    width: 100,
    usage: 12,
    marginRight: 20,
    shiftX: -40,
  },
  {
    color: '#6464FF',
    label: 'Prime',
    width: 100,
    usage: 8,
    marginRight: 20,
    shiftX: -30,
  },
  {
    color: '#D965C7',
    label: 'Hotstar',
    width: 100,
    usage: 16,
    marginRight: 20,
    shiftX: -20,
  },
  {
    color: '#33FF57',
    label: 'YouTube',
    width: 100,
    usage: 20,
    marginRight: 20,
    shiftX: -10,
  },
  {
    color: '#33FFF6',
    label: 'Spotify',
    width: 100,
    usage: 10,
    marginRight: 20,
    shiftX: 0,
  },
  {
    color: '#33FF99',
    label: 'HealthyFy',
    width: 100,
    usage: 9,
    marginRight: 20,
    shiftX: 10,
  },
];

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <WalletHeader
          walletAddress="Subscribed-Apps"
          userName="Om"
          balanceAmount="₹7000"
          bars={bars}
        />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
