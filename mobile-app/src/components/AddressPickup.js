import React, {Component} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const AddressPickup = ({
  placeholderText,
  fetchAddress, // Correct the prop name here
  displayValue,
}) => {
  const onPressAddress = (data,details) => {
      console.log("details===>>>", details)
      const lat=details.geometry.location.lat
      const lng=details.geometry.location.lng
      fetchAddress(lat, lng) // Use fetchAddress here

  }
  return (
      <View style={styles.container}>
          <GooglePlacesAutocomplete
              placeholder={placeholderText}
              onPress={onPressAddress}
              fetchDetails={true}
              query={{
                  key: 'AIzaSyAxudCbFrGwNtQ9JhYGLYFLK_TSTWVgsyk',
                  language: 'en',
              }}
              styles={{
                  textInputContainer: styles.containerStyle,
                  textInput: styles.textInputStyle
              }}
          />
      </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerStyle: {
    backgroundColor: 'white'
  },
  textInputStyle: {
    height: 48,
    color: 'black',
    fontSize: 16,
    backgroundColor: '#F3F3F3'
  }
  
});

export default AddressPickup;
