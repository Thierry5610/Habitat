import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    // Handle the "Get Started" button press, navigate to the login page
    navigation.navigate('Login');
  };

  const handleProceed = () => {
    // Handle the "Proceed" button press, navigate to the Feeds page
    navigation.navigate('Feeds');
  };

  useFocusEffect(() => {
    // Check if the user profile is found in AsyncStorage
    //clearLocalStorage()
    const checkUserProfile = async () => {
      const userProfile = await AsyncStorage.getItem('UserProfile');
      if (userProfile) {
        // Do not navigate here, only set a flag to render the "Proceed" button
        setProfileFound(true);
      } else {
        // Do not navigate here, only set a flag to render the "Get Started" button
        setProfileFound(false);
      }
    };

    checkUserProfile();
  });

  const [profileFound, setProfileFound] = React.useState(null);

  return (
    <View style={styles.container}>
      <Image source={require('./Assets/house_2163300.png')} style={styles.logo} />
      <Text style={styles.title}>Welcome to Habitat</Text>
      <Text style={styles.subtitle}>Discover Your Perfect Home</Text>
      {profileFound === true && (
        <TouchableOpacity onPress={handleProceed} style={styles.button}>
          <Text style={styles.buttonText}>Proceed</Text>
        </TouchableOpacity>
      )}
      {profileFound === false && (
        <TouchableOpacity onPress={handleGetStarted} style={styles.button}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#000000',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
