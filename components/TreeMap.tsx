import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

interface TreeMapItem {
  name: string;
  value: number;
  color: string;
  change: string;
}

interface TreeMapProps {
  data: TreeMapItem[];
  width?: number;
  height?: number;
}

// Randomized treemap layout that still creates a cohesive rectangular box
const calculateLayout = (data: TreeMapItem[], containerWidth: number, containerHeight: number) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Shuffle the data randomly while preserving proportions
  const shuffledData = [...data].sort(() => Math.random() - 0.5);
  
  const layouts: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    item: TreeMapItem;
  }> = [];

  function subdivideRandomly(items: TreeMapItem[], x: number, y: number, width: number, height: number) {
    if (items.length === 0) return;
    
    if (items.length === 1) {
      layouts.push({
        x,
        y,
        width,
        height,
        item: items[0]
      });
      return;
    }

    // Calculate total value for this subset
    const subTotal = items.reduce((sum, item) => sum + item.value, 0);
    
    // Randomly decide split direction (with some bias based on aspect ratio)
    const aspectRatio = width / height;
    const randomFactor = Math.random();
    const isVerticalSplit = aspectRatio > 1.2 ? randomFactor > 0.3 : randomFactor > 0.7;
    
    // Randomly pick a split point (but keep it reasonable)
    const splitIndex = Math.floor(Math.random() * (items.length - 1)) + 1;
    const firstGroup = items.slice(0, splitIndex);
    const secondGroup = items.slice(splitIndex);
    
    const firstTotal = firstGroup.reduce((sum, item) => sum + item.value, 0);
    const secondTotal = secondGroup.reduce((sum, item) => sum + item.value, 0);
    const firstRatio = firstTotal / subTotal;
    
    if (isVerticalSplit) {
      // Split vertically
      const firstWidth = width * firstRatio;
      subdivideRandomly(firstGroup, x, y, firstWidth, height);
      subdivideRandomly(secondGroup, x + firstWidth, y, width - firstWidth, height);
    } else {
      // Split horizontally
      const firstHeight = height * firstRatio;
      subdivideRandomly(firstGroup, x, y, width, firstHeight);
      subdivideRandomly(secondGroup, x, y + firstHeight, width, height - firstHeight);
    }
  }

  // Create random groups but ensure we use all the space
  if (shuffledData.length <= 2) {
    subdivideRandomly(shuffledData, 0, 0, containerWidth, containerHeight);
  } else {
    // Create 2-4 random groups
    const numGroups = Math.floor(Math.random() * 3) + 2; // 2-4 groups
    const groups: TreeMapItem[][] = Array.from({ length: numGroups }, () => []);
    
    // Randomly distribute items into groups
    shuffledData.forEach((item, index) => {
      const groupIndex = index % numGroups;
      groups[groupIndex].push(item);
    });
    
    // Filter out empty groups
    const nonEmptyGroups = groups.filter(group => group.length > 0);
    
    // Calculate space allocation for each group
    const groupTotals = nonEmptyGroups.map(group => 
      group.reduce((sum, item) => sum + item.value, 0)
    );
    const grandTotal = groupTotals.reduce((sum, total) => sum + total, 0);
    
    // Randomly decide main split direction
    const mainVerticalSplit = Math.random() > 0.5;
    
    if (mainVerticalSplit) {
      // Split vertically
      let currentX = 0;
      nonEmptyGroups.forEach((group, index) => {
        const ratio = groupTotals[index] / grandTotal;
        const groupWidth = containerWidth * ratio;
        subdivideRandomly(group, currentX, 0, groupWidth, containerHeight);
        currentX += groupWidth;
      });
    } else {
      // Split horizontally
      let currentY = 0;
      nonEmptyGroups.forEach((group, index) => {
        const ratio = groupTotals[index] / grandTotal;
        const groupHeight = containerHeight * ratio;
        subdivideRandomly(group, 0, currentY, containerWidth, groupHeight);
        currentY += groupHeight;
      });
    }
  }

  return layouts;
};

const TreeMap: React.FC<TreeMapProps> = ({ 
  data, 
  width = screenWidth * 0.9, 
  height = 400 
}) => {
  const [randomSeed, setRandomSeed] = React.useState(0);
  
  // Add randomSeed to force recalculation when needed
  const layouts = React.useMemo(() => {
    return calculateLayout(data, width, height);
  }, [data, width, height, randomSeed]);

  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        <Defs>
          {data.map((item, index) => (
            <LinearGradient
              key={`gradient-${index}`}
              id={`gradient-${index}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="0%" stopColor={item.color} stopOpacity="0.9" />
              <Stop offset="50%" stopColor={item.color} stopOpacity="0.8" />
              <Stop offset="100%" stopColor={item.color} stopOpacity="0.6" />
            </LinearGradient>
          ))}
        </Defs>
        
        {layouts.map((layout, index) => {
          const { x, y, width: rectWidth, height: rectHeight, item } = layout;
          const gradientId = data.findIndex(d => d.name === item.name);
          
          return (
            <React.Fragment key={`rect-${index}`}>
              <Rect
                x={x}
                y={y}
                width={rectWidth}
                height={rectHeight}
                fill={`url(#gradient-${gradientId})`}
                stroke="#2c3e50"
                strokeWidth="1"
                rx={4}
                ry={4}
              />
              
              {/* App/Tool Name */}
              {rectWidth > 50 && rectHeight > 40 && (
                <SvgText
                  x={x + 8}
                  y={y + 20}
                  fontSize={rectWidth > 100 ? "16" : rectWidth > 70 ? "14" : "12"}
                  fontWeight="600"
                  fill="#ffffff"
                >
                  {item.name.length > 10 && rectWidth < 80 ? item.name.substring(0, 7) + '...' : item.name}
                </SvgText>
              )}
              
              {/* Change Percentage */}
              {rectWidth > 50 && rectHeight > 30 && (
                <SvgText
                  x={x + 8}
                  y={y + rectHeight - 8}
                  fontSize={rectWidth > 100 ? "14" : rectWidth > 70 ? "12" : "10"}
                  fontWeight="500"
                  fill={item.change.startsWith('+') ? "#4ade80" : "#f87171"}
                >
                  {item.change}
                </SvgText>
              )}
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TreeMap;
