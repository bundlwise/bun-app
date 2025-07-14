import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { verticalScale } from 'react-native-size-matters';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>Log in</Text>

      {/* Top Group: Email, Password, Magic Link */}
      <View style={styles.topGroup}>
        <TextInput
          placeholder="Email address"
          placeholderTextColor="#888"
          style={styles.input}
        />
        <TextInput
          placeholder="Password (optional)"
          placeholderTextColor="#888"
          style={styles.input}
          secureTextEntry
        />
        <TouchableOpacity
          style={[styles.button, styles.disabledButton]}
          disabled
        >
          <Text style={styles.disabledButtonText}>Send Magic Link</Text>
        </TouchableOpacity>
      </View>

      {/* OR Text */}
      <Text style={styles.orText}>or</Text>

      {/* Bottom Group: Apple, GitHub, Google */}
      <View style={styles.bottomGroup}>
        <TouchableOpacity style={[styles.button, styles.appleButton]}>
          <Text style={[styles.buttonText, styles.appleButtonText]}>
            Continue with Apple
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continue with GitHub</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    padding: 20,
    paddingTop: 80.2,
    alignItems: "center",
    marginTop:-71,
  },
  title: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "500",
    marginBottom: 24,
    marginTop:4.6
  },

  // Top fields group
  topGroup: {
    gap: 8,
    marginBottom: 80,
    

  },

  input: {
    height: 56,
    width: 358,
    borderRadius: 17,
    backgroundColor: "#1C1C1E",
    color: "#fff",
    paddingHorizontal: 16,
    fontSize: 15,
  },

  button: {
    height: 56,
    width: 358,
    borderRadius: 17,
    backgroundColor: "#1C1C1E",
    justifyContent: "center",
    alignItems: "center",
  },

  disabledButton: {
    backgroundColor: "#2C2C2E",
  },

  disabledButtonText: {
    color: "#888",
    fontSize: 16,
    fontWeight: "600",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: -0.5,
    fontFamily: "inter",
    
  },

  appleButton: {
    backgroundColor: "#fff", // ✅ Apple button WHITE BG
  },
  appleButtonText: {
    color: "#000",            // ✅ Black text for visibility on white
    fontWeight: "500",
  },
  

  orText: {
    color: "#aaa",
    fontSize: 16,
    marginTop: -40,   // 👈 Exactly 30px below Magic Link button
    top:-10,
    marginBottom: 20,
    opacity: 0.3

  },

  // Bottom social buttons
  bottomGroup: {
    gap: 8,
  },
});

export default LoginScreen;
