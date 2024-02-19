import React, { useRef, useEffect, useState } from "react";
import { View } from "react-native";
import MapView, { Marker,PROVIDER_GOOGLE } from "react-native-maps";
import CompressedListing from "./CompressedListing";
import { TouchableOpacity } from "react-native";

const MapViewComponent = ({ route,navigation}) => {
  const mapRef = useRef(null);
  const [clickedMarker, setClickedMarker] = useState(null);
  const {searches} = route.params
  const listings = searches

  useEffect(() => {
    if (listings.length > 0) {
      const coordinates = listings.map((listing) => ({
        latitude: listing.locationData.latitude,
        longitude: listing.locationData.longitude,
      }));

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [listings]);

  useEffect(()=>{
    alert("Zoom out to see more points!")
  },[])

  const handleMarkerPress = (listing) => {
    setClickedMarker(listing);
  };

  return (
    <View style={{ flex: 1, position:'relative' }}>
      <MapView
        provider={PROVIDER_GOOGLE}
        showsPointsOfInterest={false}
        ref={mapRef}
        style={{ flex: 1 }}
        initialRegion={{
          latitude: listings[0]?.locationData.latitude || 0,
          longitude: listings[0]?.locationData.longitude || 0,
          latitudeDelta: listings[0]?.locationData.latitudeDelta || 20,
          longitudeDelta: listings[0]?.locationData.longitudeDelta || 20,
        }}
      >
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            onPress={() => handleMarkerPress(listing)}
            title={listing.title}
            coordinate={{
              latitude: listing.locationData.latitude,
              longitude: listing.locationData.longitude,
            }}
          />
        ))}
      </MapView>
      <View
        style={{
            position: 'absolute',
            bottom: 10,
            alignSelf: 'center',
            maxWidth: '99%'
        }}
      >
        {clickedMarker && (<TouchableOpacity activeOpacity={1} onPress={()=>navigation.navigate("Details",{property:clickedMarker})}><CompressedListing listing={clickedMarker} /></TouchableOpacity>)}
      </View>
    </View>
  );
};

export default MapViewComponent;
