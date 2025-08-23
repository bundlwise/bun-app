import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  ImageBackground,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import BundlwiseLogo from "../../assets/icons/bundlwise.svg";

interface InformationFlashCardProps {
  title?: string;
  description?: string;
  style?: ViewStyle;
  backgroundColor?: string;
  backgroundImage?: any; // Allow passing background image
  iconColor?: string;
  titleText?: string;
  subtitleText?: string;
}
import { LinearGradient } from 'expo-linear-gradient';

const InformationFlashCard: React.FC<InformationFlashCardProps> = ({
  title,
  description,
  style,
  backgroundColor = "#1E2023",
  backgroundImage,
  iconColor = "#FFFFFF",
  titleText = "Additional Information",
  subtitleText = "Learn More Details",
}) => {
  return (
    <View style={[styles.container, { backgroundColor }, style]}>
      {backgroundImage && (
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImageContainer}
          imageStyle={styles.backgroundImageStyle}
          resizeMode="cover"
        />
      )}
      <View style={styles.boxOverlay}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 12,
            alignItems: "center",
            width: "100%",
          }}
        >
          <View
            style={{
              width: 56,
              height: 56,
              margin: -2,
              borderRadius: 16,
              boxShadow: "0 1.189px 2.377px 0 rgba(0, 0, 0, .28)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "#07080a",
                width: 50,
                height: 50,
                borderRadius: 16,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor:
                    "linear-gradient(180deg, hsla(0, 0%, 100%, .03), hsla(0, 0%, 100%, .1))",
                  boxShadow:
                    "inset 0 1px 0 0 hsla(0, 0%, 100%, .05), 0 0 0 1px hsla(0, 0%, 100%, .25), inset 0 -1px 0 0 rgba(0, 0, 0, .2)",
                  borderRadius: 16,
                  overflow:"hidden",
                  flex:1,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >

                    <BundlwiseLogo width={24} height={24} />
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-start",
              alignSelf: "stretch",
            }}
          >
            <Text
              style={{
                textAlign: "left",
                fontSize: 18,
                fontWeight: "400",
                lineHeight: 24,
                letterSpacing: 0.2,
                fontFamily: "Inter-Medium",
                color: "#fff",
              }}
            >
              Bundlwise Ai
            </Text>
          </View>

          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.06)",

              boxShadow: "inset 0 1px 0 0 hsla(0, 0%, 100%, .05), 0 0 0 1px hsla(0, 0%, 100%, .25), inset 0 -1px 0 0 rgba(0, 0, 0, .2)",
            }}
          >
            <LinearGradient

              colors={[
                'hsla(0, 0%, 100%, 0.03)', // start color
                'hsla(0, 0%, 100%, 0.1)'   // end color
              ]}
              start={{ x: 0.5, y: 0 }}   // top center
              end={{ x: 0.5, y: 1 }}     // bottom center
              style={{ flex: 1, height: '100%', width: '100%', justifyContent: "center", alignItems: "center" }}        // or your desired style
            >
              <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                <Path
                  d="M5.75 3.75 10.25 8l-4.5 4.25"
                  stroke={iconColor}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                />
              </Svg>
            </LinearGradient>
          </View>
        </View>

        <View>
          <Text
            style={{
              fontSize: 16,
              color: "#fff",
              fontWeight: "500",
              lineHeight: 26,
              letterSpacing: 0,
            }}
          >
            Stay organized.Start, pause, or cancel your subscriptions instantly in one click.
          </Text>
        </View>
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "hsla(0, 0%, 100%, .05)",
          }}
        ></View>
      </View>
      <View
        style={{
          position: "absolute",
          height: 360,
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: "center",
          alignItems: "center",
        }}>
          <ImageBackground
            source={require("../../assets/images/walkthrough_ai_2.png")}
            style={StyleSheet.absoluteFillObject}
            resizeMode="cover"
          />
        </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 536.2,
    borderWidth: 1,
    borderColor: "hsla(0, 0%, 100%, .12)",
    borderRadius: 20,
    overflow: "hidden",
  },
  backgroundImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImageStyle: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  boxOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    gap: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
  },
});

export default InformationFlashCard;
