import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { verticalScale } from "react-native-size-matters";

const CreateAccountScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="chevron-back" size={26} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Create your account</Text>

      {/* Middle Section (Top Group + OR + Bottom Group) */}
      <View style={styles.middleSection}>

        {/* Top Group: Name, Username, Email, Password */}
        <View style={styles.topGroup}>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#888"
            style={styles.input}
          />
          <TextInput
            placeholder="Username"
            placeholderTextColor="#888"
            style={styles.input}
          />
          <TextInput
            placeholder="Email address"
            placeholderTextColor="#888"
            style={styles.input}
          />
          <TextInput
            placeholder="Password (optional)"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
          />
          <TouchableOpacity style={[styles.button, styles.createButton]}>
            <Text style={styles.createButtonText}>Create account</Text>
          </TouchableOpacity>
        </View>

        {/* OR Text */}
        <Text style={styles.orText}>or</Text>

        {/* Bottom Group: Apple, GitHub, Google */}
        <View style={styles.bottomGroup}>
          <TouchableOpacity style={[styles.button, styles.appleButton]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Image source={require('../assets/apple.png')} style={{ width: 20, height: 20, resizeMode: 'contain', left: -72 }} />
              <Text style={[styles.buttonText, styles.appleButtonText]}>
                Continue with Apple
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Image
                source={require("../assets/github.png")}
                style={{ width: 20, height: 20, resizeMode: "contain", left: -72 }}
              />
              <Text style={styles.buttonText}>Continue with GitHub</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Image
                source={require("../assets/google.png")}
                style={{ width: 20, height: 20, resizeMode: "contain", left: -72 }}
              />
              <Text style={styles.buttonText}>Continue with Google</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Terms */}
      <Text style={styles.terms}>
        By continuing you agree to our <Text style={styles.link}>Terms of Service</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    padding: 20,
    paddingTop: 12,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: verticalScale(7),
    left: 3,
    zIndex: 10,
  },
  title: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "500",
    marginBottom: 24,
  },
  middleSection: {
    alignItems: 'center',
    gap: 20,
  },
  topGroup: {
    gap: 8,
    marginBottom: 0, // ❗️Position not changed
  },
  input: {
    height: 56,
    width: 358,
    borderRadius: 17,
    backgroundColor: "#171616",
    color: "#fff",
    paddingHorizontal: 16,
    fontSize: 17,
  },
  button: {
    height: 56,
    width: 358,
    borderRadius: 17,
    backgroundColor: "#171616",
    justifyContent: "center",
    alignItems: "center",
  },
  createButton: {
    backgroundColor: "#fff",
  },
  createButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  orText: {
    color: "#aaa",
    fontSize: 16,
    opacity: 0.3,
    marginBottom: 0,
    marginTop:0
  },
  bottomGroup: {
    gap: 8,
    top:19,
  },
  appleButton: {
    backgroundColor: "#fff",
  },
  appleButtonText: {
    color: "#000",
    fontWeight: "500",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.5,
    left: -10,
  },
  terms: {
    fontSize: 13,
    color: "#363636",
    marginTop: 48,
  },
  link: {
    textDecorationLine: "underline",
  },
});

export default CreateAccountScreen;
