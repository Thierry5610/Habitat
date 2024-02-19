import React, { useEffect, useState } from 'react';
import {TextInput, TouchableOpacity, Text, StyleSheet, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from './useUser';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UpdateProfilePicture from './UpdateProfilePicture';
import Icon from 'react-native-vector-icons/Ionicons';

const UpdateUser = ({route,navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState(userData?.profilePicture);
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const apiKey = 'AIzaSyC7v4J15D5mBkoQAXKuWE8TpmqkeIXgA5k';
  const {userData,changeName,changeEmail,changePhone,changeProfilePicture} = useUser();

  useEffect(()=>{
    console.log(userData)
    setName(userData?.name)
    setEmail(userData?.email)
    setProfilePicture(userData?.profilePicture)
    setLocation(userData?.location)
    setPhoneNumber(userData?.telephone)
  },[userData])
  useEffect(()=>{
    if(route.params?.image){
        setProfilePicture(route.params.image)
      }
      if(route.params?.user){
        setName(route.params.user.name)
        setEmail(route.params.user.email)
      }
  })
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
    changeName(name)
    changeEmail(email)
    changePhone(phoneNumber)
    changeProfilePicture(profilePicture)
    console.log('Saving profile...',userData);
    storeLocal(userData)
  };

  const handleChooseProfilePicture = () => {
    // Implement logic to choose and update the profile picture
    console.log('Choosing profile picture...');
    navigation.navigate('ProfilePictureUpdate',{picture:profilePicture,user:userData})
  };

  const clearLocalStorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log('Local storage cleared successfully.');
      navigation.navigate("Frontscreen")
    } catch (error) {
      console.error('Error clearing local storage:', error);
    }

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
        style={[styles.button, { backgroundColor: '#000000',marginBottom:20 }]}
        onPress={handleSaveProfile}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Save Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button,{backgroundColor:'tomato'}]}
        onPress={clearLocalStorage}
        activeOpacity={0.8}
      >
        <Text style={[styles.buttonText,{color:"white"}]}><Icon name="power" size={20}/> Logout</Text>
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

// export default UpdateUser;

export default function UpdateUserProfile() {
    const Stack = createNativeStackNavigator()
    return(
        <>
            <Stack.Navigator
                initialRouteName='ProfileUpdate'
            >
                <Stack.Screen
                    name='ProfileUpdate'
                    component={UpdateUser}
                    options={{headerShown:false}}
                />
                <Stack.Screen
                    name='ProfilePictureUpdate'
                    component={UpdateProfilePicture}
                    options={{headerShown:false}}
                />
            </Stack.Navigator>
        </>
    )
}
