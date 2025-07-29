import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const cardColors = ['#8B0000', '#1E90FF', '#32CD32', '#FF8C00'];

const RaycastCloneScreen = () => {
  const [currentCard, setCurrentCard] = useState(0);

  const handleNext = () => {
    if (currentCard < cardColors.length - 1) {
      setCurrentCard(prev => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {cardColors.map((color, index) => {
        if (index > currentCard) return null;

        const isCurrent = index === currentCard;
        const isJustBehind = index === currentCard - 1 && currentCard >= 2;

        const style = [
          styles.card,
          {
            backgroundColor: color,
            shadowColor: color,
            zIndex: index,
            opacity: isJustBehind ? 0.6 : 1,
            transform: isJustBehind
              ? [{ rotate: '-3.4deg' }, { scale: 0.95 }, { translateY: -3 },{ translateX: 0 }]
              : [],
          },
        ];

        return (
          <Animated.View key={index} style={[...style, { position: 'absolute' }]}>
            {/* Placeholder for future content */}
          </Animated.View>
        );
      })}

      {currentCard < cardColors.length - 1 ? (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.nextButton}
          onPress={() => console.log('Finished')}
        >
          <Text style={styles.nextText}>Finish</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  card: {
    width: 375,
    height: 546,
    borderRadius: 20,
    marginTop: 120, // Increased from 68 to move cards down
    alignSelf: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  nextButton: {
    position: 'absolute',
    bottom: 80, // Increased from 25 to move button up
    alignSelf: 'center',
    backgroundColor: '#1E1E1E',
    paddingVertical: 15,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  nextText: {
    color: '#FFF',
    fontSize: 16,
  },
});

export default RaycastCloneScreen;