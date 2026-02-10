import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, 
    });
  }, [navigation]);

  const goToMapScreen = () => {
    navigation.navigate('Maps');
  };

  const navigateToLocation = (location) => {
    navigation.navigate('Maps', {
      screen: 'MapScreen', 
      params: {
        dropCoords: { latitude: location.latitude, longitude: location.longitude },
      },
    });
  };
  
  
  const goToCaloriesScreen = () => {
    navigation.navigate('Calories');
  };

  const navigateToPedometerScreen = () => {
    navigation.navigate('Fitness');
  };

  const goToHomeLocation = () => {
    navigation.navigate('Maps', {
      destination: 'Home', 
      coordinates: { latitude: 25.3719, longitude: 55.42641 },
    });
  };
  
  const goToWorkplaceLocation = () => {
    navigation.navigate('Maps', {
      destination: 'Workplace', 
      coordinates: { latitude: 25.2090, longitude: 55.2640 },
    });
  };
  
  const navigateToEcosScreen = () => {
    navigation.navigate('Ecos');
  };
  
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const loadRecentSearches = async () => {
      const searchesString = await AsyncStorage.getItem('recentSearches');
      const searches = searchesString ? JSON.parse(searchesString) : [];
      setRecentSearches(searches);
    };

    loadRecentSearches();
  }, []);


  return (
    <View style={styles.container}>
      <View style={styles.navigationContainer}>
      <Text style={styles.additionalSectionHeading}>Recent Searches</Text>
      {recentSearches.length > 0 ? (
        <View>
          {recentSearches.map((search, index) => (
            <Text key={index} style={styles.recentSearchText}>
              {search}
            </Text>
          ))}
        </View>
      ) : (
        <Text>No recent searches</Text>
      )}
      </View>

      <Text style={styles.heading}>Activity Today</Text>
      <View style={styles.rectanglesContainer}>
        <TouchableOpacity style={styles.rectangle1} onPress={() => navigation.navigate('Ecos')}>
          <Icon name="heart-circle-outline" size={50} color="#00FF57"/>
          <Text style={styles.rectangleText2}>Ecos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rectangle2} onPress={navigateToPedometerScreen}>
          <View style={styles.iconContainer}>
            <Icon name="walk-outline" size={40} color="#9E00FF" style={styles.icon} />
          </View>
          <Text style={styles.rectangleText2}>Steps</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rectangle3} onPress={() => navigation.navigate('Carbon')}>
          <Icon name="cloud-done-outline" size={40} color="#FD00FF" />
          <Text style={styles.rectangleText}>Carbon Footprint</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rectangle4} onPress={() => navigation.navigate('Calories')}>
          <Icon name="flame-outline" size={40} color="#FF8A00"/>
          <Text style={styles.rectangleText}>Calories Burnt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rectangle7} onPress={() => navigation.navigate('CaloriesBurnt')}>
          <Icon name="heart-circle-outline" size={28} color="#00FF57"/>
          <Text style={styles.rectangleText71}>430 Ecos</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.additionalSectionHeading}>Daily Stops</Text>

      <View style={styles.twoRectanglesContainer}>
        <TouchableOpacity style={styles.rectangle5} onPress={goToWorkplaceLocation}>
          <View style={styles.iconContainer2}>
            <Icon name="bag-sharp" size={33} color="#0500FF" style={styles.icon} />
          </View>
          <View style={styles.iconContainer3}>
            <Icon name="navigate-circle-outline" size={23} color="#0500FF" style={styles.icon} />
          </View>
          <Text style={styles.rectangleText5}>Workplace</Text>
          <Text style={styles.rectangleText51}>3km</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rectangle6} onPress={goToHomeLocation}>
          <View style={styles.iconContainer2}>
            <Icon name="home-sharp" size={33} color="#7000FF" style={styles.icon} />
          </View>
          <View style={styles.iconContainer3}>
            <Icon name="navigate-circle-outline" size={23} color="#7000FF" style={styles.icon} />
          </View>
          <Text style={styles.rectangleText6}>Home</Text>
          <Text style={styles.rectangleText61}>7km</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    paddingHorizontal: 20,
  },
  navigationContainer: {
    marginTop: 40,
  },
  buttonBox: {
    backgroundColor: '#EABEFF',
    width: 308,
    height: 180,
    top: 150,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
   
  },  
  button: {
    backgroundColor: '#AA00FA',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginTop: 55,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttontext2: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 100,
    
    textAlign: 'center',
    width: '100%',
  },
  heading: {
    fontFamily: 'Jost',
    fontSize: 18,
    marginTop: -400,
    marginBottom: 15,
    left: -100,
    fontWeight: 'bold'
  },
  rectanglesContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  rectangle1: {
    width: 68,
    height: 63,
    backgroundColor: '#D2FFE1',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    position: 'relative',
  },
  rectangle7: {
    width: 110,
    height: 38,
    backgroundColor: '#D2FFE1',
    borderRadius: 20,
    alignContent: 'center',
    justifyContent: 'center',
    marginHorizontal: -57.5,
    top: -98,
    right:281 ,
    borderWidth: 1,
    borderColor: '#00F654',
  },
  rectangleText71: {
    color: '#000000',
    fontSize: 13,
    fontFamily: 'Jost',
    position: 'absolute',
    marginHorizontal: -10,
    top: 10,
    right:28,
  },
  rectangle2: {
    width: 68,
    height: 63,
    backgroundColor: '#EDD0FF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    position: 'relative',
  },
  rectangle3: {
    width: 68,
    height: 63,
    backgroundColor: '#FFC5FF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    position: 'relative',
  },
  rectangle4: {
    width: 68,
    height: 63,
    backgroundColor: '#FFE9CF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    position: 'relative',
    marginBottom: 2
  },
  rectangleText: {
    color: '#000000',
    fontSize: 13,
    fontFamily: 'Jost',
    position: 'absolute',
    bottom: 0,
    marginBottom: -40,
    textAlign: 'center',
    width: '100%',
  },
  rectangleText2: {
    color: '#000000',
    fontSize: 14,
    fontFamily: 'Jost',
    position: 'absolute',
    bottom: 0,
    marginBottom: -30,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -3
  },
  additionalSectionHeading: {
    fontFamily: 'Jost',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 60,
    marginBottom: 15,
    left: -110
  },
  twoRectanglesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  rectangle5: {
    width: 160,
    height: 130,
    backgroundColor: '#E3E3FC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  rectangleText5: {
    color: '#0500FF',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'Jost',
    position: 'absolute',
    bottom: 7,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    left: 11,
  },
  rectangleText51: {
    color: '#0500FF',
    fontSize: 15,
    fontFamily: 'Jost',
    position: 'absolute',
    bottom: -20,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    left: 17,
  },
  rectangle6: {
    width: 160,
    height: 130,
    backgroundColor: '#EEE3FC',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rectangleText6: {
    color: '#7000FF',
    fontWeight: 'bold',
    fontSize: 15,
    fontFamily: 'Jost',
    position: 'absolute',
    bottom: 7,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    left: 11,
  },
  rectangleText61: {
    color: '#7000FF',
    fontSize: 15,
    fontFamily: 'Jost',
    position: 'absolute',
    bottom: -20,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    left: 17,
  },
  iconContainer2: {
    position: 'absolute',
    left: 15,
    top: 23
  },
  iconContainer3: {
    position: 'absolute',
    right: 10,
    top: 20,
  },  
  recentSearchText: {
    fontSize: 16,
    marginBottom: 5,
  },
  additionalSectionHeading: {
    marginTop: 15, 
  },
});

export default HomeScreen;
