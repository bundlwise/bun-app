import React, { useState, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  PanResponder,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Svg, { Path, Circle, Rect, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

const FinancialOverviewScreen = () => {
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('1 Week');
  const [weeklyBallPosition, setWeeklyBallPosition] = useState({ x: 130, y: 100 });
  const [monthlyBallPosition, setMonthlyBallPosition] = useState({ x: 140, y: 100 });
  const [quarterlyBallPosition, setQuarterlyBallPosition] = useState({ x: 60, y: 180 });
  const [sixMonthBallPosition, setSixMonthBallPosition] = useState({ x: 150, y: 80 });
      const [weeklyInfo, setWeeklyInfo] = useState('Wed 45%\nGrowth');
      const [monthlyInfo, setMonthlyInfo] = useState('W2 48%\nGrowth');
  const [quarterlyInfo, setQuarterlyInfo] = useState('Jan (M1) - 22% - Launch');
  const [sixMonthInfo, setSixMonthInfo] = useState('M3 65%\nPeak');

  const timeFilters = ['1 Week', '1 Month', '3 Month', '6 Month'];

      // Dynamic data based on selected time filter
    const getFinancialData = (timeFilter: string) => {
      const data = {
        '1 Week': {
          totalSpent: '₹2,450',
          avgPerDay: '₹350',
          topDay: 'Wednesday',
          topDayAmount: '₹480',
          trend: 'up',
          percentage: '+12%',
          avgPerDayChange: '+5%'
        },
        '1 Month': {
          totalSpent: '₹8,900',
          avgPerDay: '₹297',
          topDay: 'Friday',
          topDayAmount: '₹1,200',
          trend: 'down',
          percentage: '-8%',
          avgPerDayChange: '-3%'
        },
        '3 Month': {
          totalSpent: '₹24,500',
          avgPerDay: '₹272',
          topDay: 'Monday',
          topDayAmount: '₹2,100',
          trend: 'up',
          percentage: '+15%',
          avgPerDayChange: '+8%'
        },
        '6 Month': {
          totalSpent: '₹45,200',
          avgPerDay: '₹251',
          topDay: 'Thursday',
          topDayAmount: '₹3,800',
          trend: 'up',
          percentage: '+22%',
          avgPerDayChange: '+12%'
        }
      };
      
      const currentData = data[timeFilter as keyof typeof data];
      
      return [
        {
          title: 'Total Spent',
          amount: currentData.totalSpent,
          change: currentData.percentage,
          changeColor: currentData.trend === 'up' ? '#34D399' : '#F87171',
          icon: 'credit-card',
          isPositive: currentData.trend === 'up',
        },
        {
          title: 'Avg/Day',
          amount: currentData.avgPerDay,
          change: currentData.avgPerDayChange,
          changeColor: currentData.trend === 'up' ? '#34D399' : '#F87171',
          icon: 'trending-up',
          isPositive: currentData.trend === 'up',
        },
        {
          title: 'Top Day',
          amount: `${currentData.topDay} - ${currentData.topDayAmount}`,
          change: '',
          changeColor: '#F87171',
          icon: 'calendar',
          isPositive: false,
        },
        {
          title: 'Trend',
          amount: currentData.trend === 'up' ? 'Increasing' : 'Decreasing',
          change: '',
          changeColor: currentData.trend === 'up' ? '#34D399' : '#F87171',
          icon: currentData.trend === 'up' ? 'arrow-up' : 'arrow-down',
          isPositive: currentData.trend === 'up',
        },
      ];
    };

    const financialData = getFinancialData(selectedTimeFilter);

  const renderGraph = () => {
    const chartWidth = selectedTimeFilter === '3 Month' ? screenWidth - 20 : 
                      selectedTimeFilter === '6 Month' ? screenWidth + 20 : screenWidth + 20;
    const chartHeight = selectedTimeFilter === '3 Month' ? 200 : 
                       selectedTimeFilter === '6 Month' ? 180 : 200;

    // Data points based on selected time filter
    const dataPoints = selectedTimeFilter === '1 Month' ? [
      // Monthly data - 4 weeks (sharper critical points)
      { x: 50, y: 150, day: 'W1', usage: 18, critical: false },
      { x: 140, y: 100, day: 'W2', usage: 48, critical: true }, // Sharp growth spike
      { x: 230, y: 135, day: 'W3', usage: 32, critical: true }, // Sharp setback dip
      { x: 320, y: 60, day: 'W4', usage: 75, critical: true }, // Sharp recovery peak
    ] : selectedTimeFilter === '3 Month' ? [
      // Quarterly data - 3 months (more dramatic)
      { x: 60, y: 180, day: 'M1', month: 'Jan', usage: 22, critical: true }, // Launch month
      { x: 180, y: 80, day: 'M2', month: 'Feb', usage: 65, critical: true }, // Sharp growth acceleration
      { x: 300, y: 45, day: 'M3', month: 'Mar', usage: 85, critical: true }, // Market penetration peak
    ] : selectedTimeFilter === '6 Month' ? [
      // Half-yearly data - 6 months with sharp up-down volatility
      { x: -10, y: 180, month: 'M1', usage: 15, critical: false }, // Start
      { x: 60, y: 140, month: 'M2', usage: 35, critical: true }, // Growth
      { x: 130, y: 80, month: 'M3', usage: 65, critical: true }, // Peak
      { x: 200, y: 120, month: 'M4', usage: 45, critical: true }, // Dip
      { x: 270, y: 60, month: 'M5', usage: 75, critical: true }, // Recovery
      { x: 340, y: 40, month: 'M6', usage: 85, critical: true }, // Final peak
    ] : [
      // Weekly data - 7 days
      { x: 20, y: 160, day: 'Mon', usage: 12, critical: false },
      { x: 75, y: 140, day: 'Tue', usage: 25, critical: false },
      { x: 130, y: 100, day: 'Wed', usage: 45, critical: true }, // Mid-week peak
      { x: 185, y: 120, day: 'Thu', usage: 35, critical: false },
      { x: 240, y: 80, day: 'Fri', usage: 65, critical: true }, // Friday spike
      { x: 295, y: 50, day: 'Sat', usage: 85, critical: true }, // Weekend high
      { x: 350, y: 60, day: 'Sun', usage: 75, critical: true }, // Sunday dip
    ];

    const createPath = () => {
      let path = `M ${dataPoints[0].x} ${dataPoints[0].y}`;
      for (let i = 1; i < dataPoints.length; i++) {
        const prevPoint = dataPoints[i - 1];
        const currentPoint = dataPoints[i];
        if (selectedTimeFilter === '1 Month') {
          // Monthly curve logic (sharper critical points)
          const controlX = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.7; // More aggressive
          const controlY = prevPoint.y; // Sharp angle by keeping Y same
          
          // For critical points, make even sharper
          if (dataPoints[i].critical) {
            const sharpControlY = prevPoint.y + (currentPoint.y - prevPoint.y) * 0.1; // Very sharp
            path += ` Q ${controlX} ${sharpControlY} ${currentPoint.x} ${currentPoint.y}`;
          } else {
            path += ` Q ${controlX} ${controlY} ${currentPoint.x} ${currentPoint.y}`;
          }
        } else if (selectedTimeFilter === '3 Month') {
          // Quarterly curve logic (more dramatic)
          const controlX = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.8; // More aggressive
          const controlY = prevPoint.y; // Keep Y same for sharp angles
          
          // Extra sharp for critical quarterly points
          const sharpControlY = prevPoint.y + (currentPoint.y - prevPoint.y) * 0.05; // Very sharp
          path += ` Q ${controlX} ${sharpControlY} ${currentPoint.x} ${currentPoint.y}`;
        } else {
          // Weekly curve logic
          const controlX = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.6;
          const controlY = prevPoint.y;
          path += ` Q ${controlX} ${controlY} ${currentPoint.x} ${currentPoint.y}`;
        }
      }
      return path;
    };

    const createAreaPath = () => {
      let path = `M ${dataPoints[0].x} ${chartHeight}`;
      path += ` L ${dataPoints[0].x} ${dataPoints[0].y}`;
      for (let i = 1; i < dataPoints.length; i++) {
        const prevPoint = dataPoints[i - 1];
        const currentPoint = dataPoints[i];
        if (selectedTimeFilter === '1 Month') {
          // Monthly curve logic (sharper critical points)
          const controlX = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.7;
          
          if (dataPoints[i].critical) {
            const sharpControlY = prevPoint.y + (currentPoint.y - prevPoint.y) * 0.1;
            path += ` Q ${controlX} ${sharpControlY} ${currentPoint.x} ${currentPoint.y}`;
          } else {
            const controlY = prevPoint.y;
            path += ` Q ${controlX} ${controlY} ${currentPoint.x} ${currentPoint.y}`;
          }
        } else if (selectedTimeFilter === '3 Month') {
          // Quarterly curve logic (more dramatic)
          const controlX = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.8; // More aggressive
          const controlY = prevPoint.y; // Keep Y same for sharp angles
          
          // Extra sharp for critical quarterly points
          const sharpControlY = prevPoint.y + (currentPoint.y - prevPoint.y) * 0.05; // Very sharp
          path += ` Q ${controlX} ${sharpControlY} ${currentPoint.x} ${currentPoint.y}`;
        } else {
          // Weekly curve logic
          const controlX = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.6;
          const controlY = prevPoint.y;
          path += ` Q ${controlX} ${controlY} ${currentPoint.x} ${currentPoint.y}`;
        }
      }
      path += ` L ${dataPoints[dataPoints.length - 1].x} ${chartHeight} Z`;
      return path;
    };

    // Find smooth position for weekly ball sliding
    const findSmoothPosition = (x: number) => {
      // For weekly, monthly, quarterly, and 6 month views - smooth sliding
      if (selectedTimeFilter === '1 Week' || selectedTimeFilter === '1 Month' || selectedTimeFilter === '3 Month' || selectedTimeFilter === '6 Month') {
        const minX = dataPoints[0].x;
        const maxX = dataPoints[dataPoints.length - 1].x;
        const clampedX = Math.max(minX, Math.min(maxX, x));
        
        // Find the two data points that x lies between
        let leftPoint = dataPoints[0];
        let rightPoint = dataPoints[0];
        let segmentIndex = 0;
        
        for (let i = 0; i < dataPoints.length - 1; i++) {
          if (clampedX >= dataPoints[i].x && clampedX <= dataPoints[i + 1].x) {
            leftPoint = dataPoints[i];
            rightPoint = dataPoints[i + 1];
            segmentIndex = i;
            break;
          }
        }
        
        // Calculate interpolation factor (0 to 1)
        const totalDistance = rightPoint.x - leftPoint.x;
        const currentDistance = clampedX - leftPoint.x;
        let t = totalDistance > 0 ? currentDistance / totalDistance : 0;
        
        // Use the exact same curve logic as the graph path
        let y;
        if (selectedTimeFilter === '1 Month') {
          // Monthly curve logic (sharper critical points)
          const controlX = leftPoint.x + (rightPoint.x - leftPoint.x) * 0.7;
          const controlY = leftPoint.y;
          
          if (rightPoint.critical) {
            const sharpControlY = leftPoint.y + (rightPoint.y - leftPoint.y) * 0.1;
            y = (1 - t) * (1 - t) * leftPoint.y + 2 * (1 - t) * t * sharpControlY + t * t * rightPoint.y;
          } else {
            y = (1 - t) * (1 - t) * leftPoint.y + 2 * (1 - t) * t * controlY + t * t * rightPoint.y;
          }
        } else if (selectedTimeFilter === '3 Month') {
          // Quarterly curve logic (more dramatic) - EXACT same as graph
          const controlX = leftPoint.x + (rightPoint.x - leftPoint.x) * 0.8;
          const sharpControlY = leftPoint.y + (rightPoint.y - leftPoint.y) * 0.05;
          y = (1 - t) * (1 - t) * leftPoint.y + 2 * (1 - t) * t * sharpControlY + t * t * rightPoint.y;
        } else if (selectedTimeFilter === '6 Month') {
          // 6 Month curve logic - EXACT same as graph
          const controlX = leftPoint.x + (rightPoint.x - leftPoint.x) * 0.8;
          const sharpControlY = leftPoint.y + (rightPoint.y - leftPoint.y) * 0.05;
          y = (1 - t) * (1 - t) * leftPoint.y + 2 * (1 - t) * t * sharpControlY + t * t * rightPoint.y;
        } else {
          // Weekly curve logic
          const controlX = leftPoint.x + (rightPoint.x - leftPoint.x) * 0.6;
          const controlY = leftPoint.y;
          y = (1 - t) * (1 - t) * leftPoint.y + 2 * (1 - t) * t * controlY + t * t * rightPoint.y;
        }
        
        // Calculate interpolated usage with smooth transition
        const usage = Math.round(leftPoint.usage + (rightPoint.usage - leftPoint.usage) * t);
        
        // For 3 month and 6 month views, use the closer point for day/month info
        let day, month;
        if (selectedTimeFilter === '3 Month' || selectedTimeFilter === '6 Month') {
          if (t < 0.5) {
            day = (leftPoint as any).day;
            month = (leftPoint as any).month;
          } else {
            day = (rightPoint as any).day;
            month = (rightPoint as any).month;
          }
        } else {
          day = (leftPoint as any).day;
          month = (leftPoint as any).month;
        }
        
        return {
          x: clampedX,
          y: y,
          usage: usage,
          day: day,
          month: month
        };
      } else {
        // For other views, use closest point (existing behavior)
        let closest = dataPoints[0];
        let minDistance = Math.abs(x - closest.x);
        
        for (let point of dataPoints) {
          const distance = Math.abs(x - point.x);
          if (distance < minDistance) {
            minDistance = distance;
            closest = point;
          }
        }
        return closest;
      }
    };

    // PanResponder for weekly ball movement with smooth finger tracking
    const weeklyPanResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => selectedTimeFilter === '1 Week',
        onMoveShouldSetPanResponder: () => selectedTimeFilter === '1 Week',
        onPanResponderTerminationRequest: () => false, // Prevent interruption
        onPanResponderGrant: (evt) => {
          const { locationX } = evt.nativeEvent;
          console.log('Weekly ball touched at:', locationX);
          const smoothPoint = findSmoothPosition(locationX);
          console.log('Smooth point:', smoothPoint);
          setWeeklyBallPosition({ x: smoothPoint.x, y: smoothPoint.y });
          
          // Create situation label based on usage
          let situation = '';
          if (smoothPoint.usage < 30) {
            situation = 'Low';
          } else if (smoothPoint.usage < 60) {
            situation = 'Growth';
          } else {
            situation = 'Peak';
          }
          setWeeklyInfo(`${(smoothPoint as any).day} ${smoothPoint.usage}%\n${situation}`);
        },
        onPanResponderMove: (evt) => {
          const { locationX } = evt.nativeEvent;
          // Continuous finger tracking with very smooth movement
          const smoothPoint = findSmoothPosition(locationX);
          
          // Use requestAnimationFrame for smoother updates
          requestAnimationFrame(() => {
            setWeeklyBallPosition({ x: smoothPoint.x, y: smoothPoint.y });
            
            // Create situation label based on usage
            let situation = '';
            if (smoothPoint.usage < 30) {
              situation = 'Low';
            } else if (smoothPoint.usage < 60) {
              situation = 'Growth';
            } else {
              situation = 'Peak';
            }
            setWeeklyInfo(`${(smoothPoint as any).day} ${smoothPoint.usage}%\n${situation}`);
          });
        },
        onPanResponderRelease: (evt) => {
          // Optional: Add release animation or final positioning
          const { locationX } = evt.nativeEvent;
          const smoothPoint = findSmoothPosition(locationX);
          setWeeklyBallPosition({ x: smoothPoint.x, y: smoothPoint.y });
        },
      })
    ).current;



    return (
      <View style={styles.graphContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {selectedTimeFilter === '1 Month' ? 'Monthly Usage' : 
             selectedTimeFilter === '3 Month' ? 'Quarterly Usage' : 
             selectedTimeFilter === '6 Month' ? 'Quarterly Usage' : 'Weekly Usage'}
          </Text>
          <Text style={styles.gain}>
            {selectedTimeFilter === '1 Month' ? '+57%' : 
             selectedTimeFilter === '3 Month' ? '+63%' : 
             selectedTimeFilter === '6 Month' ? '+30%' : '+63%'}
          </Text>
        </View>

        <View style={styles.chartContainer} key={selectedTimeFilter}>
          <Svg width={chartWidth} height={chartHeight + 50}>
            <Defs>
                              <LinearGradient 
                  id={selectedTimeFilter === '1 Month' ? "monthlyGradient" : 
                      selectedTimeFilter === '3 Month' ? "quarterlyGradient" : 
                      selectedTimeFilter === '6 Month' ? "quarterlyGradient" : "weeklyGradient"} 
                  x1="0%" y1="0%" x2="0%" y2="100%"
                >
                  <Stop 
                    offset="0%" 
                    stopColor={selectedTimeFilter === '1 Month' ? "#3b82f6" : 
                               selectedTimeFilter === '3 Month' ? "#f59e0b" : 
                               selectedTimeFilter === '6 Month' ? "#f59e0b" : "#10b981"} 
                    stopOpacity={selectedTimeFilter === '1 Month' ? "0.7" : 
                               selectedTimeFilter === '3 Month' ? "0.8" : 
                               selectedTimeFilter === '6 Month' ? "0.8" : "0.6"} 
                  />
                  <Stop 
                    offset={selectedTimeFilter === '1 Month' ? "50%" : 
                           selectedTimeFilter === '3 Month' ? "40%" : 
                           selectedTimeFilter === '6 Month' ? "40%" : "100%"} 
                    stopColor={selectedTimeFilter === '1 Month' ? "#3b82f6" : 
                               selectedTimeFilter === '3 Month' ? "#f59e0b" : 
                               selectedTimeFilter === '6 Month' ? "#f59e0b" : "#10b981"} 
                    stopOpacity={selectedTimeFilter === '1 Month' ? "0.4" : 
                               selectedTimeFilter === '3 Month' ? "0.5" : 
                               selectedTimeFilter === '6 Month' ? "0.5" : "0.1"} 
                  />
                  <Stop 
                    offset="100%" 
                    stopColor={selectedTimeFilter === '1 Month' ? "#3b82f6" : 
                               selectedTimeFilter === '3 Month' ? "#f59e0b" : 
                               selectedTimeFilter === '6 Month' ? "#f59e0b" : "#10b981"} 
                    stopOpacity="0.1" 
                  />
                </LinearGradient>
            </Defs>
            
            <Path d={createAreaPath()} fill={`url(#${selectedTimeFilter === '1 Month' ? "monthlyGradient" : 
                                                   selectedTimeFilter === '3 Month' ? "quarterlyGradient" : 
                                                   selectedTimeFilter === '6 Month' ? "quarterlyGradient" : "weeklyGradient"})`} />
            <Path 
              d={createPath()} 
              stroke={selectedTimeFilter === '1 Month' ? "#3b82f6" : 
                      selectedTimeFilter === '3 Month' ? "#f59e0b" : 
                      selectedTimeFilter === '6 Month' ? "#f59e0b" : "#10b981"} 
              strokeWidth={selectedTimeFilter === '1 Month' ? "3" : 
                          selectedTimeFilter === '3 Month' ? "4" : 
                          selectedTimeFilter === '6 Month' ? "4" : "2.5"} 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin={selectedTimeFilter === '1 Month' ? "round" : 
                            selectedTimeFilter === '3 Month' ? "round" : 
                            selectedTimeFilter === '6 Month' ? "round" : undefined}
            />
            

            {/* Data points with labels (for quarterly view) */}
            {selectedTimeFilter === '3 Month' && dataPoints.map((point, index) => (
              <React.Fragment key={index}>

                {/* Month label */}
                <SvgText 
                  x={point.x} 
                  y={chartHeight + 30} 
                  textAnchor="middle" 
                  fontSize="13" 
                  fill="#64748b"
                  fontWeight="bold"
                >
                  {(point as any).day}
                </SvgText>

              </React.Fragment>
            ))}
            
            {/* Data points with labels (for 1 Week view) */}
            {selectedTimeFilter === '1 Week' && dataPoints.map((point, index) => (
              <React.Fragment key={index}>
                <SvgText 
                  x={point.x} 
                  y={chartHeight + 30} 
                  textAnchor="middle" 
                  fontSize="13" 
                  fill="#64748b"
                  fontWeight="bold"
                >
                  {(point as any).day}
                </SvgText>
                
              </React.Fragment>
            ))}

            {/* Data points with labels (for 6 Month view) */}
            {selectedTimeFilter === '6 Month' && dataPoints.map((point, index) => (
              <React.Fragment key={index}>
                <SvgText 
                  x={point.x} 
                  y={chartHeight + 30} 
                  textAnchor="middle" 
                  fontSize="13" 
                  fill="#64748b"
                  fontWeight="bold"
                >
                  {(point as any).month}
                </SvgText>
              </React.Fragment>
            ))}
            
            {/* Weekly ball (only for weekly view) */}
            {selectedTimeFilter === '1 Week' && (
              <Circle 
                cx={weeklyBallPosition.x} 
                cy={weeklyBallPosition.y} 
                r="12" 
                fill="white" 
                stroke="#10b981" 
                strokeWidth="3" 
              />
            )}
            
            {/* Monthly ball (only for monthly view) */}
            {selectedTimeFilter === '1 Month' && (
              <Circle 
                cx={monthlyBallPosition.x} 
                cy={monthlyBallPosition.y} 
                r="12" 
                fill="white" 
                stroke="#3b82f6" 
                strokeWidth="3" 
              />
            )}
            
            {/* Quarterly ball (only for quarterly view) */}
            {selectedTimeFilter === '3 Month' && (
              <Circle 
                cx={quarterlyBallPosition.x} 
                cy={quarterlyBallPosition.y} 
                r="12" 
                fill="white" 
                stroke="#f59e0b" 
                strokeWidth="3" 
              />
            )}

            {/* 6 Month ball (only for 6 Month view) */}
            {selectedTimeFilter === '6 Month' && (
              <Circle 
                cx={sixMonthBallPosition.x} 
                cy={sixMonthBallPosition.y} 
                r="15" 
                fill="white" 
                stroke="#f59e0b" 
                strokeWidth="4" 
              />
            )}

          </Svg>
          
          {/* Touch overlay for weekly ball movement with PanResponder */}
          {selectedTimeFilter === '1 Week' && (
            <View 
              style={styles.touchOverlay}
              {...weeklyPanResponder.panHandlers}
            />
          )}
          
          {/* Touch overlay for monthly ball movement */}
          {selectedTimeFilter === '1 Month' && (
            <View 
              style={styles.touchOverlay}
              onTouchStart={(evt) => {
                const { locationX } = evt.nativeEvent;
                const smoothPoint = findSmoothPosition(locationX);
                setMonthlyBallPosition({ x: smoothPoint.x, y: smoothPoint.y });
                
                let situation = '';
                if (smoothPoint.usage < 30) {
                  situation = 'Low';
                } else if (smoothPoint.usage < 60) {
                  situation = 'Growth';
                } else {
                  situation = 'Peak';
                }
                setMonthlyInfo(`W${(smoothPoint as any).day.slice(1)} ${smoothPoint.usage}%\n${situation}`);
              }}
              onTouchMove={(evt) => {
                const { locationX } = evt.nativeEvent;
                const smoothPoint = findSmoothPosition(locationX);
                setMonthlyBallPosition({ x: smoothPoint.x, y: smoothPoint.y });
                
                let situation = '';
                if (smoothPoint.usage < 30) {
                  situation = 'Low';
                } else if (smoothPoint.usage < 60) {
                  situation = 'Growth';
                } else {
                  situation = 'Peak';
                }
                setMonthlyInfo(`W${(smoothPoint as any).day.slice(1)} ${smoothPoint.usage}%\n${situation}`);
              }}
            />
          )}
          
          {/* Touch overlay for quarterly ball movement */}
          {selectedTimeFilter === '3 Month' && (
            <View 
              style={styles.touchOverlay}
              onTouchStart={(evt) => {
                const { locationX } = evt.nativeEvent;
                const smoothPoint = findSmoothPosition(locationX);
                setQuarterlyBallPosition({ x: smoothPoint.x, y: smoothPoint.y });
                
                let situation = '';
                if (smoothPoint.usage < 30) {
                  situation = 'Low';
                } else if (smoothPoint.usage < 60) {
                  situation = 'Growth';
                } else {
                  situation = 'Peak';
                }
                
                const point = smoothPoint as any;
                const monthName = point.month || point.day;
                const dayCode = point.day || point.month;
                setQuarterlyInfo(`${monthName} (${dayCode}) - ${smoothPoint.usage}% - ${situation}`);
              }}
              onTouchMove={(evt) => {
                const { locationX } = evt.nativeEvent;
                const smoothPoint = findSmoothPosition(locationX);
                setQuarterlyBallPosition({ x: smoothPoint.x, y: smoothPoint.y });
                
                let situation = '';
                if (smoothPoint.usage < 30) {
                  situation = 'Low';
                } else if (smoothPoint.usage < 60) {
                  situation = 'Growth';
                } else {
                  situation = 'Peak';
                }
                
                const point = smoothPoint as any;
                const monthName = point.month || point.day;
                const dayCode = point.day || point.month;
                setQuarterlyInfo(`${monthName} (${dayCode}) - ${smoothPoint.usage}% - ${situation}`);
              }}
            />
          )}

          {/* Touch overlay for 6 Month ball movement */}
          {selectedTimeFilter === '6 Month' && (
            <View 
              style={styles.touchOverlay}
              onTouchStart={(evt) => {
                const { locationX } = evt.nativeEvent;
                const smoothPoint = findSmoothPosition(locationX);
                setSixMonthBallPosition({ x: smoothPoint.x, y: smoothPoint.y });
                
                let situation = '';
                if (smoothPoint.usage < 30) {
                  situation = 'Low';
                } else if (smoothPoint.usage < 60) {
                  situation = 'Growth';
                } else {
                  situation = 'Peak';
                }
                
                const point = smoothPoint as any;
                setSixMonthInfo(`${point.month} ${smoothPoint.usage}%\n${situation}`);
              }}
              onTouchMove={(evt) => {
                const { locationX } = evt.nativeEvent;
                const smoothPoint = findSmoothPosition(locationX);
                setSixMonthBallPosition({ x: smoothPoint.x, y: smoothPoint.y });
                
                let situation = '';
                if (smoothPoint.usage < 30) {
                  situation = 'Low';
                } else if (smoothPoint.usage < 60) {
                  situation = 'Growth';
                } else {
                  situation = 'Peak';
                }
                
                const point = smoothPoint as any;
                setSixMonthInfo(`${point.month} ${smoothPoint.usage}%\n${situation}`);
              }}
            />
          )}
          
          {/* Info indicator for weekly view */}
          {selectedTimeFilter === '1 Week' && (
                        <View style={[styles.infoIndicator, {
              position: 'absolute',
              left: weeklyBallPosition.x - 25,
              top: weeklyBallPosition.y - 65,
              backgroundColor: 'rgba(0,0,0,0.9)',
              padding: 4,
              borderRadius: 3,
              zIndex: 1000,
              width: 70,
              alignItems: 'center'
            }]}>
                              <Text style={[styles.infoText, { color: 'white', fontSize: 9, fontWeight: 'bold', textAlign: 'center', lineHeight: 12 }]}>{weeklyInfo}</Text>
            </View>
          )}
          
          {/* Info indicator for monthly view */}
          {selectedTimeFilter === '1 Month' && (
                        <View style={[styles.infoIndicator, {
              position: 'absolute',
              left: monthlyBallPosition.x - 25,
              top: monthlyBallPosition.y - 65,
              backgroundColor: 'rgba(0,0,0,0.9)',
              padding: 4,
              borderRadius: 3,
              zIndex: 1000,
              width: 70,
              alignItems: 'center'
            }]}>
              <Text style={[styles.infoText, { color: 'white', fontSize: 9, fontWeight: 'bold', textAlign: 'center', lineHeight: 12 }]}>{monthlyInfo}</Text>
            </View>
          )}
          
          {/* Info indicator for quarterly view */}
          {selectedTimeFilter === '3 Month' && (
            <View style={[styles.infoIndicator, { 
              position: 'absolute',
              left: quarterlyBallPosition.x - 25,
              top: quarterlyBallPosition.y - 65,
              backgroundColor: 'rgba(0,0,0,0.9)',
              padding: 4,
              borderRadius: 3,
              zIndex: 1000,
              width: 60,
              alignItems: 'center'
            }]}>
              <Text style={[styles.infoText, { color: 'white', fontSize: 9, fontWeight: 'bold', textAlign: 'center', lineHeight: 12 }]}>{quarterlyInfo}</Text>
            </View>
          )}

          {/* Info indicator for 6 Month view */}
          {selectedTimeFilter === '6 Month' && (
            <View style={[styles.infoIndicator, { 
              position: 'absolute',
              left: sixMonthBallPosition.x - 25,
              top: sixMonthBallPosition.y - 65,
              backgroundColor: 'rgba(0,0,0,0.9)',
              padding: 4,
              borderRadius: 3,
              zIndex: 1000,
              width: 60,
              alignItems: 'center'
            }]}>
                              <Text style={[styles.infoText, { color: 'white', fontSize: 9, fontWeight: 'bold', textAlign: 'center', lineHeight: 20 }]}>{sixMonthInfo}</Text>
            </View>
          )}

        </View>
      </View>
    );
  };

  const renderTimeFilters = () => (
    <View style={styles.timeFiltersContainer}>
      {timeFilters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.timeFilterButton,
            selectedTimeFilter === filter && styles.selectedTimeFilter,
          ]}
          onPress={() => setSelectedTimeFilter(filter)}
        >
          <Text
            style={[
              styles.timeFilterText,
              selectedTimeFilter === filter && styles.selectedTimeFilterText,
            ]}
          >
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderFinancialCard = (item: any, index: number) => (
    <View key={index} style={styles.financialCardBox}>
    </View>
  );

       return (
       <SafeAreaView style={styles.container}>
         <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                   {/* Header */}
           <View style={styles.header}>
             <TouchableOpacity style={styles.headerButton}>
               <Feather name="arrow-left" size={20} color="white" />
             </TouchableOpacity>
             <View style={styles.headerButton} />
           </View>

                   {/* Currency Exchange */}
           <View style={styles.currencySection}>
             <View style={styles.currencyInfo}>
               <View style={styles.flagContainer}>
                 <Text style={styles.flagEmoji}>📱</Text>
               </View>
               <View style={styles.exchangeInfo}>
                 <Text style={styles.exchangeRate}>Bundlwise = ₹0,88</Text>
                 <Text style={styles.exchangeChange}>+₹0,90 (12%)</Text>
               </View>
             </View>
             <View style={styles.graphValue}>
               <Feather name="chevron-down" size={16} color="#A78BFA" />
               <Text style={styles.graphValueText}>+{getFinancialData(selectedTimeFilter)[0].amount}</Text>
             </View>
           </View>

        {/* Graph */}
        {renderGraph()}

                   {/* Time Filters */}
           {renderTimeFilters()}

           {/* Bottom Action Buttons */}
           <View style={[styles.bottomButtonsContainer, { marginTop: -17, marginBottom: 10}]}>
             <TouchableOpacity style={styles.bottomActionButton}>
               <Text style={styles.bottomActionButtonText}>Cancel</Text>
             </TouchableOpacity>
             
             <TouchableOpacity style={[styles.bottomActionButton, styles.bottomRenewButton]}>
               <Text style={[styles.bottomActionButtonText, styles.bottomRenewButtonText]}>Renew</Text>
             </TouchableOpacity>
           </View>

           {/* Weekly Financial Overview */}
           <View style={styles.overviewSection}>
                       <View style={styles.sectionHeader}>
               <View style={styles.sectionLine} />
               <Text style={styles.sectionTitle}>{selectedTimeFilter} Financial Overview</Text>
               <TouchableOpacity>
                 <Feather name="more-vertical" size={20} color="white" />
               </TouchableOpacity>
             </View>

                       {/* Financial Cards Grid */}
             <View style={styles.cardsGrid}>
               {financialData.map((item, index) => renderFinancialCard(item, index))}
             </View>
           </View>
         </ScrollView>
         
         {/* Sticky Open App Button */}
         <TouchableOpacity style={styles.openAppButton}>
           <Text style={styles.openAppButtonText}>Open App</Text>
         </TouchableOpacity>
       </SafeAreaView>
     );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  currencySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  currencyInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  flagEmoji: {
    fontSize: 20,
  },
  exchangeInfo: {
    flex: 1,
  },
  exchangeRate: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  exchangeChange: {
    fontSize: 14,
    color: '#34D399',
    fontWeight: '500',
  },
  graphValue: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  graphValueText: {
    fontSize: 16,
    color: '#A78BFA',
    fontWeight: '600',
    marginLeft: 4,
  },
  graphContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  graph: {
    marginBottom: 10,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  xAxisLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  timeFiltersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  timeFilterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  selectedTimeFilter: {
    backgroundColor: '#A78BFA',
  },
  timeFilterText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  selectedTimeFilterText: {
    color: 'white',
    fontWeight: '600',
  },
  overviewSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionLine: {
    width: 4,
    height: 20,
    backgroundColor: '#A78BFA',
    borderRadius: 2,
    marginRight: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
       financialCardBox: {
       width: (screenWidth - 60) / 2,
       height: 160,
       marginBottom: 20,
       backgroundColor: 'rgba(255,255,255,0.05)',
       borderRadius: 16,
       padding: 12,
       borderWidth: 1,
       borderColor: 'rgba(255,255,255,0.1)',
     },
     financialCard: {
       width: '100%',
     },
  cardGradient: {
    borderRadius: 16,
    padding: 16,
    minHeight: 120,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: 'white',
    fontWeight: '500',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
       cardChange: {
       fontSize: 12,
       fontWeight: '500',
     },
     actionButton: {
       paddingHorizontal: 16,
       paddingVertical: 8,
       marginRight: 12,
       borderRadius: 20,
       backgroundColor: 'rgba(255,255,255,0.1)',
       borderWidth: 1,
       borderColor: 'rgba(255,255,255,0.2)',
     },
     actionButtonText: {
       fontSize: 14,
       color: '#999',
       fontWeight: '500',
     },
     renewButton: {
       backgroundColor: '#A78BFA',
       borderColor: '#A78BFA',
     },
     renewButtonText: {
       color: 'white',
       fontWeight: '600',
     },
     bottomButtonsContainer: {
       flexDirection: 'row',
       justifyContent: 'space-between',
       paddingHorizontal: 20,
       paddingVertical: 20,
       marginTop: 20,
     },
     bottomActionButton: {
       flex: 1,
       paddingVertical: 16,
       borderRadius: 12,
       backgroundColor: '#333',
       borderWidth: 1,
       borderColor: '#666',
       marginHorizontal: 8,
       alignItems: 'center',
     },
     bottomActionButtonText: {
       fontSize: 16,
       color: 'white',
       fontWeight: '600',
     },
     bottomRenewButton: {
       backgroundColor: '#A78BFA',
       borderColor: '#A78BFA',
     },
     bottomRenewButtonText: {
       color: 'white',
     },
     scrollView: {
       flex: 1,
       paddingBottom: 100, // Space for sticky button
     },

     openAppButton: {
       position: 'absolute',
       bottom: 60,
       left: '50%',
       marginLeft: -80,
       width: 160,
       backgroundColor: '#A78BFA',
       borderRadius: 12,
       paddingVertical: 16,
       alignItems: 'center',
     },
     openAppButtonText: {
       color: 'white',
       fontSize: 16,
       fontWeight: '600',
     },
     title: {
       fontSize: 18,
       fontWeight: '600',
       color: 'white',
     },
     gain: {
       fontSize: 16,
       fontWeight: '600',
       color: '#10b981',
     },
     chartContainer: {
       marginTop: 10,
       backgroundColor: '#1a1a1a',
       borderRadius: 12,
       padding: 20,
       marginHorizontal: -20,
     },
     touchOverlay: {
       position: 'absolute',
       top: 0,
       left: 0,
       right: 0,
       bottom: 0,
       backgroundColor: 'transparent',
     },
     infoIndicator: {
       position: 'absolute',
       top: 10,
       right: 10,
       backgroundColor: 'rgba(0,0,0,0.8)',
       paddingHorizontal: 12,
       paddingVertical: 6,
       borderRadius: 8,
     },
     infoText: {
       color: 'white',
       fontSize: 12,
       fontWeight: '600',
     },
   });

export default FinancialOverviewScreen; 