import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


import FinalListing from './FinalListings';
import Favorites from './LikedProperty';
import UpdateUserProfile from './UpdateUser';
import Myproperty from './Myproperty';

const Tab = createBottomTabNavigator();

export default function Feeds() {
  const theme = useTheme();
  theme.colors.secondaryContainer = 'transparent';

  return (
    <>
      {/* <NavigationContainer> */}
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Listings') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Favorites') {
                iconName = focused ? 'heart' : 'heart-outline';
              } else if (route.name === 'Account') {
                iconName = focused? 'person' : 'person-outline';
              } else if (route.name === 'More') {{
                iconName = focused? 'more-horiz': 'more-horiz'
              }}

              // You can add more icons and customize them here

              if(route.name!=='More'){return <Icon name={iconName} size={size} color={color} />;}
              else {return <MaterialIcons name={iconName} size={size} color={color}/>}
            },
            tabBarActiveTintColor: '#87ceeb',
            tabBarInactiveTintColor: 'grey',
            tabBarShowLabel: true, // Set to true to show labels
            tabBarLabelStyle: { fontSize: 14 },
            tabBarHideOnKeyboard: true,
            // Remove tabBarIconStyle to let the tab bar adjust its height
            tabBarStyle: {
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 2,
              elevation: 8,
            },
          })}
        >
          <Tab.Screen name="Listings" component={FinalListing} options={{headerShown:false}}/>
          <Tab.Screen name="Favorites" component={Favorites} options={{headerShown:false}} />
          <Tab.Screen name="Account" component={UpdateUserProfile} options={{headerShown:false}} />
          <Tab.Screen name="More" component={Myproperty} options={{headerShown:false}} />
        </Tab.Navigator>
      {/* </NavigationContainer> */}
    </>
  );
}
