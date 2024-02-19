import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import useDataBase from "./InitializeDB";
import { manipulateAsync} from 'expo-image-manipulator';


export default function UpdateProfilePicture({ route, navigation }) {
    const { picture } = route.params;
    const { user } = route.params;
    const userID = user.id;
    const [imageURL, setImageURL] = useState('');
    const [image, setImage] = useState(picture);
    const [loading, setLoading] = useState(false);
    const { addProfileImage } = useDataBase();

    const handleUploadImage = async () => {
        setLoading(true);

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
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
            setImage(compressedImages[0]);
            let imageurl = await addProfileImage(userID, compressedImages[0]);
            setImageURL(imageurl);
        }

        setLoading(false);
    }

    const handleTakeImage = async () => {
        setLoading(true);

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
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
            setImage(compressedImages[0]);
            let imageurl = await addProfileImage(userID, compressedImages[0]);
            setImageURL(imageurl);
        }

        setLoading(false);
    }

    const handleSaveProfilePicture = () => {
        navigation.navigate('ProfileUpdate', { image: imageURL, user: user });
    }

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: image }}
                style={styles.image}
            />
            <View style={styles.SelectContainer}>
                <TouchableOpacity
                    style={styles.icons}
                    onPress={handleUploadImage}
                    disabled={loading}
                >
                    <Icon name="photo" size={40} color={"black"} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.icons}
                    onPress={handleTakeImage}
                    disabled={loading}
                >
                    <Icon name="camera" size={40} color={"black"} />
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity
                    style={[styles.submit, loading && styles.disabledButton]}
                    activeOpacity={0.6}
                    onPress={handleSaveProfilePicture}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#ffffff" />
                    ) : (
                        <Text style={styles.submitText}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "stretch",
        paddingHorizontal: 50,
        paddingVertical: 20
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: 'black',
        marginBottom: 30,
        alignSelf: 'center'
    },
    SelectContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 50
    },
    icons: {
        marginHorizontal: 30
    },
    submit: {
        backgroundColor: "black",
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10
    },
    disabledButton: {
        opacity: 0.6
    },
    submitText: {
        fontSize: 18,
        color: "white",
        textAlign: 'center'
    }
});
