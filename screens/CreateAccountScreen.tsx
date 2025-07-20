import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { verticalScale } from "react-native-size-matters";
import { useSmartFetch } from '../hooks/useSmartFetch';

const CreateAccountScreen = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Validation states
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [isValidatingUsername, setIsValidatingUsername] = useState(false);

  const { refetch, validateField } = useSmartFetch({ auto: false });

  // Debounced email validation
  useEffect(() => {
    if (!email || email.length < 3) {
      setEmailError("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsValidatingEmail(true);
      const error = await validateField('email', email);
      setEmailError(error || "");
      setIsValidatingEmail(false);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [email, validateField]);

  // Debounced username validation
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameError("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsValidatingUsername(true);
      const error = await validateField('username', username);
      setUsernameError(error || "");
      setIsValidatingUsername(false);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [username, validateField]);

  const handleCreateAccount = async () => {
    if (!name || !username || !email) {
      setErrorText("Please fill all required fields.");
      return;
    }

    if (emailError || usernameError) {
      setErrorText("Please fix the validation errors above.");
      return;
    }

    setLoading(true);
    setErrorText("");
    try {
      const response = await refetch({
        url: "https://your-api.com/create-account",
        method: "POST",
        body: {
          user_name: name,
          user_username: username,
          user_email: email,
          user_password: password,
        },
      });
      
      if (response?.error) {
        setErrorText(response.error || "Something went wrong. Please try again.");
      } else if (response?.data) {
        setErrorText("");
        Alert.alert("Success", `Account created for ${response.data.user_name} ✨`);
        // navigation.navigate("Badge"); // 🔁 Uncomment when Badge screen is ready
      }
    } catch (err: any) {
      setErrorText("Unexpected error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="chevron-back" size={26} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Create your account</Text>

      <View style={styles.middleSection}>
        <View style={styles.topGroup}>
          <TextInput
            placeholder="Name"
            placeholderTextColor="#888"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            placeholder="Username"
            placeholderTextColor="#888"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholder="Email address"
            placeholderTextColor="#888"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password (optional)"
            placeholderTextColor="#888"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          
          {errorText !== "" && (
  <Text style={{ color: "red", marginTop: 8, textAlign: "center" }}>
    {errorText}
  </Text>
)}

          <TouchableOpacity
            style={[styles.button, styles.createButton]}
            onPress={handleCreateAccount}
            disabled={loading || !!emailError || !!usernameError}
          >
            <Text style={styles.createButtonText}>Create account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.orText}>or</Text>

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
    marginBottom: 0,
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
  inputError: {
    borderColor: "#ff4444",
    borderWidth: 1,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
  validatingText: {
    color: "#888",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
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
    marginTop: 0,
  },
  bottomGroup: {
    gap: 8,
    top: 19,
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
