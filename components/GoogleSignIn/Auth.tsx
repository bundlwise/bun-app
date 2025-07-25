import auth from "@react-native-firebase/auth";
import { Platform, TouchableOpacity, Text } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { useState } from "react";

export default function () {
  const config = GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/drive.readonly", "email"],
    webClientId:
      "87247158210-11rffccdrj11cp2v4h9a7lpkeb3ln81s.apps.googleusercontent.com",
    offlineAccess: true,
    forceCodeForRefreshToken: true,
  });

  const signIn = async () => {
    try {
      console.log("config", config);
      await GoogleSignin.hasPlayServices();
      console.log("hasPlayServices");
      await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      const firebaseUser = auth().currentUser;
      console.log("firebaseUser", firebaseUser);
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
