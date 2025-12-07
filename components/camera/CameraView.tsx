import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { CameraView as ExpoCameraView, useCameraPermissions } from 'expo-camera';
import { BlurView } from 'expo-blur';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { 
  Camera, 
  Settings, 
  Image as ImageIcon, 
  MapPin, 
  Calendar, 
  Cloud, 
  Type, 
  Stamp,
  RotateCcw
} from 'lucide-react-native';
import WatermarkOverlay from './WatermarkOverlay';
import PresetToolbar from './PresetToolbar';
import EditorPanel from './EditorPanel';
import GalleryThumbnail from './GalleryThumbnail';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export type WatermarkPreset = 'location' | 'datetime' | 'weather' | 'custom' | 'logo' | null;

export interface WatermarkConfig {
  text: string;
  preset: WatermarkPreset;
  position: { x: number; y: number };
  fontSize: number;
  color: string;
  opacity: number;
  rotation: number;
  hasStroke: boolean;
  strokeColor: string;
  hasShadow: boolean;
}

const defaultWatermarkConfig: WatermarkConfig = {
  text: '',
  preset: null,
  position: { x: SCREEN_WIDTH / 2 - 100, y: SCREEN_HEIGHT - 300 },
  fontSize: 16,
  color: '#F8F9FA',
  opacity: 1,
  rotation: 0,
  hasStroke: false,
  strokeColor: '#000000',
  hasShadow: true,
};

export default function CameraViewComponent() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [facing, setFacing] = useState<'front' | 'back'>('back');
  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>(defaultWatermarkConfig);
  const [showEditor, setShowEditor] = useState(false);
  const [lastPhoto, setLastPhoto] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationName, setLocationName] = useState<string>('');
  const cameraRef = useRef<ExpoCameraView>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
        const [address] = await Location.reverseGeocodeAsync({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
        if (address) {
          setLocationName(`${address.city || address.region}, ${address.country}`);
        }
      }
    })();
  }, []);

  const handlePresetSelect = (preset: WatermarkPreset) => {
    let text = '';
    const now = new Date();
    
    switch (preset) {
      case 'location':
        text = locationName || '位置不可用';
        break;
      case 'datetime':
        text = now.toLocaleString('zh-CN', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
        break;
      case 'weather':
        text = `${locationName || '未知'} • 22°C`;
        break;
      case 'custom':
        text = '在此输入文字';
        break;
      case 'logo':
        text = '📷 水印';
        break;
      default:
        text = '';
    }
    
    setWatermarkConfig(prev => ({
      ...prev,
      preset,
      text,
    }));
  };

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return;
    
    setIsCapturing(true);
    setShowFlash(true);
    
    setTimeout(() => setShowFlash(false), 200);
    
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        base64: false,
      });
      
      if (photo && mediaPermission?.granted) {
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        setLastPhoto(photo.uri);
      }
    } catch (error) {
      console.error('Failed to capture photo:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const toggleCamera = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return (
      <View className="flex-1 bg-charcoal items-center justify-center">
        <Text className="text-offwhite text-lg">加载中...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-charcoal items-center justify-center px-8">
        <Camera size={64} color="#C7F464" />
        <Text className="text-offwhite text-xl font-bold mt-6 text-center">
          需要相机权限
        </Text>
        <Text className="text-gray-400 text-center mt-2 mb-6">
          我们需要相机权限来拍摄带水印的照片
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-lime px-8 py-4 rounded-none border-4 border-black"
          style={styles.brutalistButton}
        >
          <Text className="text-black font-bold text-lg">授予权限</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-charcoal">
      {/* Camera View */}
      <ExpoCameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing={facing}
      >
        {/* Watermark Overlay */}
        {watermarkConfig.preset && (
          <WatermarkOverlay
            config={watermarkConfig}
            onPositionChange={(position) => 
              setWatermarkConfig(prev => ({ ...prev, position }))
            }
          />
        )}

        {/* Flash Effect */}
        {showFlash && (
          <View 
            style={StyleSheet.absoluteFill} 
            className="bg-white"
          />
        )}

        {/* Top Bar */}
        <View className="absolute top-12 left-0 right-0 flex-row justify-between px-4">
          <TouchableOpacity
            onPress={toggleCamera}
            className="bg-black/60 p-3 rounded-none border-2 border-lime"
            style={styles.iconButton}
          >
            <RotateCcw size={24} color="#C7F464" />
          </TouchableOpacity>
          
          <TouchableOpacity
            className="bg-black/60 p-3 rounded-none border-2 border-lime"
            style={styles.iconButton}
          >
            <Settings size={24} color="#C7F464" />
          </TouchableOpacity>
        </View>

        {/* Bottom Controls */}
        <View className="absolute bottom-0 left-0 right-0">
          {/* Preset Toolbar */}
          <PresetToolbar
            selectedPreset={watermarkConfig.preset}
            onSelectPreset={handlePresetSelect}
          />

          {/* Capture Bar */}
          <BlurView intensity={80} tint="dark" className="pb-10 pt-4">
            <View className="flex-row items-center justify-between px-6">
              {/* Gallery Thumbnail */}
              <GalleryThumbnail uri={lastPhoto} />

              {/* Capture Button */}
              <TouchableOpacity
                onPress={handleCapture}
                disabled={isCapturing}
                className="w-20 h-20 rounded-full border-4 border-lime items-center justify-center"
                style={[styles.captureButton, isCapturing && styles.captureButtonPressed]}
              >
                <View className="w-16 h-16 rounded-full bg-offwhite" />
              </TouchableOpacity>

              {/* Editor Toggle */}
              <TouchableOpacity
                onPress={() => setShowEditor(true)}
                className="w-14 h-14 bg-navy border-2 border-lime items-center justify-center"
                style={styles.iconButton}
              >
                <Type size={24} color="#C7F464" />
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </ExpoCameraView>

      {/* Editor Panel */}
      {showEditor && (
        <EditorPanel
          config={watermarkConfig}
          onConfigChange={setWatermarkConfig}
          onClose={() => setShowEditor(false)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  brutalistButton: {
    shadowColor: '#000',
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 8,
  },
  iconButton: {
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 4,
  },
  captureButton: {
    shadowColor: '#C7F464',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  captureButtonPressed: {
    transform: [{ scale: 0.92 }],
  },
});
