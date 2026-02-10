import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, Dimensions, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { db } from '../../config';


const EcosScreen = ({ navigation }) => {
  const goBackToHomeScreen = () => {
    navigation.goBack(); 
  };
const [ecosToday, setEcosToday] = useState('0');
const [ecosOverall, setEcosOverall] = useState('0');

useEffect(() => {
  const unsubscribe = db.ref('weeklyFitnessData').on('value', (snapshot) => {
    const data = snapshot.val() || {};
    const today = daysOfWeek[new Date().getDay()];
    const todayEcos = data[today] ? data[today].ecos : 0;
    setEcosToday(todayEcos.toFixed(1)); 

    let totalEcos = 0;
    Object.values(data).forEach(dayData => {
      totalEcos += dayData.ecos || 0;
    });
    setEcosOverall(totalEcos.toFixed(1)); 
  });

  return () => db.ref('weeklyFitnessData').off('value', unsubscribe); 
}, []);

  const navigateToCardScreen = () => {
    navigation.navigate('NaviTransit');
  };

  return (
    <View style={styles.container}>
    <View style={styles.backButtonContainer}>
        <View style={styles.homeButtonContainer}>
      <TouchableOpacity
       onPress={goBackToHomeScreen}>
       <FeatherIcon name="chevron-left" size={24} /> 
       </TouchableOpacity>
         </View>
         </View>
        <View style={styles.twoRectanglesContainer}>
        <View style={styles.rectangle5}>
          <View style={styles.iconContainer2}>
            <Icon name="heart-circle-outline" size={33} color="#00F654" style={styles.icon} />
          </View>
          <Text style={styles.rectangleText5}>Ecos Today</Text> 
          <Text style={styles.rectangleText51}>{ecosToday}</Text>
        </View>
        <View style={styles.rectangle6}>
          <View style={styles.iconContainer2}>
            <Icon name="heart-circle-outline" size={33} color="#00F654" style={styles.icon} />
          </View>
          <Text style={styles.rectangleText6}>Ecos Overall</Text> 
          <Text style={styles.rectangleText61}>{ecosOverall}</Text>
        </View>
        <View style={styles.paymentContainer}>
        <TouchableOpacity style={styles.payment} onPress={navigateToCardScreen}>
          <View style={styles.iconContainer3}>
            <Icon name="card-outline" size={33} color="#00F654" style={styles.icon} />
          </View>
          <Text style={styles.paymentText5}>Transfer Ecos to Your NaviTransit Card</Text>
      
        </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.weeklyStatsText}>Weekly Stats</Text>
      <Text style={styles.weeklyStatsText2}>Current Stats</Text>
      <Text style={styles.weeklyStatsText3}>Transfer Points</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', 
  },
  backButtonContainer: {
    position: 'absolute',
    top: 45,
    zIndex: 999, 
  },
  homeButtonContainer: {
   right:160
  },
  weeklyStatsText: {
    color: '#000000',
    fontSize: 21,
    
    position: 'absolute',
    marginHorizontal: -10,
    top: 90,
    left:40,
    fontWeight: 'bold'
  },
  weeklyStatsText2: {
    color: '#000000',
    fontSize: 21,
    
    position: 'absolute',
    marginHorizontal: -10,
    top: 450,
    left:40,
    fontWeight: 'bold'
  },
  weeklyStatsText3: {
    color: '#000000',
    fontSize: 21,
    
    position: 'absolute',
    marginHorizontal: -10,
    top: 593,
    left:40,
    fontWeight: 'bold'
  },
  
  twoRectanglesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  rectangle5: {
    width: 160,
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    top: 120,
    left: 20,
    shadowColor: '#00F654',
    shadowOffset: {
      width: -1,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  rectangleText5: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
    
    position: 'absolute',
    bottom: 2,
    marginBottom: 30,
    left: 50,
    
    
  },
  rectangleText51: {
    color: '#000',
    fontSize: 15,
    
    position: 'absolute',
    bottom: 10,
    left: 80,
    
  },
  rectangle6: {
    width: 160,
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    top: 120,
    right: -35,
    shadowColor: '#00F654', 
    shadowOffset: {
      width: -1,
      height: 2,
    },
    shadowOpacity: 1, 
    shadowRadius: 3,
  },
  rectangleText6: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
    
    position: 'absolute',
    bottom: 2,
    marginBottom: 30,
    left: 50,
    
    
  },
  rectangleText61: {
    color: '#000',
    fontSize: 15,
    position: 'absolute',
    bottom: 10,
    left: 80,
  },
  iconContainer2: {
    position: 'absolute',
    left: 5,
    top: 14
  },
  paymentContainer: {
  },
  payment: {
    width: 335,
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    top: 270,
    right: 300,
    shadowColor: '#00F654', 
    shadowOffset: {
      width: -1,
      height: 2,
    },
    shadowOpacity: 1, 
    shadowRadius: 3,
  },
  paymentText5: {
    color: '#000',
    fontSize: 16.5,
    position: 'absolute',
    bottom: 20,
    left: 40,
  },
  iconContainer3: {
    position: 'absolute',
    left: 5,
    top: 14
  },
  
});

export default EcosScreen;
