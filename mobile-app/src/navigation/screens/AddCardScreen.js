import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { firestore } from '../../firebase'; 

const windowWidth = Dimensions.get('window').width;

const AddCardScreen = () => {
  const navigation = useNavigation();
  const [cardID, setCardID] = useState('');
  const onlineImageUrl = 'https://i.imgur.com/HXvyf0s.png';

  const handleAddCard = async () => {
    try {
      const usersRef = firestore.collection('users');
      const querySnapshot = await usersRef.where('cardID', '==', cardID).get();
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      let totalEcos = userData.TotalEcos || 0;
      let ecosFromPredictions = 0;
      Object.values(userData.predictions || {}).forEach(dailyPrediction => {
        ecosFromPredictions += dailyPrediction.ecos || 0;
      });
  
      const newCard = {
        id: userData.cardID,
        ecos: ecosFromPredictions,
        points: userData.PointsInAccount,
        image: onlineImageUrl,
      };
  
      navigation.navigate('NaviTransit', { newCard });
    } else {
      alert("That ID doesn't exist, please recheck and enter your ID");
    }
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    alert("Failed to fetch data. Please check your network and try again.");
  }
};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.addCardContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <View style={styles.headerContainer}>
          <Text style={styles.addCardTitle}>Add your Card</Text>
          <Text style={styles.addCardTitle2}>Enter your NaviTransit ID to save card</Text>
        </View>
        <View style={styles.cardPreview}>
          <Image
            source={{ uri: onlineImageUrl }}
            style={styles.cardImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your ID"
            placeholderTextColor="#A9A9A9"
            value={cardID}
            onChangeText={setCardID}
            keyboardType="numeric"
            underlineColorAndroid="transparent"
          />
          <View style={styles.lineStyle} />
        </View>
        <TouchableOpacity style={styles.continueButton} onPress={handleAddCard}>
          <Text style={styles.continueButtonText}>Add Card</Text>
          <Ionicons style={styles.enterIcon} name="enter-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  addCardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  headerContainer: {
    position: 'absolute',
    top: 50,
    width: '100%',
    padding: 20, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  addCardTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addCardTitle2: {
    color: "#C3C3C3",
    fontSize: 15,
    top:-18
  },
  cardPreview: {
    width: 400,
    height: 200, 
    borderRadius: 10,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardImage: {
    width: '100%', 
    height: '100%', 
    borderRadius: 10, 
    top:-35
  },
  cardText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 20,
    alignItems: 'center',
    top:-30
  },
  input: {
    fontSize: 18,
    color: '#000',
    width: windowWidth * 0.8,
    height: 40, 
    paddingHorizontal: 10,
    borderWidth: 0,
    textAlign: 'center',
  },
  lineStyle: {
    width: 270,
    height: 1,
    backgroundColor: '#000',
    marginTop: -10,
  },
  continueButton: {
    width: 200,
    height: 50,
    backgroundColor: '#4706ff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    top:30
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    right:13,
    top:12
  },
  enterIcon: {
    top: -10,
    left:45
  },
});

export default AddCardScreen;
