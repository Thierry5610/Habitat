import React, { useState } from 'react';
import { View, Image, ScrollView, Dimensions, StyleSheet } from 'react-native';

const ImageSlider = ({ images, height = 200 }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = (event) => {
    const { contentOffset } = event.nativeEvent;
    const pageIndex = Math.round(contentOffset.x / windowWidth);
    setCurrentPage(pageIndex);
  };

  const windowWidth = Dimensions.get('window').width;

  return (
    <View style={[styles.container, { height: height }]}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={{ width: windowWidth, height: '100%' }}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <View style={styles.paginationContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentPage
                ? styles.paginationDotActive
                : styles.paginationDotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: '#87ceeb', // Blue color from the design
  },
  paginationDotInactive: {
    backgroundColor: 'lightgrey', // Light grey color for inactive state
  },
});

export default ImageSlider;
