import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function CompressedListing({listing}) {
  
    const renderFeatures = () => {
        if (listing?.type === 'House') {
          return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {listing?.features?.bedrooms && (
                <View style={styles.featureItem}>
                  <Icon name="bed" size={20} style={styles.featureIcon} color="grey" />
                  <Text style={styles.featureLabel}>
                    {listing?.features.bedrooms}
                  </Text>
                </View>
              )}
              {listing?.features?.kitchens && (
                <View style={styles.featureItem}>
                  <MaterialCommunityIcons
                    name="stove"
                    size={20}
                    style={styles.featureIcon}
                    color="grey"
                  />
                  <Text style={styles.featureLabel}>
                    {listing?.features.kitchens}
                  </Text>
                </View>
              )}
              {listing?.features?.bathrooms && (
                <View style={styles.featureItem}>
                  <MaterialCommunityIcons name="bathtub" size={20} style={styles.featureIcon} color="grey" />
                  <Text style={styles.featureLabel}>
                    {listing?.features.bathrooms}
                  </Text>
                </View>
              )}
              {listing?.features?.parkings && (
                <View style={styles.featureItem}>
                  <Icon name="car" size={20} style={styles.featureIcon} color="grey" />
                  <Text style={styles.featureLabel}>
                    {listing?.features.parkings}
                  </Text>
                </View>
              )}
            </ScrollView>
          );
        } else if (listing?.type === 'Land') {
          return (
            <ScrollView>
              {listing?.features?.size && (
                <View style={styles.featureItem}>
                  <Icon name="resize" size={20} style={styles.featureIcon} color="grey" />
                  <Text style={styles.featureLabel}>{listing?.features.size}</Text>
                </View>
              )}
            </ScrollView>
          );
        } else if (listing?.type === 'Hall') {
          return (
            <ScrollView>
              {listing?.features?.seats && (
                <View style={styles.featureItem}>
                  <Icon name="person" size={20} style={styles.featureIcon} color="grey" />
                  <Text style={styles.featureLabel}>
                    {listing?.features.seats}
                  </Text>
                </View>
              )}
            </ScrollView>
          );
        }
    
        return null;
      };


    return(
        <>
            <View
                style = {{
                    height: 150,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    margin: 10,
                    padding:10,
                    borderRadius:20,
                    backgroundColor: 'white',
                    shadowColor: '#000',
                    shadowOpacity: 0.3,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 2,
                    elevation: 2,
                }}
            >
                <Image source={listing?.headPhoto}
                    style={{
                        resizeMode: 'cover',
                        borderRadius: 10,
                        marginRight: 10,
                        height: '100%',
                        width: '40%',
                    }}
                />
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                <View>
                    <Text
                        style={{
                            fontSize: 16,
                            color: 'grey',
                            marginBottom: 10
                        }}
                    >
                        {listing?.location}
                    </Text>
                    <Text
                        style={{
                            fontSize: 30,
                            fontWeight: 'bold',
                            color: '#87ceeb',
                            marginBottom: 10
                        }}
                    >
                        {`$${listing?.cost.toLocaleString()}`}
                    </Text>
                    <View>
                        {renderFeatures()}
                    </View>
                </View>
            </ScrollView>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    featureItem:{
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10
        //justifyContent: 'space-between'
    },
    featureIcon: {
        marginRight: 2
    },
    featureLabel: {
        color: 'grey',
        fontSize: 12
    }
})