import React from 'react';

import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import WalletHeader, { BarItem } from './WalletHeader';

// 🎨 Map with your original styles
const PRESET_BAR_CONFIGS: Record<string, Partial<BarItem>> = {
  Netflix:   { color: '#33C48D', width: 100, marginRight: 20, shiftX: -40 },
  Prime:     { color: '#6464FF', width: 100, marginRight: 20, shiftX: -30 },
  Hotstar:   { color: '#D965C7', width: 100, marginRight: 20, shiftX: -20 },
  YouTube:   { color: '#33FF57', width: 100, marginRight: 20, shiftX: -10 },
  Spotify:   { color: '#33FFF6', width: 100, marginRight: 20, shiftX: 0 },
  HealthyFy: { color: '#33FF99', width: 100, marginRight: 20, shiftX: 10 },
};

const DEFAULT_CONFIG: Partial<BarItem> = {
  color: '#AAAAAA',
  width: 100,
  marginRight: 20,
  shiftX: 0,
};

// 📝 Simulated backend response
const backendData = {
  walletAddress: 'Subscribed-Apps',
  userName: 'Om',
  balanceAmount: '₹7000',
  bars: [
    { label: 'Netflix', usage: 12 },
    { label: 'Prime', usage: 8 },
    { label: 'Hotstar', usage: 16 },
    { label: 'YouTube', usage: 20 },
    { label: 'Spotify', usage: 10 },
    { label: 'HealthyFy', usage: 9 },
  ],
  profileIcons: [
    null,
    null,
    null
  ]
  
};

// 🔷 Apply preset config for each bar
const bars: BarItem[] = backendData.bars.map((item) => {
  const config = PRESET_BAR_CONFIGS[item.label] ?? DEFAULT_CONFIG;
  const bar = {
    label: item.label,
    usage: item.usage,
    color: config.color!,
    width: config.width!,
    marginRight: config.marginRight,
    shiftX: config.shiftX,
  };
  console.log('🔍 DEBUG - Created bar:', bar);
  return bar;
});

export default function WalletScreen() {
  console.log('🔍 DEBUG - WalletScreen bars:', bars);
  console.log('🔍 DEBUG - WalletScreen bars length:', bars.length);
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        
        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <WalletHeader
            walletAddress={backendData.walletAddress}
            userName={backendData.userName}
            balanceAmount={backendData.balanceAmount}
            bars={bars}
            profileIcons={backendData.profileIcons} 
          />
        </ScrollView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50,
    paddingTop: 10, // Added top padding to move UI down
  },
});