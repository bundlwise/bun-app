import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import FinancialOverviewScreen from './screens/FinancialOverviewScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <FinancialOverviewScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
