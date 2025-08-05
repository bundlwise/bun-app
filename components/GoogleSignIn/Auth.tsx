import auth from "@react-native-firebase/auth";
import { TouchableOpacity, Text, Platform, Alert } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useState } from "react";

export default function () {
  const [userData, setUserData] = useState<{
    idToken: string;
    accessToken: string;
  }>({
    idToken: "",
    accessToken: "",
  });

  // Update with your actual backend server URL
  const BASE_URL = Platform.OS === 'android' 
    ? 'http://10.0.2.2:8080' // Android emulator uses 10.0.2.2 to access host machine
    : 'http://localhost:8080'; // iOS simulator can use localhost
  
  const API_URL = `${BASE_URL}/api/users/login`;

  const config = GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/gmail.readonly", "profile", "email"],
    webClientId:
      "87247158210-11rffccdrj11cp2v4h9a7lpkeb3ln81s.apps.googleusercontent.com",
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });

  const validateAndRegisterUser = async (userInfo: any, tokens: any) => {
    try {
      const payload = {
        "google":{user: userInfo, // Send complete user object
          tokens: {
            idToken: tokens.idToken,
            accessToken: tokens.accessToken,
            
          }},
        type: "google",
      };

      console.log("payload", JSON.stringify(payload));
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Backend response:', result);
        Alert.alert('Success', 'User data sent to backend successfully!');
      } else {
        console.error('Backend error:', response.status, response.statusText);
        Alert.alert('Error', 'Failed to send data to backend');
      }
    } catch (error) {
      console.error('Error sending to backend:', error);
      Alert.alert('Error', 'Network error while sending data to backend');
    }
  };

  const signIn = async () => {
    try {
      console.log("config", config);
      await GoogleSignin.hasPlayServices();
      console.log("hasPlayServices");
      const user = await GoogleSignin.signIn();
      console.log("user",user, user.data?.serverAuthCode);
      const tokens = await GoogleSignin.getTokens();
      console.log("Google Sign-In tokens:");
      // Access tokens safely
      const idToken = tokens.idToken;
      // Log if accessToken is available (which may be used as refresh token in some cases)
      if (tokens.accessToken) {
        console.log("Access token available:", tokens.accessToken);
      }
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      auth().currentUser;
      await validateAndRegisterUser(user, tokens);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log("user cancelled the login flow");
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log("operation (e.g. sign in) is in progress already");
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log("play services not available or outdated");
      } else {
        console.log("some other error happened");
      }
    }
  };

  const signOut = async () => {
    await GoogleSignin.signOut();
    auth().signOut();
    console.log("signOut");
  };

  return (
    <>
      <GoogleSigninButton
        style={{ width: 200, height: 40 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signIn}
      />

      <TouchableOpacity onPress={signOut}>
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </>
  );
}
