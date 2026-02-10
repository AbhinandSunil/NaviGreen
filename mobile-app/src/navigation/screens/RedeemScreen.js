import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../config';

const RedeemScreen = ({ route, navigation }) => {
  const [ecosToRedeem, setEcosToRedeem] = useState('');
  const [ecos, setEcos] = useState(0); 
  const { cardID } = route.params || {};

  useEffect(() => {
    if (cardID) {
      const totalEcosRef = db.ref('/TotalEcos');
      totalEcosRef.once('value', (snapshot) => {
        const value = snapshot.val();
        setEcos(value || 0); 
      });
    }
  }, [cardID]);

  const handleRedeemEcos = () => {
    const numericEcosToRedeem = parseInt(ecosToRedeem);
    if (isNaN(numericEcosToRedeem) || numericEcosToRedeem <= 0) {
      Alert.alert("Error", "Please enter a valid number of ecos to redeem.");
      return;
    }
  
    const userRef = db.ref('/');
    userRef.once('value', (snapshot) => {
      const userData = snapshot.val();
      console.log("User data:", userData);
  
      if (userData) {
        let totalEcos = 0;
        Object.values(userData.predictions || {}).forEach(day => {
          totalEcos += day.ecos || 0;
        });
  
        if (totalEcos >= numericEcosToRedeem) {
          userRef.update({
            TotalEcos: userData.TotalEcos - numericEcosToRedeem,
            PointsInAccount: (userData.PointsInAccount || 0) + numericEcosToRedeem
          }, (error) => {
            if (error) {
              Alert.alert("Error", "Transaction failed: " + error.message);
            } else {
              setEcos(userData.TotalEcos - numericEcosToRedeem);
              Alert.alert("Success", "Ecos redeemed successfully.");
              navigation.navigate("NaviTransit");
            }
          });
        } else {
          Alert.alert("Error", "Not enough ecos to redeem this amount.");
        }
      } else {
        Alert.alert("Error", "No valid ecos data available for this card ID.");
      }
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Image
          source={{ uri: 'https://i.imgur.com/HXvyf0s.png' }}
          style={styles.cardImage}
        />
        <Text style={styles.header}>Redeem</Text>
        <Text style={styles.header2}>Points to Perks in two clicks</Text>
        <Text style={styles.ecosText}>Ecos: {ecos}</Text>
        <TextInput
          style={styles.input}
          ardType="numeric"
            placeholder="Enter ecos to redeem"
            placeholderTextColor="#A9A9A9"
            value={ecosToRedeem}
            onChangeText={setEcosToRedeem}
            keyboardType="numeric"
            underlineColorAndroid="transparent"
          />
          <View style={styles.lineStyle} />
        <TouchableOpacity style={styles.redeemButton} onPress={handleRedeemEcos}>
          <Text style={styles.redeemButtonText}>Redeem Ecos</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  cardImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    top:200
  },
  ecosText: {
    fontSize: 25,
    top:-280,
    fontWeight: "bold"
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 12,
  },
  input: {
    fontSize: 18,
    color: '#000',
    width: 500,
    height: 30,
    borderWidth: 0, 
    textAlign: 'center',
    top:-235
  },
  lineStyle: {
    width: 270,
    height: 1,
    backgroundColor: '#000',
    top:-230
  },
  redeemButton: {
    alignItems:"center",
    justifyContent:"center",
    backgroundColor: '#00E44D',
    borderRadius: 10,
    top:-200,
    height:60,
    width:130
  },
  redeemButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: "bold"
  },
  header:{
    fontSize: 33,
    top:-120,
    left:-105,
    fontWeight: "bold"
  },
  header2:{
    fontSize: 17,
    top:-120,
    flex:1,
    right:62,
    color:"#B6B6B6"
  },
});

export default RedeemScreen;
