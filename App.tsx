import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginScreen from './screens/LoginScreen'; // Make sure this path matches your folder structure

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LoginScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;
