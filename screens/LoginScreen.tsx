import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import Button from "../components/Button";
import Input from "../components/Input";
import AppleIcon from "../assets/icons/apple.svg";
import GoogleIcon from "../assets/icons/google.svg";


const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // TODO: Implement login logic
    console.log("Login attempted with:", { email, password });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.createAccountContainer}>
          <View style={styles.createAccountTextContainer}>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="Email address"
              keyboardType="email-address"
              autoCapitalize="none"
              width="100%"
              borderRadius={17}
              backgroundColor="#171717"
              placeholderTextColor="#888"
              inputStyle={{ color: "#FFFFFF", fontSize: 16 }}
              containerStyle={{ alignSelf: "center" }}
            />

            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="Password (optional)"
              secureTextEntry
              width="100%"
              borderRadius={17}
              backgroundColor="#171717"
              placeholderTextColor="#888"
              inputStyle={{ color: "#FFFFFF", fontSize: 16 }}
              containerStyle={{ alignSelf: "center" }}
            />
          </View>

          <Button
            title="Send magic link"
            onPress={handleLogin}
            width="100%"
            // backgroundColor="#404040"
            backgroundColor="#FFFFFF"
            borderRadius={16}
            textStyle={{ color: "#1B1B1B" }}
          />
        </View>

        <View style={{}}>
          <Text
            style={{
              color: "#484848",
              fontSize: 16,
              fontFamily: "Inter-Medium",
              textAlign: "center",
            }}
          >
            or
          </Text>
        </View>

        <View
          style={{
            gap: 9,
          }}
        >
          <Button
            title="Continue with Google"
            onPress={handleLogin}
            width="100%"
            backgroundColor="#FFFFFF"
            borderRadius={16}
            textStyle={{ color: "#000000" }}
            leftIcon={<GoogleIcon width={20} height={20} fill="#000000" />}
          />

          <Button
            title="Continue with Apple"
            onPress={handleLogin}
            width="100%"
            leftIcon={<AppleIcon width={20} height={20} fill="#fff" />}
            backgroundColor="#171717"
            borderRadius={16}
            textStyle={{ color: "#fff" }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 62,
  },
  formContainer: {
    width: "90%",
    gap: 36,
  },
  createAccountContainer: {
    gap: 9,
  },
  createAccountTextContainer: {
    gap: 8,
  }
});

export default LoginScreen;
