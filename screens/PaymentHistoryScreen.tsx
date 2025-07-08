import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

type Transaction = {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  amount: string;
  address: string;
};

const PaymentHistoryScreen = () => {
    const navigation = useNavigation<any>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Mock data (replace with real API later)
        const dataFromBackend: Transaction[] = [
          {
            id: '1',
            name: 'Apple-Music',
            icon: 'https://cryptologos.cc/logos/appcoins-appc-logo.png',
            subtitle: '12th June - 14th July',
            amount: '₹450.09',
            address: 'Auto-Payment',
          },
          {
            id: '2',
            name: 'Spotify',
            icon: 'https://cryptologos.cc/logos/varenx-varen-logo.png',
            subtitle: 'Upcoming',
            amount: '₹22.00',
            address: 'Amazon-Pay',
          },
          {
            id: '3',
            name: 'Om-Baba',
            icon: 'https://cryptologos.cc/logos/kucoin-shares-kcs-logo.png',
            subtitle: 'Dev',
            amount: 'Growth',
            address: 'Intern',
          },
          {
            id: '4',
            name: 'Raha',
            icon: 'https://cryptologos.cc/logos/kucoin-shares-kcs-logo.png',
            subtitle: '19 Jan - 16 May',
            amount: '₹1300',
            address: 'Intern',
          },
          {
            id: '5',
            name: 'Subscribe',
            icon: 'https://cryptologos.cc/logos/kucoin-shares-kcs-logo.png',
            subtitle: '19 Dec - 16 May',
            amount: '₹1300',
            address: 'Rock',
          },
          {
            id: '6',
            name: 'Netflix',
            icon: 'https://cryptologos.cc/logos/neo-neo-logo.png',
            subtitle: 'Paid on 5 June',
            amount: '₹199',
            address: 'Card',
          },
          {
            id: '7',
            name: 'Prime Video',
            icon: 'https://cryptologos.cc/logos/solana-sol-logo.png',
            subtitle: 'Paid on 8 June',
            amount: '₹149',
            address: 'UPI',
          },
          {
            id: '8',
            name: 'Zee5',
            icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png',
            subtitle: 'Paid on 12 June',
            amount: '₹99',
            address: 'Paytm',
          },
          {
            id: '9',
            name: 'Hotstar',
            icon: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
            subtitle: 'Paid on 15 June',
            amount: '₹299',
            address: 'Amazon Pay',
          },
          {
            id: '10',
            name: 'YouTube Premium',
            icon: 'https://cryptologos.cc/logos/tron-trx-logo.png',
            subtitle: 'Paid on 18 June',
            amount: '₹129',
            address: 'UPI',
          },
        ];

        setTransactions(dataFromBackend);
      } catch (e) {
        setError('Failed to load payment history.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderItem: ListRenderItem<Transaction> = ({ item }) => (
    <View style={styles.row}>
      <Image source={{ uri: item.icon }} style={styles.icon} />
      <View style={styles.center}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.subtitle}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.amount}>{item.amount}</Text>
        <Text style={styles.address}>{item.address}</Text>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#292734', '#1E1B23', '#121118', '#000000']}
      locations={[0, 0.5, 0.6, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.wrapper}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backIconCircle} onPress={() => navigation.navigate('WalletScreen')}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.heading}>Payment History</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#fff" style={{ marginTop: 30 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 30,
    marginBottom: 20,
  },
  backIconCircle: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: '#1A1A1A',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 10,
  marginTop: 10,
  marginLeft: 10, // ✅ added to shift icon slightly right
},

  
  backArrow: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    left:65,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderBottomColor: '#222',
    borderBottomWidth: 1,
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 14,
    backgroundColor: '#1A1A1A',
  },
  center: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  subtitle: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  address: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 30,
  },
});

export default PaymentHistoryScreen;
