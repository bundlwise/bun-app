import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OnboardingScreen from '../screens/OnBoarding';
import LoginScreen from '../screens/LoginScreen';
import WalkthroughScreen from '../screens/WalkthroughScreen';
import HomeScreen from '../screens/HomeScreen';
import AppDetailScreen from '../screens/AppDetailScreen';
import { TreeMapItem } from '../components/TreeMap';

export type RootStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Walkthrough: undefined;
  Home: undefined;
  AppDetail: { app: TreeMapItem };
};

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
          animation: 'slide_from_right',
          animationDuration: 250,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          contentStyle: { backgroundColor: '#000000' },
        }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Walkthrough" component={WalkthroughScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen 
          name="AppDetail" 
          component={AppDetailScreen}
          options={{
            animation: 'slide_from_right',
            animationDuration: 200,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            animationTypeForReplace: 'push',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
