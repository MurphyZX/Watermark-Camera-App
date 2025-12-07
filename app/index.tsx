import { StatusBar } from 'expo-status-bar';
import CameraViewComponent from '@/components/camera/CameraView';

export default function HomeScreen() {
  return (
    <>
      <StatusBar style="light" />
      <CameraViewComponent />
    </>
  );
}
