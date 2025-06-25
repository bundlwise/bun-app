import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const MyAssetsCard = () => {
  return (
    <LinearGradient
      colors={['#F749A2', '#C147E9']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.cardContainer}
    >
      <View style={styles.leftContent}>
        <Text style={styles.largeAmount}>1,743,287.20</Text>
        <Text style={styles.smallAmount}>00.0196287</Text>
      </View>

      <View style={styles.assetInfo}>
        <Image source={require('../assets/icon.png')} style={styles.assetIcon} />
        <Text style={styles.assetName}>Tether</Text>
      </View>

      <Text style={styles.assetValue}>1,287.05</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    margin: 20,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContent: {
    flex: 1,
  },
  largeAmount: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  smallAmount: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  assetInfo: {
    alignItems: 'center',
  },
  assetIcon: {
    width: 24,
    height: 24,
    marginBottom: 4,
  },
  assetName: {
    color: '#fff',
    fontSize: 12,
  },
  assetValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MyAssetsCard;