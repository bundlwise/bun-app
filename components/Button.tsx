import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, StyleProp, TextStyle, ViewStyle, GestureResponderEvent, DimensionValue, Animated } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    rightIcon?: React.ReactNode;
    height?: DimensionValue;
    width?: DimensionValue;
    backgroundColor?: string;
    borderRadius?: number;
    textStyle?: StyleProp<TextStyle>;
    buttonStyle?: StyleProp<ViewStyle>;
    activeOpacity?: number;
}

const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    rightIcon,
    height = 62,
    width = '90%',
    backgroundColor = '#ffffff',
    borderRadius = 0,
    textStyle,
    buttonStyle,
    activeOpacity = 0.85,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    height,
                    width,
                    borderRadius,
                    backgroundColor,
                },
                buttonStyle
            ]}
            activeOpacity={activeOpacity}
            onPress={onPress}
        >
            <View style={styles.contentContainer}>
                <Text style={[
                    styles.text,
                    textStyle
                ]}>
                    {title}
                </Text>

                {rightIcon && (
                    <View style={styles.iconContainer}>
                        {rightIcon}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        shadowColor: '#000',
        shadowOpacity: 0.1,
        elevation: 3,
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        position: 'relative',
    },
    text: {
        color: '#000000',
        fontSize: 16,
        fontFamily: 'Inter-Medium',
        letterSpacing: 0.3,
        position: 'absolute',
        left: 0,
        right: 0,
        textAlign: 'center',
        width: '100%',
    },
    iconContainer: {
        position: 'absolute',
        right: 12.5,
        alignSelf: 'center',
    },
});

export default Button;