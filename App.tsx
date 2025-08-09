import { StyleSheet, Text, View, TextInput } from 'react-native';
import { useEffect } from 'react';
import * as Font from 'expo-font';
import { useState } from 'react';
import OnboardingScreen from './screens/OnBoarding';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Inter-Thin': require('./assets/fonts/inter/Inter-Thin.ttf'),
        'Inter-ThinItalic': require('./assets/fonts/inter/Inter-ThinItalic.ttf'),
        'Inter-ExtraLight': require('./assets/fonts/inter/Inter-ExtraLight.ttf'),
        'Inter-ExtraLightItalic': require('./assets/fonts/inter/Inter-ExtraLightItalic.ttf'),
        'Inter-Light': require('./assets/fonts/inter/Inter-Light.ttf'),
        'Inter-LightItalic': require('./assets/fonts/inter/Inter-LightItalic.ttf'),
        'Inter-Regular': require('./assets/fonts/inter/Inter-Regular.ttf'),
        'Inter-Italic': require('./assets/fonts/inter/Inter-Italic.ttf'),
        'Inter-Medium': require('./assets/fonts/inter/Inter-Medium.ttf'),
        'Inter-MediumItalic': require('./assets/fonts/inter/Inter-MediumItalic.ttf'),
        'Inter-SemiBold': require('./assets/fonts/inter/Inter-SemiBold.ttf'),
        'Inter-SemiBoldItalic': require('./assets/fonts/inter/Inter-SemiBoldItalic.ttf'),
        'Inter-Bold': require('./assets/fonts/inter/Inter-Bold.ttf'),
        'Inter-BoldItalic': require('./assets/fonts/inter/Inter-BoldItalic.ttf'),
        'Inter-ExtraBold': require('./assets/fonts/inter/Inter-ExtraBold.ttf'),
        'Inter-ExtraBoldItalic': require('./assets/fonts/inter/Inter-ExtraBoldItalic.ttf'),
        'Inter-Black': require('./assets/fonts/inter/Inter-Black.ttf'),
        'Inter-BlackItalic': require('./assets/fonts/inter/Inter-BlackItalic.ttf'),
      });
      setFontsLoaded(true);
    }
    
    loadFonts();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      (Text as any).defaultProps = (Text as any).defaultProps || {};
      (TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
      (Text as any).defaultProps.allowFontScaling = false;
      (Text as any).defaultProps.style = [
        (Text as any).defaultProps.style,
        { fontFamily: 'Inter-Regular' },
      ];
      (TextInput as any).defaultProps.style = [
        (TextInput as any).defaultProps.style,
        { fontFamily: 'Inter-Regular' },
      ];
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <View style={styles.container}>
      <OnboardingScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
