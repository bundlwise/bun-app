import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';

type BarItem = {
  color: string;
  label: string;
  width: number;
  fontSize?: number;
  marginRight?: number;
  marginTop?: number;
  align?: 'flex-start' | 'center' | 'flex-end';
  labelPosition?: { top: number; left: number };
  xOffset?: number;
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
  const [animatedAmount, setAnimatedAmount] = useState('₹0');
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const barWidths = useRef(bars.map(() => new Animated.Value(0))).current;
  const [labelsVisible, setLabelsVisible] = useState(false);

  // animate balance
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
        setAnimatedAmount(`₹${currentValue.toLocaleString()}`); // ✅ fixed quotes
        currentFrame++;

        if (currentFrame >= totalFrames) {
          clearInterval(interval);
          setAnimatedAmount(`₹${finalValue.toLocaleString()}`);
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.1,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 150,
              useNativeDriver: true,
            }),
          ]).start();
        }
      }, 1000 / frameRate);
    }, 200);

    return () => clearTimeout(timer);
  }, [balanceAmount]);

  // animate bars
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

  return (
    <View style={styles.container}>
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

      <View style={{ height: 50 }} />

      <View style={styles.balanceSection}>
        <Text
          style={[
            styles.label,
            {
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '600',
              marginLeft: 10,
              opacity: 0.6,
            },
          ]}
        >
          Total Spent
        </Text>

        <Animated.Text
          style={[
            styles.amount,
            {
              transform: [{ scale: scaleAnim }],
              alignSelf: 'flex-end',
              marginRight: 230,
              fontSize: 32,
              marginBottom: 10,
            },
          ]}
        >
          {animatedAmount}
        </Animated.Text>

        <View style={styles.barsWrapper}>
          {bars.map((bar, index) => (
            <View
              key={index}
              style={[
                styles.barBox,
                {
                  marginRight: bar.marginRight || 0,
                  marginTop: bar.marginTop || 0,
                  alignItems: bar.align || 'center',
                  position: 'relative',
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
                <Text
                  style={[
                    styles.barLabel,
                    { fontSize: bar.fontSize || 10 },
                    bar.labelPosition
                      ? {
                          position: 'absolute',
                          top: bar.labelPosition.top,
                          left: bar.labelPosition.left,
                        }
                      : {},
                  ]}
                >
                  {bar.label}
                </Text>
              )}
            </View>
          ))}
        </View>

        <VerticalTicksRow />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#111', padding: 20 },
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  walletIcons: { flexDirection: 'row' },
  walletIcon: { width: 24, height: 24, marginRight: -8 },
  walletAddress: { color: '#aaa', marginLeft: 10, marginRight: 'auto' },
  profileBtn: {
    backgroundColor: '#f33',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: { color: '#fff', fontWeight: 'bold' },
  profileName: { color: '#fff', marginLeft: 8 },
  balanceSection: { marginTop: 10 },
  label: { color: '#888', fontSize: 12 },
  amount: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginVertical: 8,
  },
  barsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  barBox: {
    alignItems: 'center',
    marginBottom: 8,
  },
  coloredBox: {
    height: 28,
    borderRadius: 8,
  },
  barLabel: {
    color: '#aaa',
    marginTop: 4,
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
