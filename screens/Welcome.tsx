import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Svg, { Path } from "react-native-svg";

const BundlwiseGetStartedScreen = () => {
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
        <View style={[styles.rectangleParent, styles.groupChildLayout]}>
          <View style={[styles.groupChild, styles.groupChildLayout]} />
          <Text style={styles.logIn}>Log in</Text>
        </View>
        
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
  logIn: {
    top: 15,
    left: 151,
    fontSize: 16,
    letterSpacing: -0.5,
    fontWeight: "600",
    fontFamily: "inter",
    color: "black",
    textAlign: "left",
    position: "absolute",
  },
  rectangleParent: {
    top: 682,
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
    // backgroundColor: "#dcdcdc",
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
    // fontFamily: FontFamily.interBold,
    color: "#fff",
    textAlign: "left",
    position: "absolute",
  },
});

export default BundlwiseGetStartedScreen;
