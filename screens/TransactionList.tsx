import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ListRenderItem,
} from 'react-native';

type Transaction = {
  id: string;
  name: string;
  icon: string;
  subtitle: string;
  amount: string;
  address: string;
};

const TransactionItem = ({ item }: { item: Transaction }) => {
  return (
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
};

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // 🔄 Replace this with real API later
    const fetchTransactions = async () => {
      const dataFromBackend: Transaction[] = [
        {
          id: '1',
          name: 'Apple-Music',
          icon: 'https://cryptologos.cc/logos/appcoins-appc-logo.png',
          subtitle: '12th June - 14th July',
          amount: '450.098',
          address: 'Auto-Payment',
        },
        {
          id: '2',
          name: 'Spotify',
          icon: 'https://cryptologos.cc/logos/varenx-varen-logo.png',
          subtitle: 'Upcoming',
          amount: '22.00',
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
          subtitle: '19 jan - 16 may',
          amount: '1300',
          address: 'Intern',
        },
        {
          id: '5',
          name: 'Subscribe',
          icon: 'https://cryptologos.cc/logos/kucoin-shares-kcs-logo.png',
          subtitle: '19 dec - 16 may',
          amount: '1300',
          address: 'rock',
        }
      ];
      setTransactions(dataFromBackend.slice(0, 5));
;
    };

    fetchTransactions();
  }, []);

  const renderItem: ListRenderItem<Transaction> = ({ item }) => (
    <TransactionItem item={item} />
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    height: 300,
    marginTop: 10,
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#0F0F0F',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
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
});

export default TransactionList;