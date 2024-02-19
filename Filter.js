import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { ScrollView } from "react-native";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';




export default function Filters({navigation, listings }) {
 
  const [filteredList,setFilteredList] = useState(listings)
  const [selectedFilter,setSelectedFilter] = useState({
    Type: 0,
    Price: [0,100000],
    Category: 0,
    Bedrooms: 0,
    Bathrooms: 0,
    Kitchens: 0,
    Parkings: 0,
    Size: [0,10000],
    Seats: [0,1000]
  })
  const resetFilters = () => {
    setSelectedFilter({
        Type: 0,
        Price: [0,100000],
        Category: 0,
        Bedrooms: 0,
        Bathrooms: 0,
        Kitchens: 0,
        Parkings: 0,
        Size: [0,10000],
        Seats: [0,1000]
      })
  }
  const handlePriceRangeChange = (values) => {
    setSelectedFilter({ ...selectedFilter, Price: values });
  };
  const handleSizeRangeChange = (values) => {
    setSelectedFilter({ ...selectedFilter, Size: values });
  };
  const handleSeatsRangeChange = (values) => {
    setSelectedFilter({ ...selectedFilter, Seats: values });
  };
  const selectedFilterHandler = (obj) => {
    if(obj.type=="Type"){
        setSelectedFilter({...selectedFilter,Type:obj.id})
    } else if(obj.type=="Category") {
        setSelectedFilter({...selectedFilter,Category:obj.id})
    }  else if(obj.type=="Bedrooms") {
        setSelectedFilter({...selectedFilter,Bedrooms:obj.id})
    }  else if(obj.type=="Bathrooms") {
        setSelectedFilter({...selectedFilter,Bathrooms:obj.id})
    }  else if(obj.type=="Kitchens") {
        setSelectedFilter({...selectedFilter,Kitchens:obj.id})
    }  else if(obj.type=="Parkings") {
        setSelectedFilter({...selectedFilter,Parkings:obj.id})
    }  
  }
  const filters = {
    Type:[
        {id:1,label:"Rent",type:"Type"},
        {id:2,label:"Sale",type:"Type"}
    ],
    Category:[
        {id:1,label:"House",type:"Category"},
        {id:2,label:"Hall",type:"Category"},
        {id:3,label:"Land",type:"Category"}
    ],
    Bedrooms:[
        {id:1,label:"Any",type:"Bedrooms"},
        {id:2,label:"1",type:"Bedrooms"},
        {id:3,label:"2",type:"Bedrooms"},
        {id:4,label:"3",type:"Bedrooms"},
        {id:5,label:"4+",type:"Bedrooms"},
    ],
    Bathrooms:[
        {id:1,label:"Any",type:"Bathrooms"},
        {id:2,label:"1",type:"Bathrooms"},
        {id:3,label:"2",type:"Bathrooms"},
        {id:4,label:"3",type:"Bathrooms"},
        {id:5,label:"4+",type:"Bathrooms"},
    ],
    Parkings:[
        {id:1,label:"Any",type:"Parkings"},
        {id:2,label:"1",type:"Parkings"},
        {id:3,label:"2",type:"Parkings"},
        {id:4,label:"3",type:"Parkings"},
        {id:5,label:"4+",type:"Parkings"},
    ],
    Kitchens:[
        {id:1,label:"Any",type:"Kitchens"},
        {id:2,label:"1",type:"Kitchens"},
        {id:3,label:"2",type:"Kitchens"},
        {id:4,label:"3",type:"Kitchens"},
        {id:5,label:"4+",type:"Kitchens"},
    ]
  }

  const applyFilters = () => {
    const filteredList = listings.filter((listing) => {
      // Apply Type filter
      if (selectedFilter.Type !== 0) {
        if(filters.Type[selectedFilter.Type-1].label=='Rent'&&(!listing.forRent)){return false;}
      }
  
      // Apply Category filter
      if (selectedFilter.Category !== 0 && listing.type !== filters.Category[selectedFilter.Category - 1].label) {
        return false;
      }
  
      // Apply Price filter
      if (listing.cost < selectedFilter.Price[0] || listing.cost > selectedFilter.Price[1]) {
        return false;
      }
  
      // Apply Size filter
      if (listing.dimensions < selectedFilter.Size[0] || listing.dimensions > selectedFilter.Size[1]) {
        return false;
      }
  
      // Apply Bedrooms filter
      if (selectedFilter.Bedrooms !== 0 && selectedFilter.Bedrooms !== 5 && listing.features.bedrooms != filters.Bedrooms[selectedFilter.Bedrooms - 1].label) {
        if(filters.Bedrooms[selectedFilter.Bedrooms - 1].label=='Any'){return true}
        return false;
      }
  
      if (selectedFilter.Bedrooms === 5 && listing.features.bedrooms < 4) {
        return false;
      }
  
      // Apply Bathrooms filter
      if (selectedFilter.Bathrooms !== 0 && selectedFilter.Bathrooms !== 5 && listing.features.bathrooms != filters.Bathrooms[selectedFilter.Bathrooms - 1].label) {
        if(filters.Bathrooms[selectedFilter.Bathrooms - 1].label=='Any'){return true}
        return false;
      }

      if (selectedFilter.Bathrooms === 5 && listing.features.bathrooms < 4) {
        return false;
      }
  
  
      // Apply Kitchens filter
      if (selectedFilter.Kitchens !== 0 && selectedFilter.Kitchens !== 5 && listing.features.kitchens != filters.Kitchens[selectedFilter.Kitchens - 1].label) {
        if(filters.Kitchens[selectedFilter.Kitchens - 1].label=='Any'){return true}
        return false;
      }

      if (selectedFilter.Kitchens === 5 && listing.features.kitchens < 4) {
        return false;
      }
  
      // Apply Parkings filter
      if (selectedFilter.Parkings !== 0 && selectedFilter.Parkings !== 5 && listing.features.parkings != filters.Parkings[selectedFilter.Parkings - 1].label) {
        if(filters.Parkings[selectedFilter.Parkings - 1].label=='Any'){return true}
        return false;
      }

      if (selectedFilter.Parkings === 5 && listing.features.parkings < 4) {
        return false;
      }
  
      // If all filters pass, include the listing in the filtered list
      return true;
    });
  
    return filteredList;
  };
  useEffect(() => {
    //setFilteredList(()=>applyFilters());
    const randoList = applyFilters();
    setFilteredList(randoList)
    // console.log(filteredList)
  }, [selectedFilter]);  

  return (
    <>
            <ScrollView>
                <View style={styles.ModalContainer}>
                    <View style={styles.modalCloseIcon}>
                        <TouchableOpacity
                            onPress={()=>navigation.navigate("List View",{filters:filteredList})}
                        >
                            <Icon name="close" size={30}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>resetFilters()}
                        >
                            <MaterialCommunityIcons name="restart" size={30}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.filterContainer}>
                        <Text style={styles.filterTitle}>Type</Text>
                        <View style={styles.filterOptionContainer}>
                            {filters.Type.map((type)=>(
                                <TouchableOpacity
                                    key={type.id}
                                    onPress={()=>{selectedFilterHandler(type);console.log(selectedFilter.Type)}}
                                    style={!(selectedFilter.Type===type.id)?styles.filterOption:styles.filterOptionActive}
                                >
                                    <Text style={!(selectedFilter.Type===type.id)?styles.filterOptionText:styles.filterOptionTextActive}>
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <View style={styles.filterContainer}>
                        <Text style={styles.filterTitle}>Category</Text>
                        <View style={styles.filterOptionContainer}>
                            {filters.Category.map((type)=>(
                                <TouchableOpacity
                                    key={type.id}
                                    onPress={()=>{selectedFilterHandler(type);console.log(selectedFilter.Category)}}
                                    style={!(selectedFilter.Category===type.id)?styles.filterOption:styles.filterOptionActive}
                                >
                                    <Text style={!(selectedFilter.Category===type.id)?styles.filterOptionText:styles.filterOptionTextActive}>
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <View style={styles.filterContainer}>
                        <Text style={styles.filterTitle}>Price</Text>
                        <View style={styles.sliderContainer}>
                            <MultiSlider
                            values={selectedFilter.Price}
                            min={0}
                            max={1000000}
                            step={500}
                            sliderLength={300}
                            onValuesChange={handlePriceRangeChange}
                            allowOverlap={false}
                            snapped
                            containerStyle={styles.slider}
                            trackStyle={styles.sliderTrack}
                            selectedStyle={styles.sliderSelected}
                            markerStyle={styles.sliderMarker}
                            />
                        </View>
                        <Text style={{alignSelf:'center',fontWeight:'bold'}}>
                            Range: {selectedFilter.Price[0]} - {selectedFilter.Price[1]}
                        </Text>
                    </View>
                    <View style={styles.filterContainer}>
                        <Text style={styles.filterTitle}>Size</Text>
                        <View style={styles.sliderContainer}>
                            <MultiSlider
                            values={selectedFilter.Size}
                            min={0}
                            max={10000}
                            step={100}
                            sliderLength={300}
                            onValuesChange={handleSizeRangeChange}
                            allowOverlap={false}
                            snapped
                            containerStyle={styles.slider}
                            trackStyle={styles.sliderTrack}
                            selectedStyle={styles.sliderSelected}
                            markerStyle={styles.sliderMarker}
                            />
                        </View>
                        <Text style={{alignSelf:'center',fontWeight:'bold'}}>
                            Range: {selectedFilter.Size[0]} - {selectedFilter.Size[1]}
                        </Text>
                    </View>
                    {selectedFilter.Category===1&&(
                        <>
                            <View style={styles.filterContainer}>
                                <Text style={styles.filterTitle}>Bedrooms</Text>
                                <View style={styles.filterOptionContainer}>
                                    {filters.Bedrooms.map((type)=>(
                                        <TouchableOpacity
                                            key={type.id}
                                            onPress={()=>{selectedFilterHandler(type);console.log(selectedFilter.Bedrooms)}}
                                            style={!(selectedFilter.Bedrooms===type.id)?[styles.filterOption,{flex:1}]:[styles.filterOptionActive,{flex:1}]}
                                        >
                                            <Text style={!(selectedFilter.Bedrooms===type.id)?styles.filterOptionText:styles.filterOptionTextActive}>
                                                {type.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View style={styles.filterContainer}>
                                <Text style={styles.filterTitle}>Bathrooms</Text>
                                <View style={styles.filterOptionContainer}>
                                    {filters.Bathrooms.map((type)=>(
                                        <TouchableOpacity
                                            key={type.id}
                                            onPress={()=>{selectedFilterHandler(type);console.log(selectedFilter.Bathrooms)}}
                                            style={!(selectedFilter.Bathrooms===type.id)?[styles.filterOption,{flex:1}]:[styles.filterOptionActive,{flex:1}]}
                                        >
                                            <Text style={!(selectedFilter.Bathrooms===type.id)?styles.filterOptionText:styles.filterOptionTextActive}>
                                                {type.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View style={styles.filterContainer}>
                                <Text style={styles.filterTitle}>Kitchens</Text>
                                <View style={styles.filterOptionContainer}>
                                    {filters.Kitchens.map((type)=>(
                                        <TouchableOpacity
                                            key={type.id}
                                            onPress={()=>{selectedFilterHandler(type);console.log(selectedFilter.Kitchens)}}
                                            style={!(selectedFilter.Kitchens===type.id)?[styles.filterOption,{flex:1}]:[styles.filterOptionActive,{flex:1}]}
                                        >
                                            <Text style={!(selectedFilter.Kitchens===type.id)?styles.filterOptionText:styles.filterOptionTextActive}>
                                                {type.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                            <View style={styles.filterContainer}>
                                <Text style={styles.filterTitle}>Parkings</Text>
                                <View style={styles.filterOptionContainer}>
                                    {filters.Parkings.map((type)=>(
                                        <TouchableOpacity
                                            key={type.id}
                                            onPress={()=>{selectedFilterHandler(type);console.log(selectedFilter.Parkings)}}
                                            style={!(selectedFilter.Parkings===type.id)?[styles.filterOption,{flex:1}]:[styles.filterOptionActive,{flex:1}]}
                                        >
                                            <Text style={!(selectedFilter.Parkings===type.id)?styles.filterOptionText:styles.filterOptionTextActive}>
                                                {type.label}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>
                        </>
                    )}
                    {selectedFilter.Category===2&&(
                        <View style={styles.filterContainer}>
                            <Text style={styles.filterTitle}>Seats</Text>
                            <View style={styles.sliderContainer}>
                                <MultiSlider
                                values={selectedFilter.Seats}
                                min={0}
                                max={10000}
                                step={10}
                                sliderLength={300}
                                onValuesChange={handleSeatsRangeChange}
                                allowOverlap={false}
                                snapped
                                containerStyle={styles.slider}
                                trackStyle={styles.sliderTrack}
                                selectedStyle={styles.sliderSelected}
                                markerStyle={styles.sliderMarker}
                                />
                            </View>
                            <Text style={{alignSelf:'center',fontWeight:'bold'}}>
                                Range: {selectedFilter.Seats[0]} - {selectedFilter.Seats[1]}
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
    ModalContainer: {
        padding: 30,
        position: 'relative',
    },
    modalCloseIcon:{
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        marginBottom: 10
    },
    filterTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20
    },
    filterContainer: {
        marginBottom: 20,
    },
    filterOptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        //justifyContent: "space-evenly"
    },
    filterOption: {
        fontSize: 16,
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'grey',
        alignItems:'center'
    },
    filterOptionActive: {
        backgroundColor: '#87ceef',
        borderColor: '#87ceef',
        fontSize: 16,
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
        borderWidth: 1,
        //alignItems:'center'
    },
    filterOptionText: {
       color:"grey" 
    },
    filterOptionTextActive: {
        color: "white"
    },
    sliderContainer: {
        alignItems: 'center',
        marginBottom: 10,
    },
    slider: {
        height: 40,
    },
    sliderTrack: {
        height: 2,
        backgroundColor: 'lightgray',
    },
    sliderSelected: {
        backgroundColor: '#87ceef',
    },
    sliderMarker: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#87ceef',
    },
    
})