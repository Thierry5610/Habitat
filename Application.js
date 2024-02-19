import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Constants from 'expo-constants';
import ProfileSetup from './ProfileSetup';

export default function Application() {
  
  return (
    <View style={styles.container}>
      <ProfileSetup/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: Constants.statusBarHeight
  },
});
