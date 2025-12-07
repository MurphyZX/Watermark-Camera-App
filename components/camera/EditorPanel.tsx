import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { X, Type, Palette, Sun, RotateCw, Layers } from 'lucide-react-native';
import { WatermarkConfig } from './CameraView';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface EditorPanelProps {
  config: WatermarkConfig;
  onConfigChange: (config: WatermarkConfig) => void;
  onClose: () => void;
}

const colors = [
  '#F8F9FA', // White
  '#C7F464', // Lime
  '#FF006E', // Hot Pink
  '#00D4FF', // Cyan
  '#FFD700', // Gold
  '#FF6B35', // Orange
];

const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32];

export default function EditorPanel({ config, onConfigChange, onClose }: EditorPanelProps) {
  const [activeTab, setActiveTab] = useState<'text' | 'style' | 'effects'>('text');

  const updateConfig = (updates: Partial<WatermarkConfig>) => {
    onConfigChange({ ...config, ...updates });
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />
      
      <Animated.View style={styles.panel}>
        <BlurView intensity={90} tint="dark" style={styles.blurContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Watermark</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#F8F9FA" />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'text' && styles.tabActive]}
              onPress={() => setActiveTab('text')}
            >
              <Type size={18} color={activeTab === 'text' ? '#C7F464' : '#888'} />
              <Text style={[styles.tabLabel, activeTab === 'text' && styles.tabLabelActive]}>
                Text
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'style' && styles.tabActive]}
              onPress={() => setActiveTab('style')}
            >
              <Palette size={18} color={activeTab === 'style' ? '#C7F464' : '#888'} />
              <Text style={[styles.tabLabel, activeTab === 'style' && styles.tabLabelActive]}>
                Style
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'effects' && styles.tabActive]}
              onPress={() => setActiveTab('effects')}
            >
              <Layers size={18} color={activeTab === 'effects' ? '#C7F464' : '#888'} />
              <Text style={[styles.tabLabel, activeTab === 'effects' && styles.tabLabelActive]}>
                Effects
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {activeTab === 'text' && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Custom Text</Text>
                <TextInput
                  style={styles.textInput}
                  value={config.text}
                  onChangeText={(text) => updateConfig({ text })}
                  placeholder="Enter watermark text..."
                  placeholderTextColor="#666"
                  multiline
                />
              </View>
            )}

            {activeTab === 'style' && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Color</Text>
                  <View style={styles.colorGrid}>
                    {colors.map((color) => (
                      <TouchableOpacity
                        key={color}
                        style={[
                          styles.colorButton,
                          { backgroundColor: color },
                          config.color === color && styles.colorButtonSelected,
                        ]}
                        onPress={() => updateConfig({ color })}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Font Size</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.sizeGrid}>
                      {fontSizes.map((size) => (
                        <TouchableOpacity
                          key={size}
                          style={[
                            styles.sizeButton,
                            config.fontSize === size && styles.sizeButtonSelected,
                          ]}
                          onPress={() => updateConfig({ fontSize: size })}
                        >
                          <Text
                            style={[
                              styles.sizeButtonText,
                              config.fontSize === size && styles.sizeButtonTextSelected,
                            ]}
                          >
                            {size}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Opacity</Text>
                  <View style={styles.opacityRow}>
                    {[0.25, 0.5, 0.75, 1].map((opacity) => (
                      <TouchableOpacity
                        key={opacity}
                        style={[
                          styles.opacityButton,
                          config.opacity === opacity && styles.opacityButtonSelected,
                        ]}
                        onPress={() => updateConfig({ opacity })}
                      >
                        <Text
                          style={[
                            styles.opacityButtonText,
                            config.opacity === opacity && styles.opacityButtonTextSelected,
                          ]}
                        >
                          {Math.round(opacity * 100)}%
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}

            {activeTab === 'effects' && (
              <>
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Rotation</Text>
                  <View style={styles.rotationRow}>
                    {[0, -15, -30, -45, 15, 30, 45].map((rotation) => (
                      <TouchableOpacity
                        key={rotation}
                        style={[
                          styles.rotationButton,
                          config.rotation === rotation && styles.rotationButtonSelected,
                        ]}
                        onPress={() => updateConfig({ rotation })}
                      >
                        <RotateCw
                          size={16}
                          color={config.rotation === rotation ? '#C7F464' : '#888'}
                          style={{ transform: [{ rotate: `${rotation}deg` }] }}
                        />
                        <Text
                          style={[
                            styles.rotationButtonText,
                            config.rotation === rotation && styles.rotationButtonTextSelected,
                          ]}
                        >
                          {rotation}°
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Effects</Text>
                  <View style={styles.effectsRow}>
                    <TouchableOpacity
                      style={[styles.effectButton, config.hasStroke && styles.effectButtonActive]}
                      onPress={() => updateConfig({ hasStroke: !config.hasStroke })}
                    >
                      <Text
                        style={[
                          styles.effectButtonText,
                          config.hasStroke && styles.effectButtonTextActive,
                        ]}
                      >
                        Stroke
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.effectButton, config.hasShadow && styles.effectButtonActive]}
                      onPress={() => updateConfig({ hasShadow: !config.hasShadow })}
                    >
                      <Text
                        style={[
                          styles.effectButtonText,
                          config.hasShadow && styles.effectButtonTextActive,
                        ]}
                      >
                        Shadow
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        </BlurView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  panel: {
    height: SCREEN_HEIGHT * 0.55,
    borderTopWidth: 4,
    borderTopColor: '#C7F464',
    overflow: 'hidden',
  },
  blurContainer: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 29, 0.95)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#F8F9FA',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 1,
  },
  closeButton: {
    padding: 8,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: '#333',
    gap: 8,
  },
  tabActive: {
    borderColor: '#C7F464',
    backgroundColor: 'rgba(199, 244, 100, 0.1)',
  },
  tabLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#C7F464',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#F8F9FA',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: '#333',
    color: '#F8F9FA',
    fontSize: 16,
    padding: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorButton: {
    width: 44,
    height: 44,
    borderWidth: 3,
    borderColor: '#333',
  },
  colorButtonSelected: {
    borderColor: '#C7F464',
    shadowColor: '#C7F464',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  sizeGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  sizeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: '#333',
  },
  sizeButtonSelected: {
    borderColor: '#C7F464',
    backgroundColor: 'rgba(199, 244, 100, 0.1)',
  },
  sizeButtonText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  sizeButtonTextSelected: {
    color: '#C7F464',
  },
  opacityRow: {
    flexDirection: 'row',
    gap: 12,
  },
  opacityButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
  },
  opacityButtonSelected: {
    borderColor: '#C7F464',
    backgroundColor: 'rgba(199, 244, 100, 0.1)',
  },
  opacityButtonText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
  },
  opacityButtonTextSelected: {
    color: '#C7F464',
  },
  rotationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  rotationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: '#333',
    gap: 6,
  },
  rotationButtonSelected: {
    borderColor: '#C7F464',
    backgroundColor: 'rgba(199, 244, 100, 0.1)',
  },
  rotationButtonText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  rotationButtonTextSelected: {
    color: '#C7F464',
  },
  effectsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  effectButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 2,
    borderColor: '#333',
    alignItems: 'center',
  },
  effectButtonActive: {
    borderColor: '#C7F464',
    backgroundColor: 'rgba(199, 244, 100, 0.1)',
  },
  effectButtonText: {
    color: '#888',
    fontSize: 14,
    fontWeight: '700',
  },
  effectButtonTextActive: {
    color: '#C7F464',
  },
});
