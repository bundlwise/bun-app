import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import {
  scale,
  verticalScale,
  moderateScale,
} from 'react-native-size-matters';

const RaycastWelcome = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={['#333', '#1a1a1a']}
            style={styles.logoGradient}
          >
            <View style={styles.logoBox}>
              <Svg
                width={scale(64)}
                height={scale(64)}
                viewBox="0 0 16 18"
                fill="none"
              >
                <Path
                  d="M11.0386 7.65363C11.2415 7.61853 11.4372 7.56993 11.6243 7.50873L11.6235 7.50783C12.9702 7.06323 13.8606 5.93913 13.8606 4.16253C13.8606 2.91604 13.2007 1.89184 12.2306 1.37704C11.4325 0.954042 10.5658 0.729043 9.69587 0.599443C7.62218 0.289844 5.5398 0.0126446 3.44479 4.46082e-05C2.12731 -0.00805537 1.56843 1.08814 1.29373 2.31034C0.955877 3.82054 0.722221 5.64483 0.759321 7.19823C0.783792 8.22872 1.15559 9.37082 2.40991 9.19172C4.26732 8.92712 6.02842 8.59142 7.81163 8.25122C8.87176 8.04873 9.939 7.84532 11.0386 7.65363ZM2.42491 17.9991H11.442L11.4428 18C13.788 18 15.2365 15.723 14.9681 13.1913C14.8055 11.6496 14.1756 9.99452 12.7871 9.46802C11.6788 9.04682 10.4584 9.23042 9.31145 9.40232C9.18593 9.42122 9.06121 9.44012 8.93728 9.45722C7.64428 9.64262 6.3568 9.87212 5.07012 10.1016C4.87593 10.1367 4.68174 10.1709 4.48834 10.206C4.42598 10.2168 4.36283 10.2276 4.29968 10.2393C3.39663 10.3986 2.39097 10.5768 1.53765 10.8774C0.6717 11.1825 0.370158 12.0753 0.22807 12.9852C0.167288 13.3749 0.130976 13.7691 0.0946648 14.1624C0.0836135 14.2785 0.0733516 14.3946 0.0623003 14.5107C-0.0308464 15.4476 -0.108995 16.4214 0.528033 17.1747C1.00798 17.7444 1.75157 17.9991 2.42491 17.9991Z"
                  fill="white"
                />
              </Svg>
            </View>
          </LinearGradient>
        </View>

        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.raycastText}>Bundlwise</Text>
          <Text style={styles.descriptionText}>
            A collection of powerful{'\n'}productivity tools in your pocket
          </Text>
        </View>

        {/* Buttons */}
       {/* Buttons Wrapper shifted slightly down */}
       <View style={styles.buttonShiftWrapper}>
  <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.loginButton}>
      <Text style={styles.loginButtonText}>Log in</Text>
    </TouchableOpacity>

    <View style={styles.createAccountContainer}>
      <TouchableOpacity style={styles.createAccountButton}>
        <Text style={styles.createAccountButtonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  </View>
</View>


      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: (40),
  },
  logoContainer: {
    position: 'absolute',
    top:"13.30%", // 🔁 Adjust as per how much down you want
    alignSelf: 'center',
  },
  
  logoGradient: {
    width: 178,
    height: 178,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -4,
  },
  logoBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: '45.36%',
    top:'46.18%',
  },
  welcomeText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 4,
  },
  raycastText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 20,
    

  },
  descriptionText: {
    color: '#9CA3AF',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 22,
    top:-10
  },
  buttonShiftWrapper: {
    marginTop: 340, // 👈 only this shifts buttons down
    marginBottom: ('12.29%')
  },
  
  buttonContainer: {
    width: ('87.34%'),
    height: (54.5),
    gap: (11),
    marginBottom: ('13.39%'),
    
  },
  loginButton: {
    backgroundColor: '#fff',
    borderRadius: (15),
    paddingVertical: (16),
    alignItems: 'center',
    
  },
  loginButtonText: {
    color: '#000',
    fontSize: (16),
    fontWeight: '500',
    marginTop:-2
  },
  createAccountContainer: {
    backgroundColor: '#1A1A1A',
    width: 343,
    height: '87.96%',
    marginBottom: '6.4%', // ✅ Try 8 or 12 for a tight but readable gap
    borderRadius: 15,
  },
  
  
  createAccountButton: {
    backgroundColor: 'transparent',
    borderRadius: (12),
    paddingVertical: (16),
    alignItems: 'center',
  },
  createAccountButtonText: {
    color: '#fff',
    fontSize: (16),
    fontWeight: '500',
  },
});

export default RaycastWelcome;
