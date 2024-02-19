import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import useDataBase from './InitializeDB';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from './useUser';

const UserProfile = ({route,navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('https://cdn-icons-png.flaticon.com/512/1946/1946429.png');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const apiKey = 'AIzaSyC7v4J15D5mBkoQAXKuWE8TpmqkeIXgA5k';
  const {db,addUserProfile} = useDataBase();
  const {setUserData} = useUser();

  useEffect(()=>{
    if(route.params?.image){
      setProfilePicture(route.params.image)
    }
    if(route.params?.user){
      setName(route.params.user.username)
      setEmail(route.params.user.email)
    }
  })

  useEffect(() => {
    (async () => {
      // Request foreground location permissions and handle the result
      const foregroundPermission = await Location.requestForegroundPermissionsAsync();
      if (foregroundPermission.status !== 'granted') {
        alert('Foreground location access denied');
        return;
      }
  
      // Request background location permissions and handle the result
      const backgroundPermission = await Location.requestBackgroundPermissionsAsync();
      if (backgroundPermission.status !== 'granted') {
        alert('Background location access denied');
        return;
      }
  
      try {
        // Fetch the user's current location
        const location = await Location.getCurrentPositionAsync();
        const { latitude, longitude } = location.coords;
  
        // Fetch the address using the Google Maps Geocoding API
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );
        const data = await response.json();
  
        if (data.status === 'OK') {
          const address = data.results[0].formatted_address;
          setLocation(address); // Update the state with the address
        } else {
          // Handle the case when the Geocoding API does not return a valid result
          console.error('Geocoding API error:', data);
          alert('An error occurred while fetching location. Please try again.');
        }
      } catch (error) {
        // Handle any errors that occurred during location fetching or address retrieval
        console.error('Error fetching location or address:', error.message);
        alert('An error occurred while fetching location. Please try again.');
      }
    })();
  }, []);

  const storeLocal = async (data) => {
    try{
      await AsyncStorage.setItem('UserProfile',JSON.stringify(data))
      console.log("data saved")
    }catch(e) {
      console.error("Couldn't sava profile data: ",e)
    }
  }
  const handleSaveProfile = () => {
    // Perform profile update logic here
    const UserProfileData = {
      id: route.params?.user?.id,
      name: name,
      email: email,
      profilePicture: profilePicture,
      location: location,
      telephone: phoneNumber,
      property:[],
      liked: []
    }
    console.log('Saving profile...',UserProfileData);
    addUserProfile(UserProfileData.id,UserProfileData)
    storeLocal(UserProfileData)
    setUserData(UserProfileData)
    //setUserData(UserProfileData)
    navigation.navigate('Feeds')
  };

  const handleChooseProfilePicture = () => {
    // Implement logic to choose and update the profile picture
    console.log('Choosing profile picture...');
    navigation.navigate('Picture',{picture:profilePicture,user:route.params?.user})
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={{uri:profilePicture}}
        style={styles.profilePicture}
      />
      <TouchableOpacity style={styles.changePictureButton} onPress={handleChooseProfilePicture}>
        <Text style={styles.changePictureButtonText}>Change Picture</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={text => setPhoneNumber(text)}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={text => setLocation(text)}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#000000' }]}
        onPress={handleSaveProfile}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 30,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  profilePicture: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 30,
  },
  changePictureButton: {
    marginBottom: 20,
  },
  changePictureButtonText: {
    color: '#87ceeb',
    fontSize: 16,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#f2f2f2',
    marginBottom: 30,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  buyerSellerContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  buyerSellerButton: {
    flex: 1,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginHorizontal: 5,
  },
  activeBuyerSellerButton: {
    backgroundColor: '#87ceeb',
  },
  buyerSellerButtonText: {
    fontSize: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#000000',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default UserProfile;
