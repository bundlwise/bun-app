import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import ArrowIcon from '../components/ArrowIcon';
import Svg, { Path } from 'react-native-svg';

import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  AntDesign,
  Entypo,
} from '@expo/vector-icons';

export default function Welcome() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <LinearGradient
      colors={['#292734', '#1E1B23', '#121118', '#000000']}
      locations={[0, 0.5, 0.6, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
          <Svg
          width={32}
          height={32}
          viewBox="0 0 16 18"
          style={styles.logoImage}
          >
            <Path
            d="M11.0386 7.65363C11.2415 7.61853 11.4372 7.56993 11.6243 7.50873L11.6235 7.50783C12.9702 7.06323 13.8606 5.93913 13.8606 4.16253C13.8606 2.91604 13.2007 1.89184 12.2306 1.37704C11.4325 0.954042 10.5658 0.729043 9.69587 0.599443C7.62218 0.289844 5.5398 0.0126446 3.44479 4.46082e-05C2.12731 -0.00805537 1.56843 1.08814 1.29373 2.31034C0.955877 3.82054 0.722221 5.64483 0.759321 7.19823C0.783792 8.22872 1.15559 9.37082 2.40991 9.19172C4.26732 8.92712 6.02842 8.59142 7.81163 8.25122C8.87176 8.04873 9.939 7.84532 11.0386 7.65363ZM2.42491 17.9991H11.442L11.4428 18C13.788 18 15.2365 15.723 14.9681 13.1913C14.8055 11.6496 14.1756 9.99452 12.7871 9.46802C11.6788 9.04682 10.4584 9.23042 9.31145 9.40232C9.18593 9.42122 9.06121 9.44012 8.93728 9.45722C7.64428 9.64262 6.3568 9.87212 5.07012 10.1016C4.87593 10.1367 4.68174 10.1709 4.48834 10.206C4.42598 10.2168 4.36283 10.2276 4.29968 10.2393C3.39663 10.3986 2.39097 10.5768 1.53765 10.8774C0.6717 11.1825 0.370158 12.0753 0.22807 12.9852C0.167288 13.3749 0.130976 13.7691 0.0946648 14.1624C0.0836135 14.2785 0.0733516 14.3946 0.0623003 14.5107C-0.0308464 15.4476 -0.108995 16.4214 0.528033 17.1747C1.00798 17.7444 1.75157 17.9991 2.42491 17.9991Z"
            fill="white" // 👈 change color dynamically if needed
              />
          </Svg>
            <Text style={styles.logoText}>undlwise</Text>
          </View>
          <Ionicons name="menu" size={28} color="white" />
        </View>

        {/* Title & Subtitle */}
        <View style={styles.contentContainer}>
          <Text style={styles.title}>THE{'\n'}FUTURE.</Text>
          <Text style={styles.subtitle}>
            Bundlwise is the smartest way to manage subscriptions and the fastest
            growing platform to optimize spending.
          </Text>
        </View>

        {/* Background Text */}
        <View style={styles.backgroundTextWrapper}>
          <Text style={styles.backgroundText}>BUN</Text>
          <Text style={[styles.backgroundText, styles.secondLine]}>DLW</Text>
        </View>

        {/* Icon layer */}
        <View style={styles.customIconsWrapper}>
          <View style={[styles.iconButtonAbsolute, { top: 80, left: -20 }]}>
            <FontAwesome5 name="linkedin-in" size={20} color="#0A66C2" />
            <Text style={styles.iconText}>linkedin</Text>
          </View>
          <View style={[styles.iconButtonAbsolute, { top: 80, left: 175 }]}>
            <MaterialCommunityIcons name="microsoft" size={20} color="#F3F3F3" />
            <Text style={styles.iconText}>Microsoft</Text>
          </View>
          <View style={[styles.iconButtonAbsolute, { top: 80, left: 370 }]}>
            <MaterialCommunityIcons name="love" size={20} color="#F3F3F3" />
            <Text style={styles.iconText}>Microsoft</Text>
          </View>
          <View style={[styles.iconButtonAbsolute, { top: 140, left: -160 }]}>
            <FontAwesome5 name="spotify" size={20} color="#1DB954" />
            <Text style={styles.iconText}>Spotify</Text>
          </View>
          <View style={[styles.iconButtonAbsolute, { top: 140, left: 50 }]}>
            <FontAwesome5 name="spotify" size={20} color="#1DB954" />
            <Text style={styles.iconText}>Spotify</Text>
          </View>
          <View style={[styles.iconButtonAbsolute, { top: 140, left: 260 }]}>
            <AntDesign name="cloudo" size={20} color="red" />
            <Text style={styles.iconText}>Netflix</Text>
          </View>
          <View style={[styles.iconButtonAbsolute, { top: 200, left: -1 }]}>
            <Entypo name="code" size={20} color="#0052CC" />
            <Text style={styles.iconText}>Jira Software</Text>
          </View>
          <View style={[styles.iconButtonAbsolute, { top: 200, left: 220 }]}>
            <AntDesign name="Adobedotcom" size={20} color="red" />
            <Text style={styles.iconText}>Adobe</Text>
          </View>
        </View>

        {/* Gradient Login Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('WalletScreen')}
        >
          <LinearGradient
            colors={['#4D2FFF', '#2A61F0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <View style={styles.loginButton}>
              <Text style={styles.loginText}>LOGIN WITH GOOGLE</Text>
              <ArrowIcon style={styles.arrowIcon} />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  logoText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginLeft: 1,
    letterSpacing: -1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    color: 'white',
    fontSize: 60,
    fontWeight: '900',
    lineHeight: 60,
  },
    subtitle: {
      fontFamily: 'Inter_400Regular', // 👈 Google Fonts loaded name
      fontSize: 16,
      color: '#DAD9E5',
      marginTop: 20,
      lineHeight: 24,
      maxWidth: 320,
    },
    
  backgroundTextWrapper: {
    position: 'absolute',
    top: 350,
    left: 0,
    zIndex: -1,
  },
  backgroundText: {
    fontSize: 200,
    fontWeight: '600',
    color: 'white',
    opacity: 0.09,
    letterSpacing: 10,
    includeFontPadding: false,
    textAlign: 'left',
    width: 1000,
  },
  secondLine: {
    marginTop: -60,
    marginLeft: 0,
  },
  customIconsWrapper: {
    height: 440,
    marginTop: 40,
    position: 'relative',
  },
  iconButtonAbsolute: {
    flexDirection: 'row',
    backgroundColor: '#1D1B26',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'absolute',
    width: 183,
    height: 40,
    paddingHorizontal: 16,
  },
  iconText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '500',
    textTransform: 'lowercase',
  },
  gradientButton: {
    width: 400,
    height:100,
    alignSelf: 'center',
    marginTop: -100,
    borderRadius: 0,
    paddingVertical: 10,
    overflow: 'hidden',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    paddingTop:3.5,
  },
  arrowIcon: {
    width: 22,
    height: 22,
    marginLeft: 12,
  },
});
