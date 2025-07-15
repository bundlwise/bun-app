import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import CreateAccountScreen from './screens/CreateAccountScreen'; // adjust if your file path is different

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" />
      <CreateAccountScreen />
    </SafeAreaView>
  );
};

export default App;
