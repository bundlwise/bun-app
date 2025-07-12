// components/TransactionHistory.tsx
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const transactions = [
  {
    title: 'CSS.GG',
    subtitle:
      'Open-source CSS, SVG and Figma UI Icons Available in SVG Sprite, styled-components, NPM & API',
    amount: '₹2,281',
    avatarUri: 'https://avatars.githubusercontent.com/u/1857554?v=4',
    user: 'astrit',
    downloads: '2,281',
  },
  {
    title: 'Tailwind Icons',
    subtitle:
      'Icons made for Tailwind + Figma + React using SVG, CSS, and more',
    amount: '₹3,499',
    avatarUri: 'https://avatars.githubusercontent.com/u/123456?v=4',
    user: 'rahul',
    downloads: '5,612',
  },
  {
    title: 'Feather Icons',
    subtitle:
      'Simply beautiful open-source icons, always up-to-date for developers',
    amount: '₹1,999',
    avatarUri: 'https://avatars.githubusercontent.com/u/7891011?v=4',
    user: 'jack',
    downloads: '3,014',
  },
];

const TransactionHistory = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {transactions.map((item, index) => (
          <View key={index} style={styles.card}>
            {/* Top Row */}
            <View style={styles.topRow}>
              <View style={styles.iconTitleContainer}>
                <View style={styles.titleSubtitle}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text numberOfLines={2} style={styles.subtitle}>
                    {item.subtitle}
                  </Text>
                </View>
              </View>
              <View style={styles.amount}>
                <Text style={styles.amountText}>{item.amount}</Text>
              </View>
            </View>

            {/* Bottom Row */}
            <View style={styles.bottomRow}>
              <View style={styles.metaLeft}>
                <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
                <Text style={styles.metaText}>{item.user}</Text>
              </View>
              <View style={styles.metaRight}>
                <Feather name="download" color="#aaa" size={14} />
                <Text style={styles.metaText}>{item.downloads}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransactionHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  card: {
    width: 385,
    padding: 32,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: '#1A1A1A',
    shadowColor: '#ffffff',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    marginBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconTitleContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  titleSubtitle: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Inter_600SemiBold',
  },
  subtitle: {
    fontSize: 15,
    color: '#aaa',
    height: 36,
    overflow: 'hidden',
    marginBottom: 16,
    fontFamily: 'Inter_400Regular',
  },
  amount: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    top: -5,
  },
  amountText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    fontFamily: 'Inter-Medium',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 35,
  },
  metaLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
    top: 2,
  },
  metaText: {
    fontSize: 13,
    color: '#aaa',
    marginLeft: 4,
  },
});
