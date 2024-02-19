import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from './useUser';
import { fetchListings } from './listingData';
import { useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PropertyForm from './Addproperty';
import UpdateProperty from './UpdateProperty';
import CompressedProperty from './components/CompressedProperty';

function SeeProperty({ navigation }) {
  const { userData, addProperty } = useUser();
  const [listings, setListings] = useState([]);
  const [property, setProperty] = useState([]);

  useEffect(() => {
    const fetchAndCacheListings = async () => {
      try {
        const data = await fetchListings();
        setListings(data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchAndCacheListings();
  },[userData.property,listings]);

  useEffect(() => {
    // Filter property listings based on IDs only when userData.property changes
    const propertyBuffer = userData.property
      .map((id) => {
        const toStore = listings.find((listing) => listing.id === id);
        return toStore;
      })
      .filter(Boolean); // Filter out falsy values (null, undefined, etc.)
  
    setProperty(propertyBuffer);
  }, [userData.property, listings]);
  

  const keyExtractor = ({ id }) => id.toString();

  const renderItem = ({ item }) => {
    if (!item) {
      // Handle the case where the item is undefined or falsy
      return null;
    }
  
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate('Update property', { formData: item })}
      >
        <CompressedProperty listing={item} />
      </TouchableOpacity>
    );
  };
  

  const renderListings = useMemo(() => {
    if (property.length === 0) {
      return <Text>Nothing to show here!</Text>;
    }
    return (
      <FlatList
        data={property}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    );
  }, [property]);

  return (
    <>
      <View style={styles.container}>
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            padding: 20,
            elevation: 2,
            backgroundColor: 'white',
            shadowColor: 'black',
            shadowOpacity: 0.3,
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 2,
            marginBottom: 30,
          }}
        >
          <TouchableOpacity activeOpacity={0.5}
            onPress={() => {
              // addProperty(listings[0])
              // console.log(userData)
              navigation.navigate('Add property')
            }}
          >
            <Text style={{ color: '#87ceeb' }}>Add property</Text>
          </TouchableOpacity>
        </View>
        <View>{renderListings}</View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});

export default function Myproperty() {
  const Stack = createNativeStackNavigator();
  return (
    <>
      <Stack.Navigator>
        <Stack.Screen
          name='See Property'
          component={SeeProperty}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Add property'
          component={PropertyForm}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Update property'
          component={UpdateProperty}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </>
  );
}
