import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { MapPin, Calendar, Cloud, Type, Stamp } from 'lucide-react-native';
import { WatermarkPreset } from './CameraView';

interface PresetToolbarProps {
  selectedPreset: WatermarkPreset;
  onSelectPreset: (preset: WatermarkPreset) => void;
}

const presets: { id: WatermarkPreset; label: string; icon: React.ReactNode }[] = [
  { id: 'location', label: 'Location', icon: <MapPin size={18} color="#F8F9FA" /> },
  { id: 'datetime', label: 'Date/Time', icon: <Calendar size={18} color="#F8F9FA" /> },
  { id: 'weather', label: 'Weather', icon: <Cloud size={18} color="#F8F9FA" /> },
  { id: 'custom', label: 'Custom', icon: <Type size={18} color="#F8F9FA" /> },
  { id: 'logo', label: 'Logo', icon: <Stamp size={18} color="#F8F9FA" /> },
];

export default function PresetToolbar({ selectedPreset, onSelectPreset }: PresetToolbarProps) {
  return (
    <BlurView intensity={60} tint="dark" style={styles.container}>
      <View style={styles.borderTop} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {presets.map((preset) => {
          const isSelected = selectedPreset === preset.id;
          return (
            <TouchableOpacity
              key={preset.id}
              onPress={() => onSelectPreset(preset.id)}
              style={[
                styles.presetButton,
                isSelected && styles.presetButtonSelected,
              ]}
            >
              <View style={styles.iconContainer}>
                {preset.icon}
              </View>
              <Text
                style={[
                  styles.presetLabel,
                  isSelected && styles.presetLabelSelected,
                ]}
              >
                {preset.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    marginBottom: 0,
  },
  borderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#C7F464',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
    flexDirection: 'row',
  },
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(13, 27, 42, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#333',
    gap: 8,
  },
  presetButtonSelected: {
    borderColor: '#C7F464',
    backgroundColor: 'rgba(199, 244, 100, 0.15)',
    transform: [{ scale: 1.05 }],
    shadowColor: '#C7F464',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetLabel: {
    color: '#F8F9FA',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  presetLabelSelected: {
    color: '#C7F464',
  },
});
