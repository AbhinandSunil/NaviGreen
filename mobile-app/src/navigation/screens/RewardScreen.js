import React from 'react';
import { Text, View, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';

const RewardScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Image source={{ uri: 'https://i.imgur.com/MWwHZIj.jpeg' }} style={styles.image} />
        <Text style={styles.heading}>Bus Ticket</Text>
        <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Redeem</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.box}>
        <Image source={{ uri: 'https://i.imgur.com/rT2rrV4.jpeg' }} style={styles.image} />
        <Text style={styles.heading}>IMG Ticket</Text>
        <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Redeem</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.box}>
        <Image source={{ uri: 'https://i.imgur.com/mKf3JQg.jpeg' }} style={styles.image} />
        <Text style={styles.heading3}>Atlantis</Text>
        <Text style={styles.heading2}>Ticket</Text>
        <TouchableOpacity style={styles.button2}>
          <Text style={styles.buttonText}>Redeem</Text>
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
    backgroundColor: "white"
  },
  heading:{
    flex:1,
    fontSize: 16,
    fontWeight: "bold",
    top:-40,
    left:50,
    alignItems: "center",
  },
  heading2:{
    fontSize: 16,
    fontWeight: "bold",
    top:-25,
    left:-5,
  },
  heading3:{
   
    fontSize: 16,
    fontWeight: "bold",
    top:-45,
    left:50,
    alignItems: "center",
  },
  box: {
    backgroundColor: "#E0DFFB",
  
    width: '90%',
    height: 180,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    
    borderRadius: 18,
    padding: 10,
    shadowColor: '#000', // These four lines are for the shadow effect
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3, 
  },
  image: {
    width: 170,
    height: '100%',
    marginRight: 10,
    borderRadius: 15
  },
  button: {
    backgroundColor: '#5D5FEF',
    padding: 14,
    borderRadius: 12,
    top:30,
    left:-17,
    shadowColor: '#000', // These four lines are for the shadow effect
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3, 
  },
  button2: {
    backgroundColor: '#5D5FEF',
    padding: 14,
    borderRadius: 12,
    top:30,
    left:-70,
    shadowColor: '#000', // These four lines are for the shadow effect
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3, 
  },
  buttonText:{
    color:"white"
  }
});

export default RewardScreen;
