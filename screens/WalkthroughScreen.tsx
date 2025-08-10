import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Button from '../components/Button';

type WalkthroughScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Walkthrough'>;
};

const WalkthroughScreen: React.FC<WalkthroughScreenProps> = ({ navigation }) => {
  const handleContinue = () => {
    // TODO: Add navigation logic or further steps
    console.log('Walkthrough continued');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome to Bundlwise</Text>
        <Text style={styles.description}>
          Discover a smarter way to manage your finances and track your spending.
        </Text>

        <Button 
          title="Continue" 
          onPress={handleContinue}
          width="90%"
          backgroundColor="#FFFFFF"
          borderRadius={16}
          textStyle={{ color: "#1B1B1B" }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    width: '90%',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  description: {
    color: '#888888',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default WalkthroughScreen;
