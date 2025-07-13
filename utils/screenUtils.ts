import { Dimensions, PixelRatio } from 'react-native';

// Original DPI conversion function
export function pxToDpiReactNative(pixels: number): number {
    const { width, height } = Dimensions.get('window');
    const pixelRatio = PixelRatio.get();
    
    // Get physical pixels
    const screenWidthPx = width * pixelRatio;
    const screenHeightPx = height * pixelRatio;
    
    // Estimate screen size in inches (you might need to get this from device info)
    const screenWidthInches = width / 96; // Approximate
    
    // Calculate actual DPI
    const actualDpi = screenWidthPx / screenWidthInches;
    
    // Convert pixels to DPI
    const dpi = pixels * (actualDpi / screenWidthPx);
    
    return dpi;
}

// Enhanced responsive scaling with DPI awareness
export function responsiveScale(size: number, factor: number = 0.5): number {
    const { width, height } = Dimensions.get('window');
    const pixelRatio = PixelRatio.get();
    
    // Base scale calculation (similar to react-native-size-matters)
    const scale = width / 375; // 375 is iPhone X width as baseline
    
    // Apply scaling factor
    const scaledSize = size * scale * factor;
    
    // Ensure minimum size for readability
    const minSize = size * 0.8;
    const maxSize = size * 1.5;
    
    return Math.max(minSize, Math.min(maxSize, scaledSize));
}

// Vertical scaling (for heights)
export function responsiveVerticalScale(size: number, factor: number = 0.5): number {
    const { height } = Dimensions.get('window');
    const pixelRatio = PixelRatio.get();
    
    // Base scale calculation
    const scale = height / 812; // 812 is iPhone X height as baseline
    
    // Apply scaling factor
    const scaledSize = size * scale * factor;
    
    // Ensure minimum size
    const minSize = size * 0.8;
    const maxSize = size * 1.5;
    
    return Math.max(minSize, Math.min(maxSize, scaledSize));
}

// Moderate scaling (for balanced scaling)
export function responsiveModerateScale(size: number, factor: number = 0.5): number {
    const { width } = Dimensions.get('window');
    const pixelRatio = PixelRatio.get();
    
    // Base scale calculation
    const scale = width / 375;
    
    // Apply moderate scaling
    const scaledSize = size * scale * factor;
    
    // Ensure reasonable bounds
    const minSize = size * 0.7;
    const maxSize = size * 1.3;
    
    return Math.max(minSize, Math.min(maxSize, scaledSize));
}

// Combined function: Responsive scaling + DPI conversion
export function responsiveWithDpi(size: number, factor: number = 0.5) {
    // Get responsive scaled size
    const responsiveSize = responsiveScale(size, factor);
    
    // Convert to DPI
    const dpi = pxToDpiReactNative(responsiveSize);
    
    return {
        scaledPixels: responsiveSize,
        dpi: dpi,
        originalPixels: size
    };
}

// Comprehensive screen info with both scaling and DPI
export function getComprehensiveScreenInfo() {
    const { width, height } = Dimensions.get('window');
    const pixelRatio = PixelRatio.get();
    
    // Physical pixels
    const physicalWidth = width * pixelRatio;
    const physicalHeight = height * pixelRatio;
    
    // Calculate DPI
    const screenWidthInches = width / 96;
    const actualDpi = physicalWidth / screenWidthInches;
    
    // Responsive scaling factors
    const horizontalScale = width / 375;
    const verticalScale = height / 812;
    
    return {
        // Screen dimensions
        logicalWidth: width,
        logicalHeight: height,
        physicalWidth: physicalWidth,
        physicalHeight: physicalHeight,
        pixelRatio: pixelRatio,
        
        // DPI information
        screenDpi: actualDpi,
        dpiFor100px: pxToDpiReactNative(100),
        
        // Responsive scaling factors
        horizontalScale: horizontalScale,
        verticalScale: verticalScale,
        
        // Device type detection
        isTablet: width > 768,
        isLargeScreen: width > 414,
        isSmallScreen: width < 375,
        
        // Recommended scaling functions
        scaleFn: (size: number) => responsiveScale(size),
        verticalScaleFn: (size: number) => responsiveVerticalScale(size),
        moderateScaleFn: (size: number) => responsiveModerateScale(size),
        withDpi: (size: number) => responsiveWithDpi(size)
    };
}

// Utility function for creating responsive styles
export function createResponsiveStyle(baseStyle: any) {
    const screenInfo = getComprehensiveScreenInfo();
    
    return {
        ...baseStyle,
        // Auto-scale common properties
        fontSize: baseStyle.fontSize ? responsiveScale(baseStyle.fontSize) : undefined,
        width: baseStyle.width ? responsiveScale(baseStyle.width) : undefined,
        height: baseStyle.height ? responsiveVerticalScale(baseStyle.height) : undefined,
        padding: baseStyle.padding ? responsiveModerateScale(baseStyle.padding) : undefined,
        margin: baseStyle.margin ? responsiveModerateScale(baseStyle.margin) : undefined,
        borderRadius: baseStyle.borderRadius ? responsiveModerateScale(baseStyle.borderRadius) : undefined,
    };
}

// Legacy function for backward compatibility
export function getScreenInfo() {
    const { width, height } = Dimensions.get('window');
    const pixelRatio = PixelRatio.get();
    
    return {
        logicalWidth: width,
        logicalHeight: height,
        physicalWidth: width * pixelRatio,
        physicalHeight: height * pixelRatio,
        pixelRatio: pixelRatio,
        dpi: pxToDpiReactNative(1) // Get DPI for 1 pixel
    };
} 