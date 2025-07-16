import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import ExpenseTracker from './screens/ExpenseTracker'; // Make sure this file exists

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ExpenseTracker />
    </SafeAreaView>
  );
};

export default App;
