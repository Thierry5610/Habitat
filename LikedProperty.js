import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useUser } from "./useUser";
import Listing from "./components/Listing";
import { fetchListings } from "./listingData";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PropertyDetail from "./PropertyDetail";

function LikedProperty({navigation}) {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    // Fetch the data and update the state when the component mounts
    const getListings = async () => {
      const data = await fetchListings();
      setListings(data);
    };

    getListings();
  }, []);
  const { userData } = useUser();
  const dataToRender = listings.filter((property) =>
    userData?.liked.includes(property.id)
  );

  const keyExtractor = ({ id }) => id.toString();
  const renderItem = ({ item }) => <TouchableOpacity activeOpacity={1} onPress={()=>(navigation.navigate("DetailsLiked",{property:item}))}><Listing {...item} /></TouchableOpacity>;

  const renderEmptyList = () => (
    <View style={styles.emptyListContainer}>
      <Text style={styles.emptyListText}>No liked properties</Text>
      <TouchableOpacity style={styles.findPropertyButton} onPress={()=>(navigation.navigate("Listings"))}>
        <Text style={styles.findPropertyButtonText}>Find Property</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {dataToRender.length === 0 ? (
        renderEmptyList()
      ) : (
        <FlatList
          data={dataToRender}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyListText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  findPropertyButton: {
    backgroundColor: "#87ceeb",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  findPropertyButtonText: {
    fontSize: 16,
    color: "#fff",
  },
});

export default function Favorites() {
  const Stack = createNativeStackNavigator()
  return(
    <>
      <Stack.Navigator
        initialRouteName="FavoritesScreen"
      >
        <Stack.Screen
          name="FavoritesScreen"
          component={LikedProperty}
          options={{headerShown:false}}
        />
        <Stack.Screen
          name="DetailsLiked"
          component={PropertyDetail}
          options={{headerShown:false}}
        />
      </Stack.Navigator>
    </>
  )
}
