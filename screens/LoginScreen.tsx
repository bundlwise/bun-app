import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { verticalScale } from "react-native-size-matters";
import { useSmartFetch } from "../hooks/useSmartFetch"; // ✅ hook import

const LoginScreen = () => {
  const [user_email, setUserEmail] = useState("");     // ✅ using DB key
  const [user_password, setUserPassword] = useState(""); // ✅ using DB key

  const { refetch, data, loading, error } = useSmartFetch({
    url: "https://your-api.com/api/login",
    method: "POST",
    body: {
      user_email,
      user_password,
    },
  });

  const submitLogin = () => {
    refetch(); // ✅ trigger request
  };

  return (
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
          onChangeText={setUserEmail} // ✅ update via DB key
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password (optional)"
          placeholderTextColor="#888"
          style={styles.input}
          secureTextEntry
          value={user_password}
          onChangeText={setUserPassword} // ✅ update via DB key
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

      {/* Bottom Group: Apple, GitHub, Google */}
      <View style={styles.bottomGroup}>
        <TouchableOpacity style={[styles.button, styles.appleButton]}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Ionicons name="logo-apple" size={18} color="#000" style={{ left: -70 }} />
            <Text style={[styles.buttonText, styles.appleButtonText]}>
              Continue with Apple
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Ionicons name="logo-github" size={18} color="#fff" style={{ left: -70 }} />
            <Text style={styles.buttonText}>Continue with GitHub</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Ionicons name="logo-google" size={18} color="#fff" style={{ left: -70 }} />
            <Text style={styles.buttonText}>Continue with Google</Text>
          </View>
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
    marginTop: -74,
  },
  backButton: {
    position: "absolute",
    top: verticalScale(68),
    left: 5,
    zIndex: 10,
  },
  title: {
    fontSize: 17,
    color: "#fff",
    fontWeight: "500",
    marginBottom: 24,
    marginTop: 4.6,
  },
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
    fontSize: 16,
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
    fontSize: 16,
    marginTop: -40,
    top: -10,
    marginBottom: 20,
    opacity: 0.3,
  },
  bottomGroup: {
    gap: 8,
  },
});

export default LoginScreen; 