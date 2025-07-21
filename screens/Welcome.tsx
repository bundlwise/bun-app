import React, { useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { useGoogleAuth } from "../utils/authService";

type WelcomeScreenProps = {
  route: RouteProp<RootStackParamList, 'Welcome'>;
  navigation: any;
};

const Welcome = ({ route, navigation }: WelcomeScreenProps) => {
  const { userInfo, signOut } = useGoogleAuth();
  
  // Get user from navigation params or from auth state
  const user = route.params?.user || userInfo;

  useEffect(() => {
    // If no user is authenticated, redirect to the login screen
    if (!user) {
      navigation.replace('BundlwiseGetStartedScreen');
    }
  }, [user, navigation]);

  const handleProfilePress = () => {
    navigation.navigate('Profile', { user });
  };

  const handleSignOut = async () => {
    await signOut();
    navigation.replace('BundlwiseGetStartedScreen');
  };

  if (!user) {
    // Loading state or redirect handling
    return (
      <View style={[styles.view, styles.viewBg]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.view, styles.viewBg]}>
      <View style={styles.logoBox}>
        <View style={styles.child}>
          <Image 
            source={require("../assets/isolatedCube.webp")}
            style={{ width: "20%", height: "20%" }}
            resizeMode="cover"
          />
        </View>

        <Text style={styles.welcomeTo}>
          Welcome to{"\n"}Bundlwise
        </Text>

        <View style={styles.userInfoContainer}>
          <Text style={styles.welcomeMessage}>Hello, {user.name}!</Text>
          <Text style={styles.emailText}>{user.email}</Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.rectangleParent, styles.groupChildLayout]}
          onPress={handleProfilePress}
        >
          <View style={[styles.groupChild, styles.groupChildLayout]} />
          <Text style={styles.buttonText}>My Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.signOutButton, styles.groupChildLayout]}
          onPress={handleSignOut}
        >
          <View style={[styles.signOutChild, styles.groupChildLayout]} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  groupChildLayout: {
    height: 50,
    width: 346,
    position: "absolute",
  },
  groupChild: {
    borderRadius: 16,
    backgroundColor: "#fff",
    left: 0,
    top: 0,
  },
  buttonText: {
    top: 15,
    left: 140,
    fontSize: 16,
    letterSpacing: -0.5,
    fontWeight: "600",
    fontFamily: "inter",
    color: "black",
    textAlign: "left",
    position: "absolute",
  },
  rectangleParent: {
    top: 582,
  },
  signOutButton: {
    top: 652,
  },
  signOutChild: {
    borderRadius: 16,
    backgroundColor: "#333",
    left: 0,
    top: 0,
  },
  signOutText: {
    top: 15,
    left: 140,
    fontSize: 16,
    letterSpacing: -0.5,
    fontWeight: "600",
    fontFamily: "inter",
    color: "white",
    textAlign: "left",
    position: "absolute",
  },
  viewBg: {
    backgroundColor: "#000",
    flex: 1,
  },
  view: {
    width: "100%",
    height:"100%",
    overflow: "hidden"
  },
  child: {
    top: 112,
    borderRadius: 37,
    width: 505,
    height: 284,
    position: "absolute",
    display:"flex",
    justifyContent:"center",
    alignItems:"center"
  },
  logoBox: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  welcomeTo: {
    top: 387,
    fontSize: 32,
    letterSpacing: -0.1,
    fontWeight: "700",
    color: "#fff",
    textAlign: "left",
    position: "absolute",
  },
  userInfoContainer: {
    top: 480,
    alignItems: "center",
    position: "absolute",
  },
  welcomeMessage: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  emailText: {
    fontSize: 16,
    color: "#ccc",
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    marginTop: 300,
  }
});

export default Welcome;
