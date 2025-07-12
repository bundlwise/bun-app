// App.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from './screens/Welcome'; // 👈 Your Welcome screen
import WalletScreen from './screens/WalletScreen'; // 👈 The Wallet UI screen
import ProfileInfoScreen from './screens/Profile';
import PaymentHistoryScreen from './screens/PaymentHistoryScreen';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="WalletScreen" component={WalletScreen} />
        <Stack.Screen name="Profile" component={ProfileInfoScreen} />
        <Stack.Screen name="PaymentHistory" component={PaymentHistoryScreen} />

        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
