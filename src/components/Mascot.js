import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { spring, useReducedMotion } from './ui';
import { useColors } from '../theme/tokens';

// Original mascot: a game tile with a face. Its paws rise to cover its eyes while you type a password.
export default function Mascot({ covering }) {
  const c = useColors();
  const reduced = useReducedMotion();
  const y = useRef(new Animated.Value(0)).current;
  useEffect(() => { spring(y, covering ? 1 : 0, { response: 0.3, ratio: 0.85, reduced }); }, [covering]);
  const lift = y.interpolate({ inputRange: [0, 1], outputRange: [0, -74] });
  const Eye = () => <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#1B1D26' }} />;
  const Paw = () => <Animated.View style={{ width: 34, height: 40, borderRadius: 14, backgroundColor: c.challenge, transform: [{ translateY: lift }] }} />;
  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={{ alignSelf: 'center', backgroundColor: c.edge, borderRadius: 30, paddingBottom: 7 }}>
      <View style={{ width: 116, height: 104, borderRadius: 30, backgroundColor: c.puzzle, overflow: 'hidden', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 28, marginTop: 32 }}><Eye /><Eye /></View>
        <View style={{ width: 22, height: 10, marginTop: 8, borderBottomLeftRadius: 11, borderBottomRightRadius: 11, backgroundColor: '#1B1D26' }} />
        <View style={{ position: 'absolute', bottom: -38, flexDirection: 'row', gap: 12 }}><Paw /><Paw /></View>
      </View>
    </View>
  );
}
