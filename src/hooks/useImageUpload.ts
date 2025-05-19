import { useState } from 'react';
import * as ImagePicker from 'react-native-image-picker';
import { Platform, PermissionsAndroid } from 'react-native';

interface UseImageUploadProps {
  onError?: (error: Error) => void;
}

export const useImageUpload = ({ onError }: UseImageUploadProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const requestGalleryPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES ||
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      throw new Error('Gallery permission denied');
    }

    const options: ImagePicker.ImageLibraryOptions = {
      mediaType: 'photo',
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
      selectionLimit: 1,
    };

    try {
      setIsLoading(true);
      const response = await ImagePicker.launchImageLibrary(options);

      if (response.didCancel) {
        return null;
      }

      if (response.errorCode) {
        throw new Error(response.errorMessage);
      }

      if (response.assets && response.assets[0].uri) {
        return response.assets[0].uri;
      }

      return null;
    } catch (error) {
      onError?.(error as Error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pickImage,
    isLoading,
  };
}; 