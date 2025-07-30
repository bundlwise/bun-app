import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
import { useSmartFetch } from '../hooks/useSmartFetch';
import CardStack from './CharacterCardStack';
import SmoothCarouselExample from './SmoothCarouselExample';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isAndroid = Platform.OS === 'android';

// Database Types - Only needed fields
interface UserSubscriptionDetails {
  company_name: string; // App name/label from database
  amount: number; // Price/amount from database
}

// Dummy data for testing
const DUMMY_SUBSCRIPTIONS: UserSubscriptionDetails[] = [
  { company_name: "Netflix", amount: 1499.00 },
  { company_name: "Spotify", amount: 1199.00 },
  { company_name: "Adobe Creative Cloud", amount: 2499.00 },
  { company_name: "GitHub Pro", amount: 799.00 }
];

// Transform database data to UI bars
const transformSubscriptionsToBars = (subscriptions: UserSubscriptionDetails[]): BarItem[] => {
  const colors = ['#FF6464', '#6464FF', '#33FF99', '#FFB366', '#FF66B2', '#66FFB3'];
  
  return subscriptions.map((sub, index) => {
    let initialWidth = 80;
    if (index === 0) { initialWidth = 120; }
    else if (index === 1) { initialWidth = 100; }
    else if (index === 2) { initialWidth = 80; }
    else if (index === 3) { initialWidth = 60; }
    
    return {
      color: colors[index % colors.length],
      label: sub.company_name, // Database key: company_name → UI key: label
      width: initialWidth,
      fontSize: 12,
      marginRight: 10,
      marginTop: 0,
      align: 'center' as const,
      shiftX: 0
    };
  });
};

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
  walletAddress: string;
  userName: string;
  balanceAmount: string;
  bars: BarItem[];
  profileIcons?: (string | null)[];

};

const VerticalTicksRow = () => (
  <View style={styles.ticksContainer}>
    {Array.from({ length: 40 }).map((_, i) => (
      <View key={i} style={styles.tick} />
    ))}
  </View>
);

const AnimatedIcon = ({ 
  index, 
  uploadedImage, 
  iconOffset, 
  iconOpacity, 
  onPress 
}: {
  index: number;
  uploadedImage: string | null;
  iconOffset: Animated.SharedValue<number>;
  iconOpacity: Animated.SharedValue<number>;
  onPress: () => void;
}) => {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: iconOffset.value }],
    opacity: iconOpacity.value,
  }));

  return (
    <Animated.View style={[animatedStyle, styles.iconContainer]}>
      <TouchableOpacity onPress={onPress}>
        <Image
          source={
            uploadedImage
              ? typeof uploadedImage === 'string'
                ? { uri: uploadedImage }
                : uploadedImage
              : require('../assets/images/google.png')
          }
          style={styles.walletIcon}
        />
        {!uploadedImage && (
          <View style={styles.uploadOverlay}>
            <Text style={styles.uploadText}>+</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const AnimatedBar = ({
  bar,
  visibleIdx,
  originalIdx,
  scrollX,
  animationProgress,
  interactionStarted,
  barWidths,
  barMargins,
  labelsVisible
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
}) => {
  const widthStyle = useAnimatedStyle(() => ({
    width: barWidths[originalIdx].value,
  }));

  const marginRightStyle = useAnimatedStyle(() => ({
    marginRight: barMargins[originalIdx].value,
  }));

  // Center scaling animation based on scroll position
  const centerScaleStyle = useAnimatedStyle(() => {
    // Only apply scaling after tap animation completes and interaction is started
    if (animationProgress.value < 1 || !interactionStarted.value) {
      return {
        transform: [{ scale: 1 }],
      };
    }

    const barWidth = bar.width;
    const barSpacing = bar.marginRight || 10;
    const totalBarWidth = barWidth + barSpacing;
    
    // Calculate bar center position
    const barCenterX = visibleIdx * totalBarWidth + barWidth / 2;
    const screenCenterX = screenWidth / 2;
    
    // Calculate distance from screen center
    const distanceFromCenter = Math.abs(barCenterX - screenCenterX - scrollX.value);
    
    // Simple highlight effect - bars get bigger when at center, smaller when away
    const scale = interpolate(
      distanceFromCenter, 
      [0, 100], 
      [1.3, 0.7], // At center: 1.3x, away: 0.7x (increased scale down from 0.9 to 0.7)
      Extrapolate.CLAMP
    );

    // Calculate the height to keep bar at bottom
    const barHeight = 28;
    const scaledHeight = barHeight * scale;
    const heightDifference = scaledHeight - barHeight;
    
    return {
      transform: [{ scale }], // Just scale without translateY
    };
  });

  return (
    <Animated.View
      style={[styles.barBox, marginRightStyle, centerScaleStyle, { marginTop: bar.marginTop ?? 0 }]}
    >
      <Animated.View style={[styles.barShadowWrapperBase, widthStyle]}>
        <Animated.View style={[styles.coloredBox, { backgroundColor: bar.color }]} />
      </Animated.View>

      {labelsVisible && (
        <Text style={[
          styles.barLabel,
          { fontSize: bar.fontSize || 12 },
          { transform: [{ translateX: bar.shiftX ?? 0 }] }
        ]}>
          {bar.label}
        </Text>
      )}
    </Animated.View>
  );
};

const WalletHeader = ({ walletAddress, userName, balanceAmount, bars, profileIcons }: Props) => {
  const navigation = useNavigation<any>();
  const animationProgress = useSharedValue(0);
  const interactionStarted = useSharedValue(false);
  const scrollX = useSharedValue(0);
  
  // API Integration - shows dummy data initially, then real data when API fetches
  const { data: subscriptionsData, loading, error } = useSmartFetch<UserSubscriptionDetails[]>({
    url: 'https://your-api.com/api/user-subscriptions',
    method: 'GET',
    auto: false // Disable auto-fetch to avoid console errors with fake URL
  });

  // Use real API data when available, otherwise use dummy data
  const currentSubscriptions = subscriptionsData || DUMMY_SUBSCRIPTIONS;
  
  // Filter out empty/invalid data - show only valid records
  const validSubscriptions = currentSubscriptions.filter(sub => 
    sub && 
    sub.company_name && 
    sub.company_name.trim() !== '' && 
    sub.amount > 0
  );
  
  // Calculate total from valid data only
  const totalSpent = validSubscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  const [animatedAmount, setAnimatedAmount] = useState('₹0');
  const [labelsVisible, setLabelsVisible] = useState(false);
  const [visibleBars, setVisibleBars] = useState<BarItem[]>(bars || []);
  const [uploadedImages, setUploadedImages] = useState<(string | null)[]>(
    Array(3).fill(null).map((_, i) => profileIcons?.[i] ?? null)
  );
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [showBars, setShowBars] = useState(false);

  // Smooth number animation when real data fetches
  useEffect(() => {
    if (subscriptionsData) { // Only animate when real API data arrives
      const finalValue = totalSpent;
      const duration = 2000; // 2 seconds for smooth animation
      const frameRate = 60;
      const totalFrames = Math.round((duration / 1000) * frameRate);
      let currentFrame = 0;

      const interval = setInterval(() => {
        const progress = currentFrame / totalFrames;
        const currentValue = Math.floor(progress * finalValue);
        setAnimatedAmount(`₹${currentValue.toLocaleString()}`);
        currentFrame++;
        if (currentFrame >= totalFrames) {
          clearInterval(interval);
          setAnimatedAmount(`₹${finalValue.toLocaleString()}`);
        }
      }, 1000 / frameRate);

      return () => clearInterval(interval);
    }
  }, [subscriptionsData, totalSpent]);

  const slideStarted = useRef(false);
  const iconOffset0 = useSharedValue(50);
  const iconOffset1 = useSharedValue(50);
  const iconOffset2 = useSharedValue(50);
  const iconOpacity0 = useSharedValue(0);
  const iconOpacity1 = useSharedValue(0);
  const iconOpacity2 = useSharedValue(0);
  const barWidth0 = useSharedValue(0);
  const barWidth1 = useSharedValue(0);
  const barWidth2 = useSharedValue(0);
  const barWidth3 = useSharedValue(0);
  const barWidth4 = useSharedValue(0);
  const barWidth5 = useSharedValue(0);
  const barMargin0 = useSharedValue(10);
  const barMargin1 = useSharedValue(10);
  const barMargin2 = useSharedValue(10);
  const barMargin3 = useSharedValue(10);
  const barMargin4 = useSharedValue(10);
  const barMargin5 = useSharedValue(10);

  const iconOffsets = [iconOffset0, iconOffset1, iconOffset2];
  const iconOpacities = [iconOpacity0, iconOpacity1, iconOpacity2];
  const barWidths = [barWidth0, barWidth1, barWidth2, barWidth3, barWidth4, barWidth5];
  const barMargins = [barMargin0, barMargin1, barMargin2, barMargin3, barMargin4, barMargin5];

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  const triggerSlideToPosition = () => {
    if (slideStarted.current) return;
    slideStarted.current = true;

    setScrollEnabled(true);

    bars.forEach((bar, idx) => {
      barWidths[idx].value = withTiming(bar.width, { duration: 800 });
      const originalMargin = (bar as any)._originalMargin ?? 10;
      barMargins[idx].value = withTiming(originalMargin, { duration: 800 });
    });

    animationProgress.value = withTiming(1, { duration: 600 }, () => {
      // Enable scroll-based scaling after tap animation completes
      interactionStarted.value = true;
    });
  };

  useEffect(() => {
    uploadedImages.forEach((_, i) => {
      const delay = i * 500;
      iconOffsets[i].value = withDelay(delay, withTiming(0, { duration: 600 }));
      iconOpacities[i].value = withDelay(delay, withTiming(1, { duration: 600 }));
    });

    setTimeout(() => setShowBars(true), 3 * 500 + 500);
  }, [uploadedImages]);

  useEffect(() => {
    if (bars && bars.length > 0) {
      setVisibleBars(bars);
      
      bars.forEach((bar, idx) => {
        const originalWidth = bar.width;
        const originalMargin = bar.marginRight ?? 10;

        let distortedWidth = originalWidth;
        let distortedMargin = originalMargin;

        if (idx === 0) { distortedWidth = 110; distortedMargin = 7; }
        else if (idx === 1) { distortedWidth = 90; distortedMargin = 6; }
        else if (idx === 2) { distortedWidth = 70; distortedMargin = 7; }
        else if (idx === 3) { distortedWidth = 50; distortedMargin = 20; }

        // Set initial values immediately without delay
        barWidths[idx].value = distortedWidth;
        barMargins[idx].value = distortedMargin;
        (bars[idx] as any)._originalMargin = originalMargin;
      });

      // Show labels immediately
      setLabelsVisible(true);
    }
  }, [bars]);

  const pickImage = async (index: number) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to upload images!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets?.[0]) {
        const newImages = [...uploadedImages];
        newImages[index] = result.assets[0].uri;
        setUploadedImages(newImages);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...uploadedImages];
    newImages[index] = null;
    setUploadedImages(newImages);
  };

  const handleIconPress = (index: number) => {
    if (uploadedImages[index]) {
      Alert.alert('Image Options', 'What would you like to do?', [
        { text: 'Change Image', onPress: () => pickImage(index) },
        { text: 'Remove Image', onPress: () => removeImage(index), style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ]);
    } else {
      pickImage(index);
    }
  };

  return (
    <View style={styles.container}>
      {/* Loading Indicator at Top */}
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Fetching data...</Text>
        </View>
      )}

      {/* Top Search Bar - Exact same as WalletHeader.tsx */}
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
        <Text style={styles.label}>Total Spent</Text>
        <Text style={styles.amount}>{animatedAmount}</Text>

        <View style={styles.chartWrapper}>
          <AnimatedScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            scrollEnabled={scrollEnabled} // Only enable scroll after tap
            onScroll={scrollHandler}
            scrollEventThrottle={16}
          >
                <View style={styles.barsWrapper}>
                  {visibleBars.map((bar, visibleIdx) => {
                    const originalIdx = bars.findIndex(b => b.label === bar.label);
                    return (
                      <TouchableOpacity
                        key={bar.label}
                        onPress={triggerSlideToPosition}
                        activeOpacity={0.8}
                      >
                        <AnimatedBar
                          bar={bar}
                          visibleIdx={visibleIdx}
                          originalIdx={originalIdx}
                          scrollX={scrollX}
                          animationProgress={animationProgress}
                          interactionStarted={interactionStarted}
                          barWidths={barWidths}
                          barMargins={barMargins}
                          labelsVisible={labelsVisible}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </AnimatedScrollView>
            </View>

        <View style={styles.ticksWrapper}>
          <VerticalTicksRow />
        </View>
      </View>

      {/* Character Card Stack */}
      <View style={styles.cardStackContainer}>
        <CardStack />
      </View>

      {/* Smooth Carousel Example */}
      <View style={styles.carouselContainer}>
        <SmoothCarouselExample />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D0D0D',
    padding: 20,
  },
  // Loading Indicator Styles
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0D0D0D',
    paddingVertical: 10,
    zIndex: 10,
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Top Bar Styles - Exact same as WalletHeader.tsx
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginTop: -15, // Reduced from 15 to 5 to move up
    marginLeft: -20, // Added negative margin to move left
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
  walletIcons: { flexDirection: 'row' },
  walletIcon: { width: 24, height: 24, marginRight: -8, borderRadius: 12 },
  iconContainer: { position: 'relative' },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  walletAddress: { color: '#aaa', marginLeft: 10, marginRight: 'auto' },
  profileBtn: {
    backgroundColor: '#f33',
    width: 30, height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: { color: '#fff', fontWeight: 'bold' },
  profileName: { color: '#fff', marginLeft: 8 },
  balanceSection: { marginTop: 10 },
  label: { color: '#FFF', fontSize: 14, fontWeight: '600', marginLeft: 10, opacity: 0.6 },
  amount: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-end',
    marginRight: 230,
  },
  chartWrapper: { 
    position: 'relative', 
    paddingBottom: 10,
    marginTop: -50, // Added margin-top to move bars below the amount
    overflow: 'visible' 
  },
  scrollView: { marginTop: 16, overflow: 'visible' },
  barsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 0,
  },
  barBox: { 
    position: 'relative', 
    alignItems: 'center', 
    marginBottom: 10, 
    minHeight: 140, 
    overflow: 'visible',
    justifyContent: 'flex-end' // Align bars to bottom
  },
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
  ticksWrapper: { 
    position: 'absolute', 
    top: 133, // Moved down from 140 to 160 to create more space above labels
    left: 0, 
    right: 0 
  },
  ticksContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
  tick: { width: 1, height: 10, backgroundColor: '#333' },
  cardStackContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  carouselContainer: {
    marginBottom: 20,
  },
});

export default WalletHeader; 