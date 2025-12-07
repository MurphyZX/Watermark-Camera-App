import React from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Image as ImageIcon } from 'lucide-react-native';

interface GalleryThumbnailProps {
  uri: string | null;
}

export default function GalleryThumbnail({ uri }: GalleryThumbnailProps) {
  return (
    <TouchableOpacity style={styles.container}>
      {uri ? (
        <Image source={{ uri }} style={styles.image} />
      ) : (
        <View style={styles.placeholder}>
          <ImageIcon size={24} color="#888" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 56,
    borderWidth: 3,
    borderColor: '#C7F464',
    backgroundColor: '#1A1A1D',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 0,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D1B2A',
  },
});
