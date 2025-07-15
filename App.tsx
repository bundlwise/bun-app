import React from 'react';
import { SafeAreaView } from 'react-native';
import RaycastCloneScreen from './screens/RaycastCloneScreen'; // Assuming you're keeping screen inside src/screens

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <RaycastCloneScreen />
    </SafeAreaView>
  );
}
