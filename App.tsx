// App.tsx

import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import ExpenseTracker from './screens/ExpenseTracker.tsx'; // Adjust path if needed

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ExpenseTracker />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
