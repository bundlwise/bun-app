import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export interface SmoothCarouselProps {
  data: any[];
  renderItem: (item: any, index: number) => React.ReactElement;
  itemWidth?: number;
  sliderWidth?: number;
  activeSlideAlignment?: 'center' | 'end' | 'start';
  activeSlideOffset?: number;
  inactiveSlideOpacity?: number;
  inactiveSlideScale?: number;
  enableSnap?: boolean;
  enableMomentum?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
  containerCustomStyle?: ViewStyle;
  contentContainerCustomStyle?: ViewStyle;
  onSnapToItem?: (index: number) => void;
  onScroll?: (event: any) => void;
}

const SmoothCarousel: React.FC<SmoothCarouselProps> = ({
  data = [],
  renderItem,
  itemWidth = 200,
  sliderWidth = screenWidth,
  activeSlideAlignment = 'center',
  activeSlideOffset = 20,
  inactiveSlideOpacity = 0.7,
  inactiveSlideScale = 0.9,
  enableSnap = true,
  enableMomentum = true,
  loop = false,
  autoplay = false,
  autoplayInterval = 3000,
  containerCustomStyle = {},
  contentContainerCustomStyle = {},
  onSnapToItem,
  onScroll,
}) => {
  // Refs
  const flatListRef = useRef<FlatList>(null);
  const scrollPosition = useRef(new Animated.Value(0));
  const activeIndex = useRef(0);
  const autoplayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // State
  const [currentIndex, setCurrentIndex] = useState(0);

  // Calculate container margin based on alignment
  const getContainerMargin = useCallback(() => {
    switch (activeSlideAlignment) {
      case 'start':
        return 0;
      case 'end':
        return sliderWidth - itemWidth;
      case 'center':
      default:
        return (sliderWidth - itemWidth) / 2;
    }
  }, [activeSlideAlignment, sliderWidth, itemWidth]);

  // Get interpolated styles for each item
  const getItemStyle = useCallback((index: number) => {
    const inputRange = [
      (index - 1) * itemWidth,
      index * itemWidth,
      (index + 1) * itemWidth,
    ];

    const opacity = scrollPosition.current.interpolate({
      inputRange,
      outputRange: [inactiveSlideOpacity, 1, inactiveSlideOpacity],
      extrapolate: 'clamp',
    });

    const scale = scrollPosition.current.interpolate({
      inputRange,
      outputRange: [inactiveSlideScale, 1, inactiveSlideScale],
      extrapolate: 'clamp',
    });

    return {
      opacity,
      transform: [{ scale }],
    };
  }, [itemWidth, inactiveSlideOpacity, inactiveSlideScale]);

  // Handle scroll events
  const handleScroll = useCallback((event: any) => {
    const offset = event.nativeEvent.contentOffset.x;
    scrollPosition.current.setValue(offset);
    
    if (onScroll) {
      onScroll(event);
    }
  }, [onScroll]);

  // Handle momentum scroll end
  const handleMomentumScrollEnd = useCallback((event: any) => {
    const offset = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offset / itemWidth);
    
    // Stay exactly where the user stopped - no automatic snapping
    setCurrentIndex(newIndex);
    activeIndex.current = newIndex;
    
    if (onSnapToItem) {
      onSnapToItem(newIndex);
    }
  }, [itemWidth, onSnapToItem]);

  // Snap to specific item
  const snapToItem = useCallback((index: number, animated = true) => {
    if (flatListRef.current) {
      const offset = index * itemWidth;
      flatListRef.current.scrollToOffset({
        offset,
        animated,
      });
    }
  }, [itemWidth]);

  // Snap to next item
  const snapToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % data.length;
    snapToItem(nextIndex);
  }, [currentIndex, data.length, snapToItem]);

  // Snap to previous item
  const snapToPrev = useCallback(() => {
    const prevIndex = currentIndex === 0 ? data.length - 1 : currentIndex - 1;
    snapToItem(prevIndex);
  }, [currentIndex, data.length, snapToItem]);

  // Autoplay functionality
  useEffect(() => {
    if (autoplay && data.length > 1) {
      autoplayTimeoutRef.current = setTimeout(() => {
        snapToNext();
      }, autoplayInterval);
    }

    return () => {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
    };
  }, [autoplay, data.length, autoplayInterval, snapToNext]);

  // Render carousel item
  const renderCarouselItem = useCallback(({ item, index }: { item: any; index: number }) => {
    const animatedStyle = getItemStyle(index);

    return (
      <Animated.View
        style={[
          styles.carouselItem,
          { width: itemWidth },
          animatedStyle,
        ]}
      >
        {renderItem(item, index)}
      </Animated.View>
    );
  }, [renderItem, itemWidth, getItemStyle]);

  // Memoized styles
  const containerStyle = useMemo(() => [
    styles.container,
    { width: sliderWidth },
    containerCustomStyle,
  ], [sliderWidth, containerCustomStyle]);

  const contentContainerStyle = useMemo(() => [
    styles.contentContainer,
    {
      paddingHorizontal: getContainerMargin(),
    },
    contentContainerCustomStyle,
  ], [getContainerMargin, contentContainerCustomStyle]);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <View style={containerStyle}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderCarouselItem}
        keyExtractor={(_, index) => `carousel-item-${index}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        pagingEnabled={false}
        snapToAlignment="center"
        decelerationRate="normal"
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        contentContainerStyle={contentContainerStyle}
        getItemLayout={(_, index) => ({
          length: itemWidth,
          offset: itemWidth * index,
          index,
        })}
        initialScrollIndex={0}
        removeClippedSubviews={false}
        maxToRenderPerBatch={5}
        windowSize={5}
        bounces={false}
        overScrollMode="never"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  contentContainer: {
    alignItems: 'center',
  },
  carouselItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SmoothCarousel; 