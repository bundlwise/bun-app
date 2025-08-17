import React from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface TreeMapItem {
  name: string;
  value: number; // main metric (e.g. cost or usage)
  color?: string; // optional custom accent
  change: string; // e.g. "+3.2%" or "-1.2%"
  meta?: Record<string, any>; // extensibility for future details
}

interface TreeMapProps {
  data: TreeMapItem[];
  width?: number;
  height?: number;
  onSelect?: (item: TreeMapItem) => void;
  selectedName?: string | null;
  dark?: boolean;
}

// Deterministic squarified treemap layout (simple variant)
const calculateLayout = (data: TreeMapItem[], containerWidth: number, containerHeight: number) => {
  const items = [...data].sort((a, b) => b.value - a.value);
  const total = items.reduce((s, i) => s + i.value, 0) || 1;

  const layouts: Array<{ x: number; y: number; width: number; height: number; item: TreeMapItem; }> = [];

  function worst(row: TreeMapItem[], w: number): number {
    const s = row.reduce((sum, r) => sum + r.value, 0) / total * (containerWidth * containerHeight);
    const maxVal = Math.max(...row.map(r => r.value)) / total * (containerWidth * containerHeight);
    const minVal = Math.min(...row.map(r => r.value)) / total * (containerWidth * containerHeight);
    const w2 = w * w;
    return Math.max((w2 * maxVal) / (s * s), (s * s) / (w2 * minVal));
  }

  let x = 0, y = 0, w = containerWidth, h = containerHeight;
  let row: TreeMapItem[] = [];
  let remaining = [...items];

  while (remaining.length > 0) {
    const item = remaining[0];
    const newRow = [...row, item];
    const shortSide = Math.min(w, h);
    if (row.length === 0 || worst(newRow, shortSide) <= worst(row, shortSide)) {
      row = newRow;
      remaining.shift();
    } else {
      layoutRow(row, shortSide);
      row = [];
    }
  }
  if (row.length) layoutRow(row, Math.min(w, h));

  function layoutRow(r: TreeMapItem[], shortSide: number) {
    const rowTotal = r.reduce((s, i) => s + i.value, 0);
    const areaFactor = (containerWidth * containerHeight) / total;
    const rowArea = rowTotal * areaFactor;
    if (shortSide === w) {
      // horizontal row
      const rowHeight = rowArea / w;
      let curX = x;
      r.forEach(it => {
        const itWidth = (it.value * areaFactor) / rowHeight;
        layouts.push({ x: curX, y, width: itWidth, height: rowHeight, item: it });
        curX += itWidth;
      });
      y += rowHeight;
      h -= rowHeight;
    } else {
      // vertical column
      const colWidth = rowArea / h;
      let curY = y;
      r.forEach(it => {
        const itHeight = (it.value * areaFactor) / colWidth;
        layouts.push({ x, y: curY, width: colWidth, height: itHeight, item: it });
        curY += itHeight;
      });
      x += colWidth;
      w -= colWidth;
    }
  }

  return layouts;
};

const accentPalette = [
  '#6366f1', // indigo-500
  '#0ea5e9', // sky-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ec4899', // pink-500
  '#84cc16', // lime-500
  '#8b5cf6', // violet-500
  '#f43f5e', // rose-500
  '#06b6d4', // cyan-500
  '#14b8a6'  // teal-500
];

const TreeMap: React.FC<TreeMapProps> = ({
  data,
  width = screenWidth * 0.90,
  height = screenHeight * 0.80,
  onSelect,
  selectedName,
  dark = true
}) => {
  // Filter out Datadog from the data and add a special "Add" item
  const processedData = React.useMemo(() => {
    // Filter out Datadog
    const filteredData = data.filter(item => item.name !== 'Datadog');
    
    // Create a special Add item
    const addItem: TreeMapItem = {
      name: 'Add Subscription',
      value: 14, // Use Datadog's value (14) for the Add button
      change: '',
      color: '#ef4444', // Red color
      meta: { isAddAction: true }
    };
    
    // Return filtered data with Add item
    return [...filteredData, addItem];
  }, [data]);
  
  // Create the layout using the processed data
  const layouts = React.useMemo(() => calculateLayout(processedData, width, height), 
    [processedData, width, height]);
  
  const total = React.useMemo(() => processedData.reduce((s, i) => s + i.value, 0) || 1, [processedData]);

  const maxValue = React.useMemo(() => Math.max(...processedData.map(d => d.value), 1), [processedData]);

  function withAlpha(hex: string, alpha: number) {
    const h = hex.replace('#','');
    const bigint = parseInt(h.length === 3 ? h.split('').map(c=>c+c).join('') : h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r},${g},${b},${alpha})`;
  }
  
  return (
    <View style={styles.container}>
      <Svg width={width} height={height}>
        {layouts.map(layout => {
          const { x, y, width: rectWidth, height: rectHeight, item } = layout;
          const isAddItem = item.meta?.isAddAction === true;
          const isSelected = selectedName === item.name;
          
          // For normal items, show percentage
          let pct = '';
          if (!isAddItem) {
            const pctNum = (item.value / total) * 100;
            pct = pctNum.toFixed(1) + '%';
          }
          
          // Either use item's color or pick from palette
          const accent = item.color || accentPalette[processedData.findIndex((d: TreeMapItem) => d.name === item.name) % accentPalette.length];
          const intensity = isAddItem ? 1 : (0.12 + (item.value / maxValue) * 0.28); // 0.12 - 0.40 range
          
          // Display parameters based on box size
          const showName = rectWidth > 55 && rectHeight > 38;
          const showChange = !isAddItem && rectWidth > 70 && rectHeight > 54; // space for second line
          const showMonthly = !isAddItem && rectWidth > 70 && rectHeight > 60 && item.meta?.monthly !== undefined;
          const monthlyVal = item.meta?.monthly;
          const shareTopRight = !isAddItem && rectWidth > 70 && rectHeight > 42;
          let nameFont = rectWidth > 140 ? 17 : rectWidth > 110 ? 15 : rectWidth > 80 ? 13 : 12;
          
          return (
            <React.Fragment key={item.name}>
              <Rect
                x={x}
                y={y}
                width={rectWidth}
                height={rectHeight}
                fill={'#050607'}
                stroke={'#ffffff'}
                strokeWidth={isSelected ? 2 : 1}
                rx={0}
                ry={0}
                onPress={() => onSelect && onSelect(item)}
              />
              <Rect
                x={x+1}
                y={y+1}
                width={rectWidth-2}
                height={rectHeight-2}
                fill={isAddItem ? '#666666' : '#000000'}
                rx={0}
                ry={0}
                pointerEvents="none"
              />
              
              {/* White box icon removed */}
              
              {/* For the add item, show a plus sign */}
              {isAddItem ? (
                <SvgText
                  x={x + (rectWidth / 2)}
                  y={y + (rectHeight / 2) + 8}
                  fontSize={32}
                  fontWeight="bold"
                  fill="#ffffff"
                  textAnchor="middle"
                >
                  +
                </SvgText>
              ) : (
                <>
                  {/* Display app name at the top and percentage in large bold text */}
                  {(() => {
                    // Calculate font sizes based on box dimensions
                    const minDimension = Math.min(rectWidth, rectHeight);
                    const boxArea = rectWidth * rectHeight;
                    
                    // App name at top (smaller font)
                    const nameFontSize = Math.max(
                      12, // Minimum font size for name
                      Math.min(
                        20, // Maximum font size for name
                        Math.floor(minDimension * 0.12) // 12% of the minimum dimension
                      )
                    );
                    
                    // Format amount with dollar sign
                    const amount = monthlyVal !== undefined ? `$${monthlyVal}` : '$0';
                    const amountLength = amount.length;
                    
                    // Adaptive amount font size calculation
                    // For smaller amounts (fewer digits), we can use larger font
                    // For longer amounts, we need to reduce the size
                    const sizeFactor = amountLength <= 3 ? 0.42 : 
                                       amountLength <= 4 ? 0.38 : 
                                       amountLength <= 5 ? 0.36 :
                                       amountLength <= 6 ? 0.34 : 0.30;
                    
                    // More advanced scaling based on both dimensions and area
                    const amountFontSize = Math.max(
                      20, // Minimum font size for amount
                      Math.min(
                        72, // Maximum font size for amount 
                        Math.floor(minDimension * sizeFactor), // Scaled by minimum dimension
                        Math.floor(Math.sqrt(boxArea) * 0.22) // Also consider total area
                      )
                    );
                    
                    // Dynamic positioning based on box dimensions
                    const topPadding = Math.max(10, Math.min(16, rectHeight * 0.08));
                    const nameYPos = y + topPadding + (nameFontSize * 0.8);
                    
                    // Perfect center positioning for amount
                    // SVG text has baseline alignment, so we need to adjust y position to visually center it
                    // Adding 1/3 of font size as a correction for visual center alignment
                    const amountYPos = y + (rectHeight / 2) + (amountFontSize / 3);
                    
                    return (
                      <>
                        {/* App name at top - only show if enough space */}
                        {(rectWidth > 50 && rectHeight > 40) && (
                          <SvgText
                            x={x + Math.min(15, rectWidth * 0.08)}
                            y={nameYPos}
                            fontSize={nameFontSize}
                            fontWeight="500"
                            fill="#ffffff"
                            textAnchor="start"
                          >
                            {item.name.length > 12 && rectWidth < 120 
                              ? item.name.substring(0, 10) + '...' 
                              : item.name}
                          </SvgText>
                        )}
                        
                        {/* Large amount value positioned based on available space */}
                        <SvgText
                          x={x + (rectWidth / 2)}
                          y={amountYPos}
                          fontSize={amountFontSize}
                          fontWeight="900"
                          fill="#ffffff"
                          textAnchor="middle"
                        >
                          {amount}
                        </SvgText>
                      </>
                    );
                  })()}
                </>
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
    justifyContent: 'flex-start', // Change to flex-start to prevent centering that could cause cutoff
    paddingBottom: 20, // Increase bottom padding to ensure visibility
    overflow: 'hidden', // Ensure content doesn't overflow the container
    marginBottom: 10, // Add margin at the bottom
  }
});

export default TreeMap;
