import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import {LinearGradient} from 'expo-linear-gradient';

export default function GradientText ({ text, style, gradientColors })  {
  return (
    <MaskedView
      maskElement={<Text style={[style, { backgroundColor: 'transparent' }]}>{text}</Text>}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        <Text style={[style, styles.hiddenText]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
};

const styles = StyleSheet.create({
  hiddenText: {
    opacity: 0,
  },
});
