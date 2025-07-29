import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from "@expo/vector-icons";
import { verticalScale, scale } from "react-native-size-matters";
import { useSmartFetch } from "../hooks/useSmartFetch";
// import auth from "@react-native-firebase/auth";
// import {
//   GoogleSignin,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";

const { width: screenWidth } = Dimensions.get('window');

const LoginScreen = ({ navigation }: any) => {
  const [user_email, setUserEmail] = useState("");
  const [user_password, setUserPassword] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  // Configure Google Sign-In - TEMPORARILY DISABLED
  // GoogleSignin.configure({
  //   scopes: ["https://www.googleapis.com/auth/drive.readonly", "email"],
  //   webClientId:
  //     "87247158210-11rffccdrj11cp2v4h9a7lpkeb3ln81s.apps.googleusercontent.com",
  //   offlineAccess: true,
  //   forceCodeForRefreshToken: true,
  // });

  const { refetch, data, loading, error } = useSmartFetch({
    url: "https://your-api.com/api/login",
    method: "POST",
    body: {
      user_email,
      user_password,
    },
  });

  const submitLogin = () => {
    refetch();
  };

  const signInWithGoogle = async () => {
    // TEMPORARILY DISABLED - Show alert and navigate
    Alert.alert("Success", "Google Sign-In completed!", [
      {
        text: "Continue", 
        onPress: () => {
          // Navigate to RaycastCloneScreen after successful Google Sign-In
          if (navigation) {
            navigation.navigate('RaycastClone');
          } else {
            console.log("Navigate to RaycastCloneScreen");
          }
        }
      }
    ]);
    
    // Real Google Sign-In logic (commented out for testing)
    // try {
    //   setGoogleLoading(true);
    //   console.log("Starting Google Sign-In...");
    //   
    //   await GoogleSignin.hasPlayServices();
    //   console.log("Play Services available");
    //   
    //   await GoogleSignin.signIn();
    //   const { idToken } = await GoogleSignin.getTokens();
    //   const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    //   await auth().signInWithCredential(googleCredential);
    //   
    //   const firebaseUser = auth().currentUser;
    //   console.log("Successfully signed in:", firebaseUser?.email);
    //   
    //   // Navigate to RaycastCloneScreen after successful Google Sign-In
    //   Alert.alert("Success", "Login successful!", [
    //     {
    //       text: "Continue",
    //       onPress: () => {
    //         if (navigation) {
    //           navigation.navigate('RaycastClone');
    //         } else {
    //           console.log("Navigate to RaycastCloneScreen");
    //         }
    //       }
    //     }
    //   ]);
    //   
    // } catch (error: any) {
    //   console.log("Google Sign-In Error:", error);
    //   if (error.code === statusCodes.SIGN_IN_CANCELLED) {
    //     console.log("User cancelled the login flow");
    //   } else if (error.code === statusCodes.IN_PROGRESS) {
    //     console.log("Operation is in progress already");
    //   } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
    //     console.log("Play services not available or outdated");
    //   } else {
    //     console.log("Some other error happened:", error.message);
    //     Alert.alert("Error", "Failed to sign in with Google. Please try again.");
    //   }
    // } finally {
    //   setGoogleLoading(false);
    // }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />

        {/* Back Button */}
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.title}>Log in</Text>

        {/* Top Group: Email, Password, Magic Link */}
        <View style={styles.topGroup}>
          <TextInput
            placeholder="Email address"
            placeholderTextColor="#888"
            style={styles.input}
            value={user_email}
            onChangeText={setUserEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            placeholder="Password (optional)"
            placeholderTextColor="#888"
            style={styles.input}
            secureTextEntry
            value={user_password}
            onChangeText={setUserPassword}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={submitLogin}
          >
            <Text style={styles.buttonText}>Send Magic Link</Text>
          </TouchableOpacity>
        </View>

        {/* OR Text */}
        <Text style={styles.orText}>or</Text>

        {/* Bottom Group: Google Only */}
        <View style={styles.bottomGroup}>
          <TouchableOpacity 
            style={[styles.button, styles.appleButton]}
            onPress={signInWithGoogle}
            disabled={googleLoading}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="logo-google" size={18} color="#000" style={styles.googleIcon} />
              <Text style={[styles.buttonText, styles.appleButtonText]}>
                {googleLoading ? "Signing in..." : "Continue with Google"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  container: {
    backgroundColor: "#000",
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: verticalScale(20),
    alignItems: "center",
    justifyContent: 'flex-start', // Changed from 'center' to move content up
    marginTop: -verticalScale(-10), // Add negative margin to move everything up
  },
  backButton: {
    position: "absolute",
    top: verticalScale(20),
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: scale(17),
    color: "#fff",
    fontWeight: "500",
    marginBottom: verticalScale(24),
    textAlign: 'center',
  },
  topGroup: {
    width: '100%',
    maxWidth: 400,
    gap: verticalScale(8),
    marginBottom: verticalScale(60),
  },
  input: {
    height: 56,
    width: 358,
    borderRadius: 17,
    backgroundColor: "#1C1C1E",
    color: "#fff",
    paddingHorizontal: 16,
    fontSize: scale(16),
    marginLeft: 5,
  },
  button: {
    height: 56,
    width: 358,
    borderRadius: 17,
    backgroundColor: "#1C1C1E",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    marginRight: 8,
  },
  disabledButton: {
    backgroundColor: "#2C2C2E",
  },
  disabledButtonText: {
    color: "#888",
    fontSize: scale(16),
    fontWeight: "600",
  },
  buttonText: {
    color: "#fff",
    fontSize: scale(16),
    fontWeight: "600",
    letterSpacing: -0.5,
    fontFamily: "inter",
  },
  appleButton: {
    backgroundColor: "#fff",
  },
  appleButtonText: {
    color: "#000",
    fontWeight: "600",
  },
  orText: {
    color: "#aaa",
    fontSize: scale(16),
    marginTop: -verticalScale(30), // Move only "or" text up
    marginBottom: verticalScale(20),
    opacity: 0.8,
    textAlign: 'center',
  },
  bottomGroup: {
    width: '100%',
    maxWidth: 400,
    gap: verticalScale(8),
  },
});

export default LoginScreen; 