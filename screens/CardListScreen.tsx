import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSmartFetch } from '../hooks/useSmartFetch';


import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

// 🔹 Card Component
const CardItem = ({ title, subtitle, avatar, downloads, amount, icon }: any) => {
  const imageSource = typeof icon === 'string' ? { uri: icon } : icon;
  
  // const navigation = useNavigation();

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconTitleContainer}>
          <Image source={imageSource} style={styles.icon} />
          <View style={styles.titleSubtitle}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </View>
        <View style={styles.amount}>
          <Text style={styles.amountText}>{amount}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.metaLeft}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <Text style={styles.metaText}>astrit</Text>
        </View>
        <View style={styles.metaRight}>
          <Feather name="download" color="#aaa" size={14} />
          <Text style={styles.metaText}>{downloads}</Text>
        </View>
      </View>
    </View>
  );
};

// 🔹 Main Component
const CSSCardList = () => {
  // const navigation = useNavigation();

  // 🧪 Dummy data fallback (temporary)
  const dummyData = [
    {
      title: 'CSS.GG',
      subtitle: 'Open-source CSS, SVG and Figma UI Icons Available in SVG Sprite, styled-components, NPM & API',
      icon: require('../assets/google.png'),
      avatar: 'https://avatars.githubusercontent.com/u/1857554?v=4',
      downloads: '2,281',
      amount: '₹2,281',
    },
    {
      title: 'ChatGPT',
      subtitle: 'Bringing the power of artificial intelligence to everyone — anytime, anywhere — to think, create, and solve',
      icon: require('../assets/google.png'),
      avatar: 'https://avatars.githubusercontent.com/u/23264?v=4',
      downloads: '3,999',
      amount: '₹1,299',
    },
    {
      title: 'GitHub',
      subtitle: 'The world’s leading platform for software development — where millions of developers collaborate, innovate',
      icon: '../assets/google.png',
      avatar: 'https://avatars.githubusercontent.com/u/839962?v=4',
      downloads: '5,232',
      amount: '₹3,999',
    },
    {
      title: 'Heroicons',
      subtitle: 'Unlimited entertainment. One simple subscription. Watch stories unfold across the world, whenever and wherever you want',
      icon: '../assets/google.png',
      avatar: 'https://avatars.githubusercontent.com/u/23264?v=4',
      downloads: '1,800',
      amount: '₹899',
    },
  ];

  // ��️ API fetch logic
  // const { data, loading, error } = useSmartFetch({
  //   url: 'https://your-api.com/payment-history',
  //   method: 'GET',
  //   auto: true,
  // });

  // Use API data if available, otherwise fallback to dummyData
  // const cardData = data && Array.isArray(data) && data.length > 0 ? data : dummyData;
  const cardData = dummyData;

  return (
    <LinearGradient
      colors={['#292734', '#1E1B23', '#121118', '#000000']}
      locations={[0, 0.5, 0.6, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      {/* Sticky Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.backButton} >
          <Feather name="arrow-left" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.heading}>Payment History</Text>
      </View>
      {/* Scrollable Cards */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.cardsWrapper}>
          {cardData.map((item: any, index: number) => (
            <CardItem
              key={index}
              title={item.company_name || item.title}
              subtitle={item.subscription_type ? `${item.subscription_type} • Starts ${item.subscription_start_date}` : item.subtitle}
              avatar={item.user_profile_pic || item.avatar || 'https://cdn.myapp.com/default-avatar.png'}
              downloads={item.downloads || '1,000'}
              amount={item.amount ? `₹${item.amount}` : item.amount}
              icon={item.company_icon || item.icon || 'https://cdn.myapp.com/icons/default.png'}
            />
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  scrollContent: {
    paddingBottom: 32,
    paddingTop: 8,
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    marginLeft: 60,
  },
  cardsWrapper: {
    alignItems: 'center',
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
  icon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginRight: 16,
    top: -5,
  },
  titleSubtitle: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    fontFamily: 'Inter_600SemiBold',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#aaa',
    top: 18,
    left: -40,
    width: 330,
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
    fontFamily: 'Inter_500Medium',
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
    fontFamily: 'Inter_400Regular',
  },
});

export default CSSCardList;