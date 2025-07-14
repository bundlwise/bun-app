// App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BundlwiseGetStartedScreen from './screens/BundlwiseGetStartedScreen';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Bundlwise" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Bundlwise" component={BundlwiseGetStartedScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
