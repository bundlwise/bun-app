import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';

type BarItem = {
  color: string;
  label: string;
  width: number;
};

type Props = {
  walletAddress: string;
  userName: string;
  balanceAmount: string;
  bars: BarItem[];
};

const VerticalTicksRow = () => {
  const tickCount = 40;
  return (
    <View style={styles.ticksContainer}>
      {Array.from({ length: tickCount }).map((_, index) => (
        <View key={index} style={styles.tick} />
      ))}
    </View>
  );
};

const WalletHeader = ({ walletAddress, userName, balanceAmount, bars }: Props) => {
  const screenWidth = Dimensions.get('window').width;
  const [animatedAmount, setAnimatedAmount] = useState('₹0');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const barWidths = useRef(bars.map(() => new Animated.Value(0))).current;
  const barScales = useRef(bars.map(() => new Animated.Value(1))).current;
  const barShifts = useRef(bars.map(() => new Animated.Value(0))).current;
  const labelScales = useRef(bars.map(() => new Animated.Value(1))).current;
  const [labelsVisible, setLabelsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
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
          Animated.sequence([
            Animated.spring(scaleAnim, {
              toValue: 1.1,
              friction: 3,
              tension: 120,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              friction: 4,
              tension: 100,
              useNativeDriver: true,
            }),
          ]).start();
        }
      }, 1000 / frameRate);
    }, 200);

    return () => clearTimeout(timer);
  }, [balanceAmount]);

  useEffect(() => {
    const animations = bars.map((bar, index) =>
      Animated.timing(barWidths[index], {
        toValue: bar.width,
        duration: 800,
        useNativeDriver: false,
      })
    );
    Animated.stagger(200, animations).start(() => {
      setLabelsVisible(true);
    });
  }, []);

  const getBarOffsetToCenter = (index: number) => {
    const barWidth = bars[index].width;
    const totalBarWidth = barWidth + 8; // bar + marginHorizontal
    const screenCenter = screenWidth / 2;
    const barX = totalBarWidth * index + totalBarWidth / 2;
    return screenCenter - barX;
  };

  const resetBars = () => {
    setSelectedIndex(null);
    bars.forEach((_, i) => {
      Animated.parallel([
        Animated.spring(barScales[i], {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.spring(labelScales[i], {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(barShifts[i], {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleBarTap = (index: number) => {
    if (selectedIndex === index) {
      resetBars();
      return;
    }

    resetBars();

    setTimeout(() => {
      setSelectedIndex(index);
      const centerOffset = getBarOffsetToCenter(index);
      bars.forEach((_, i) => {
        let offset = 0;
        if (i === index) {
          offset = centerOffset;
        } else {
          const spacing = 30;
          offset = i < index ? -spacing : spacing;
        }

        Animated.parallel([
          Animated.spring(barScales[i], {
            toValue: i === index ? 1.4 : 0.9,
            friction: 6,
            tension: 120,
            useNativeDriver: true,
          }),
          Animated.spring(labelScales[i], {
            toValue: i === index ? 1.2 : 0.9,
            friction: 6,
            tension: 90,
            useNativeDriver: true,
          }),
          Animated.timing(barShifts[i], {
            toValue: offset,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 50);
  };

  return (
    <TouchableWithoutFeedback onPress={resetBars}>
      <View style={styles.container}>
        {/* Top Header */}
        <View style={styles.topBar}>
          <View style={styles.walletIcons}>
            {[...Array(3)].map((_, i) => (
              <Image
                key={i}
                source={require('../assets/icon.png')}
                style={styles.walletIcon}
              />
            ))}
          </View>
          <Text style={styles.walletAddress}>{walletAddress}</Text>
          <TouchableOpacity style={styles.profileBtn}>
            <Text style={styles.profileInitial}>{userName[0]}</Text>
          </TouchableOpacity>
          <Text style={styles.profileName}>{userName}</Text>
        </View>

        {/* Balance */}
        <View style={{ height: 50 }} />
        <View style={styles.balanceSection}>
          <Text style={[styles.label, { opacity: 0.6, marginLeft: 10 }]}>Total Spent</Text>
          <Animated.Text
            style={[
              styles.amount,
              { transform: [{ scale: scaleAnim }], marginRight: 230 },
            ]}
          >
            {animatedAmount}
          </Animated.Text>

          {/* Bars */}
          <View style={[styles.barsWrapper]}>
            {bars.map((bar, index) => (
              <TouchableOpacity key={index} onPress={() => handleBarTap(index)} activeOpacity={0.9}>
                <Animated.View
                  style={[
                    styles.barBox,
                    {
                      transform: [
                        { scale: barScales[index] },
                        { translateX: barShifts[index] },
                      ],
                    },
                  ]}
                >
                  <Animated.View
                    style={[
                      styles.coloredBox,
                      {
                        backgroundColor: bar.color,
                        width: barWidths[index],
                      },
                    ]}
                  />
                  {labelsVisible && (
                    <Animated.View
                      style={{ transform: [{ scale: labelScales[index] }] }}
                    >
                      <Text style={styles.barLabel}>{bar.label}</Text>
                      {selectedIndex === index && (
                        <Text style={styles.usageText}>12% usage</Text>
                      )}
                    </Animated.View>
                  )}
                </Animated.View>
              </TouchableOpacity>
            ))}
          </View>

          <VerticalTicksRow />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  walletIcons: {
    flexDirection: 'row',
  },
  walletIcon: {
    width: 24,
    height: 24,
    marginRight: -8,
  },
  walletAddress: {
    color: '#aaa',
    marginLeft: 10,
    marginRight: 'auto',
  },
  profileBtn: {
    backgroundColor: '#f33',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileName: {
    color: '#fff',
    marginLeft: 8,
  },
  balanceSection: {
    marginTop: 10,
  },
  label: {
    color: '#888',
    fontSize: 12,
  },
  amount: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginVertical: 8,
  },
  barsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  barBox: {
    alignItems: 'center',
    marginHorizontal: 4,
  },
  coloredBox: {
    height: 28,
    borderRadius: 8,
  },
  barLabel: {
    color: '#aaa',
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  },
  usageText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  ticksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
  },
  tick: {
    width: 1,
    height: 10,
    backgroundColor: '#333',
  },
});

export default WalletHeader;
