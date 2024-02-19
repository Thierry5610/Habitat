import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import useDataBase from './InitializeDB';
import { useUser } from './useUser';
import { manipulateAsync} from 'expo-image-manipulator';

const PropertyForm = () => {
  const [id, setId] = useState('');
  const [cost, setCost] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [type, setType] = useState('Home');
  const [features, setFeatures] = useState({});
  const [priceType, setPriceType] = useState('Sale');
  const [images, setImages] = useState([]);
  const [locationData, setLocationData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiKey = 'AIzaSyC7v4J15D5mBkoQAXKuWE8TpmqkeIXgA5k';
  const {addPropertyImage,addPropertyDB} = useDataBase()
  const {userData,addProperty} = useUser()

  const LoadLocation = async () => {
    try {
      // Generate a unique ID using v4()
      const uniqueId = uuidv4();
      setId(uniqueId);
  
      // Request both foreground and background location permissions
      const foregroundStatus = await Location.requestForegroundPermissionsAsync();
      const backgroundStatus = await Location.requestBackgroundPermissionsAsync();
  
      if (
        foregroundStatus.status === 'granted' ||
        backgroundStatus.status === 'granted'
      ) {
        // At least one of the permissions is granted
        const location = await Location.getCurrentPositionAsync();
        const { latitude, longitude } = location.coords;
  
        // Fetch the address using the Google Maps Geocoding API
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
        );
        const data = await response.json();
        const address = data.results[0].formatted_address;
  
        // Update the state with the fetched location and address
        setLocation(address);
        setLocationData({
          longitude,
          latitude,
          longitudeDelta: 0.01,
          latitudeDelta: 0.01,
          accuracy: location.coords.accuracy,
        });
      } else {
        // Both foreground and background permissions were denied
        alert('Permission to access location was denied');
      }
    } catch (error) {
      console.error('Error fetching current location:', error);
    }
  };
  useEffect(() => {
    LoadLocation();
  },[]);
  useFocusEffect(
    useCallback(() => {
        LoadLocation();
      // Clear features when the screen focuses
      setFeatures({});
      // Clear details when the screen focuses
      setDetails('');
      // Clear images when the screen focuses
      setImages([]);
      return () => {
        // Clear the form after leaving the screen
        setId('');
        setCost('');
        setLocation('');
        setTitle('');
        setDescription('');
        setLocationData({});
      };
    }, [])
  );

  const handleAddFeature = (key, value) => {
    setFeatures({ ...features, [key]: value });
  };

  const handleAddDetails = (text) => {
    setDetails(text);
  };

  const handleSelectImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1, // Set the quality to 1 initially to get the original image
        allowsMultipleSelection: true,
      });
  
      if (!result.canceled) {
        // Compress the images before uploading
        const compressedImages = await Promise.all(
          result.assets.map(async (asset) => {
            const compressedImage = await manipulateAsync(
              asset.uri,
              [{ resize: { width: 800 } }], // You can adjust the width to control the image size
              { compress: 0.7 } // Set the compress factor (0.1 - 1.0) to control the image quality
            );
            return compressedImage.uri;
          })
        );
  
        // Upload the compressed images
        const uploadPromises = compressedImages.map(async (uri, index) => {
          return await addPropertyImage(id, uri, index);
        });
  
        // Wait for all images to be uploaded and get their URLs
        Promise.all(uploadPromises)
          .then((imageUrls) => {
            setImages(imageUrls);
          })
          .catch((error) => {
            console.error('Error uploading images:', error);
          });
      }
    } catch (error) {
      console.error('Error selecting images:', error);
    }
  
    alert("Make sure all images you have selected are visible below before proceeding!");
  };
  
  const validateForm = () => {
    if (!cost || !location || !title || !description || images.length === 0) {
      Alert.alert('Error', 'Please fill out all required fields and select at least one image.');
      return false;
    }
    return true;
  };

  const handleSubmitForm = () => {
    // Submit the property data to your database or API here
    if (!validateForm()) {
        return;
      }
  
      // Set isSubmitting to true when the form is being submitted
      setIsSubmitting(true);

    const propertyData = {
      id,
      cost: parseFloat(cost),
      location,
      title,
      description,
      details: details.split(',').map((detail) => detail.trim()), // Split the details into an array
      type,
      features,
      priceType,
      images,
      dimensions:features.area,
      headPhoto:{uri:images[0]},
      forRent:priceType=='Rent'?true:false,
      locationData,
      owner:{
        name:userData.name,
        email:userData.email,
        telephone:userData.telephone
      }
    };
    console.log('Property Data:', propertyData);
    addPropertyDB(id,propertyData)
    addProperty(propertyData)
    // Clear the form after submitting
    setId('');
    setCost('');
    setLocation('');
    setTitle('');
    setDescription('');
    setDetails('');
    setType('Home');
    setFeatures({});
    setPriceType('Sale');
    setImages([]);
    setLocationData({});
    setIsSubmitting(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Property Form</Text>
      <TextInput
        style={styles.input}
        placeholder="Cost"
        value={cost}
        onChangeText={setCost}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Details:</Text>
        <View style={styles.detailsList}>
          {details.split(',').map((detail, index) => (
            <Text key={index} style={styles.detailsItem}>
              - {detail.trim()}
            </Text>
          ))}
        </View>
        <TextInput
          style={styles.detailsInput}
          placeholder="Add comma-separated Details"
          value={details}
          onChangeText={(text) => handleAddDetails(text)}
        />
      </View>
      <Text style={styles.label}>Type:</Text>
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'House' ? styles.activeTypeButton : null]}
          onPress={() => setType('House')}
        >
          <Text style={styles.typeButtonText}>House</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'Land' ? styles.activeTypeButton : null]}
          onPress={() => setType('Land')}
        >
          <Text style={styles.typeButtonText}>Land</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'Hall' ? styles.activeTypeButton : null]}
          onPress={() => setType('Hall')}
        >
          <Text style={styles.typeButtonText}>Hall</Text>
        </TouchableOpacity>
      </View>
      {type === 'House' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Number of Bedrooms"
            value={features.bedrooms?.toString() || ''}
            onChangeText={(text) => handleAddFeature('bedrooms', parseInt(text) || '')}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Number of Kitchens"
            value={features.kitchens?.toString() || ''}
            onChangeText={(text) => handleAddFeature('kitchens', parseInt(text) || '')}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Number of Bathrooms"
            value={features.bathrooms?.toString() || ''}
            onChangeText={(text) => handleAddFeature('bathrooms', parseInt(text) || '')}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Number of Parkings"
            value={features.parkings?.toString() || ''}
            onChangeText={(text) => handleAddFeature('parkings', parseInt(text) || '')}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Area (sqm)"
            value={features.area?.toString() || ''}
            onChangeText={(text) => handleAddFeature('area', parseFloat(text) || '')}
            keyboardType="numeric"
          />
        </>
      )}
      {type === 'Land' && (
        <TextInput
          style={styles.input}
          placeholder="Area (sqm)"
          value={features.area?.toString() || ''}
          onChangeText={(text) => handleAddFeature('area', parseFloat(text) || '')}
          keyboardType="numeric"
        />
      )}
      {type === 'Hall' && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Number of Seats"
            value={features.seats?.toString() || ''}
            onChangeText={(text) => handleAddFeature('seats', parseInt(text) || '')}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Area (sqm)"
            value={features.area?.toString() || ''}
            onChangeText={(text) => handleAddFeature('area', parseFloat(text) || '')}
            keyboardType="numeric"
          />
        </>
      )}
      <Text style={styles.label}>Price Type:</Text>
      <View style={styles.typeContainer}>
        <TouchableOpacity
          style={[styles.typeButton, priceType === 'Sale' ? styles.activeTypeButton : null]}
          onPress={() => setPriceType('Sale')}
        >
          <Text style={styles.typeButtonText}>For Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, priceType === 'Rent' ? styles.activeTypeButton : null]}
          onPress={() => setPriceType('Rent')}
        >
          <Text style={styles.typeButtonText}>For Rent</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.imagePickerButton} onPress={handleSelectImage}>
        <Text style={styles.imagePickerButtonText}>Select Images</Text>
      </TouchableOpacity>
      <View style={styles.imageListContainer}>
        {images.map((imageUri, index) => (
          <Image key={index} source={{ uri: imageUri }} style={styles.imagePreview} />
        ))}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmitForm}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      padding: 20,
      backgroundColor: '#f2f2f2',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      height: 40,
      borderColor: '#888888',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 20,
    },
    detailsContainer: {
      marginBottom: 10,
    },
    detailsTitle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    detailsList: {
      marginVertical: 5,
    },
    detailsItem: {
      fontSize: 14,
    },
    detailsInput: {
      height: 40,
      borderColor: '#888888',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginTop: 5,
      marginBottom: 15,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 5,
    },
    typeContainer: {
      flexDirection: 'row',
      marginBottom: 15,
    },
    typeButton: {
      flex: 1,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      marginRight: 10,
      backgroundColor: '#f2f2f2',
    },
    activeTypeButton: {
      backgroundColor: '#87ceeb',
    },
    typeButtonText: {
      fontSize: 16,
    },
    imagePickerButton: {
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      marginBottom: 10,
      backgroundColor: '#87ceeb',
    },
    imagePickerButtonText: {
      fontSize: 16,
      color: 'white',
    },
    imageListContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 10,
    },
    imagePreview: {
      width: 80,
      height: 80,
      marginHorizontal: 5,
      marginBottom: 5,
      borderRadius: 5,
    },
    submitButton: {
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      backgroundColor: '#000000',
    },
    submitButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: 'white',
    },
  });


export default PropertyForm;
