import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

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
  width = screenWidth * 0.92,
  height = 400,
  onSelect,
  selectedName,
  dark = true
}) => {
  const layouts = React.useMemo(() => calculateLayout(data, width, height), [data, width, height]);
  const total = React.useMemo(() => data.reduce((s, i) => s + i.value, 0) || 1, [data]);

  const maxValue = React.useMemo(() => Math.max(...data.map(d => d.value), 1), [data]);

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
          const pctNum = (item.value / total) * 100;
          const pct = pctNum.toFixed(1) + '%';
          const isSelected = selectedName === item.name;
          const accent = item.color || accentPalette[data.findIndex(d => d.name === item.name) % accentPalette.length];
          const intensity = 0.12 + (item.value / maxValue) * 0.28; // 0.12 - 0.40 range
          const showName = rectWidth > 55 && rectHeight > 38;
          const showChange = rectWidth > 70 && rectHeight > 54; // space for second line
          const showMonthly = rectWidth > 90 && rectHeight > 72 && item.meta?.monthly !== undefined;
          const monthlyVal = item.meta?.monthly;
          const shareTopRight = rectWidth > 70 && rectHeight > 42;
          let nameFont = rectWidth > 140 ? 17 : rectWidth > 110 ? 15 : rectWidth > 80 ? 13 : 12;
          return (
            <React.Fragment key={item.name}>
              <Rect
                x={x}
                y={y}
                width={rectWidth}
                height={rectHeight}
                fill={'#050607'}
                stroke={isSelected ? '#ffffff' : '#11171e'}
                strokeWidth={isSelected ? 2 : 1}
                rx={6}
                ry={6}
                onPress={() => onSelect && onSelect(item)}
              />
              <Rect
                x={x+1}
                y={y+1}
                width={rectWidth-2}
                height={rectHeight-2}
                fill={withAlpha(accent, intensity)}
                rx={5}
                ry={5}
                pointerEvents="none"
              />
              {shareTopRight && (
                <SvgText
                  x={x + rectWidth - 8}
                  y={y + 16}
                  fontSize={11}
                  fontWeight="500"
                  fill="#94a3b8"
                  textAnchor="end"
                >
                  {pct}
                </SvgText>
              )}
              {showName && (
                <SvgText
                  x={x + 10}
                  y={y + 20}
                  fontSize={nameFont}
                  fontWeight="600"
                  fill="#f1f5f9"
                >
                  {item.name.length > 16 ? item.name.substring(0, 13) + '…' : item.name}
                </SvgText>
              )}
              {showChange && (
                <SvgText
                  x={x + 10}
                  y={y + 38}
                  fontSize={12}
                  fontWeight="500"
                  fill={item.change.startsWith('+') ? '#22c55e' : '#ef4444'}
                >
                  {item.change}
                </SvgText>
              )}
              {showMonthly && (
                <SvgText
                  x={x + 10}
                  y={y + 56}
                  fontSize={12}
                  fontWeight="500"
                  fill="#e2e8f0"
                >
                  ${monthlyVal}
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
