import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Svg, { Path } from "react-native-svg";

const BundlwiseGetStartedScreen = () => {
  return (
    <View style={[styles.view, styles.viewBg]}>
      <View style={styles.screenLayout}>

        <View style={styles.child}>
          <Image
            source={require("../assets/isolatedCube.webp")}
            style={{ width: "50%", height: "50%" }}
            resizeMode="cover"
          />

          {/* SVG placed on top of the image without altering layout */}
          <Svg
            width={32}
            height={32}
            viewBox="0 0 16 18"
            style={styles.overlayIcon}
          >
            <Path
              d="M11.0386 7.65363C11.2415 7.61853 11.4372 7.56993 11.6243 7.50873L11.6235 7.50783C12.9702 7.06323 13.8606 5.93913 13.8606 4.16253C13.8606 2.91604 13.2007 1.89184 12.2306 1.37704C11.4325 0.954042 10.5658 0.729043 9.69587 0.599443C7.62218 0.289844 5.5398 0.0126446 3.44479 4.46082e-05C2.12731 -0.00805537 1.56843 1.08814 1.29373 2.31034C0.955877 3.82054 0.722221 5.64483 0.759321 7.19823C0.783792 8.22872 1.15559 9.37082 2.40991 9.19172C4.26732 8.92712 6.02842 8.59142 7.81163 8.25122C8.87176 8.04873 9.939 7.84532 11.0386 7.65363ZM2.42491 17.9991H11.442L11.4428 18C13.788 18 15.2365 15.723 14.9681 13.1913C14.8055 11.6496 14.1756 9.99452 12.7871 9.46802C11.6788 9.04682 10.4584 9.23042 9.31145 9.40232C9.18593 9.42122 9.06121 9.44012 8.93728 9.45722C7.64428 9.64262 6.3568 9.87212 5.07012 10.1016C4.87593 10.1367 4.68174 10.1709 4.48834 10.206C4.42598 10.2168 4.36283 10.2276 4.29968 10.2393C3.39663 10.3986 2.39097 10.5768 1.53765 10.8774C0.6717 11.1825 0.370158 12.0753 0.22807 12.9852C0.167288 13.3749 0.130976 13.7691 0.0946648 14.1624C0.0836135 14.2785 0.0733516 14.3946 0.0623003 14.5107C-0.0308464 15.4476 -0.108995 16.4214 0.528033 17.1747C1.00798 17.7444 1.75157 17.9991 2.42491 17.9991Z"
              fill="white"
            />
          </Svg>
        </View>

        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeTextTitle}>Welcome to{"\n"}Bundlwise</Text>
          <Text style={styles.welcomeTextDescription}>Manage subscriptions at your fingertips</Text>
        </View>

        <View style={[styles.rectangleParent, styles.groupChildLayout]}>
          <View style={[styles.groupChild, styles.groupChildLayout]} />
          <Text style={styles.logIn}>Log in</Text>
        </View>

        <View style={[styles.rectangleCreateAcc, styles.groupChildLayout]}>
          <View style={[styles.groupChild, styles.groupChildLayout]} />
          <Text style={styles.createAcc}>Create Account</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // this should be in the top of the every screen
  viewBg: {
    backgroundColor: "#000",
    flex: 1,
  },
  view: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
  },

  // this should be in the top of the every screen
  screenLayout: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },

  // Middle text section
  viewWelcomeTo: {
    flex: 1,
  },
  welcomeTextContainer: {
    top: 387,
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  welcomeTextTitle: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: -0.1,
    // lineHeight: 18,
  },
  welcomeTextDescription: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "400",
    textAlign: "center",
    letterSpacing: -0.1,
  },



  groupChildLayout: {
    height: 50,
    width: 346,
    position: "absolute",
  },
  groupChild: {
    borderRadius: 16,
    backgroundColor: "#1B1B1C",
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
  rectangleCreateAcc: {
    top: 682 + 50 + 12,
    position: "absolute",
  },
  createAcc: {
    top: 15,
    left: 120,
    fontSize: 16,
    letterSpacing: -0.5,
    fontWeight: "600",
    fontFamily: "inter",
    color: "black",
    textAlign: "left",
    position: "absolute",
  },

  description: {
    top: 469,
    fontSize: 16,
    fontWeight: "400",
    color: "#fff",
    textAlign: "left",
    position: "absolute",
  },
  child: {
    top: 112,
    borderRadius: 37,
    width: 505,
    height: 284,
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayIcon: {
    position: "absolute",
    top: 10, // You can adjust if needed
    left: 10,
  },
});

export default BundlwiseGetStartedScreen;
