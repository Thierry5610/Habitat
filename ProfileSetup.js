import React, { useEffect, useState } from 'react';
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import UserProfile from "./UserProfile"
import ProfilePicturePicker from "./ProfilePicturePicker"
import Login from "./Login"
import SignUp from "./Signup"
import ResetPassword from "./ResetPassword"
import { Text, Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import Feeds from "./Feeds"
import HomeScreen from "./Home"
import NetInfo from '@react-native-community/netinfo'; // Import the NetInfo module

export default function ProfileSetup() {
    //const {userData,InitUser} = useUser()
    const Stack = createNativeStackNavigator()
    const Tab = createMaterialBottomTabNavigator()

    const [isConnected, setIsConnected] = useState(true); // Initialize isConnected to true by default

    useEffect(() => {
      // Add a listener for network connectivity changes
      const unsubscribe = NetInfo.addEventListener((state) => {
        setIsConnected(state.isConnected);
      });

      // Cleanup the listener when the component is unmounted
      return () => {
        unsubscribe();
      };
    }, []);

    // Show an alert and prevent navigation if the user is offline
    if (!isConnected) {
      Alert.alert(
        'No Internet Connection',
        'Please check your internet connection and try again.',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }

    const FrontScreen = ({navigation}) => {
        //should be replaced with Home and will display get started button only when profile not found
        //When get started button is pressed, it leads to login...
        useEffect(()=>{
            (async()=>{
                userProfile = await AsyncStorage.getItem('UserProfile')
                userProfileData = JSON.parse(userProfile)
                if(userProfile){
                    //InitUser(userProfileData)
                    //console.log(userProfileData)
                    navigation.navigate("Feeds")
                }else {
                    navigation.navigate("Login")
                }
            })()
        },[])
        return(<>
            <Text>Welcome!</Text>
        </>)
    }

    return(
        <>  
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Frontscreen"
                >
                    <Stack.Screen
                        component={HomeScreen}
                        name="Frontscreen"
                        options={{headerShown:false}}
                    />
                    <Stack.Group>
                        <Stack.Screen
                            component={Login}
                            name="Login"
                            options={{headerShown:false}}
                        />
                        <Stack.Screen
                            component={SignUp}
                            name="SignUp"
                            options={{headerShown:false}}
                        />
                        <Stack.Screen
                            component={ResetPassword}
                            name="Reset"
                            options={{headerShown:false}}
                        />
                    </Stack.Group>
                    <Stack.Screen
                        name="Profile"
                        component={UserProfile}
                        options={{headerShown:false}}
                    />
                    <Stack.Screen
                        name="Picture"
                        component={ProfilePicturePicker}
                        options={{headerShown:false}}
                    />
                    <Stack.Screen
                        component={Feeds}
                        name="Feeds"
                        options={{headerShown:false}}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
}
