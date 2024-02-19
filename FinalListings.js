import React, { useCallback, useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Listings from './ListingsFinal';
import MapViewComponent from './components/MapView';
import Filters from './Filter';
import PropertyDetail from './PropertyDetail';
import { fetchListings } from './listingData';
import { useUser } from './useUser';
import { ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';


export default function FinalListing({ listing }) {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {userData} = useUser()

  // useEffect(() => {
  //   // Fetch the data and update the state when the component mounts
  //   const getListings = async () => {
  //     const data = await fetchListings();

  //     setListings(data.filter((datum)=>!(datum.isTaken&&(!datum.forRent))));
  //     setIsLoading(false);
  //   };

  //   getListings();
  // }, [userData]);

  useFocusEffect(
    useCallback(()=>{
      const getListings = async () => {
        const data = await fetchListings();
  
        setListings(data.filter((datum)=>!(datum.isTaken&&(!datum.forRent))));
        setIsLoading(false);
      };
  
      getListings();
    },[])
  )

  const Stack = createNativeStackNavigator();

  if (isLoading) {
    // Render a loading state or placeholder while fetching the data
    return (<ActivityIndicator color='grey' style={{position: 'absolute',left:0,right:0,top:0,bottom:0}}/>);
  }

  return (
    <>
      <Stack.Navigator initialRouteName="Filters">
        <Stack.Screen name="Filters" options={{ headerShown: false }}>
          {(props) => <Filters {...props} listings={listings} />}
        </Stack.Screen>
        <Stack.Screen name="List View" options={{ headerShown: false }}>
          {(props) => <Listings {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Map View" options={{ headerShown: true, headerTintColor: '#87ceef' }}>
          {(props) => <MapViewComponent {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Details" options={{ headerShown: false }}>
          {(props) => <PropertyDetail {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
}
