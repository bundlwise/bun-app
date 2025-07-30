import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Transaction = {
  id: number;
  company_name: string;
  renewal_date: string;
  amount: number;
  currency: string;
  usage_percentage: number;
};

const TransactionItem = ({ item }: { item: Transaction }) => {
  return (
    <View style={styles.row}>
      <Image source={{ uri: 'https://cryptologos.cc/logos/appcoins-appc-logo.png' }} style={styles.icon} />
      <View style={styles.center}>
        <Text style={styles.name}>{item.company_name}</Text>
        <Text style={styles.subtitle}>{item.renewal_date}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.amount}>{item.currency} {item.amount}</Text>
        <Text style={styles.address}>{item.usage_percentage}% used</Text>
      </View>
    </View>
  );
};

const TransactionList = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔄 Replace this with real API later
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const dataFromBackend: Transaction[] = [
          {
            id: 1,
            company_name: 'Apple-Music',
            renewal_date: '12th June - 14th July',
            amount: 450.098,
            currency: '₹',
            usage_percentage: 75,
          },
          {
            id: 2,
            company_name: 'Spotify',
            renewal_date: 'Upcoming',
            amount: 22.00,
            currency: '₹',
            usage_percentage: 45,
          },
          {
            id: 3,
            company_name: 'Netflix',
            renewal_date: 'Dev',
            amount: 499,
            currency: '₹',
            usage_percentage: 90,
          },
          {
            id: 4,
            company_name: 'Prime',
            renewal_date: '19 jan - 16 may',
            amount: 1300,
            currency: '₹',
            usage_percentage: 60,
          },
          {
            id: 5,
            company_name: 'YouTube',
            renewal_date: '19 dec - 16 may',
            amount: 1300,
            currency: '₹',
            usage_percentage: 30,
          }
        ];
        
        // Filter out invalid/empty data
        const validTransactions = dataFromBackend.filter(transaction => 
          transaction && 
          transaction.company_name && 
          transaction.company_name.trim() !== '' && 
          transaction.amount > 0 &&
          transaction.renewal_date &&
          transaction.renewal_date.trim() !== ''
        );
        
        setTransactions(validTransactions.slice(0, 5));
      } catch (error) {
        console.log('Error fetching transactions:', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const renderItem: ListRenderItem<Transaction> = ({ item }) => (
    <TransactionItem item={item} />
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Loading transactions...</Text>
          </View>
        ) : transactions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        ) : (
          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          />
        )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
});

export default TransactionList;