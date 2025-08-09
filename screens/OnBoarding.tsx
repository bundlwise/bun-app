import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ImageBackground } from 'react-native';
import BundlwiseLogo from '../assets/bundlwise-logo.svg';
import RightArrow from '../assets/arrow-right.svg';
import Button from '../components/Button';
const OnboardingScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: Implement login logic
    console.log('Login attempted with:', { email, password });
  };

  return (
    <ImageBackground source={require('../assets/onboarding-bg.png')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.logoContainer}>
          <BundlwiseLogo width={100} height={100} />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            onPress={handleLogin}
            height={52}
            width="90%"
            backgroundColor="#ffffffff"
            borderRadius={16}
            rightIcon={<RightArrow width={17} height={17} />}
            textStyle={{ color: '#000000' }}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateY: '-50%' }],
  },
  buttonContainer: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    width: '100%',
    display: 'flex',
    justifyContent: "center",
    gap: 12
  }
});

export default OnboardingScreen;
