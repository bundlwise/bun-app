import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  ImageBackground,
} from "react-native";
import Svg, { Path } from 'react-native-svg';

interface FlashCardProps {
  title?: string;
  description?: string;
  style?: ViewStyle;
  backgroundColor?: string;
  backgroundImage?: any; // Allow passing background image
}

const FlashCard: React.FC<FlashCardProps> = ({
  title,
  description,
  style,
  backgroundColor = "transparent",
  backgroundImage,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundImageContainer}>
        <ImageBackground
          source={backgroundImage}
          imageStyle={{
            height: 413,
            width: 360,
          }}
          resizeMode="cover"
        ></ImageBackground>
      </View>
      
      <Text style={styles.additionalText}>
        One App to Manage
      </Text>

      <View style={styles.subscriptionTextContainer}>
        <Text style={styles.secondaryText}>
          All Your Subscriptions
        </Text>
        <View style={styles.iconContainer}>
          <Svg width={16} height={16} fill="none" viewBox="0 0 16 16">
            <Path 
              stroke="#888888" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="1.5" 
              d="M9.75 4.75 13.25 8m0 0-3.5 3.25M13.25 8H2.75"
            />
          </Svg>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 536.2,
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: 'hsla(0, 0%, 100%, .06)',
    backgroundColor: "#111214",
    borderRadius: 22,
  },
  backgroundImageContainer: {
    borderRadius: 22,
    height: 413,
    width: "100%",
  },
  additionalText: {
    marginTop: 40, 
    marginBottom: 8, 
    fontSize: 24,
    fontFamily: "Inter-Medium",
    fontWeight: "500",
    lineHeight: 24,
    letterSpacing: 0.2,
    color: "#FFFFFF",
    textAlign: "center", 
    width: "100%",
  },
  subscriptionTextContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  secondaryText: {
    display: "flex",
    gap: 3,
    alignItems: "center",
    color: "#888888",
    fontSize: 16,
    textAlign: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  }
});

export default FlashCard;
