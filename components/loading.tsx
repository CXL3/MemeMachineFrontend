import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = 'Loading . . .' }: LoadingProps) {
  return (
    <View style={styles.loadingView}>
      <ActivityIndicator size="large" color="#5637DD" />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    color: '#5637DD',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
});
