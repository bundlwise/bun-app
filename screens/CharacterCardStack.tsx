import { useSmartFetch } from '../hooks/useSmartFetch';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  PanResponder,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');

export interface SubscriptionData {
  id: number;
  company_name: string;
  renewal_date: string;
  amount: number;
  currency: string;
  subscription_start_date: string;
  subscription_end_date: string;
  usage_percentage: number; // Changed from app_usage to match WalletHeader
}

export interface CardData {
  id: number;
  color: string;
  appIcon: string;
  appName: string;
  usage: string;
  renewalDate: string;
  planPrice: string;
}

const CardStack = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  // Background cards animations for smooth transitions
  const bg1TranslateX = useRef(new Animated.Value(-20)).current;
  const bg1TranslateY = useRef(new Animated.Value(-8)).current;
  const bg1Scale = useRef(new Animated.Value(0.90)).current;
  const bg1Rotation = useRef(new Animated.Value(-2)).current;

  const bg2TranslateX = useRef(new Animated.Value(-35)).current;
  const bg2TranslateY = useRef(new Animated.Value(-15)).current;
  const bg2Scale = useRef(new Animated.Value(0.80)).current;
  const bg2Rotation = useRef(new Animated.Value(-6)).current;

  const bg3TranslateX = useRef(new Animated.Value(-50)).current;
  const bg3TranslateY = useRef(new Animated.Value(-25)).current;
  const bg3Scale = useRef(new Animated.Value(0.70)).current;
  const bg3Rotation = useRef(new Animated.Value(-8)).current;

  // Use your custom hook
  const { data: subscriptions, loading, error, refetch } = useSmartFetch<SubscriptionData[]>({
    url: 'https://fake-api.com/subscriptions', // Replace this URL with your real API endpoint
    method: 'GET',
    auto: false // Disable auto-fetch for dummy data
  });

  // Dummy data for development - matches your database schema
  const dummySubscriptions: SubscriptionData[] = [
    {
      id: 1,
      company_name: 'Netflix',
      renewal_date: '2024-12-15',
      amount: 1499.00,
      currency: '₹',
      subscription_start_date: '2024-01-15',
      subscription_end_date: '2024-12-15',
      usage_percentage: 85, // Direct usage percentage from database
    },
    {
      id: 2,
      company_name: 'Spotify',
      renewal_date: '2024-12-22',
      amount: 1199.00,
      currency: '₹',
      subscription_start_date: '2024-02-22',
      subscription_end_date: '2024-12-22',
      usage_percentage: 70, // Direct usage percentage from database
    },
    {
      id: 3,
      company_name: 'Adobe Creative Cloud',
      renewal_date: '2025-01-08',
      amount: 2499.00,
      currency: '₹',
      subscription_start_date: '2024-03-08',
      subscription_end_date: '2025-01-08',
      usage_percentage: 90, // Direct usage percentage from database
    },
    {
      id: 4,
      company_name: 'GitHub Pro',
      renewal_date: '2024-12-30',
      amount: 799.00,
      currency: '₹',
      subscription_start_date: '2024-04-30',
      subscription_end_date: '2024-12-30',
      usage_percentage: 60, // Direct usage percentage from database
    },
    {
      id: 5,
      company_name: 'Notion',
      renewal_date: '2025-05-10',
      amount: 999.00,
      currency: '₹',
      subscription_start_date: '2024-05-10',
      subscription_end_date: '2025-05-10',
      usage_percentage: 80, // Direct usage percentage from database
    },
    {
      id: 6,
      company_name: 'Figma',
      renewal_date: '2024-12-15',
      amount: 899.00,
      currency: '₹',
      subscription_start_date: '2024-06-15',
      subscription_end_date: '2024-12-15',
      usage_percentage: 75, // Direct usage percentage from database
    }
  ];

  // Use dummy data for now - replace with real API call later
  const mockSubscriptions = subscriptions || dummySubscriptions;

  // Color palette for cards
  const colorPalette = [
    '#a78bfa', // Purple
    '#a3b9d8', // Blue
    '#e8d9c5', // Beige
    '#34d399', // Green
    '#f87171', // Red
    '#fbbf24', // Yellow
    '#60a5fa', // Light Blue
    '#a78bfa', // Purple
    '#34d399', // Green
    '#f472b6', // Pink
  ];

  // Icon mapping for different companies
  const getAppIcon = (companyName: string): string => {
    const iconMap: { [key: string]: string } = {
      'netflix': '📱',
      'spotify': '🎵',
      'xbox': '🎮',
      'disney': '📺',
      'amazon': '📦',
      'youtube': '📺',
      'apple': '🍎',
      'google': '🔍',
      'microsoft': '💻',
      'adobe': '🎨',
      'default': '📱'
    };

    const normalizedName = companyName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (normalizedName.includes(key)) {
        return icon;
      }
    }
    return iconMap.default;
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Transform backend data to card format
  const transformToCardData = (subscriptions: SubscriptionData[]): CardData[] => {
    return subscriptions.map((sub, index) => {
      const usagePercent = sub.usage_percentage;
      
      return {
        id: sub.id,
        color: colorPalette[index % colorPalette.length],
        appIcon: getAppIcon(sub.company_name),
        appName: sub.company_name,
        usage: `${Math.round(usagePercent)}%`,
        renewalDate: formatDate(sub.renewal_date),
        planPrice: `${sub.currency}${sub.amount}`
      };
    });
  };

  // Transform subscriptions to card data
  const cardData = mockSubscriptions ? transformToCardData(mockSubscriptions) : [];

  // Handle dynamic card count
  const getCardOrder = () => {
    const order = [];
    const cardCount = cardData.length;
    if (cardCount === 0) return [];
    
    for (let i = 0; i < Math.min(4, cardCount); i++) {
      order.push((currentIndex + i) % cardCount);
    }
    return order;
  };

  const cardOrder = getCardOrder();
  const displayCardOrder = isAnimating ? getCardOrder() : cardOrder;

  // Helper function to get card data safely
  const getCardData = (index: number): CardData => {
    if (cardData.length === 0) {
      return {
        id: 0,
        color: '#a78bfa',
        appIcon: '📱',
        appName: 'No Data',
        usage: '0%',
        renewalDate: 'N/A',
        planPrice: '$0.00'
      };
    }
    return cardData[index % cardData.length];
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Reset any ongoing animations
        translateX.setValue(0);
        translateY.setValue(0);
        scale.setValue(1);
      },
      onPanResponderMove: (_, gesture) => {
        // Android-safe gesture handling
        if (!gesture || typeof gesture.dx !== 'number' || typeof gesture.dy !== 'number') {
          return;
        }
        
        // Limit movement for better performance
        const maxDistance = 200;
        const clampedDx = Math.max(-maxDistance, Math.min(maxDistance, gesture.dx));
        const clampedDy = Math.max(-maxDistance, Math.min(maxDistance, gesture.dy));
        
        translateX.setValue(clampedDx);
        translateY.setValue(clampedDy);
        
        // Simplified scaling for better performance
        const distance = Math.sqrt(clampedDx ** 2 + clampedDy ** 2);
        const newScale = Math.max(0.8, 1 - distance / 300);
        scale.setValue(newScale);
        
        // Simplified background card animations
        const progress = Math.min(1, distance / 150);
        
        // Only animate the immediate background card for better performance
        bg1TranslateX.setValue(-20 + (20 * progress));
        bg1TranslateY.setValue(-8 + (8 * progress));
        bg1Scale.setValue(0.90 + (0.10 * progress));
      },
      onPanResponderRelease: (_, gesture) => {
        const swipeDistance = Math.abs(gesture.dx);
        const velocity = Math.abs(gesture.vx);
        
        if (swipeDistance > 80 || velocity > 0.3) {
          // Swipe detected - simplified animation
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: gesture.dx > 0 ? width : -width,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(translateY, {
              toValue: gesture.dy * 0.3,
              duration: 300,
              useNativeDriver: false,
            }),
            Animated.timing(scale, {
              toValue: 0.7,
              duration: 300,
              useNativeDriver: false,
            })
          ]).start(() => {
            // Reset and cycle
            translateX.setValue(0);
            translateY.setValue(0);
            scale.setValue(1);
            setCurrentIndex((prev) => (prev + 1) % cardData.length);
            animateBackgroundCards();
          });
        } else {
          // Return to original position - simplified
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: false,
              tension: 100,
              friction: 8,
            }),
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: false,
              tension: 100,
              friction: 8,
            }),
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: false,
              tension: 100,
              friction: 8,
            }),
            // Simplified background card return
            Animated.spring(bg1TranslateX, {
              toValue: -20,
              useNativeDriver: false,
              tension: 100,
              friction: 8,
            }),
            Animated.spring(bg1TranslateY, {
              toValue: -8,
              useNativeDriver: false,
              tension: 100,
              friction: 8,
            }),
            Animated.spring(bg1Scale, {
              toValue: 0.90,
              useNativeDriver: false,
              tension: 100,
              friction: 8,
            })
          ]).start();
        }
      },
    })
  ).current;

  const animateBackgroundCards = () => {
    setIsAnimating(true);
    Animated.parallel([
      // Simplified animation - only animate the immediate background card
      Animated.spring(bg1TranslateX, {
        toValue: 0,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(bg1TranslateY, {
        toValue: 0,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(bg1Scale, {
        toValue: 1,
        useNativeDriver: false,
        tension: 50,
        friction: 7,
      })
    ]).start(() => {
      // Reset values for next cycle
      bg1TranslateX.setValue(-20);
      bg1TranslateY.setValue(-8);
      bg1Scale.setValue(0.90);
      
      setIsAnimating(false);
    });
  };

  // Show loading state
  if (loading && !mockSubscriptions) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#a78bfa" />
          <Text style={styles.loadingText}>Loading subscriptions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state only if no dummy data available
  if (error && !mockSubscriptions) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Text style={styles.retryText} onPress={() => refetch()}>
            Tap to retry
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show empty state
  if (cardData.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No subscriptions found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.cardsWrapper}>
          <Text style={styles.title}>Upcoming Payments</Text>
          
          {/* Fourth card - only show if we have 4+ cards */}
          {displayCardOrder.length >= 4 && (
            <Animated.View style={[
              styles.card, 
              styles.fourthCard, 
              { 
                backgroundColor: getCardData(displayCardOrder[3]).color,
                transform: [
                  { translateX: bg3TranslateX },
                  { translateY: bg3TranslateY },
                  { scale: bg3Scale }
                ]
              }
            ]}>
              <View style={styles.cardContent}>
                <View style={styles.appHeader}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.appIcon}>{getCardData(displayCardOrder[3]).appIcon}</Text>
                  </View>
                  <Text style={styles.appName}>{getCardData(displayCardOrder[3]).appName}</Text>
                </View>
                
                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Usage</Text>
                    <Text style={styles.infoValue}>{getCardData(displayCardOrder[3]).usage}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Renewal</Text>
                    <Text style={styles.infoValue}>{getCardData(displayCardOrder[3]).renewalDate}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Plan</Text>
                    <Text style={styles.infoValue}>{getCardData(displayCardOrder[3]).planPrice}</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}
          
          {/* Third card - only show if we have 3+ cards */}
          {displayCardOrder.length >= 3 && (
            <Animated.View style={[
              styles.card, 
              styles.thirdCard, 
              { 
                backgroundColor: getCardData(displayCardOrder[2]).color,
                transform: [
                  { translateX: bg2TranslateX },
                  { translateY: bg2TranslateY },
                  { scale: bg2Scale }
                ]
              }
            ]}>
              <View style={styles.cardContent}>
                <View style={styles.appHeader}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.appIcon}>{getCardData(displayCardOrder[2]).appIcon}</Text>
                  </View>
                  <Text style={styles.appName}>{getCardData(displayCardOrder[2]).appName}</Text>
                </View>
                
                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Usage</Text>
                    <Text style={styles.infoValue}>{getCardData(displayCardOrder[2]).usage}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Renewal</Text>
                    <Text style={styles.infoValue}>{getCardData(displayCardOrder[2]).renewalDate}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Plan</Text>
                    <Text style={styles.infoValue}>{getCardData(displayCardOrder[2]).planPrice}</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}
          
          {/* Second card - only show if we have 2+ cards */}
          {displayCardOrder.length >= 2 && (
            <Animated.View style={[
              styles.card, 
              styles.secondCard, 
              { 
                backgroundColor: getCardData(displayCardOrder[1]).color,
                transform: [
                  { translateX: bg1TranslateX },
                  { translateY: bg1TranslateY },
                  { scale: bg1Scale }
                ]
              }
            ]}>
              <View style={styles.cardContent}>
                <View style={styles.appHeader}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.appIcon}>{getCardData(displayCardOrder[1]).appIcon}</Text>
                  </View>
                  <Text style={styles.appName}>{getCardData(displayCardOrder[1]).appName}</Text>
                </View>
                
                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Usage</Text>
                    <Text style={styles.infoValue}>{getCardData(displayCardOrder[1]).usage}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Renewal</Text>
                    <Text style={styles.infoValue}>{getCardData(displayCardOrder[1]).renewalDate}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Plan</Text>
                    <Text style={styles.infoValue}>{getCardData(displayCardOrder[1]).planPrice}</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}
          
          {/* Front card - always show if we have at least 1 card */}
          {displayCardOrder.length >= 1 && (
            <Animated.View
              style={[
                styles.card,
                styles.frontCard,
                { 
                  backgroundColor: getCardData(displayCardOrder[0]).color,
                  transform: [
                    { translateX: translateX },
                    { translateY: translateY },
                    { scale: scale }
                  ]
                }
              ]}
              {...panResponder.panHandlers}
            >
              <View style={styles.cardContent}>
                <View style={styles.appHeader}>
                  <View style={styles.iconContainer}>
                    <Text style={styles.appIcon}>{getCardData(displayCardOrder[0]).appIcon}</Text>
                  </View>
                  <Text style={styles.appName}>{getCardData(displayCardOrder[0]).appName}</Text>
                </View>
                
                <View style={styles.infoContainer}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Usage</Text>
                    <Text style={styles.infoValue}>{getCardData(displayCardOrder[0]).usage}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Renewal</Text>
                    <Text style={styles.infoValue}>{getCardData(displayCardOrder[0]).renewalDate}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Plan</Text>
                    <Text style={styles.infoValue}>{getCardData(displayCardOrder[0]).planPrice}</Text>
                  </View>
                </View>
              </View>
            </Animated.View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  cardContainer: {
    position: 'relative',
    width: 280,
    height: 420,
  },
  cardsWrapper: {
    position: 'relative',
    width: 360,
    height: 450,
    backgroundColor: '#E6C36F',
    left: -40,
    borderRadius: 30,
  },
  card: {
    position: 'absolute',
    width: 250,
    height: 360,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'visible', // Changed from 'hidden' to 'visible' for better swipe
    left: 60,
    top: 60,
  },
  secondCard: {
    backgroundColor: '#a3b9d8',
    zIndex: 2,
  },
  thirdCard: {
    backgroundColor: '#e8d9c5',
    zIndex: 1,
  },
  fourthCard: {
    backgroundColor: '#34d399',
    zIndex: 0,
  },
  frontCard: {
    backgroundColor: '#a78bfa',
    zIndex: 3,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    width: '100%',
    height: '100%',
  },
  appHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appIcon: {
    fontSize: 32,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  priceContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  priceLabel: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.8,
    fontWeight: '500',
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 10,
    top: 20,  
    left: -60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#a78bfa',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryText: {
    fontSize: 16,
    color: '#a78bfa',
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  emptyText: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
  },
});

export default CardStack;