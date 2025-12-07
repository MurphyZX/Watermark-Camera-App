import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder } from 'react-native';
import { WatermarkConfig } from './CameraView';

interface WatermarkOverlayProps {
  config: WatermarkConfig;
  onPositionChange: (position: { x: number; y: number }) => void;
}

export default function WatermarkOverlay({ config, onPositionChange }: WatermarkOverlayProps) {
  const pan = useRef(new Animated.ValueXY({ x: config.position.x, y: config.position.y })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event(
        [null, { dx: pan.x, dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        onPositionChange({
          x: (pan.x as any)._value,
          y: (pan.y as any)._value,
        });
      },
    })
  ).current;

  const getPresetIcon = () => {
    switch (config.preset) {
      case 'location':
        return '📍';
      case 'datetime':
        return '📅';
      case 'weather':
        return '☀️';
      case 'logo':
        return '📷';
      default:
        return '';
    }
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.container,
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            { rotate: `${config.rotation}deg` },
          ],
          opacity: config.opacity,
        },
      ]}
    >
      <View style={[styles.watermarkBox, config.hasShadow && styles.withShadow]}>
        <Text
          style={[
            styles.watermarkText,
            {
              fontSize: config.fontSize,
              color: config.color,
            },
            config.hasStroke && {
              textShadowColor: config.strokeColor,
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 2,
            },
          ]}
        >
          {getPresetIcon()} {config.text}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 100,
  },
  watermarkBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#C7F464',
  },
  withShadow: {
    shadowColor: '#C7F464',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  watermarkText: {
    fontFamily: 'SpaceMono-Regular',
    fontWeight: '700',
    letterSpacing: 1,
  },
});
