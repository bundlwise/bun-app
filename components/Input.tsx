import React, { forwardRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  DimensionValue,
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
} from 'react-native';

type AutoCapitalize = 'none' | 'sentences' | 'words' | 'characters';

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: AutoCapitalize;
  editable?: boolean;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: () => void;

  height?: DimensionValue;
  width?: DimensionValue;
  backgroundColor?: string;
  borderRadius?: number;
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  placeholderTextColor?: string;
}

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      value,
      onChangeText,
      placeholder,
      leftIcon,
      rightIcon,
      secureTextEntry = false,
      keyboardType = 'default',
      autoCapitalize = 'none',
      editable = true,
      returnKeyType,
      onSubmitEditing,
      height = 56,
      width = '90%',
      backgroundColor = '#171717',
      borderRadius = 16,
      containerStyle,
      inputStyle,
      placeholderTextColor = '#595959',
    },
    ref
  ) => {
    return (
      <View
        style={[
          styles.container,
          { height, width, borderRadius, backgroundColor },
          containerStyle,
        ]}
      >
        {leftIcon ? <View style={styles.leftIcon}>{leftIcon}</View> : null}
        <TextInput
          ref={ref}
          style={[
            styles.input,
            {
              paddingLeft: leftIcon ? 44 : 16,
              paddingRight: rightIcon ? 44 : 16,
              fontFamily: value && value.length > 0 ? 'Inter-Medium' : 'Inter-Regular',
            },
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
        />
        {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#232323',
  },
  input: {
    flex: 1,
    color: '#000000',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  leftIcon: {
    position: 'absolute',
    left: 14,
    elevation: 1,
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 14,
    elevation: 1,
    zIndex: 1,
  },
});

export default Input;


