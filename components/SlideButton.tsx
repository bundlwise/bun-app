import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  I18nManager,
  LayoutChangeEvent,
  PanResponder,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

export type SlideButtonProps = {
  label?: string;
  onComplete?: () => void;
  style?: ViewStyle;
  height?: number; // track height
  knobSize?: number; // knob diameter; default derived from height
  trackColor?: string;
  knobColor?: string;
  textColor?: string;
};

// Pure-Animated sliding CTA, smooth with native driver.
export default function SlideButton({
  label = "Let's go",
  onComplete,
  style,
  height = 56,
  knobSize,
  trackColor = 'rgba(255,255,255,0.18)',
  knobColor = '#ffffff',
  textColor = '#ffffff',
}: SlideButtonProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;
  const animating = useRef(false);
  const isRTL = I18nManager.isRTL;

  const diameter = useMemo(() => knobSize ?? Math.max(40, height - 10), [knobSize, height]);

  const maxSlide = Math.max(0, trackWidth - diameter - 8); // 4 padding each side
  const threshold = maxSlide * 0.7;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, { dx }) => {
          if (animating.current) return;
          const dirDx = isRTL ? -dx : dx;
          const next = Math.max(0, Math.min(maxSlide, dirDx));
          translateX.setValue(next);
        },
        onPanResponderRelease: (_, { dx, vx }) => {
          if (animating.current) return;
          const dirDx = isRTL ? -dx : dx;
          const projected = dirDx + vx * 160; // momentum for smoothness
          const goEnd = projected > threshold;
          animating.current = true;
          Animated.timing(translateX, {
            toValue: goEnd ? maxSlide : 0,
            duration: goEnd ? 260 : 220,
            easing: goEnd ? Easing.out(Easing.cubic) : Easing.out(Easing.quad),
            useNativeDriver: true,
          }).start(() => {
            animating.current = false;
            if (goEnd) onComplete?.();
          });
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxSlide, threshold, isRTL]
  );

  const onLayout = (e: LayoutChangeEvent) => {
    setTrackWidth(e.nativeEvent.layout.width);
  };

  const labelOpacity = translateX.interpolate({
    inputRange: [0, maxSlide * 0.5, threshold],
    outputRange: [1, 0.35, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.wrapper, { height }, style]} onLayout={onLayout}>
      <View style={[styles.track, { backgroundColor: trackColor, height }]}> 
+       {/* Center label fades out as knob slides */}
        <Animated.Text style={[styles.label, { color: textColor, opacity: labelOpacity }]}>
          {label}
        </Animated.Text>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.knob,
            {
              width: diameter,
              height: diameter,
              borderRadius: diameter / 2,
              backgroundColor: knobColor,
              transform: [{ translateX }],
            },
          ]}
        >
          <Text style={styles.knobIcon}>{isRTL ? '⟵' : '⟶'}</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '88%',
  },
  track: {
    width: '100%',
    borderRadius: 999,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  label: {
    position: 'absolute',
    width: '100%',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
  },
  knob: {
    position: 'absolute',
    left: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  knobIcon: {
    fontSize: 22,
    color: '#111',
    paddingHorizontal: 6,
  },
});
