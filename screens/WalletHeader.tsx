/**
 * WalletHeader Component
 * 
 * Backend Integration:
 * - Uses useSmartFetch hook to fetch subscription data from API
 * - Database schema matches PostgreSQL tables:
 *   - users (user_id, user_email, user_name, etc.)
 *   - user_subscriptions_details (company_name, amount, renewal_date, etc.)
 *   - bundlwise_subscriptions_details (bundled subscriptions)
 * 
 * API Endpoints:
 * - GET /api/user-subscriptions - Fetches user's subscription data
 * - GET /api/subscription-usage - Fetches usage statistics
 * 
 * To connect to real backend:
 * 1. Change API_BASE_URL to your actual API URL
 * 2. Ensure API returns data matching UserSubscriptionsResponse interface
 * 3. Update usage calculation logic in transformSubscriptionsToBars function
 */

import React, { useEffect, useRef, useState } from 'react';

import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { useSmartFetch } from '../hooks/useSmartFetch';
import CharacterCardStack from './CharacterCardStack';
import SmoothCarouselExample from './SmoothCarouselExample';
import TransactionList from './TransactionList';
import {
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

// Database Types - Matching PostgreSQL Schema
interface UserSubscriptionDetails {
  // Required fields for bars
  company_name: string;
  amount: number;
  usage_percentage?: number; // Optional usage data from backend
  
  // Optional fields for database compatibility
  id?: number;
  user_id?: number;
  purchase_date?: string;
  renewal_date?: string;
  payment_method?: string;
  currency?: string;
  renewal_amount?: number;
  subscription_type?: string;
  subscription_user_name?: string;
  subscription_start_date?: string;
  subscription_end_date?: string;
  created_at?: string;
  updated_at?: string;
}

interface BundlwiseSubscriptionDetails {
  id: number;
  user_id: number;
  company_name: string;
  purchase_date: string;
  renewal_date?: string;
  payment_method?: string;
  amount: number;
  currency: string;
  renewal_amount?: number;
  subscription_type: string;
  subscription_user_name?: string;
  subscription_start_date: string;
  subscription_end_date?: string;
  created_at: string;
  updated_at: string;
}

interface UserSubscriptionsResponse {
  individual_subscriptions: UserSubscriptionDetails[];
  bundled_subscription?: BundlwiseSubscriptionDetails;
  total_spent: number;
  currency: string;
}

// API Configuration
const API_BASE_URL = 'https://your-api.com'; // Change this to your actual API URL
const API_ENDPOINTS = {
  userSubscriptions: `${API_BASE_URL}/api/user-subscriptions`,
  subscriptionUsage: `${API_BASE_URL}/api/subscription-usage`,
};

// Dummy data - ONLY what's actually used for bars
const DUMMY_SUBSCRIPTIONS: UserSubscriptionsResponse = {
  individual_subscriptions: [
    {
      company_name: "Netflix",
      amount: 1499.00,
      usage_percentage: 75
    },
    {
      company_name: "Spotify", 
      amount: 1199.00,
      usage_percentage: 60
    },
    {
      company_name: "Adobe Creative Cloud",
      amount: 2499.00,
      usage_percentage: 85
    },
    {
      company_name: "GitHub Pro",
      amount: 799.00,
      usage_percentage: 45
    }
  ],
  total_spent: 5996.00,
  currency: "INR"
};

// Utility function to transform database data to UI format
const transformSubscriptionsToBars = (subscriptions: UserSubscriptionsResponse): BarItem[] => {
  const colors = ['#FF6464', '#6464FF', '#33FF99', '#FFB366', '#FF66B2', '#66FFB3'];
  
  // Only show subscriptions that exist in database (filter out empty/null entries)
  const validSubscriptions = subscriptions.individual_subscriptions.filter(sub => 
    sub && 
    sub.company_name && 
    sub.company_name.trim() !== '' && 
    sub.amount > 0
  );
  
  return validSubscriptions.map((sub, index) => ({
    color: colors[index % colors.length],
    label: sub.company_name,
    width: 80 + (index * 10), // Dynamic width based on index
    fontSize: 12,
    marginRight: 20,
    marginTop: 0,
    align: 'center' as const,
    usage: sub.usage_percentage || undefined, // Only show usage if backend provides it
    shiftX: 0,
    company_name: sub.company_name,
    amount: sub.amount,
    currency: sub.currency
  }));
};

// Animated Number Component
const AnimatedAmount = ({ value, duration = 2000 }: { value: string; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState('₹0');
  const animatedValue = useSharedValue(0);
  
  useEffect(() => {
    const finalValue = parseInt(value.replace(/[^\d]/g, ''), 10);
    
    // Reset to 0
    setDisplayValue('₹0');
    animatedValue.value = 0;
    
    // Start smooth animation
    animatedValue.value = withTiming(finalValue, {
      duration: duration,
    });
    
    // Update display value during animation
    const updateInterval = setInterval(() => {
      const currentValue = Math.floor(animatedValue.value);
      
      // Add shuffling effect during first 80% of animation
      if (currentValue < finalValue * 0.8) {
        const shuffleValue = currentValue + Math.floor(Math.random() * 100);
        setDisplayValue(`₹${shuffleValue.toLocaleString()}`);
      } else {
        setDisplayValue(`₹${currentValue.toLocaleString()}`);
      }
    }, 50); // Update every 50ms for smooth animation
    
    // Cleanup
    setTimeout(() => {
      clearInterval(updateInterval);
      setDisplayValue(`₹${finalValue.toLocaleString()}`);
    }, duration);
    
    return () => clearInterval(updateInterval);
  }, [value, duration]);

  return (
    <Text style={styles.amount} numberOfLines={1} adjustsFontSizeToFit={true}>
      {displayValue}
    </Text>
  );
};

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Android-specific adjustments
const isAndroid = Platform.OS === 'android';
const centerOffset = isAndroid ? screenWidth / 2 - 20 : screenWidth / 2; // Adjust for Android padding
const barSpacing = isAndroid ? 8 : 20; // Slightly tighter spacing on Android

export type BarItem = {
  color: string;
  label: string;
  width: number;
  fontSize?: number;
  marginRight?: number;
  marginTop?: number;
  align?: 'flex-start' | 'center' | 'flex-end';
  usage?: number;
  shiftX?: number;
};

type Props = {
  balanceAmount: string;
  bars: BarItem[];
};

const VerticalTicksRow = () => (
  <View style={styles.ticksContainer}>
    {Array.from({ length: 40 }).map((_, i) => (
      <View key={i} style={styles.tick} />
    ))}
  </View>
);

// Separate component for animated bars
const AnimatedBar = ({
  bar,
  visibleIdx,
  originalIdx,
  scrollX,
  animationProgress,
  interactionStarted,
  barWidths,
  barMargins,
  labelsVisible,
  onPress
}: {
  bar: BarItem;
  visibleIdx: number;
  originalIdx: number;
  scrollX: Animated.SharedValue<number>;
  animationProgress: Animated.SharedValue<number>;
  interactionStarted: Animated.SharedValue<boolean>;
  barWidths: Animated.SharedValue<number>[];
  barMargins: Animated.SharedValue<number>[];
  labelsVisible: boolean;
  onPress: (idx: number) => void;
}) => {
  const shiftXStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: [0, 1, 2, 3].includes(originalIdx) ? -9 : 0 }],
  }));

  const scaleStyle = useAnimatedStyle(() => {
    const mid = visibleIdx * (bar.width + barMargins[originalIdx].value) + barWidths[originalIdx].value / 2;
    const center = scrollX.value + screenWidth / 2; // True center of the screen
    const dist = Math.abs(center - mid);
    const rawScale = interpolate(dist, [0, 80, 200], [1.5, 0.85, 0.6], Extrapolate.CLAMP);
    const s = 1 + (rawScale - 1) * animationProgress.value;
    return { transform: [{ scale: s }] };
  });

  const shadowStyle = useAnimatedStyle(() => {
    const mid = visibleIdx * (bar.width + barMargins[originalIdx].value) + barWidths[originalIdx].value / 2;
    const center = scrollX.value + screenWidth / 2; // True center of the screen
    const dist = Math.abs(center - mid);
    const opacity = interactionStarted.value
      ? interpolate(dist, [0, 60, 150], [1, 0, 0], Extrapolate.CLAMP)
      : 0;
    return {
      shadowColor: '#33FF99',
      shadowOpacity: opacity * 0.4,
      shadowRadius: opacity * 10,
      elevation: isAndroid ? opacity * 8 : opacity * 10, // Android elevation
    };
  });

  const labelScaleStyle = useAnimatedStyle(() => {
    const mid = visibleIdx * (bar.width + barMargins[originalIdx].value) + barWidths[originalIdx].value / 2;
    const center = scrollX.value + screenWidth / 2; // True center of the screen
    const dist = Math.abs(center - mid);
    const rawScale = interpolate(dist, [0, 80, 200], [1.5, 0.85, 0.6], Extrapolate.CLAMP);
    const s = 1 + (rawScale - 1) * animationProgress.value;
    return { transform: [{ scale: s }] };
  });

  const widthStyle = useAnimatedStyle(() => ({
    width: barWidths[originalIdx].value,
  }));

  const marginRightStyle = useAnimatedStyle(() => ({
    marginRight: barMargins[originalIdx].value,
  }));

  const usageStyle = useAnimatedStyle(() => {
    const mid = visibleIdx * (bar.width + barMargins[originalIdx].value) + barWidths[originalIdx].value / 2;
    const center = scrollX.value + screenWidth / 2; // True center of the screen
    const dist = Math.abs(center - mid);
    const show = interactionStarted.value
      ? interpolate(dist, [0, 40, 80], [1, 0, 0], Extrapolate.CLAMP)
      : 0;
    return { opacity: show };
  });

  return (
    <Animated.View
      style={[styles.barBox, marginRightStyle, shiftXStyle, { marginTop: bar.marginTop ?? 0 }]}
    >
      <TouchableWithoutFeedback onPress={() => onPress(originalIdx)}>
        <View>
          {bar.usage != null && (
            <Animated.View style={[styles.usageTextBox, usageStyle]}>
              <Text style={styles.usageText}>{bar.usage}% USAGE</Text>
            </Animated.View>
          )}

          <Animated.View style={[styles.barShadowWrapperBase, scaleStyle, shadowStyle]}>
            <Animated.View style={[styles.coloredBox, { backgroundColor: bar.color }, widthStyle]} />
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
      {labelsVisible && (
        <Animated.Text style={[
          styles.barLabel,
          { fontSize: bar.fontSize || 12 },
          { transform: [{ translateX: bar.shiftX ?? 0 }] },
          labelScaleStyle
        ]}>
          {bar.label}
        </Animated.Text>
      )}
    </Animated.View>
  );
};

const WalletHeader = ({ balanceAmount, bars }: Props) => {
  const navigation = useNavigation<any>();
  const animationProgress = useSharedValue(0);
  const scrollX = useSharedValue(0);
  const interactionStarted = useSharedValue(false);
  
  // API Integration with useSmartFetch
  const { data: subscriptionsData, loading, error, refetch } = useSmartFetch<UserSubscriptionsResponse>({
    url: API_ENDPOINTS.userSubscriptions,
    method: 'GET',
    auto: true // Auto-fetch on component mount
  });

  // Use dummy data if API is not available (for development)
  const currentData = subscriptionsData || DUMMY_SUBSCRIPTIONS;
  const transformedBars = transformSubscriptionsToBars(currentData);
  
  // Calculate total spent only from valid subscriptions
  const validSubscriptions = currentData.individual_subscriptions.filter((sub: UserSubscriptionDetails) => 
    sub && 
    sub.company_name && 
    sub.company_name.trim() !== '' && 
    sub.amount > 0
  );
  // Calculate total on screen from individual amounts
  const totalSpent = validSubscriptions.reduce((sum: number, sub: UserSubscriptionDetails) => sum + sub.amount, 0);

  const [labelsVisible, setLabelsVisible] = useState(false);
  const [visibleBars, setVisibleBars] = useState<BarItem[]>(transformedBars);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [showBars, setShowBars] = useState(false);

  // Update bars when data changes
  useEffect(() => {
    if (currentData) {
      const newBars = transformSubscriptionsToBars(currentData);
      setVisibleBars(newBars);
    }
  }, [currentData]);

  const slideStarted = useRef(false);
  
  // Store original margins separately instead of modifying bars objects
  const originalMargins = useRef<number[]>(visibleBars.map(bar => bar.marginRight ?? 20));

  // Update originalMargins when visibleBars changes
  useEffect(() => {
    originalMargins.current = visibleBars.map(bar => bar.marginRight ?? 20);
  }, [visibleBars]);
  
  const barWidth0 = useSharedValue(0);
  const barWidth1 = useSharedValue(0);
  const barWidth2 = useSharedValue(0);
  const barWidth3 = useSharedValue(0);
  const barWidth4 = useSharedValue(0);
  const barWidth5 = useSharedValue(0);
  
  const barMargin0 = useSharedValue(barSpacing);
  const barMargin1 = useSharedValue(barSpacing);
  const barMargin2 = useSharedValue(barSpacing);
  const barMargin3 = useSharedValue(barSpacing);
  const barMargin4 = useSharedValue(barSpacing);
  const barMargin5 = useSharedValue(barSpacing);

  const barWidths = [barWidth0, barWidth1, barWidth2, barWidth3, barWidth4, barWidth5];
  const barMargins = [barMargin0, barMargin1, barMargin2, barMargin3, barMargin4, barMargin5];

  const triggerSlideToPosition = () => {
    if (slideStarted.current) return;
    slideStarted.current = true;

    setScrollEnabled(true);
    interactionStarted.value = true; // Enable usage text visibility

    visibleBars.forEach((bar, idx) => {
      barWidths[idx].value = withTiming(bar.width, { duration: 800 });
      const originalMargin = originalMargins.current[idx]; // Use stored original margin
      barMargins[idx].value = withTiming(originalMargin, { duration: 800 });
    });

    animationProgress.value = withTiming(1, { duration: 600 });
  };

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
    animationProgress.value = withTiming(1, { duration: 600 });
  });

  useEffect(() => {
    visibleBars.forEach((bar, idx) => {
      const originalWidth = bar.width;
      const originalMargin = originalMargins.current[idx]; // Use stored original margin

      let distortedWidth = originalWidth;
      let distortedMargin = barSpacing; // Use Android-adjusted spacing

      if (idx === 0) { distortedWidth = 120; }
      else if (idx === 1) { distortedWidth = 100; }
      else if (idx === 2) { distortedWidth = 80; }
      else if (idx === 3) { distortedWidth = 60; }

      barWidths[idx].value = withDelay(idx * 200, withTiming(distortedWidth, { duration: 800 }));
      barMargins[idx].value = withDelay(idx * 200, withTiming(distortedMargin, { duration: 800 }));
    });

    setTimeout(() => setLabelsVisible(true), visibleBars.length * 200 + 800);
  }, [visibleBars]);

  const scrollViewRef = useRef<ScrollView>(null);

  const handleBarPress = (idx: number) => {
    // Calculate the center position of the tapped bar using current bar widths and margins
    let offset = 0;
    for (let i = 0; i < idx; i++) {
      offset += barWidths[i].value + barMargins[i].value;
    }
    offset += barWidths[idx].value / 2;
    
    // Scroll so that the bar's center is at the screen center
    const scrollToX = Math.max(0, offset - screenWidth / 2);
    scrollViewRef.current?.scrollTo({ x: scrollToX, animated: true });
    
    // Trigger the animation
    triggerSlideToPosition();
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Loading Indicator at Top */}
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Fetching data...</Text>
        </View>
      )}

      {/* Top Search Bar - Exact same as HomeScreen */}
      <View style={styles.topBar}>
        <TouchableOpacity>
          <Svg
            width={32}
            height={32}
            viewBox="0 0 16 18"
            style={styles.overlayIcon}
          >
            <Path
              d="M11.0386 7.65363C11.2415 7.61853 11.4372 7.56993 11.6243 7.50873L11.6235 7.50783C12.9702 7.06323 13.8606 5.93913 13.8606 4.16253C13.8606 2.91604 13.2007 1.89184 12.2306 1.37704C11.4325 0.954042 10.5658 0.729043 9.69587 0.599443C7.62218 0.289844 5.5398 0.0126446 3.44479 4.46082e-05C2.12731 -0.00805537 1.56843 1.08814 1.29373 2.31034C0.955877 3.82054 0.722221 5.64483 0.759321 7.19823C0.783792 8.22872 1.15559 9.37082 2.40991 9.19172C4.26732 8.92712 6.02842 8.59142 7.81163 8.25122C8.87176 8.04873 9.939 7.84532 11.0386 7.65363ZM2.42491 17.9991H11.442L11.4428 18C13.788 18 15.2365 15.723 14.9681 13.1913C14.8055 11.6496 14.1756 9.99452 12.7871 9.46802C11.6788 9.04682 10.4584 9.23042 9.31145 9.40232C9.18593 9.42122 9.06121 9.44012 8.93728 9.45722C7.64428 9.64262 6.3568 9.87212 5.07012 10.1016C4.87593 10.1367 4.68174 10.1709 4.48834 10.206C4.42598 10.2168 4.36283 10.2276 4.29968 10.2393C3.39663 10.3986 2.39097 10.5768 1.53765 10.8774C0.6717 11.1825 0.370158 12.0753 0.22807 12.9852C0.167288 13.3749 0.130976 13.7691 0.0946648 14.1624C0.0836135 14.2785 0.0733516 14.3946 0.0623003 14.5107C-0.0308464 15.4476 -0.108995 16.4214 0.528033 17.1747C1.00798 17.7444 1.75157 17.9991 2.42491 17.9991Z"
              fill="white"
            />
          </Svg>
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Feather name="search" size={16} color="#888" style={{ marginHorizontal: 8 }} />
          <TextInput
            placeholder="Search Raycast"
            placeholderTextColor="#888"
            style={styles.input}
          />
        </View>

        <View style={styles.profileCircle}>
          <Text style={styles.profileText}>RS</Text>
        </View>
      </View>

      {/* 🔹 Balance & Bars */}
      <View style={styles.balanceSection}>
        <LinearGradient
          colors={['#FF6464', '#6464FF', '#33FF99', '#666666']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradientBorderWrapper}
        >
          <View style={styles.balanceContainer}>
            <Text style={styles.label}>Total Spent</Text>
            {loading ? (
              <Text style={styles.amount}>Loading...</Text>
            ) : error ? (
              <Text style={styles.amount}>Error loading data</Text>
            ) : (
              <AnimatedAmount value={`${totalSpent.toLocaleString()}`} />
            )}

            <View style={styles.chartWrapper}>
              {visibleBars.length > 0 ? (
                <>
                  {/* Remove TouchableWithoutFeedback from here, move to bar */}
                  <AnimatedScrollView
                    ref={scrollViewRef}
                    horizontal
                    scrollEnabled={scrollEnabled}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={isAndroid ? 8 : 16} // Lower throttle on Android for better performance
                    onScroll={scrollHandler}
                    style={styles.scrollView}
                    removeClippedSubviews={isAndroid} // Android optimization
                  >
                    <View style={styles.barsWrapper}>
                      {visibleBars.map((bar, visibleIdx) => {
                        const originalIdx = visibleBars.findIndex(b => b.label === bar.label);
                        return (
                          <AnimatedBar
                            key={bar.label}
                            bar={bar}
                            visibleIdx={visibleIdx}
                            originalIdx={originalIdx}
                            scrollX={scrollX}
                            animationProgress={animationProgress}
                            interactionStarted={interactionStarted}
                            barWidths={barWidths}
                            barMargins={barMargins}
                            labelsVisible={labelsVisible}
                            onPress={handleBarPress}
                          />
                        );
                      })}
                    </View>
                  </AnimatedScrollView>
                  <View style={styles.ticksWrapper}>
                    <VerticalTicksRow />
                  </View>
                </>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No subscriptions found</Text>
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>
      
      {/* Carousel Section */}
      {/* <View style={styles.carouselSection}>
        <SmoothCarouselExample />
      </View> */}
      <View style={styles.cardStackSection}>
        <CharacterCardStack />
      </View>
      <View style={styles.carouselSection}>
        <SmoothCarouselExample />
      </View>
      <View style={styles.transactionSection}>
        <TransactionList />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Added to give full height
    padding: Platform.OS === 'android' ? 16 : 20, // Slightly less padding on Android
    marginTop: 10, // Add top margin to move content down
    backgroundColor: '#000',
    paddingTop: StatusBar.currentHeight ?? 40,
  },
  // Top Bar Styles - Exact same as HomeScreen
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 10,
    width: 270,
    height: 45,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    paddingVertical: 6,
  },
  overlayIcon: {
    // Optional: add any specific styling for the SVG icon
  },
  profileCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#819add',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  balanceSection: { marginTop: 20 },
  balanceContainer: {
    backgroundColor: '#0a0a0a',
    borderRadius: 17,
    padding: 20,
    paddingBottom: 5, // Significantly reduced bottom padding to decrease height
    width: '100%',
  },
  label: { color: '#FFF', fontSize: 14, fontWeight: '600', marginLeft: 10, opacity: 0.6 },
  amount: {
    fontSize: Platform.OS === 'android' ? 30 : 32, // Slightly smaller font on Android
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-end',
    marginRight: 280, // Adjust for Android screen
  },
  chartWrapper: { 
    position: 'relative', 
    paddingBottom: 10, // Reduced from 30 to 10 to decrease container height
    marginTop: 5, // Reduced from 50 to 20 to move bars up
    overflow: 'visible' 
  },
  scrollView: { marginTop: 16, overflow: 'visible' },
  barsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'nowrap',
    paddingHorizontal: Platform.OS === 'android' ? -10: -5, // Less padding on Android
    overflow: 'visible',
  },
  barBox: { position: 'relative', alignItems: 'center', marginBottom: 10, minHeight: 140, overflow: 'visible' },
  barShadowWrapperBase: { backgroundColor: '#111', borderRadius: 8, height: 28, justifyContent: 'center' },
  coloredBox: { height: 28, borderRadius: 8 },
  barLabel: { color: '#aaa', marginTop: 42, textAlign: 'center' },
  usageTextBox: {
    position: 'absolute',
    top: -30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  usageText: {
    fontSize: 12,
    color: '#FFF',
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ticksWrapper: { position: 'absolute', bottom: 100, left: 0, right: 0 }, // Moved ticks down by reducing bottom from 120 to 100
  ticksContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
  tick: { width: 1, height: 10, backgroundColor: '#333' },
  gradientBorderWrapper: {
    borderRadius: 20,
    padding: 1,
    marginHorizontal: -5,
    width: '106%',
    alignSelf: 'center',
  },
  carouselSection: {
    marginTop: 40, // Increased from 20 to 40 to give more space for carousel
    flex: 1, // Added to take remaining space
  },
  cardStackSection: {
    marginTop: 40, // Increased from 20 to 40 to give more space for carousel
    flex: 1, // Added to take remaining space
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: '#888',
    fontSize: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  loadingText: {
    color: '#33FF99',
    fontSize: 14,
    fontWeight: '500',
  },
  scrollContent: {
    flexGrow: 1,
  },
  transactionSection: {
    marginTop: 20,
  },
});

export default WalletHeader;
/*
 * Usage Example:
 * 
 * // Before (with static props):
 * <WalletHeader 
 *   balanceAmount="₹12,894" 
 *   bars={staticBars} 
 * />
 * 
 * // After (with backend integration):
 * <WalletHeader 
 *   balanceAmount="" // Not used anymore, data comes from API
 *   bars={[]} // Not used anymore, data comes from API
 * />
 * 
 * The component now automatically:
 * 1. Fetches data from API using useSmartFetch
 * 2. Transforms database records to UI bars
 * 3. Shows loading/error states
 * 4. Updates when API data changes
 * 
 * Database Schema Mapping:
 * - company_name → bar.label
 * - amount → bar.amount
 * - currency → bar.currency
 * - usage_percentage → bar.usage (from separate API call)
 * 
 * API Response Expected Format:
 * {
 *   "individual_subscriptions": [
 *     {
 *       "id": 1,
 *       "user_id": 1,
 *       "company_name": "Netflix",
 *       "amount": 1499.00,
 *       "currency": "INR",
 *       "renewal_date": "2024-12-15",
 *       ...
 *     }
 *   ],
 *   "bundled_subscription": { ... },
 *   "total_spent": 12894.00,
 *   "currency": "INR"
 * }
 */
