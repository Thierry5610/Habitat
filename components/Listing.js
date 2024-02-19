import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useUser } from "../useUser";



export default function Listing({
    id,
    type,
    dimensions,
    location,
    forRent,
    favorite,
    features,
    title,
    headPhoto,
    cost,
}) {

    const property = {id,type,dimensions,location,forRent,favorite,features,title,headPhoto,cost}
    const {isLiked,addLike,removeLike} = useUser()

    const renderFeatures = () => {
        if (type === 'House') {
          return (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {features?.bedrooms && (
                <View style={styles.featureItem}>
                  <Icon name="bed" size={20} style={styles.featureIcon} color="#87ceeb" />
                  <Text style={styles.featureLabel}>
                    {features.bedrooms} {features.bedrooms > 1 ? 'Bedrooms' : 'Bedroom'}
                  </Text>
                </View>
              )}
              {features?.kitchens && (
                <View style={styles.featureItem}>
                  <MaterialCommunityIcons
                    name="stove"
                    size={20}
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
                  <MaterialCommunityIcons name="bathtub" size={20} style={styles.featureIcon} color="#87ceeb" />
                  <Text style={styles.featureLabel}>
                    {features.bathrooms} {features.bathrooms > 1 ? 'Bathrooms' : 'Bathroom'}
                  </Text>
                </View>
              )}
              {features?.parkings && (
                <View style={styles.featureItem}>
                  <Icon name="car" size={20} style={styles.featureIcon} color="#87ceeb" />
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
                  <Icon name="resize" size={20} style={styles.featureIcon} color="#87ceeb" />
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
                  <Icon name="person" size={20} style={styles.featureIcon} color="#87ceeb" />
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

    return(
        <>
            <View
                style={{
                    backgroundColor:'white',
                    borderRadius:20,
                    overflow:'hidden',
                    marginHorizontal:20,
                    marginVertical:20,
                    shadowColor:'#000',
                    shadowOffset: {width:0,height:2},
                    shadowOpacity:0.3,
                    shadowRadius:2,
                    backgroundColor:'white',
                    elevation:2,

                }}
            >
                <View
                    style={{
                        height: 175,
                        position:'relative'
                    }}
                >
                    <Image source={headPhoto}
                        style={{
                            height:'100%',
                            resizeMode:'cover',
                        }}
                    />
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={{
                            padding:10,
                            borderRadius:100,
                            shadowColor:'#000',
                            shadowOffset: {width:0,height:2},
                            shadowOpacity:0.3,
                            shadowRadius:2,
                            backgroundColor:'white',
                            elevation:2,
                            position: 'absolute',
                            right: 10,
                            bottom: -25
                        }}
                        onPress={()=>{
                          if(isLiked(property)){removeLike(property)}else{addLike(property)}
                        }}
                    >
                        {isLiked(property)?<Icon name="heart" size={30} style={{color:'red'}}/>:<Icon name="heart-outline" size={30} style={{color:'red'}}/>}
                    </TouchableOpacity>
                </View>
                <View
                    style={{
                        padding:20,
                    }}
                >
                    <View
                        style={{
                            borderBottomColor:'grey',
                            borderBottomWidth:1
                        }}
                    >
                        <View
                          style = {{
                            flexDirection: 'row',
                            alignItems: 'baseline'
                          }}
                        >
                        <Text
                            style={{
                                fontSize:24,
                                fontWeight:'bold',
                                marginBottom:10,
                                marginRight:5
                            }}
                        >{`$${cost.toLocaleString()}`}</Text>
                        {forRent && <Text style={{fontSize: 14,color: 'grey',}}>Monthly</Text>}
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom:15,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        marginRight:10
                                    }}
                                >
                                    <Icon name="location-outline" size={20} style={{marginRight:5,color:'grey'}}/>
                                    <Text style={{color:'grey'}}>{location}</Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                    }}
                                >
                                    <MaterialCommunityIcons name="floor-plan" size={20} style={{marginRight:5,color:'grey'}}/>
                                    <Text style={{color:'grey'}}>{`${dimensions.toLocaleString()}m²`}</Text>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                    <View style={styles.featureContainer}>{renderFeatures()}</View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    featureContainer: {
        paddingVertical: 10,
      },
      featureItem: {
        marginRight: 20,
        alignItems: 'center',
        flexDirection:'row'
      },
      featureIcon: {
        color: '#87ceeb',
        marginRight:5
      },
      featureLabel: {
        color: '#87ceeb',
        textAlign: 'center',
      },
})