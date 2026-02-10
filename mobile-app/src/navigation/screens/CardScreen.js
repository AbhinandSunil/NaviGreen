import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  SafeAreaView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../config';
import { useIsFocused } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView } from 'react-native';

const windowWidth = Dimensions.get('window').width;

const CardScreen = ({ route }) => {
  const navigation = useNavigation();
  const [cards, setCards] = useState([]);
  const [totalEcos, setTotalEcos] = useState(0); 
  const { newCard = {} } = route.params || {};

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false, 
    });
  }, [navigation]);

  const isFocused = useIsFocused(); 
  useEffect(() => {
    if (isFocused) {
      const fetchTotalEcos = async () => {
        const totalEcosRef = db.ref('/TotalEcos');
        totalEcosRef.once('value', (snapshot) => {
          const value = snapshot.val();
          setTotalEcos(value || 0); 
        });
      };
      fetchTotalEcos();
    }
    if (route.params?.newCard) {
      setCards(prevCards => [...prevCards, route.params.newCard]);
      navigation.setParams({ newCard: null }); 
    }
  }, [isFocused, route.params?.newCard, navigation]);
  
  const handleAddCard = () => {
    navigation.navigate('AddCard');
  };

  const handleRedeem = (card) => {
    console.log('Redeem button pressed with ecos:', card.ecos);
    navigation.navigate('Redeem', { ecos: card.ecos, cardID: card.id });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.headingText}>NaviTransit</Text>
      <Text style={styles.headingText2}>Your Wallet, Your Eco-Statement</Text>
      <View style={styles.container}>
        {cards.length === 0 ? (
          <TouchableOpacity style={styles.addButton} onPress={handleAddCard}>
            <Ionicons name="add-circle-outline" size={70} color="blue" />
          </TouchableOpacity>
        ) : (
          cards.map((card, index) => (
            <View key={index} style={styles.cardContainer}>
              <Image
                source={{ uri: card.image }}
                style={styles.cardImage}
                resizeMode="contain"
              />
              <View style={styles.statsCard}>
              <Text style={styles.valText}>CardID</Text>
              <Text style={styles.cardId}>{card.id}</Text>
              </View>
              <View style={styles.statsCard2}>
              <Text style={styles.valText2}>Points in Account</Text>
              <Text style={styles.dataText}>{card.points}</Text>
              </View>
              <View style={styles.statsCard3}>
              <Text style={styles.valText3}>Total Ecos</Text>
              <Text style={styles.dataText2}>{totalEcos}</Text>
              </View>
              <View style={styles.transaction}>
              <View style={styles.bus}>
              <Ionicons name="bus" size={31} color="#21007F" />
              </View>
              <View style={styles.ticket}>
              <Ionicons name="ticket" size={31} color="#21007F" />
              </View>
              <Text style={styles.headingText3}>Latest Transactions</Text>
              <Text style={styles.transactionText}>Muweilah to Etisalat MS</Text>
              </View>
              <View style={styles.transaction2}>
              <View style={styles.bus2}>
              <Ionicons name="bus" size={31} color="#21007F" />
              </View>
              <View style={styles.ticket2}>
              <Ionicons name="ticket" size={31} color="#21007F" />
              </View>
              <Text style={styles.transactionText2}>Muweilah to Etisalat MS</Text>
              </View>
              <TouchableOpacity style={styles.redeemButton} onPress={() => handleRedeem(card)}>
              <MaterialCommunityIcons name="account-cash" size={30} color="white" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fbfcf6"
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#fbfcf6"
  },
  headingText:{
    fontSize: 33,
    top:10,
    left:17,
    fontWeight: "bold"
  },
  headingText2:{
    fontSize: 17,
    top:12,
    flex:1,
    right:-17,
    color:"#B6B6B6"
  },
  headingText3:{
    fontSize: 19,
    top:-80,
    right:80,
    color:"black",
    fontWeight:"bold"
  },
  addButton: {
    position: 'absolute',
    top:-10
  },
  cardContainer: {
    width: 370,
    height: 250,
    top: -100,
    borderRadius: 10,
    backgroundColor: '#fbfcf6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  cardId: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    top: 1,
    left:-42
  },
  dataText: {
    top: -1,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    left:-60
  },
  dataText2: {
    top: -30,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    left:-50
  },
  redeemButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 50,
    width:55,
    height:55,
    backgroundColor: '#21007F',
    top:-320,
    left:128
  },
  redeemButtonText: {
    color: 'white',
    fontSize: 13.5,
    fontWeight: "bold",
    top:20,
    right:-2
  },
  statsCard: {
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 8,
    width: 160, 
    height: 58, 
    right:85, 
    top:-20,
    shadowColor: '#B7B6FF', 
    shadowOffset: {
      width: -1,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  statsCard2: {
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 8, 
    width: 160, 
    height: 58, 
    right:85,
    top:-15,
    shadowColor: '#B7B6FF',
    shadowOffset: {
      width: -1,
      height: 1,
    },
    shadowOpacity: 1, 
    shadowRadius: 3, 
  },
  statsCard3: {
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 8, 
    width: 160, 
    height: 121, 
    right:-85,
    top:-135,
    shadowColor: '#B7B6FF',
    shadowOffset: {
      width: -1,
      height: 1,
    },
    shadowOpacity: 1, 
    shadowRadius:3, 
  },
  transaction: {
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: 'white',
    borderRadius: 8, 
    width: "90%", 
    height: 60, 
    right:0, 
    padding:6,
    top:-50,
    shadowColor: '#B7B6FF', 
    shadowOffset: {
      width: -1,
      height: 1,
    },
    shadowOpacity: 1, 
    shadowRadius: 3, 
  },
  transaction2: {
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    
    borderRadius: 8, 
    width: "90%", 
    height: 60, 
    right:0, 
    padding:6,
    top:-40,
    shadowColor: '#B7B6FF', 
    shadowOffset: {
      width: -1,
      height: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 3, 
  },
  bus:{
    left:-130,
    top:35
  },
  bus2:{
    left:-130,
    top:25
  },
  ticket:{
    left:130,
    top:6
  },
  ticket2:{
    left:130,
    top:-5
  },
  transactionText: {
    left:0,
    fontSize: 16,
    top:-42
  },
  transactionText2: {
    left: 0,
    fontSize: 16,
    top:-32
  },
  valText:{
    fontSize: 15,
    top:0,
    left:-43,
    fontWeight: "500"
  },
  valText2:{
    fontSize: 15,
    top:0,
    left:-4,
    fontWeight: "500"
  },
  valText3:{
    fontSize: 15,
    top:-32,
    left:-31,
    fontWeight: "500"
  },
});

export default CardScreen;
