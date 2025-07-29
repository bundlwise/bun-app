import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import WalletHeader from './screens/WalletHeader';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <WalletHeader balanceAmount="" bars={[]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
