/**
 * @flow
 * @providesModule RNSSegmentedControl
 */

import React from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';

import { colors, fonts } from '../styles';

const RNSSegmentedControl = props => {
  const segments = props.values.map((value, index) => (
    <Segment
      type={props.type}
      key={value}
      value={value}
      isSelected={index === props.selectedIndex}
      selectionColor={props.selectionColor? props.selectionColor : colors.backgroundBlue}
      onPress={() => props.onChange(index)}
      index={index}
      count={props.values.length}
    />
  ));
  return <View style={[styles.container, props.style]}>{segments}</View>;
};

function Segment({ isSelected, onPress, selectionColor, value, type, index, count}) {
  let position = 'middle';
  if(index == 0)
    position = 'start';
  else if(index == count-1)
    position =  'end';

  let selectedButtonStyle;
  if (isSelected) {
    selectedButtonStyle = { backgroundColor: colors.red };
  }
  let deselectedLabelStyle;
  if (!isSelected && Platform.OS === 'android') {
    deselectedLabelStyle = styles.deselectedLabel;
  }
  const title = value;

  const accessibilityTraits = ['button'];
  if (isSelected) {
    accessibilityTraits.push('selected');
  }

  return (
    <TouchableOpacity
      accessibilityTraits={accessibilityTraits}
      activeOpacity={0.8}
      onPress={onPress}
      style={[
        styles.button,
        position === 'start' && styles.start,
        position === 'end' && styles.end,
        position === 'middle' && styles.middle,
        selectedButtonStyle,
      ]}
    >
      <Text style={[styles.label, deselectedLabelStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const HEIGHT = 40;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    ...Platform.select({
      ios: {
        paddingBottom: 6,
        justifyContent: 'center',
        alignItems: 'center',
      },
    }),
  },
  button: {
    borderColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2c3e50',
  },
  start: {
    flex:1,
    height: HEIGHT,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    borderWidth: 1,
  },
  middle: {
    flex:1,
    height: HEIGHT,
    borderWidth: 1,
    borderLeftWidth: 0
  },
  end: {
    flex:1,
    height: HEIGHT,
    borderWidth: 1,
    borderLeftWidth: 0,
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  },
  default: {
    ...Platform.select({
      ios: {
        height: HEIGHT,
        paddingHorizontal: 20,
        borderRadius: HEIGHT / 2,
        borderWidth: 1,
      },
      android: {
        paddingBottom: 6,
        paddingHorizontal: 10,
        borderBottomWidth: 3,
        marginRight: 10,
      },
    }),
  },
  underline: {
    paddingBottom: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
    marginRight: 10,
  },
  label: {
    letterSpacing: 1,
    fontSize: 16,
    color: colors.white,
  },
  deselectedLabel: {
    color: colors.red,
  },
});

export default RNSSegmentedControl;
