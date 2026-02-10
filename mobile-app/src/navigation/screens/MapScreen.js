  import React, { useState, useEffect, useRef, useCallback } from 'react';
  import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    Image,
    Linking
  } from 'react-native';
  import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
  import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
  import * as Location from 'expo-location';
  import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
  import MapViewDirections from 'react-native-maps-directions';
  import { Ionicons } from '@expo/vector-icons';
  import { FontAwesome5, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
  import { Accelerometer } from 'expo-sensors';
  import { Alert } from 'react-native';
  import AsyncStorage from '@react-native-async-storage/async-storage';


  const GOOGLE_API_KEY = '';

  const MapScreen = ({ navigation }) => {
    const [dropCoords, setDropCoords] = useState(null);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [transitInfo, setTransitInfo] = useState(null);
    const [selectedMode, setSelectedMode] = useState('walking');
    const [busDetails, setBusDetails] = useState([]);
    const [region, setRegion] = useState({
      latitude: 0,
      longitude: 0,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    const mapRef = useRef(null);
    const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
    const [isLiveInfoBottomSheetVisible, setIsLiveInfoBottomSheetVisible] = useState(false);
    const [placeDetails, setPlaceDetails] = useState(null);
    const directionsBottomSheetRef = useRef(null);
    const [bottomSheetIndex, setBottomSheetIndex] = useState(-1);
    const [showModeButtons, setShowModeButtons] = useState(false);
    const [isDirectionsPanelVisible, setIsDirectionsPanelVisible] = useState(false);
    const liveInfoBottomSheetRef = useRef(null);
    const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
    const [subscription, setSubscription] = useState(null);
    const [userId, setUserId] = useState(null);
    useEffect(() => {
      AsyncStorage.getItem('userId').then((id) => {
        if (id) {
          console.log('Retrieved User ID:', id);
          setUserId(id);
        } else {
          console.log('User ID not found in AsyncStorage');
        }
      }).catch((error) => {
        console.error('Error retrieving user ID:', error);
      });
    }, []);

    const saveSearch = async (searchTerm) => {
      try {
        const currentSearchesString = await AsyncStorage.getItem('recentSearches');
        const currentSearches = currentSearchesString ? JSON.parse(currentSearchesString) : [];
        const updatedSearches = [searchTerm, ...currentSearches];
        await AsyncStorage.setItem('recentSearches', JSON.stringify(updatedSearches.slice(0, 3)));
      } catch (error) {
        console.error('Error saving search:', error);
      }
    };

    const [cars, setCars] = useState([
      {
        id: 1,
        currentLocation: { latitude: 25.3097, longitude: 55.4626},
        timeToUser: '3 mins', 
        heading: 20
      },
      {
        id: 2,
        currentLocation: { latitude: 25.3089, longitude: 55.45701 },
        timeToUser: '1 mins', 
        heading: 90,
      }
    ]);
    
    const [features, setFeatures] = useState({
      meanAcc: 0,
      stdDev: 0,
      xJerk: 0,
      yJerk: 0,
      zJerk: 0,
      medianAcc: 0,
      variance: 0,
      skewness: 0,
  });

  let dataBuffer = [];
  const bufferInterval = 5; 
  let bufferStartTime = Date.now();

  const calculateFeatures = (accData) => {
    const meanAcc = (accData.x + accData.y + accData.z) / 3;
    const stdDev = Math.sqrt(
        [(accData.x - meanAcc) ** 2, (accData.y - meanAcc) ** 2, (accData.z - meanAcc) ** 2].reduce((a, b) => a + b, 0) / 3
    );
    const xJerk = accData.x - meanAcc;
    const yJerk = accData.y - meanAcc;
    const zJerk = accData.z - meanAcc;
    const sortedAcc = [accData.x, accData.y, accData.z].sort((a, b) => a - b);
    const medianAcc = sortedAcc[1];
    const variance = stdDev ** 2;
    const skewness = ((accData.x - meanAcc) ** 3 + (accData.y - meanAcc) ** 3 + (accData.z - meanAcc) ** 3) / (3 * stdDev ** 3);

    setFeatures({
        meanAcc,
        stdDev,
        xJerk,
        yJerk,
        zJerk,
        medianAcc,
        variance,
        skewness,
    });

   
    dataBuffer.push({
        meanAcc,
        stdDev,
        xJerk,
        yJerk,
        zJerk,
        medianAcc,
        variance,
        skewness,
        x: accData.x,
        y: accData.y,
        z: accData.z
    });

    if (Date.now() - bufferStartTime > bufferInterval * 1000) {
        const averageData = calculateAverage(dataBuffer);
        sendDataToModel(averageData);
        dataBuffer = [];
        bufferStartTime = Date.now();
    }
};


  const calculateAverage = (data) => {
    const sumData = data.reduce((acc, current) => {
        return {
            x: acc.x + current.x,
            y: acc.y + current.y,
            z: acc.z + current.z,
            meanAcc: acc.meanAcc + current.meanAcc,
            stdDev: acc.stdDev + current.stdDev,
            xJerk: acc.xJerk + current.xJerk,
            yJerk: acc.yJerk + current.yJerk,
            zJerk: acc.zJerk + current.zJerk,
            medianAcc: acc.medianAcc + current.medianAcc,
            variance: acc.variance + current.variance,
            skewness: acc.skewness + current.skewness,
        };
    }, {
        x: 0,
        y: 0,
        z: 0,
        meanAcc: 0,
        stdDev: 0,
        xJerk: 0,
        yJerk: 0,
        zJerk: 0,
        medianAcc: 0,
        variance: 0,
        skewness: 0,
    });

    const averageData = [
        sumData.x / data.length,
        sumData.y / data.length,
        sumData.z / data.length,
        sumData.meanAcc / data.length,
        sumData.stdDev / data.length,
        sumData.xJerk / data.length,
        sumData.yJerk / data.length,
        sumData.zJerk / data.length,
        sumData.medianAcc / data.length,
        sumData.variance / data.length,
        sumData.skewness / data.length
    ];

    return averageData;
  };

  const _subscribe = () => {
    Accelerometer.setUpdateInterval(1000); 
    setSubscription(
        Accelerometer.addListener((accData) => {
            setAccelerometerData(accData);
            calculateFeatures(accData);
        })
    );
  };

  const resetMap = () => {

    stopAccelerometer();
    dataBuffer = [];
    setAccelerometerData({ x: 0, y: 0, z: 0 });
    setFeatures({
      meanAcc: 0,
      stdDev: 0,
      xJerk: 0,
      yJerk: 0,
      zJerk: 0,
      medianAcc: 0,
      variance: 0,
      skewness: 0,
    });
    setDropCoords(null);
    setTransitInfo(null);
    setSelectedMode('walking');
    setBusDetails([]);
    setPlaceDetails(null);
    setIsBottomSheetVisible(false);
    setShowModeButtons(false);
    setIsDirectionsPanelVisible(false);
    setBottomSheetIndex(-1);
    searchBarRef.current?.setAddressText(''); 

    
    goToCurrentLocation();

    
    setIsLiveInfoBottomSheetVisible(false);

  };




  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const startAccelerometer = () => {
    _subscribe();
  };

  const stopAccelerometer = () => {
    _unsubscribe();

  };

  useEffect(() => {
    return () => _unsubscribe(); 
  }, []);


  const sendDataToModel = async (averageData) => {
    if (!userId) {
      console.error('No userId provided');
      return;
    }
    try {
        const response = await fetch('http://192.168.1.67:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: averageData,  user_id: userId, }),
        });

        const result = await response.json();
        console.log('Predicted mode of transport:', result.prediction);
    } catch (error) {
        console.error('Error sending data to model:', error);
    }
  };

    React.useLayoutEffect(() => {
      navigation.setOptions({
        headerShown: false, 
      });
    }, [navigation]);

    const bottomSheetRef = useRef(null);

    const [liveDistance, setLiveDistance] = useState(null);
    const [liveDuration, setLiveDuration] = useState(null);

    const handleSheetChanges = useCallback((index) => {
      console.log('handleSheetChanges', index);
    }, []);

    const getLastKnownLocation = async () => {
      let location = await Location.getLastKnownPositionAsync({});
      if (location) {
        const currentLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };
        setCurrentLocation(currentLocation);
        setRegion({
          ...region,
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        });
      }
    };
    


    useEffect(() => {
      getLastKnownLocation();
    }, []);

    const handleLocationSelect = (placeId) => {
      const fetchDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`;
    
      fetch(fetchDetailsUrl)
        .then((response) => response.json())
        .then((result) => {
          const location = result.result.geometry.location;
          setDropCoords({
            latitude: location.lat,
            longitude: location.lng,
          });
          setPlaceDetails(result.result); 
          setBottomSheetIndex(0); 
          saveSearch(result.result.name); 
          mapRef.current.animateToRegion({
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: 0.005, 
            longitudeDelta: 0.005, 
          }, 1000); 
        })
        .catch((error) => {
          console.error('Error fetching details:', error);
        });
    };

    
    const handleShowDirections = () => {
      setIsBottomSheetVisible(true); 
      setShowModeButtons(true);
      setBottomSheetIndex(-1); 
    };

    const closeDirectionsPanel = () => {
      setIsBottomSheetVisible(false);
      setShowModeButtons(false);
      liveInfoBottomSheetRef.current?.snapToIndex(-1);
    };

    let interval;

  const hailCar = (car) => {
    console.log("Hailing car:", car.id);
    closeDirectionsPanel();
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      const moveFactor = 0.05;
      setCars(prevCars => prevCars.map(c => {
        if (c.id === car.id) {
          const latDistance = currentLocation.latitude - c.currentLocation.latitude;
          const lngDistance = currentLocation.longitude - c.currentLocation.longitude;
          let newLatitude = c.currentLocation.latitude + latDistance * moveFactor;
          let newLongitude = c.currentLocation.longitude + lngDistance * moveFactor;  
          if (Math.abs(latDistance) < 0.0001 && Math.abs(lngDistance) < 0.0001) {
            clearInterval(interval);
            interval = null;
            Alert.alert("Your ride has arrived"); 
            return { ...c, currentLocation: { latitude: currentLocation.latitude, longitude: currentLocation.longitude } }; 
          }
  
          return { ...c, currentLocation: { latitude: newLatitude, longitude: newLongitude } };
        }
        return c;
      }));
    }, 1000); 
  };

    const placeTypeMapping = {
      shopping_mall: 'Mall',
      gas_station: 'Station',
    };

    const renderPlaceDetails = () => {
      if (!placeDetails) return null;

      const renderStars = (rating) => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
          stars += i <= rating ? '★' : '☆';
        }
        return stars;
      };

      const placeType = placeDetails.types
      ? placeTypeMapping[placeDetails.types[0]] || placeDetails.types[0]
      : null;
      const reviews = placeDetails.reviews
        ? placeDetails.reviews.map((review, index) => (
            <View key={index} style={styles.reviewContainer}>
              <Text style={styles.reviewAuthor}>{review.author_name}</Text>
              <Text style={styles.reviewText}>{review.text}</Text>
            </View>
          ))
        : null;

      const photos = placeDetails.photos?.map((photo) => {
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${GOOGLE_API_KEY}`;
      });

      return (
        <View style={styles.bottomSheetContent}>
          <View style={styles.placeHeader}>
            <TouchableOpacity style={styles.directionsButton} onPress={handleShowDirections}>
              <Ionicons name="compass" size={30} color="blue" style={styles.directionsIcon} />
              <Text style={styles.directionsButtonText}>Directions</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.placeName}>{placeDetails.name}</Text>
          {placeType && <Text style={styles.placeDetailText}>Type: {placeType}</Text>}
          <Text style={styles.placeDetailText}>Rating: </Text>
          <Text style={styles.placeDetailText}>Status: {placeDetails.opening_hours?.open_now ? 'Open Now' : 'Closed'}</Text>
          <Text style={styles.placeRating}>
          {renderStars(placeDetails.rating)} 
        </Text>
        <Text style={styles.placeRating2}>
          ({placeDetails.rating})
        </Text>
        
          {photos && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosContainer}>
              {photos.map((photoUrl, index) => (
                <Image key={index} source={{ uri: photoUrl }} style={styles.placePhoto} />
              ))}
            </ScrollView>
          )}
        {placeDetails.website && (
    <TouchableOpacity onPress={() => Linking.openURL(placeDetails.website)}>
      <Text style={styles.placeWebsite}>Visit Website</Text>
    </TouchableOpacity>
  )}
        
        </View>
      );
    };

    const searchBarRef = useRef(null);

    const onGoPress = () => {
      closeDirectionsPanel();
      goToCurrentLocation();
      setIsLiveInfoBottomSheetVisible(true);
      startAccelerometer();
    };

    const goToCurrentLocation = () => {
      directionsBottomSheetRef.current?.close();
      bottomSheetRef.current?.close();
      if (currentLocation) {
        mapRef.current.animateToRegion({
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 1000); 
      }
    };

    const fetchTransitInfo = () => {
      if (!currentLocation || !dropCoords) return;

      const origin = `${currentLocation.latitude},${currentLocation.longitude}`;
      const destination = `${dropCoords.latitude},${dropCoords.longitude}`;
      const mode = selectedMode === 'walking' ? 'walking' : selectedMode === 'bus' ? 'transit' : 'bicycling';

      const apiUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${GOOGLE_API_KEY}`;

      fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          if (data.routes && data.routes.length > 0 && data.routes[0].legs && data.routes[0].legs.length > 0) {
            setTransitInfo(data.routes[0].legs[0]);
            if (mode === 'transit') {
              const steps = data.routes[0].legs[0].steps.filter(step => step.travel_mode === "TRANSIT" && step.transit_details.line.vehicle.type === "BUS");
              setBusDetails(steps.map(step => ({
                departureStop: step.transit_details.departure_stop.name,
                arrivalStop: step.transit_details.arrival_stop.name,
                departureTime: step.transit_details.departure_time.text,
                arrivalTime: step.transit_details.arrival_time.text,
                numberOfStops: step.transit_details.num_stops,
                busNumber: step.transit_details.line.short_name,
                busName: step.transit_details.line.name
              })));
            } else {
              setBusDetails([]);
            }
            if (selectedMode === 'cycling') {
              const reducedTime = parseFloat(leg.duration.value) * (2 / 3); 
              leg.duration.text = `${Math.ceil(reducedTime / 60)} mins`; 
            }
          }
        })
    };

    useEffect(() => {
      fetchTransitInfo();
    }, [currentLocation, dropCoords, selectedMode]);

    const handleModeChange = (mode) => {
      setSelectedMode(mode);
      setIsBottomSheetVisible(true); 
      if (currentLocation && dropCoords) {
        mapRef.current.fitToCoordinates([currentLocation, dropCoords], {
          edgePadding: { top: 180, right: 120, bottom: 330, left: 120 }, 
          animated: true,
        });
      }
    };
    const renderTransitInfo = () => {
      if (!transitInfo) return null;
      const noBusTransitInfoAvailable = selectedMode === 'bus' && (!busDetails || busDetails.length === 0);
      return (
        <View style={styles.bottomSheetContainer}>
          <View style={styles.modeSelectionContainer}>
          <TouchableOpacity
              style={[styles.modeIcon, selectedMode === 'car' && styles.selectedMode]}
              onPress={() => handleModeChange('car')}
            >
            <FontAwesome5 name="car" size={24} color={selectedMode === 'car' ? 'white' : 'black'} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeIcon2, selectedMode === 'walking' && styles.selectedMode]}
              onPress={() => handleModeChange('walking')}
            >
              <FontAwesome5 name="walking" size={24} color={selectedMode === 'walking' ? 'white' : 'black'} />
            </TouchableOpacity>
            <TouchableOpacity
            style={[styles.modeIcon, selectedMode === 'bus' && styles.selectedMode]}
            onPress={() => handleModeChange('bus')}
          >
            <MaterialIcons name="directions-bus" size={24} color={selectedMode === 'bus' ? 'white' : 'black'} />
          </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modeIcon, selectedMode === 'cycle' && styles.selectedMode]}
              onPress={() => handleModeChange('cycle')}
            >
              <MaterialCommunityIcons name="bike" size={24} color={selectedMode === 'cycle' ? 'white' : 'black'} />
            </TouchableOpacity>
          </View>
    
        
          <View style={styles.locationInputContainer}>
          <MaterialIcons name="my-location" size={27} style={styles.locationIcon} /> 
          <Text style={styles.locationText}>My Location</Text>
          <Text style={styles.dots}> ••• </Text> 
          <MaterialIcons name="location-on" size={27} style={styles.destinationIcon}  /> 
          <Text style={styles.locationText2}>{placeDetails?.name || 'Destination'}</Text>
          </View>
    
          <View style={styles.footerContainer}>
            <Text style={styles.distanceText}>
              {transitInfo ? `${transitInfo.distance.text} • ${transitInfo.duration.text}` : ""}
            </Text>
            <TouchableOpacity style={styles.goButton} onPress={onGoPress}>
                <Text style={styles.goButtonText}>GO</Text>
                </TouchableOpacity>
          </View>
          <View style={styles.transitDetailsContainer}>
            {selectedMode === 'walking' || selectedMode === 'cycle' ? (
              <>
              </>
            ) : null}

            {selectedMode === 'car' && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.carContainer}>
                {cars.map((car, index) => (
                  <View key={index} style={styles.carDetailContainer}>
                    <Text style={styles.carInfoText}>Time: {car.timeToUser}</Text>
                    <Image source={{ uri: 'https://i.imgur.com/vM8HrFJ.png' }} style={styles.carimage} resizeMode='contain'/>
                    <TouchableOpacity style={styles.hailButton} onPress={() => hailCar(car)}>
                      <Text style={styles.hailButtonText}>Hail</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}

          {selectedMode === 'bus' && (
            noBusTransitInfoAvailable ? (
              <Text style={styles.noTransitText}>
                Public transport is not available to this destination
              </Text>
            ) : (
              busDetails.map((detail, index) => (
                <View key={index} style={styles.busDetailContainer}>
                <Text style={styles.transitInfoText}>Departure Stop: {detail.departureStop}</Text>
                <Text style={styles.transitInfoText}>Arrival Stop: {detail.arrivalStop}</Text>
                <Text style={styles.transitInfoText}>Departure Time: {detail.departureTime}</Text>
                <Text style={styles.transitInfoText}>Arrival Time: {detail.arrivalTime}</Text>
                <Text style={styles.transitInfoText}>Number of Stops: {detail.numberOfStops}</Text>
                <Text style={styles.transitInfoText}>Bus Number: {detail.busNumber}</Text>
                <Text style={styles.transitInfoText}>Bus Name: {detail.busName}</Text>
              </View>
            ))
            )
          )}
          </View>
        </View>
      );
    };
    

    return (
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          showsUserLocation={true}
        >
          {dropCoords && <Marker coordinate={dropCoords} />}
          {selectedMode === 'car' && cars.map(car => (
            <Marker
              key={car.id}
              coordinate={car.currentLocation}
              title={`Time to user: ${car.timeToUser}`}>
              <Image
                source={{ uri: "https://i.imgur.com/bIt3vcy.png" }}
                style={{ width: 70, height: 40, transform: [{ rotate: `${car.heading}deg` }] }}  
              />
              </Marker>
          ))}
          {currentLocation && dropCoords && (
            <MapViewDirections
              origin={currentLocation}
              destination={dropCoords}
              apikey={GOOGLE_API_KEY}
              strokeWidth={3}
              strokeColor={
                selectedMode === 'walking'
                  ? 'hotpink'
                  : selectedMode === 'transit'
                  ? 'blue'
                  : selectedMode === 'cycle'
                  ? 'orange'
                  : 'purple' 
              }    
              mode={selectedMode}
              onReady={(result) => {
                setLiveDistance(result.distance);
                setLiveDuration(result.duration);
              }}
            />
          )}
        </MapView>

        <View style={styles.searchBox}>
          <View style={styles.inputWrapper}>
            <Ionicons name='location' size={28} color={'#0400B5'} style={styles.placesIcon} />
            <GooglePlacesAutocomplete
              placeholder='Search for a place or address'
              ref={searchBarRef}
              onPress={(data) => {
                handleLocationSelect(data.place_id);
              }}
              query={{
                key: GOOGLE_API_KEY,
                language: 'en',
              }}
              styles={{
                textInput: styles.textInput,
                container: styles.placesInput,
              }}
              fetchDetails
              debounce={200}
            />
          </View>
        </View>

        <BottomSheet
          ref={directionsBottomSheetRef}
          index={bottomSheetIndex}
          snapPoints={[300, 450]}
          enablePanDownToClose={true}
          onClose={() => setBottomSheetIndex(-1)}
        >
          <BottomSheetView>
            {renderPlaceDetails()}
          </BottomSheetView>
        </BottomSheet>

        <BottomSheet
          backgroundColor= "red"
          ref={bottomSheetRef}
          index={isBottomSheetVisible ? 0 : -1}
          snapPoints={[300, 450]}
          enablePanDownToClose={true}
          onClose={closeDirectionsPanel}
        >
          <BottomSheetView>
            {renderTransitInfo()}
          </BottomSheetView>
        </BottomSheet>

        {isLiveInfoBottomSheetVisible && (
    <BottomSheet
      ref={liveInfoBottomSheetRef}
      index={0}
      snapPoints={[200]}
      enablePanDownToClose={true}
      onClose={() => setIsLiveInfoBottomSheetVisible(false)}
    >
    <BottomSheetView>
      <Text style={styles.liveInfoText}>Distance Remaining: {liveDistance ? `${liveDistance.toFixed(2)} km` : 'Calculating...'}</Text>
      <Text style={styles.liveInfoText}>Time: {liveDuration ? `${Math.ceil(liveDuration)} mins` : 'Calculating...'}</Text>
      <TouchableOpacity style={styles.finishButton} onPress={resetMap}>
              <Text style={styles.finishButtonText}>Finish</Text>
          </TouchableOpacity>
    </BottomSheetView>
  </BottomSheet>
        )}
      </View>
    );
  };


  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    searchBox: {
      position: 'absolute',
      top: 10,
      width: '100%',
      alignItems: 'center',
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#D8DCFC', 
      borderRadius: 30, 
      paddingHorizontal: 10,
      width: '95%',
      zIndex: 10,
      top: 49,
      borderColor: '#0400B5', 
      borderWidth: 1, 
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3, 
      
    },
    placesInput: {
      width: '100%',
    },
    placeWebsite: {
      color: 'blue', 
      textDecorationLine: 'underline', 
      top:-330,
      fontSize: 17,
      left: 235
    },
    textInput: {
      height: 40,
      fontSize: 17,
      backgroundColor: '#D8DCFC', 
      color: '#333', 
      borderRadius: 20,
    },
    placesIcon: {
      marginRight: 10,
    },
    handle: {
      width: 40,
      height: 5,
      backgroundColor: '#ccc',
      borderRadius: 5,
      alignSelf: 'center',
      marginBottom: 10,
    },
    transitInfoText: {
      fontSize: 16,
      marginBottom: 8,
    },
    modeSelectionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 16,
    },
    modeButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      backgroundColor: '#eee',
    },
    modeButtonText: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    selectedModeButton: {
      backgroundColor: '#007bff',
    },
    selectedModeButtonText: {
      color: 'white',
    },
    bottomSheetContent: {
      backgroundColor: 'white',
      padding: 16,
      height: 450, 
    },
    placeDetailText: {
      fontSize: 16,
      marginBottom: 8,
      top: -30
    },
    photosContainer: {
      marginBottom: 8,
      top: -55
    },
    reviewsContainer: {
      marginBottom: 8,
      top: 250
    },
    placePhoto: {
      width: 120,
      height: 120,
      marginRight: 8,
      borderRadius: 8,
    },
    placeName: {
      fontSize: 19,
      fontWeight: 'bold',
      marginBottom: 10,
      top: -45
    },
    placeRating: {
      top: -85,
      fontSize: 16,
      color: 'gold', 
      right: -55
    },
    placeRating2: {
      fontSize: 14,
      color: 'black', 
      right:-135,
      top:-103.5
    },
    reviewContainer: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#f0f0f0', 
      borderRadius: 5,
    },
    reviewAuthor: {
      fontWeight: 'bold',
    },
    reviewText: {
      color: '#333', 
    },
    directionsButton: {
      flexDirection: 'row',
      backgroundColor: '#eee',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      left:220,
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      elevation: 3, 
    },
    directionsButtonText: {
      color: '#000',
      marginLeft: 5,
    },
    directionsIcon: {
    },
    placeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    bottomSheetContainer: {
      backgroundColor: 'white',
      padding: 16,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 8,
    },
    estimatedTimeText: {
      color: 'white',
      fontSize: 20,
    },
    modeSelectionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      paddingBottom: 8,
    },
    modeIcon: {
      padding: 12,
      borderRadius: 20,
      backgroundColor: '#eee',
    },
    modeIcon2: {
      padding: 12,
      width: 50,
      alignItems: 'center',
      borderRadius: 20,
      backgroundColor: '#eee',
    },
    selectedMode: {
      backgroundColor: '#007bff',
    },
    locationInputContainer: {
      backgroundColor: '#eee', 
      borderRadius: 20,
      padding: 8,
      marginVertical: 8,
      height:100
    },
    locationText: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 17,
      top: -19,
      right: -40
    },
    locationText2: {
      color: 'black',
      fontWeight: 'bold',
      fontSize: 17,
      top: -34,
      right: -40
    },
    footerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    distanceText: {
      color: '#0400B5',
      fontWeight: "bold",
      fontSize: 23,
      right:-10,
      top: 1
    },
    goButton: {
      backgroundColor: '#34C759', 
      borderRadius: 20,
      padding: 10,
      top: -80,
      left: -20
    },
    goButtonText: {
      color: 'white',
      fontSize: 20,
    },
    dots: {
      fontSize: 15,
      color: "#626060",
      paddingHorizontal: 10, 
      transform: [{ rotate: '90deg' }],
      top: 127,
      right: 144
    },
    locationIcon: {
      color: "#30CAFA",
      top:5,
      left:5
    },
    destinationIcon: {
      color: "#FA1475",
      top:-10,
      left:5.5 
    },
    liveInfoText: {
      color: '#0400B5',
      fontWeight: "bold",
      fontSize: 23,
      right: -15,
      marginBottom: 10,
    },
    finishButton: {
      backgroundColor: '#FF3B30', 
      borderRadius: 20,
      padding: 10,
      alignItems: 'center',
      marginTop: 10,
  },
  finishButtonText: {
      color: 'white',
      fontSize: 20,
  },
  carContainer: {
    padding: 10,
  },
  carDetailContainer: {
    height: 160,
    width: 250,
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  carInfoText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  hailButton: {
    backgroundColor: '#34C759',
    padding: 10,
    width:60,
    borderRadius: 5,
    top:-110,
    left:77,
    borderRadius: 20
  },
  hailButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: "bold",
    left:3
  },
  carimage: {
    height:150,
    width:150,
    left: -40,
    top:-15
  }
    
  });

  export default MapScreen;
