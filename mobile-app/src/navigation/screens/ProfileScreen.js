import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView, Dimensions, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { db } from '../../config'; // Make sure to import your Firebase config

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const ProfileScreen = ({ navigation }) => {
  const [steps, setSteps] = useState('0'); 
  const [calories, setCalories] = useState('0'); 
  const [ecos, setEcos] = useState('0');

  const today = daysOfWeek[new Date().getDay()]; 
  useEffect(() => {
    navigation.setOptions({
      headerShown: false, 
    });

    const todayDataRef = db.ref(`weeklyFitnessData/${today}`);
    const listener = todayDataRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSteps(data.steps.toString());
        setCalories(data.calories.toString());
        setEcos(data.ecos ? data.ecos.toFixed(1) : '0');
      }
    });
  
    return () => todayDataRef.off('value', listener); 
  }, [navigation, today]);
  

  const goToMapScreen = () => {
    navigation.navigate('Maps');
  };

  const goToLoginScreen = () => {
    navigation.navigate('Login');
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
  

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
        <ImageBackground
          source={{ uri: 'https://i.imgur.com/DCpbf2G.png' }} 
          style={styles.headerBackground}
          resizeMode="cover"
        >
          
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back-outline" size={30} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.profileHeader}>Profile</Text>
          <Image
            source={{ uri: 'https://imgur.com/rK1F2Z5.png' }} 
            style={styles.profileImage}
          />
        </ImageBackground>

        <ImageBackground
          source={{ uri: 'https://i.imgur.com/syIHir8.png' }} 
          style={styles.ecosimg}
          resizeMode="cover"
        ></ImageBackground>

<ImageBackground
          source={{ uri: 'https://i.imgur.com/0Kay9Cj.png' }} 
          style={styles.stepsimg}
          resizeMode="cover"
        ></ImageBackground>

<ImageBackground
          source={{ uri: 'https://i.imgur.com/24UcmEv.png' }}
          style={styles.cardimg}
          resizeMode="cover"
        ></ImageBackground>

<ImageBackground
          source={{ uri: 'https://i.imgur.com/0QIil9l.png' }} 
          style={styles.caloriesimg}
          resizeMode="cover"
        ></ImageBackground>

      <View style={styles.navigationContainer}>
        <View style = {styles.buttonBox}>
        
        <TouchableOpacity style={styles.button} onPress={goToLoginScreen}>
          <Text style={styles.buttonText}>SignOut</Text>
        </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.heading}>My Stats</Text>

      
      <View style={styles.rectanglesContainer}>
        <TouchableOpacity style={styles.rectangle1} onPress={() => navigation.navigate('Ecos')}>
        <View style={styles.iconContainer2}>
          <Icon name="heart-circle-outline" size={40} color="#00FF57"/>
          </View>
          <Text style={styles.dataText1}>{ecos}</Text>
          <Text style={styles.rectangleText}>Ecos</Text>
          <Text style={styles.detailsText1}>Tap to view details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rectangle2} onPress={() => navigation.navigate('Fitness')}>
          <View style={styles.iconContainer}>
            <Icon name="walk-outline" size={35} color="#9E00FF" style={styles.icon} />
          </View>
          <Text style={styles.dataText2}>{steps}</Text>
          <Text style={styles.rectangleText2}>Steps</Text>
          <Text style={styles.detailsText2}>Tap to view details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rectangle3} onPress={() => navigation.navigate('Carbon')}>
        <View style={styles.iconContainer2}>
          <Icon name="cloud-done-outline" size={35} color="#FD00FF" />
          </View>
          <Text style={styles.dataText3}>30</Text>
          <Text style={styles.rectangleText3}>Credits</Text>
          <Text style={styles.detailsText3}>Tap to view details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rectangle4} onPress={() => navigation.navigate('Calories')}>
          <View style={styles.iconContainer2}>
            <Icon name="flame-outline" size={35} color="#FF8A00"/>
          </View>
          <Text style={styles.dataText4}>{calories}</Text>
          <Text style={styles.rectangleText4}>Calories{'\n'}Burnt</Text>
          <Text style={styles.detailsText4}>Tap to view details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.rectangleprofile} onPress={() => navigation.navigate('Carbon')}>
        <View style={styles.iconContainer4}>
          <Icon name="person-circle-outline" size={35} color="#00F654" />
          </View>
          <Text style={styles.profileText}>Profile Info</Text>
        </TouchableOpacity>
    
      </View>

      <Text style={styles.additionalSectionHeading}>Profile Settings</Text>

     
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fbfcf6',
  },
  headerBackground: {
    width: '112%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    top:170,
  },
  backIcon: {
    position: 'absolute',
    top: 10, 
    left: 10,
  },
  profileHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    position: 'absolute',
    top: 10, 
    right: 10,
  },
  profileImage: {
    width: 100, 
    height: 100, 
    borderRadius: 50,
    borderColor: '#fff', 
    borderWidth: 3,
    position: 'absolute',
    bottom: -50, 
  },
  ecosimg: {
    width: 140, 
    height: 140, 
    position: 'absolute',
    left:-10,
    zIndex:1,
    top:210
  },
  stepsimg: {
    width: 170, 
    height: 150,
    position: 'absolute',
    zIndex:1,
    top:200,
    right:45
   
  },
  cardimg: {
    width: 150, 
    height: 140,
    zIndex:1,
    position: 'absolute',
    top:400,
    left:-20
  },
  caloriesimg: {
    width: 120, 
    height: 120, 
    position: 'absolute',
    zIndex:1,
    top:410,
    right:80
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    paddingHorizontal: 20,
    top:30
  },
  profileContainer: {
    backgroundColor: '#00F5A0',
    width:'112%',
    flexDirection: 'row',
    alignItems: 'center',
    height:200,
    top: 60
  },
  profileText2: {
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 140,
    top: 28
  },
  iconContainer5: {
    position: 'absolute',
    left: 18,
    top: 70,
  },  
  navigationContainer: {
    marginTop: 40,
  },
  buttonBox: {
    color: '#fbfcf6',
    width: 308,
    height: 180,
    top: 250,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
   
  },  
  button: {
    backgroundColor: '#fbfcf6',
    borderRadius: 10,
    top: -128,
    right:-140,
    width:100,
    height:40
  },
  buttonText: {
    color: '#FF2626',
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
    fontSize: 22,
    bottom: -10,
    left: -120,
    fontWeight: 'bold'
  },
  rectanglesContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop:20,
  },
  rectangle1: {
    width: 160,
    height: 150,
    backgroundColor: '#D2FFE1',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    position: 'relative',
    bottom : -30,
    shadowColor: '#7CFDA8', 
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 2, 
    shadowRadius: 3, 
  },
  rectangle2: {
    width: 160,
    height: 150,
    backgroundColor: '#EDCEFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    right:-180,
    position: 'relative',
    bottom:120,
    marginHorizontal: 5,
    shadowColor: '#C76CFF', 
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1, 
    shadowRadius: 3, 
  },
  rectangle3: {
    width: 160,
    height: 150,
    backgroundColor: '#CFCEFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    position: 'relative',
    bottom: 80,
    shadowColor: '#7371FF', 
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1, 
    shadowRadius: 3, 
  },
  rectangle4: {
    width: 160,
    height: 150,
    backgroundColor: '#FFE9CF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    position: 'relative',
    marginBottom: 2,
    bottom: 230,
    right:-180,
    shadowColor: '#FFBB6B', 
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1, 
    shadowRadius: 3, 
  },
  rectangleText: {
    color: '#00DD4B',
    fontSize: 14,
    position: 'absolute',
    bottom: 10,
    left: 115,
    textAlign: 'center',
    fontWeight: 'bold'
   
  },
  rectangleText2: {
    color: '#9E00FF',
    fontSize: 14,
    position: 'absolute',
    bottom: 10,
    left: 115,
    fontWeight: 'bold',
    },
  rectangleText3: {
      color: '#0300AC',
      fontSize: 12,
      position: 'absolute',
      bottom: 10,
      left: 110,
      textAlign: 'center',
      fontWeight: 'bold'
  },
    rectangleText4: {
      color: '#FF8A00',
      fontSize: 12,
      position: 'absolute',
      bottom: 5,
      left: 105,
      textAlign: 'center',
      fontWeight: 'bold'
     
    },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 260,
    top: 5
  },
  additionalSectionHeading: {
    fontFamily: 'Jost',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 60,
    marginBottom: 15,
    left: -92,
    top: -210
  },
 
  iconContainer2: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 260,
    top: 5
  },
  iconContainer3: {
    position: 'absolute',
    right: 10,
    top: 300,
  },  
  dataText1: {
    color: '#00DD4B',
    fontSize: 56,
    position: 'absolute',
    bottom: 0,
    left: 15,
    textAlign: 'center',
    fontWeight: 'bold'
   
  },
  dataText2: {
    color: '#9E00FF',
    fontSize: 56,
    position: 'absolute',
    bottom: 0,
    left: 15,
    textAlign: 'center',
    fontWeight: 'bold'
   
  },
  dataText3: {
    color: '#0300AC',
    fontSize: 50,
    position: 'absolute',
    bottom: 0,
    left: 15,
    textAlign: 'center',
    fontWeight: 'bold'
   
  },
  dataText4: {
    color: '#FF8A00',
    fontSize: 56,
    position: 'absolute',
    bottom: 0,
    left: 15,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  rectangleprofile: {
    width: 330,
    height: 55,
    backgroundColor: '#FCF8F8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    position: 'relative',
    bottom : 55
  },
  iconContainer4: {
    position: 'absolute',
    left: 20,
    top: 10,
  },  
  profileText: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'Jost',
    position: 'absolute',
    bottom: 18,
    left: 70,
    textAlign: 'center',
  },
  detailsText1: {
    fontSize: 10,
    
    marginLeft: 170,
    top: -15
  },
  detailsText2: {
    fontSize: 10,
   
    marginLeft: 170,
    top: -15
  },
  detailsText3: {
    fontSize: 10,
    
    marginLeft: 170,
    top: -15
  },
  detailsText4: {
    fontSize: 10,
    
    marginLeft: 170,
    top: -15,
  },
});

export default ProfileScreen;
