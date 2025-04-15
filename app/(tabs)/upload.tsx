import React, { useReducer } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, Input, Image } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { baseUrl } from '../../shared/baseUrl';

// Types
type UploadState = {
  newTitle: string;
  imageUrl: string;
};

type Action =
  | { type: 'SET_TITLE'; payload: string }
  | { type: 'SET_IMAGE'; payload: string }
  | { type: 'RESET' };

// Initial state
const initialState: UploadState = {
  newTitle: '',
  imageUrl: baseUrl + 'images/sample.jpg',
};

// Reducer
function uploadReducer(state: UploadState, action: Action): UploadState {
  switch (action.type) {
    case 'SET_TITLE':
      return { ...state, newTitle: action.payload };
    case 'SET_IMAGE':
      return { ...state, imageUrl: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export default function UploadScreen() {
  const [state, dispatch] = useReducer(uploadReducer, initialState);

  const getImageFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Camera access is needed to upload a photo.');
      return;
    }

    const importImage = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!importImage.canceled && importImage.assets?.length > 0) {
      const { uri } = importImage.assets[0];
      dispatch({ type: 'SET_IMAGE', payload: uri });
    }
  };

  const handleCancel = () => {
    Alert.alert('Alert', 'Discard the upload?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK', onPress: () => dispatch({ type: 'RESET' }) },
    ]);
  };

  return (
    <ScrollView>
      <View style={styles.formButton}>
        <Button type="outline" title="Choose a photo" onPress={getImageFromCamera} />
        <Input
          placeholder="Input your title here"
          value={state.newTitle}
          onChangeText={(text) => dispatch({ type: 'SET_TITLE', payload: text })}
          leftIconContainerStyle={styles.formIcon}
        />
      </View>

      <View>
        <Text style={styles.textTitle2}>{state.newTitle}</Text>
        <Image source={{ uri: state.imageUrl }} style={styles.image} />
      </View>

      <Button style={styles.formButton} title="Post" onPress={() => Alert.alert('Posted!')} />
      <Button style={styles.formButton} type="outline" title="Cancel" onPress={handleCancel} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formButton: {
    marginHorizontal: 40,
    marginTop: 20,
    borderRadius: 4,
  },
  formIcon: {
    marginRight: 10,
  },
  textTitle2: {
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    flex: 1,
    height: 345,
    resizeMode: 'contain',
  },
});
