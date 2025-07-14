import React from "react";
import { StatusBar } from "react-native";
import BundlwiseGetStartedScreen from "./screens/BundlwiseGetStartedScreen"; // ✅ Adjust path if needed

const App = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <BundlwiseGetStartedScreen />
    </>
  );
};

export default App;
