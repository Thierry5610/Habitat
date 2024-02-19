import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Application from './Application';
import UserContextProvider from './useUser';
import {enableLatestRenderer} from 'react-native-maps';


enableLatestRenderer();

export default function App() {
  
  return (
    <View style={styles.container}>
      <UserContextProvider>
         <StatusBar />
         <Application/>
      </UserContextProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
