import React from 'react';
import { Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ImageSlider from './components/ImageSlider';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, { Marker,PROVIDER_GOOGLE } from 'react-native-maps';
import { useUser } from './useUser';

const PropertyDetail = ({
  route
}) => {
  const {isLiked,addLike,removeLike} = useUser()
  const {property} = route.params
  const {
    details,
    type,
    dimensions,
    location,
    locationData,
    owner,
    forRent,
    images,
    description,
    features,
    title,
    isTaken,
    cost,
  } = property;
  
  const handlePhoneCall = () => {
    const phoneNumber = owner?.telephone;
    if (phoneNumber) {
      const phoneUrl = `tel:${phoneNumber}`;
      Linking.openURL(phoneUrl);
    }
  };
  const handleEmail = () => {
    const email = owner?.email;
    if (email) {
      const emailUrl = `mailto:${email}`;
      Linking.openURL(emailUrl);
    }
  };
  const renderFeatures = () => {
    if (type === 'House') {
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {features?.bedrooms && (
            <View style={styles.featureItem}>
              <Icon name="bed" size={50} style={styles.featureIcon} color="#87ceeb" />
              <Text style={styles.featureLabel}>
                {features.bedrooms} {features.bedrooms > 1 ? 'Bedrooms' : 'Bedroom'}
              </Text>
            </View>
          )}
          {features?.kitchens && (
            <View style={styles.featureItem}>
              <MaterialCommunityIcons
                name="stove"
                size={50}
                style={styles.featureIcon}
                color="#87ceeb"
              />
              <Text style={styles.featureLabel}>
                {features.kitchens} {features.kitchens > 1 ? 'Kitchens' : 'Kitchen'}
              </Text>
            </View>
          )}
          {features?.bathrooms && (
            <View style={styles.featureItem}>
              <MaterialCommunityIcons name="bathtub" size={50} style={styles.featureIcon} color="#87ceeb" />
              <Text style={styles.featureLabel}>
                {features.bathrooms} {features.bathrooms > 1 ? 'Bathrooms' : 'Bathroom'}
              </Text>
            </View>
          )}
          {features?.parkings && (
            <View style={styles.featureItem}>
              <Icon name="car" size={50} style={styles.featureIcon} color="#87ceeb" />
              <Text style={styles.featureLabel}>
                {features.parkings} {features.parkings > 1 ? 'Parkings' : 'Parking'}
              </Text>
            </View>
          )}
        </ScrollView>
      );
    } else if (type === 'Land') {
      return (
        <ScrollView>
          {features?.size && (
            <View style={styles.featureItem}>
              <Icon name="resize" size={50} style={styles.featureIcon} color="#87ceeb" />
              <Text style={styles.featureLabel}>Size: {features.size}</Text>
            </View>
          )}
        </ScrollView>
      );
    } else if (type === 'Hall') {
      return (
        <ScrollView>
          {features?.seats && (
            <View style={styles.featureItem}>
              <Icon name="person" size={50} style={styles.featureIcon} color="#87ceeb" />
              <Text style={styles.featureLabel}>
                {features.seats} {features.seats > 1 ? 'Seats' : 'Seat'}
              </Text>
            </View>
          )}
        </ScrollView>
      );
    }

    return null;
  };
  const showStatus = () => {
    if(!isTaken) {
      return(<Text style={styles.status}>{forRent ? 'For Rent' : 'For Sale'}</Text>)
    } else {
      return(<Text style={[styles.status,{backgroundColor:'tomato'}]}>{'Taken'}</Text>)
    }
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageSlider images={images} height={300} />
        <View style={styles.contentContainer}>
          {showStatus()}
          <Text style={styles.title}>{title}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.detailsContainer}>
              <View style={styles.detailItem}>
                <Icon size={20} name="location-outline" style={styles.icon} />
                <Text style={styles.detailText}>{location}</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons size={20} name="floor-plan" style={styles.icon} />
                <Text style={styles.detailText}>{`${dimensions.toLocaleString()}m²`}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
        <TouchableOpacity activeOpacity={0.9} style={styles.heartContainer}
          onPress={()=>{
            if(isLiked(property)){removeLike(property)}else{addLike(property)}
          }}
        >
          {isLiked(property) ? (
            <Icon size={30} name="heart" style={styles.heartIcon} />
          ) : (
            <Icon size={30} name="heart-outline" style={styles.heartIcon} />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Price</Text>
        <View style={styles.priceDetails}>
          <Text style={styles.priceValue}>{`$${cost.toLocaleString()}`}</Text>
          {forRent && <Text style={styles.priceType}>Per Month</Text>}
        </View>
      </View>
      <View style={styles.featureContainer}>{renderFeatures()}</View>
      <View
        style={{
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 15,
          }}
        >
          Description
        </Text>
        <Text>{description}</Text>
      </View>
      <View style={styles.photoContainer}>
        <Text style={styles.photoTitle}>Photos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images?.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.image} />
          ))}
        </ScrollView>
      </View>
      <View
        style={{
          padding:20
        }}
      >
        <Text
          style={{fontSize:22,fontWeight:'bold',marginBottom:15}}
        >Property Details</Text>
        {details?.map((detail,index)=>(
          <View key={index}
            style={[{
              flexDirection: 'row',
              alignItems: 'center',
            },index!==details.length&&{marginBottom:15}]}
          >
            <Icon name='md-checkmark-circle-outline' size={24} style={{marginRight:10,color:'#87ceeb'}}/>
            <Text style={{fontSize:18,color:'grey'}}>{detail}</Text>
          </View>
        ))}
      </View>
      <View
        style={{
          padding: 20,
          backgroundColor: 'white',
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            marginBottom: 20,
            fontWeight: 'bold'
          }}
        >Location</Text>
        {locationData&&(
          <View style={{ height: 200, borderRadius: 10, overflow: 'hidden' }}>
            <MapView style={{ height:'100%' }} region={locationData} provider={PROVIDER_GOOGLE}>
              <Marker coordinate={locationData} />
            </MapView>
          </View>
      )}
      </View>
      <View
        style={{
          padding: 20,
          position: 'relative',

        }}
      >
        <Text
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 15
          }}
        >Contact</Text>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginBottom: 10,
            color:'#87ceeb'
          }}
        >{owner?.name}</Text>
        <View
          style={{
            position: 'absolute',
            right: 20,
            bottom: 20,
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            style={{
              marginHorizontal:10,
              padding:10,
              borderRadius:50,
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 2,
              elevation: 2,
            }}
            activeOpacity={0.8}
            onPress={handlePhoneCall}
          >
            <Icon name='call' size={30} style={{color:'#87ceeb'}}/>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              marginHorizontal:10,
              padding:10,
              borderRadius:50,
              backgroundColor: 'white',
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 2,
              elevation: 2,
            }}
            activeOpacity={0.8}
            onPress={handleEmail}
          >
            <Icon name='mail' size={30} style={{color:'#87ceeb'}}/>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  imageContainer: {
    height: 300,
    position: 'relative',
  },
  contentContainer: {
    position: 'absolute',
    left: 10,
    bottom: 50,
    alignItems: 'flex-start',
  },
  status: {
    backgroundColor: '#87ceeb',
    padding: 5,
    color: '#ffffff',
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#ffffff',
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailItem: {
    flexDirection: 'row',
    marginRight: 20,
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
    color: '#ffffff',
  },
  detailText: {
    color: '#ffffff',
  },
  heartContainer: {
    position: 'absolute',
    right: 20,
    bottom: -20,
    borderRadius: 50,
    padding: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 5,
  },
  heartIcon: {
    color: 'red',
  },
  priceContainer: {
    padding: 20,
  },
  priceLabel: {
    fontSize: 18,
    color: '#87ceeb',
    marginBottom: 10,
  },
  priceDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
  },
  priceValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginRight: 10,
  },
  priceType: {
    fontSize: 16,
    color: 'grey',
  },
  featureContainer: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 20,
  },
  featureItem: {
    marginRight: 20,
    alignItems: 'center',
  },
  featureIcon: {
    color: '#87ceeb',
  },
  featureLabel: {
    color: 'grey',
    textAlign: 'center',
  },
  photoContainer: {
    padding: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 2,
  },
  photoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginRight: 10,
    borderRadius: 10,
  },
});

export default PropertyDetail;
