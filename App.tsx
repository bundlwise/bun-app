import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as WebBrowser from 'expo-web-browser';

// Screens
import Welcome from './screens/Welcome';
import Profile from './screens/Profile';
import PaymentHistoryScreen from './screens/PaymentHistoryScreen';
import BundlwiseGetStartedScreen from './screens/BundlwiseGetStartedScreen';

// Types
import { RootStackParamList } from './types/navigation';

// Make sure the auth redirect can be handled
WebBrowser.maybeCompleteAuthSession();

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BundlwiseGetStartedScreen"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#000' },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="BundlwiseGetStartedScreen" component={BundlwiseGetStartedScreen} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="PaymentHistoryScreen" component={PaymentHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
