import React, { useState, useEffect, useRef } from 'react';
import MyAssetsCard from '../components/MyAssetsCard';

import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

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
  profileIcons?: string[];
};

const VerticalTicksRow = () => (
  <View style={styles.ticksContainer}>
    {Array.from({ length: 40 }).map((_, i) => (
      <View key={i} style={styles.tick} />
    ))}
  </View>
);

const WalletHeader = ({ walletAddress, userName, balanceAmount, bars, profileIcons }: Props) => {
  const animationProgress = useSharedValue(0);
  const scrollX = useSharedValue(0);
  const interactionStarted = useSharedValue(false);

  const [animatedAmount, setAnimatedAmount] = useState('₹0');
  const [labelsVisible, setLabelsVisible] = useState(false);
  const [visibleBars, setVisibleBars] = useState<BarItem[]>(bars);
  const [uploadedImages, setUploadedImages] = useState<(string | null)[]>(
    Array(3).fill(null).map((_, i) => profileIcons?.[i] ?? null)
  );
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const [showBars, setShowBars] = useState(false);

  const slideStarted = useRef(false);
  const iconOffsets = useRef([0, 1, 2].map(() => useSharedValue(50))).current;
  const iconOpacities = useRef([0, 1, 2].map(() => useSharedValue(0))).current;
  const barWidths = useRef(bars.map(() => useSharedValue(0))).current;
  const barMargins = useRef(bars.map(() => useSharedValue(10))).current;

  const triggerSlideToPosition = () => {
    if (slideStarted.current) return;
    slideStarted.current = true;

    setScrollEnabled(true);

    bars.forEach((bar, idx) => {
      barWidths[idx].value = withTiming(bar.width, { duration: 800 });
      const originalMargin = (bar as any)._originalMargin ?? 10;
      barMargins[idx].value = withTiming(originalMargin, { duration: 800 });
    });

    animationProgress.value = withTiming(1, { duration: 600 });
  };

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
    animationProgress.value = withTiming(1, { duration: 600 });
  });

  useEffect(() => {
    uploadedImages.forEach((_, i) => {
      const delay = i * 500;
      iconOffsets[i].value = withDelay(delay, withTiming(0, { duration: 600 }));
      iconOpacities[i].value = withDelay(delay, withTiming(1, { duration: 600 }));
    });

    setTimeout(() => setShowBars(true), 3 * 500 + 500);
  }, [uploadedImages]);

  useEffect(() => {
    const finalValue = parseInt(balanceAmount.replace(/[^\d]/g, ''), 10);
    const duration = 3000;
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
  }, [balanceAmount]);

  useEffect(() => {
    bars.forEach((bar, idx) => {
      const originalWidth = bar.width;
      const originalMargin = bar.marginRight ?? 10;

      let distortedWidth = originalWidth;
      let distortedMargin = originalMargin;

      if (idx === 0) { distortedWidth = 110; distortedMargin = 7; }
      else if (idx === 1) { distortedWidth = 90; distortedMargin = 6; }
      else if (idx === 2) { distortedWidth = 70; distortedMargin = 7; }
      else if (idx === 3) { distortedWidth = 50; distortedMargin = 20; }

      barWidths[idx].value = withDelay(idx * 200, withTiming(distortedWidth, { duration: 800 }));
      barMargins[idx].value = withDelay(idx * 200, withTiming(distortedMargin, { duration: 800 }));
      (bars[idx] as any)._originalMargin = originalMargin;
    });

    setTimeout(() => setLabelsVisible(true), bars.length * 200 + 800);
  }, []);

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
      {/* 🔹 Profile Header */}
      <View style={styles.topBar}>
        <View style={styles.walletIcons}>
          {uploadedImages.map((_, i) => {
            const animatedStyle = useAnimatedStyle(() => ({
              transform: [{ translateX: iconOffsets[i].value }],
              opacity: iconOpacities[i].value,
            }));

            return (
              <Animated.View key={i} style={[animatedStyle, styles.iconContainer]}>
                <TouchableOpacity onPress={() => handleIconPress(i)}>
                  <Image
                    source={uploadedImages[i] ? { uri: uploadedImages[i]! } : require('../assets/icon.png')}
                    style={styles.walletIcon}
                  />
                  {!uploadedImages[i] && (
                    <View style={styles.uploadOverlay}>
                      <Text style={styles.uploadText}>+</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <Text style={styles.walletAddress}>{walletAddress}</Text>
        <TouchableOpacity style={styles.profileBtn}>
          <Text style={styles.profileInitial}>{userName[0]}</Text>
        </TouchableOpacity>
        <Text style={styles.profileName}>{userName}</Text>
      </View>

      <View style={{ height: 50 }} />

      {/* 🔹 Balance & Bars */}
      <View style={styles.balanceSection}>
        <Text style={styles.label}>Total Spent</Text>
        <Text style={styles.amount}>{animatedAmount}</Text>

        <View style={styles.chartWrapper}>
          <TouchableWithoutFeedback onPress={triggerSlideToPosition}>
            <View>
              <AnimatedScrollView
                horizontal
                scrollEnabled={scrollEnabled}
                showsHorizontalScrollIndicator={false}
                scrollEventThrottle={16}
                onScroll={scrollHandler}
                style={styles.scrollView}
              >
                <View style={styles.barsWrapper}>
                  {visibleBars.map((bar, visibleIdx) => {
                    const originalIdx = bars.findIndex(b => b.label === bar.label);

                    const shiftXStyle = useAnimatedStyle(() => ({
                      transform: [{ translateX: [0, 1, 2, 3].includes(originalIdx) ? -9 : 0 }],
                    }));

                    const scaleStyle = useAnimatedStyle(() => {
                      const mid = visibleIdx * (bar.width + barMargins[originalIdx].value) + barWidths[originalIdx].value / 2;
                      const center = scrollX.value + 180;
                      const dist = Math.abs(center - mid);
                      const rawScale = interpolate(dist, [0, 80, 200], [1.5, 0.85, 0.6], Extrapolate.CLAMP);
                      const s = 1 + (rawScale - 1) * animationProgress.value;
                      return { transform: [{ scale: s }] };
                    });

                    const shadowStyle = useAnimatedStyle(() => {
                      const mid = visibleIdx * (bar.width + barMargins[originalIdx].value) + barWidths[originalIdx].value / 2;
                      const center = scrollX.value + 180;
                      const dist = Math.abs(center - mid);
                      const opacity = interactionStarted.value
                        ? interpolate(dist, [0, 60, 150], [1, 0, 0], Extrapolate.CLAMP)
                        : 0;
                      return {
                        shadowColor: '#33FF99',
                        shadowOpacity: opacity * 0.4,
                        shadowRadius: opacity * 10,
                        elevation: opacity * 8,
                      };
                    });

                    const labelScaleStyle = useAnimatedStyle(() => {
                      const mid = visibleIdx * (bar.width + barMargins[originalIdx].value) + barWidths[originalIdx].value / 2;
                      const center = scrollX.value + 180;
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

                    return (
                      <Animated.View
                        key={bar.label}
                        style={[styles.barBox, marginRightStyle, shiftXStyle, { marginTop: bar.marginTop ?? 0 }]}
                      >
                        {bar.usage != null && (
                          <Animated.View style={[styles.usageTextBox, useAnimatedStyle(() => {
                            const mid = visibleIdx * (bar.width + barMargins[originalIdx].value) + barWidths[originalIdx].value / 2;
                            const center = scrollX.value + 180;
                            const dist = Math.abs(center - mid);
                            const show = interactionStarted.value
                              ? interpolate(dist, [0, 40, 80], [1, 0, 0], Extrapolate.CLAMP)
                              : 0;
                            return { opacity: show };
                          })]}>
                            <Text style={styles.usageText}>{bar.usage}% USAGE</Text>
                          </Animated.View>
                        )}

                        <Animated.View style={[styles.barShadowWrapperBase, scaleStyle, shadowStyle]}>
                          <Animated.View style={[styles.coloredBox, { backgroundColor: bar.color }, widthStyle]} />
                        </Animated.View>

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
                  })}
                </View>
              </AnimatedScrollView>
            </View>
          </TouchableWithoutFeedback>

          <View style={styles.ticksWrapper}>
            <VerticalTicksRow />
          </View>
        </View>
        <MyAssetsCard />
      </View>
      
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0D0D0D',
    padding: 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  chartWrapper: { position: 'relative', paddingBottom: 30, overflow: 'visible' },
  scrollView: { marginTop: 16, overflow: 'visible' },
  barsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flexWrap: 'nowrap',
    paddingHorizontal: 10,
    overflow: 'visible',
  },
  barBox: { position: 'relative', alignItems: 'center', marginBottom: 8, minHeight: 140, overflow: 'visible' },
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
  ticksWrapper: { position: 'absolute', bottom: 120, left: 0, right: 0 },
  ticksContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 },
  tick: { width: 1, height: 10, backgroundColor: '#333' },
});

export default WalletHeader;
