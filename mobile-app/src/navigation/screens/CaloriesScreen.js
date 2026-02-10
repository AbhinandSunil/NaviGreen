import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, Dimensions, Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { db } from '../../config';

const CaloriesScreen = ({ navigation }) => {
  const goBackToHomeScreen = () => {
    navigation.goBack(); 
  };

  const [caloriesToday, setCaloriesToday] = useState('0');
  const [caloriesOverall, setCaloriesOverall] = useState('0');

  useEffect(() => {
    const unsubscribe = db.ref('weeklyFitnessData').on('value', (snapshot) => {
      const data = snapshot.val() || {};
      let totalCalories = 0;
  
      Object.values(data).forEach(dayData => {
        totalCalories += Number(dayData.calories) || 0;
      });
  
      const today = new Date().toLocaleDateString();
      const todayData = data[today] || { calories: '0' };
  
      // Set the state with the formatted calories value
      setCaloriesToday(Number(todayData.calories).toFixed(0)); 
      setCaloriesOverall(totalCalories.toFixed(0)); 
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
          <Button title="< Home" onPress={goBackToHomeScreen} color="black" />
        </View>
      </View>
      <View style={styles.twoRectanglesContainer}>
        <View style={styles.rectangle5}>
          <View style={styles.iconContainer2}>
            <Icon name="flame-outline" size={33} color="#FF8A00" style={styles.icon} />
          </View>
          <Text style={styles.rectangleText5}>Calories Burnt</Text>
          <Text style={styles.rectangleText52}>Today</Text>
          <Text style={styles.rectangleText51}>{caloriesToday}</Text>
        </View>
        <View style={styles.rectangle6}>
          <View style={styles.iconContainer2}>
            <Icon name="flame-outline" size={33} color="#FF8A00" style={styles.icon} />
          </View>
          
          <Text style={styles.rectangleText6}>Calories Burnt</Text>
          <Text style={styles.rectangleText62}>Overall</Text>
          <Text style={styles.rectangleText61}>{caloriesOverall}</Text>
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
    top: 40,
    zIndex: 999, 
  },
  homeButtonContainer: {
    right: 140
  },
  weeklyStatsText: {
    color: '#000000',
    fontSize: 21,
  
    position: 'absolute',
    marginHorizontal: -10,
    top: 90,
    left: 40,
    fontWeight: 'bold'
  },
  weeklyStatsText2: {
    color: '#000000',
    fontSize: 21,
  
    position: 'absolute',
    marginHorizontal: -10,
    top: 450,
    left: 40,
    fontWeight: 'bold'
  },
  weeklyStatsText3: {
    color: '#000000',
    fontSize: 21,
    position: 'absolute',
    marginHorizontal: -10,
    top: 593,
    left: 40,
    fontWeight: 'bold'
  },

  twoRectanglesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  rectangle5: {
    width: 160,
    height: 70,
    backgroundColor: '#FFE9CF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    top: 120,
    left: 20
  },
  rectangleText5: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
    position: 'absolute',
    bottom: 2,
    marginBottom: 40,
    left: 45,
  },
  rectangleText51: {
    color: '#000',
    fontSize: 15,
   
    position: 'absolute',
    bottom: 8,
    left: 85,
  },
  rectangleText52: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
    position: 'absolute',
    bottom: 28,
    left: 75,
  },
  rectangle6: {
    width: 160,
    height: 70,
    backgroundColor: '#FFE9CF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    top: 120,
    right: -35
  },
  rectangleText6: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
    position: 'absolute',
    bottom: 2,
    marginBottom: 40,
    left: 45,
  },
  rectangleText61: {
    color: '#000',
    fontSize: 15,
    position: 'absolute',
    bottom: 8,
    left: 85,
  },
  rectangleText62: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 15,
    position: 'absolute',
    bottom: 28,
    left: 75,
  },
  iconContainer2: {
    position: 'absolute',
    left: 5,
    top: 19
  },
  paymentContainer: {},
  payment: {
    width: 335,
    height: 60,
    backgroundColor: '#FFE9CF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    top: 275,
    right: 300
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

export default CaloriesScreen;
