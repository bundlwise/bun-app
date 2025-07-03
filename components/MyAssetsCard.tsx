import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const MyAssetsCard = () => {
  return (
    <LinearGradient
      colors={['#F749A2', '#C147E9']}
      style={styles.outerCard}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* 🔹 Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Upcoming Payments</Text>
      </View>

      {/* 🔹 Main Rectangle */}
      <View style={styles.rectangleBox}>
        <Image
          source={{ uri: 'https://your-backend.com/icon.png' }}
          style={styles.rectangleImage}
        />
        <Text style={styles.rectangleText}>Rs 1200</Text>
      </View>

      {/* 🔹 First Overlap Rectangle */}
      <View style={styles.blurWrapper}>
        <BlurView intensity={30} tint="light" style={styles.overlapBox}>
          <Image
            source={{ uri: 'https://your-backend.com/overlap-icon.png' }}
            style={styles.overlapImage}
          />
          <Text style={styles.overlapText}>Rs 600</Text>
        </BlurView>
      </View>

      {/* 🔹 Second Overlap Rectangle */}
      <View style={styles.blurWrapper2}>
        <BlurView intensity={40} tint="light" style={styles.overlapBox2}>
          <Image
            source={{ uri: 'https://your-backend.com/third-icon.png' }}
            style={styles.overlapImage2}
          />
          <Text style={styles.overlapText2}>Rs 300</Text>
        </BlurView>
      </View>

      {/* 🔹 Spacer */}
      <View style={styles.spacer} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  outerCard: {
    borderRadius: 24,
    padding: 18,
    marginVertical: 20,
    height: 200,
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

  rectangleBox: {
    backgroundColor: 'rgba(255,176,234,0.35)',
    borderRadius: 16,
    height: 160,
    width: 290,
    top: 50,
    right: 32,
    position: 'absolute',
    justifyContent: 'center',
    paddingHorizontal: 16,
    overflow: 'hidden',
  },

  rectangleText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    position: 'absolute',
    top: 11,
    left: 175,
  },

  rectangleImage: {
    width: 22,
    height: 22,
    position: 'absolute',
    top: 6,
    left: 16,
    borderRadius: 10,
    backgroundColor: '#fff2',
  },

  /** 🔸 BlurView Wrappers */
  blurWrapper: {
    position: 'absolute',
    top: 80,
    right: 22,
    borderRadius: 16,
    overflow: 'hidden',
  },

  blurWrapper2: {
    position: 'absolute',
    top: 110,
    right: 12,
    borderRadius: 16,
    overflow: 'hidden',
  },

  /** 🔸 First Overlapping Box */
  overlapBox: {
    height: 160,
    width: 310,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },

  overlapText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    position: 'absolute',
    top: 11,
    left: 183,
  },

  overlapImage: {
    width: 22,
    height: 22,
    position: 'absolute',
    top: 6,
    left: 19,
    borderRadius: 10,
    backgroundColor: '#fff2',
  },

  /** 🔸 Second Overlapping Box */
  overlapBox2: {
    height: 160,
    width: 330,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },

  overlapText2: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    position: 'absolute',
    top: 11,
    left: 185,
  },

  overlapImage2: {
    width: 22,
    height: 22,
    position: 'absolute',
    top: 6,
    left: 23,
    borderRadius: 10,
    backgroundColor: '#fff2',
  },

  spacer: {
    height: 8,
  },
});

export default MyAssetsCard;
