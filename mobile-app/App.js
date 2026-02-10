import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from './navigation/screens/LoginScreen';
import HomeScreen from './navigation/screens/HomeScreen';
import SignUpScreen from './navigation/screens/SignUpScreen';
import ProfileScreen from './navigation/screens/ProfileScreen';
import CardScreen from './navigation/screens/CardScreen';
import MapScreen from './navigation/screens/MapScreen';
import AccelerometerScreen from './navigation/screens/AccelerometerScreen';
import FitnessScreen from './navigation/screens/FitnessScreen';
import FlashMessage from 'react-native-flash-message';
import EcosScreen from './navigation/screens/EcosScreen';
import CaloriesScreen from './navigation/screens/CaloriesScreen';
import CFScreen from './navigation/screens/CFScreen';
import AddCardScreen from './navigation/screens/AddCardScreen';
import RedeemScreen from './navigation/screens/RedeemScreen';
import RewardScreen from './navigation/screens/RewardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const homeName = "Home";
const profileName = "Profile";
const cardName = "NaviTransit";
const mapName = "Maps";
const accelerometerName = "Accelerometer";
const fitnessName = "Fitness";
const ecos = "Ecos";
const calories= 'Calories';
const cfscreen = 'Carbon';
const addCard = "AddCard";
const redeem = "Redeem";
const reward = "Reward";

const MainTabNavigator = () => (
  <Tab.Navigator
    initialRouteName={homeName}
    screenOptions={({ route }) => ({
      tabBarShowLabel: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === homeName) {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === profileName) {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === cardName) {
          iconName = focused ? 'card' : 'card-outline';
        } else if (route.name === mapName) {
          iconName = focused ? 'map' : 'map-outline';
        }else if (route.name === reward) {
          iconName = focused ? 'cart' : 'cart-outline';
        }

       
        return <Ionicons name={iconName} size={size} color={color} />;
      },
    })}
    tabBarOptions={{
      activeTintColor: '#00E44D',
      inactiveTintColor: 'gray',
    }}
  >
    <Tab.Screen name={homeName} component={HomeScreen} />
    <Tab.Screen name={profileName} component={ProfileScreen} />
    <Tab.Screen name={cardName} component={CardScreen} />
    <Tab.Screen name={mapName} component={MapScreen} />
    
    
  </Tab.Navigator>
);

const MainStackNavigator = () => (
  <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="Home" component={MainTabNavigator} />
    <Stack.Screen name={accelerometerName} component={AccelerometerScreen} />
    <Stack.Screen name={fitnessName} component={FitnessScreen} />
    <Stack.Screen name={ecos} component={EcosScreen} />
    <Stack.Screen name={calories} component={CaloriesScreen} />
    <Stack.Screen name={cfscreen} component={CFScreen} />
    <Stack.Screen name={addCard} component={AddCardScreen} />
    <Stack.Screen name={redeem} component={RedeemScreen} />

  </Stack.Navigator>
);

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="MainStackNavigator" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MainStackNavigator" component={MainStackNavigator} />
        </Stack.Navigator>
        <FlashMessage position="top" />
      </NavigationContainer>
    </>
  );
};

export default App;
