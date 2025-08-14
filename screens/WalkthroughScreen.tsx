import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import Button from '../components/Button';
import InformationFlashCard from '../components/FlashCards/InformationFlashCard';

type WalkthroughScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Walkthrough'>;
};

const WalkthroughScreen: React.FC<WalkthroughScreenProps> = ({ navigation }) => {
  const handleContinue = () => {
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.flashCardContainer}>
          {/* <FlashCard 
            title="Manage Subscriptions" 
            description="Track and control your recurring expenses effortlessly."
            backgroundImage={require('../assets/images/walkthrough_manage_subs.png')}
            backgroundColor="#1E1E1E"
          /> */}
          {/* <FlashCard 
            title="Manage Subscriptions" 
            description="Track and control your recurring expenses effortlessly."
            backgroundImage={require('../assets/images/walkthrough_manage_subs.png')}
            backgroundColor="#1E1E1E"
          /> */}
          <InformationFlashCard
            title="Additional Information"
            description="Learn More Details"
         
            backgroundImage={require('../assets/images/flash-card-bg/navy_blue.png')}
           
            style={{
              shadowColor:'rgba(255, 255, 255, 0.1) 0px 1px 0px 0px inset, rgba(0, 0, 0, 0.4) 0px 30px 50px 0px, rgba(3, 15, 129, 0.09) 0px 4px 24px 0px, rgba(255, 255, 255, 0.06) 0px 0px 0px 1px inset',
              shadowOffset:{
                width:0,
                height:0,
              },
              shadowOpacity:0.5,
              shadowRadius:10,
            }}
          />
        </View>

        <View style={{
          marginTop:76,
          flex:1,
          justifyContent:"center",
          alignItems:"center",
        }}> 
          <Button 
            title="Next" 
            onPress={handleContinue}
            width="auto"
            borderRadius={16}
            borderColor="#303030"
            borderWidth={1}
            textStyle={{ color: "#fff" }}
            buttonStyle={{
              width:90,
              paddingHorizontal: 24,
              backgroundColor:"transparent",
              flex:1,
              justifyContent:"center",
              alignItems:"center",
            }}
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
    backgroundColor: "#07080a",
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    width: '90%',
    alignItems: 'center',
    gap: 20,
  },
  flashCardContainer: {
    width: '100%',
  },
});

export default WalkthroughScreen;
