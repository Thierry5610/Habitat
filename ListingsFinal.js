import React, { useState, useMemo } from "react";
import { FlatList, StyleSheet, TextInput, View, Text, TouchableOpacity } from "react-native";
import Listing from "./components/Listing";
import Icon from 'react-native-vector-icons/Ionicons';

export default function Listings({ route,navigation}) {

  const {filters} = route.params;
  const listings = filters;
  const [searchText, setSearchText] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("location");
  const [filteredData, setFilteredData] = useState(listings);

  const keyExtractor = ({ id }) => id.toString();

  const filterListings = (text, criteria) => {
    const filteredListings = listings.filter((listing) =>
      listing[criteria].toString().toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredListings);
  };

  const renderItem = ({ item }) => (<TouchableOpacity activeOpacity={1} onPress={()=>navigation.navigate("Details",{property:item})}><Listing {...item} /></TouchableOpacity>);

  const handleSearchTextChange = (text) => {
    setSearchText(text);
    filterListings(text, searchCriteria);
  };
  const handleSearchCriteriaChange = () => {
    const newSearchCriteria = searchCriteria === "location" ? "cost" : "location";
    setSearchCriteria(newSearchCriteria);
    //filterListings(searchText, newSearchCriteria);
  };


  const renderListings = useMemo(() => {
    if (searchText !== "" && filteredData.length === 0) {
      return (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>No results found</Text>
        </View>
      );
    }

    const dataToRender = searchText !== "" ? filteredData : listings;

    return (
      <FlatList
        data={dataToRender}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    );
  }, [searchText, filteredData]);



  const propertyCount = filteredData.length;

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search..."
          placeholderTextColor="#888888"
          value={searchText}
          onChangeText={handleSearchTextChange}
        />
        <TouchableOpacity
          style={styles.searchCriteriaButton}
          onPress={handleSearchCriteriaChange}
        >
          <Text style={styles.searchCriteriaText}>{searchCriteria}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mapIconContainer}
          onPress={() => {
            navigation.navigate('Map View',{searches:filteredData})
          }}
        >
          <Icon
            name="map"
            size={24}
            color="#87ceeb"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mapIconContainer}
          onPress={() => {
            navigation.navigate("Filters")
          }}
        >
          <Icon
            name="options-outline"
            size={24}
            color="#87ceeb"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.propertyCountContainer}>
        <Text style={styles.propertyCountText}>Total Properties: {propertyCount}</Text>
      </View>
      {renderListings}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  searchContainer: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2,
  },
  searchBar: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#ffffff",
    marginRight: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dddddd",
    color: "#333333",
  },
  searchCriteriaButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    marginRight: 6,
  },
  searchCriteriaText: {
    fontSize: 14,
    color: "#333333",
  },
  mapIconContainer: {
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: "#888888",
  },
  propertyCountContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  propertyCountText: {
    fontSize: 14,
    color: "#666666",
  },
});
