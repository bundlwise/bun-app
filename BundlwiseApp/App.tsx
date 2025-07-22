import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginScreen from './screens/LoginScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <LoginScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
});
