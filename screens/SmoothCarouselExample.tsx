import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import SmoothCarousel from '../components/GoogleSignIn/SmoothCarousel';

const { width: screenWidth } = Dimensions.get('window');

interface CarouselItem {
  id: number;
  name: string;
  description: string;
  avatar: string;
  labels: string[];
  color: string;
}

const SmoothCarouselExample: React.FC = () => {
  const carouselData: CarouselItem[] = [
    {
      id: 1,
      name: ' Apurva Vashishth',
      description: ' Marketing Manager at Bundlwise',
      avatar: '👩‍💼',
      labels: ['Design', 'UI/UX', 'Creative', "Marketing"],
      color: '#FF6B6B'
    },
    {
      id: 2,
      name: 'Arpit Maurya',
      description: ' Senior Product Designer at Bundlwise',
      avatar: '👨‍💻',
      labels: ['React', 'Node.js', 'TypeScript',"Full Stack Developer"],
      color: '#4ECDC4'
    },
    {
      id: 3,
      name: 'Vishwash Patil',
      description: 'Backend Developer and Ai  at Bundlwise',
      avatar: '👩‍💼',
      labels: ['Python', 'ML', 'Analytics',"Backend Developer"],
      color: '#45B7D1'
    },
    {
      id: 4,
      name: 'Om Sawant',
      description: 'Frontend Developer at Bundlwise',
      avatar: '👨‍🔬',
      labels: ['React-Native', 'Node.js', 'TypeScript',"Frontend Developer"],
      color: '#96CEB4'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      description: 'UX Researcher at UserFirst',
      avatar: '👩‍🎨',
      labels: ['Research', 'UX', 'User Testing'],
      color: '#FFEAA7'
    },
    {
      id: 6,
      name: 'James Anderson',
      description: 'DevOps Engineer at CloudTech',
      avatar: '👨‍🔧',
      labels: ['DevOps', 'AWS', 'Docker'],
      color: '#DDA0DD'
    }
  ];

  const renderCarouselItem = (item: CarouselItem, index: number) => {
    return (
      <View style={[styles.card, { backgroundColor: item.color }]}>
        {/* Empty card - data will be added later */}
      </View>
    );
  };

  const handleSnapToItem = (index: number) => {
    console.log('Snapped to item:', index);
  };

  return (
    <View style={styles.container}>
      <SmoothCarousel
        data={carouselData}
        renderItem={renderCarouselItem}
        itemWidth={180} // Decreased from 200 to 160 to reduce spacing between cards
        sliderWidth={screenWidth}
        activeSlideAlignment="center"
        activeSlideOffset={0}
        inactiveSlideOpacity={0.4}
        inactiveSlideScale={0.75}
        enableSnap={true}
        enableMomentum={true}
        autoplay={false}
        containerCustomStyle={styles.carouselContainerStyle}
        contentContainerCustomStyle={styles.carouselContentStyle}
        onSnapToItem={handleSnapToItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 180, // Increased from 150 to 180 to make 2 cards visible
    height: 280, // Reduced from 400 to 280
    borderRadius: 24,
    marginHorizontal: 20, // Decreased spacing between cards (was -20)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Changed from 'center' to move cards up
    alignItems: 'center',
    backgroundColor: 'transparent', // Transparent background
    marginTop: -20, // Added negative margin to move cards up
  },
  carouselContainerStyle: {
    width: '100%',
    alignItems: 'center',
  },
  carouselContentStyle: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
});

export default SmoothCarouselExample; 