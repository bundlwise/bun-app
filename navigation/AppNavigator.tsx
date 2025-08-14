import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingScreen from '../screens/OnBoarding';
import LoginScreen from '../screens/LoginScreen';
import WalkthroughScreen from '../screens/WalkthroughScreen';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Walkthrough: undefined;
  Home: undefined;
};
import HomeScreen from '../screens/HomeScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const theme = {
    ...DefaultTheme,
    colors: {
      background: '#000000',
    },
  } as const;
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          animation: 'none',
          contentStyle: { backgroundColor: '#000000' },
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Walkthrough" component={WalkthroughScreen} />
  <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
