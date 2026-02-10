import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CircularProgress from 'react-native-circular-progress-indicator';
import { Pedometer } from 'expo-sensors';
import { firestore } from '../../firebase'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const FitnessScreen = ({ navigation }) => {
  const [fitnessData, setFitnessData] = useState({});
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('userId').then((id) => {
      if (id) {
        console.log('Retrieved User ID:', id);
        setUserId(id);
        initializeAppData(id);
      } else {
        console.log('User ID not found in AsyncStorage');
      }
    }).catch((error) => {
      console.error('Error retrieving user ID:', error);
    });
  }, []);

  const initializeAppData = (id) => {
    subscribeToPedometer(id);
    fetchFitnessDataForWeek(id);
    checkAndInitializeWeekData(id);
  };

  const initializeWeekData = (id) => {
    const weekData = {};
    daysOfWeek.forEach(day => {
      weekData[day] = { steps: 0, distance: 0, calories: 0 };
    });

    firestore.collection('users').doc(id).set(weekData)
      .then(() => {
        console.log('Week data initialized in Firestore');
      })
      .catch(error => {
        console.error('Error initializing week data in Firestore:', error);
      });
  };

  const checkAndInitializeWeekData = (id) => {
    firestore.collection('users').doc(id).get()
      .then(doc => {
        if (!doc.exists || Object.keys(doc.data()).length < daysOfWeek.length) {
          initializeWeekData(id);
        }
      })
      .catch(error => {
        console.error('Error checking week data in Firestore:', error);
      });
  };

  const subscribeToPedometer = (userId) => {
    Pedometer.isAvailableAsync().then(isAvailable => {
      console.log('Pedometer availability:', isAvailable);
      if (isAvailable) {
        Pedometer.watchStepCount(result => {
          console.log('Pedometer step count:', result.steps);
          if (userId) {  
            calculateDistanceAndCalories(result.steps, userId);
          } else {
            console.log('User ID is not set. Cannot update Firestore.');
          }
        });
      } else {
        console.log('Pedometer is not available on this device.');
      }
    }).catch(err => {
      console.error('Error checking pedometer availability:', err);
    });
  };
  

  const calculateDistanceAndCalories = (steps) => {
    const distance = steps * 0.76 / 1000; 
    const calories = steps * 0.05; 
  
    console.log(`Steps: ${steps}, Distance: ${distance.toFixed(2)} km, Calories: ${calories.toFixed(0)} cal`);
    
    if (userId) {
      updateFirestore(steps, distance.toFixed(2), calories.toFixed(0));
    } else {
      console.log('User ID is not set. Cannot update Firestore.');
    }
  };
  

  const updateFirestore = (steps, distance, calories) => {
    const day = daysOfWeek[new Date().getDay()];
    const data = { steps, distance, calories };
  
    console.log(`Updating Firestore for ${day} with data:`, data);
    
    firestore.collection('users').doc(userId).update({
      [`weeklyFitnessData.${day}`]: data 
    })
    .then(() => {
      console.log('Data updated in Firestore');
    })
    .catch(error => {
      console.error('Error updating Firestore:', error);
    });
  };
  

  const fetchFitnessDataForWeek = (id) => {
    const unsubscribe = firestore.collection('users').doc(id).onSnapshot(doc => {
      const data = doc.data();
      console.log("Real-time fetched data:", data);
      setFitnessData(data || {});
    }, error => {
      console.error('Error fetching Firestore data:', error);
    });
  
    return unsubscribe; 
  };
  
  useEffect(() => {
    let unsubscribe;
    if (userId) {
      unsubscribe = fetchFitnessDataForWeek(userId);
    }
  
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [userId]);
  
  const handleDayPress = (dayIndex) => {
    setSelectedDay(dayIndex);
  };

  const goBackToHomeScreen = () => {
    navigation.goBack();
  };

  const renderDayButton = (day, index) => {
    const isActive = selectedDay === index;
    return (
      <TouchableOpacity
        style={[styles.dayButton, isActive && styles.activeDayButton]}
        onPress={() => handleDayPress(index)}
        key={day}
      >
        <Text style={styles.dayText}>{day[0]}</Text>
      </TouchableOpacity>
    );
  };

  const selectedDayData = fitnessData.weeklyFitnessData ? fitnessData.weeklyFitnessData[daysOfWeek[selectedDay]] : {};


  return (
    <View style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity
       onPress={goBackToHomeScreen}>
      <Ionicons name="chevron-back-outline" size={24} color="black" />
      </TouchableOpacity>
      </View>
      <View style={styles.daysContainer}>
        {daysOfWeek.map((day, index) => renderDayButton(day, index))}
      </View>
      <View style={styles.progressContainer}>
      <CircularProgress
          value={selectedDayData.steps || 0}
          maxValue={12000}
          radius={110}
          activeStrokeWidth={selectedDayData.steps > 0 ? 30 : 0} 
          inActiveStrokeWidth={30}
          activeStrokeColor={'#9E00FF'}
          inActiveStrokeColor={'#D9DFED'}
          textColor={'#364F6B'}
          textStyle={{
            fontSize: 20,
            fontWeight: 'bold',
          }}
          title={"Steps"}
          titleStyle={{ color: '#364F6B' }}
          titleColor={'#364F6B'}
          titleFontSize={20}
          showProgressValue={true}
          dashRatio={selectedDayData.steps > 0 ? 1 : 0.01} 
        />



      </View>
      <Text style={styles.headingText}>Fitness</Text>
      <Text style={styles.activityText}>Daily Data</Text>
      <View style={styles.statsBlock}>
        <View style={styles.statsCard}>
          <MaterialCommunityIcons name="shoe-sneaker" size={36} color="#D795FF" style={styles.statsIcon} />
          <Text style={styles.statsLabel}>Steps</Text>
          <Text style={styles.statsValue}>{selectedDayData.steps || '0'}</Text>
        </View>

        <View style={styles.statsCard2}>
          <MaterialCommunityIcons name="fire" size={36} color="#FCC457" style={styles.statsIcon} />
          <Text style={styles.statsLabel}>Calories</Text>
          <Text style={styles.statsValue}>{selectedDayData.calories ? `${selectedDayData.calories}Kcal` : '0Kcal'}</Text>
        </View>

        <View style={styles.statsCard3}>
          <MaterialCommunityIcons name="map-marker-distance" size={36} color="#4ECDC4" style={styles.statsIcon} />
          <Text style={styles.statsLabel}>Distance</Text>
          <Text style={styles.statsValue}>{selectedDayData.distance ? `${selectedDayData.distance}KM` : '0.00KM'}</Text>
        </View>
      </View>
      </View>
    
  );
  
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 10,
    zIndex: 999,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    width: '100%',
    top: -60,
    left: -10
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    right:-10,
    backgroundColor: '#F4F4F4',
  },
  activeDayButton: {
    backgroundColor: '#E1AFFF',
    shadowColor: '#9E00FF', 
    shadowOffset: {
      width: -2,
      height: 1,
    },
    shadowOpacity: 1, 
    shadowRadius: 3, 
  },
  dayText: {
    color: '#000',
    fontSize: 16,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top:-25,
    
  },
  headingText:{
    fontSize:36,
    fontWeight: "bold",
    top:-375,
    left:-112
  },
  activityText:{
    fontSize:22,
    fontWeight: "bold",
    top:-33,
    left:-120
  },
  
  statsBlock: {
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    width: '100%', 
  },
  statsCard: {
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 15, 
    width: 100, 
    height: 110, 
    shadowColor: '#9E00FF', 
    shadowOffset: {
      width: -1,
      height: 2,
    },
    shadowOpacity: 1, 
    shadowRadius: 3, 
  },
  statsCard2: {
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 15, 
    width: 100, 
    height: 110, 
    shadowColor: '#FCC457', 
    shadowOffset: {
      width: -1,
      height: 2,
    },
    shadowOpacity: 1, 
    shadowRadius: 3, 
  },
  statsCard3: {
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 15, 
    width: 100, 
    height: 110, 
    shadowColor: '#4ECDC4', 
    shadowOffset: {
      width: -1,
      height: 2,
    },
    shadowOpacity: 1, 
    shadowRadius: 3, 
  },
  statsIcon: {
    marginBottom: 8, 
  },
  statsLabel: {
    fontSize: 12,
    color: '#757575', 
    fontWeight: 'bold',
  },
  statsValue: {
    fontSize: 18,
    color: '#000', 
    fontWeight: 'bold',
  },
});
export default FitnessScreen;

