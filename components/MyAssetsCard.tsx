import React, { useRef, useState, useEffect } from 'react';
import { Easing, View, Text, StyleSheet, Image, PanResponder, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const MyAssetsCard = () => {
  const [cards, setCards] = useState([
    { key: 'Hotstar', amount: 'Rs 1200', uri: 'https://your-backend.com/icon.png' },
    { key: 'Prime', amount: 'Rs 600', uri: 'https://your-backend.com/overlap-icon.png' },
    { key: 'LightBill', amount: 'Rs 300', uri: 'https://your-backend.com/third-icon.png' },
  ]);

  const [isAnimating, setIsAnimating] = useState(false);

  const positions = [
    { top: 50, right: 32, width: 290, fontSize: 12 },
    { top: 90, right: 22, width: 310, fontSize: 15 },
    { top: 130, right: 12, width: 330, fontSize: 20 },
  ];

  const animatedValues = useRef(cards.map(() => ({
    top: new Animated.Value(positions[0].top),
    right: new Animated.Value(positions[0].right),
    width: new Animated.Value(positions[0].width),
    fontSize: new Animated.Value(positions[0].fontSize),
    translateX: new Animated.Value(0),
    opacity: new Animated.Value(1),
  })));

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 20,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 20) swipe('right');
        else if (gesture.dx < -20) swipe('left');
      },
    })
  ).current;

  const swipe = (direction: 'left' | 'right') => {
    if (isAnimating) return;
    setIsAnimating(true);

    const front = cards.length - 1;
    const middle = cards.length - 2;
    const back = cards.length - 3;

    const toX = direction === 'left' ? -400 : 400;

    const frontAnim = animatedValues.current[front];
    const middleAnim = animatedValues.current[middle];
    const backAnim = animatedValues.current[back];

    // Front card slides out
    Animated.timing(frontAnim.translateX, {
      toValue: toX,
      duration: 400,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start(() => {
      frontAnim.translateX.setValue(0);
      setCards(prev => {
        const updated = [...prev];
        const removed = updated.pop();
        if (removed) updated.unshift(removed);
        return updated;
      });

      const updatedAnims = [...animatedValues.current];
      const removedAnim = updatedAnims.pop();
      if (removedAnim) updatedAnims.unshift(removedAnim);
      animatedValues.current = updatedAnims;

      setIsAnimating(false);
    });

    // Middle → Front
    Animated.parallel([
      Animated.timing(middleAnim.top, {
        toValue: positions[2].top,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }),
      Animated.timing(middleAnim.right, {
        toValue: positions[2].right,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(middleAnim.width, {
        toValue: positions[2].width,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(middleAnim.fontSize, {
        toValue: positions[2].fontSize,
        duration: 400,
        useNativeDriver: false,
      }),
    ]).start();

    // Back → Middle (appear from top with "tapak gaya" illusion)
    backAnim.top.setValue(positions[1].top - 20); // start slightly above
    backAnim.opacity.setValue(0);

    Animated.parallel([
      Animated.timing(backAnim.top, {
        toValue: positions[1].top,
        duration: 400,
        easing: Easing.out(Easing.exp),
        useNativeDriver: false,
      }),
      Animated.timing(backAnim.right, {
        toValue: positions[1].right,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(backAnim.width, {
        toValue: positions[1].width,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(backAnim.fontSize, {
        toValue: positions[1].fontSize,
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(backAnim.opacity, {
        toValue: 1,
        duration: 250,
        delay: 100,
        useNativeDriver: false,
      }),
    ]).start();
  };

  useEffect(() => {
    cards.forEach((_, i) => {
      const pos = positions[i];
      const anim = animatedValues.current[i];

      if (!anim) return;

      Animated.parallel([
        Animated.timing(anim.top, {
          toValue: pos.top,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(anim.right, {
          toValue: pos.right,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(anim.width, {
          toValue: pos.width,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(anim.fontSize, {
          toValue: pos.fontSize,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(anim.opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
      ]).start();
    });
  }, [cards]);

  return (
    <LinearGradient
      colors={['#F749A2', '#C147E9']}
      style={styles.outerCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      {...panResponder.panHandlers}
    >
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Upcoming Payments</Text>
      </View>

      {cards.map((item, index) => {
        const anim = animatedValues.current[index];
        if (!anim) return null;
        
        return (
          <Animated.View
            key={item.key}
            style={{
              position: 'absolute',
              top: anim.top,
              right: anim.right,
              width: anim.width,
              height: 160,
              borderRadius: 16,
              overflow: 'hidden',
              zIndex: index + 1,
              transform: [{ translateX: anim.translateX }],
              opacity: anim.opacity,
            }}
          >
            <BlurView intensity={30 + index * 10} tint="light" style={styles.blur}>
              <Image source={{ uri: item.uri }} style={styles.image} />
              <Animated.Text style={[styles.amountText, { fontSize: anim.fontSize }]}>
                {item.amount}
              </Animated.Text>
              {index === 2 && <Text style={styles.labelText}>{item.key}</Text>}
            </BlurView>
          </Animated.View>
        );
      })}

      <View style={{ height: 8 }} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  outerCard: {
    borderRadius: 24,
    padding: 18,
    marginVertical: 20,
    height: 190,
    overflow: 'hidden',
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.9,
  },
  blur: {
    flex: 1,
    borderRadius: 16,
  },
  image: {
    width: 22,
    height: 22,
    position: 'absolute',
    top: 12,
    left: 16,
    borderRadius: 10,
    backgroundColor: '#fff2',
  },
  amountText: {
    color: '#fff',
    fontWeight: 'bold',
    position: 'absolute',
    top: 12,
    left: 220,
  },
  labelText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    position: 'absolute',
    top: 13,
    left: 60,
    opacity: 0.8,
  },
});

export default MyAssetsCard;
