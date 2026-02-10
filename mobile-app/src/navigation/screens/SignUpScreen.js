import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StyleSheet, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/core';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../../firebase';


const SignUpScreen = ({ navigation }) => {
  const [form, setForm] = useState({ fullname:'', email: '', password: '', confirmPassword: ''  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
          navigation.navigate("Home", { userId: userCredential.user.uid });

      }
    });
    return unsubscribe;
  }, []);
  
  
  
  const handleSignup = () => {
    const { fullname, email, password, confirmPassword } = form;
  
    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match");
      return;
    }
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
       
        const user = userCredential.user;
        console.log("User signed up:", user.uid);
  
        const userProfileData = {
          fullname: fullname,
          email: email,
          PointsInAccount: 0,
          TotalEcos: 0,
          cardID: '',
          weeklyFitnessData: {
            Sunday: { steps: 0, calories: 0, distance: 0 },
            Monday: { steps: 0, calories: 0, distance: 0 },
            Tuesday: { steps: 0, calories: 0, distance: 0 },
            Wednesday: { steps: 0, calories: 0, distance: 0 },
            Thursday: { steps: 0, calories: 0, distance: 0 },
            Friday: { steps: 0, calories: 0, distance: 0 },
            Saturday: { steps: 0, calories: 0, distance: 0 },
            
          }
        };
  
       
        const userRef = doc(firestore, 'users', user.uid);
        return setDoc(userRef, userProfileData);
      })
      .then(() => {
        console.log("User profile created successfully");
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.error("Error during sign-up or profile creation:", error);
        Alert.alert(error.message);
      });
    }
  
  



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View style={styles.container}>
        <KeyboardAwareScrollView>
          <View style={styles.header}>
            <Text style={styles.title}>
              Begin <Text style={{ color: '#00F5A0' }}>Navigating</Text>
            </Text>

            <Text style={styles.subtitle}>
              Create an account to continue
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Full Name</Text>

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                onChangeText={fullname => setForm({ ...form, fullname })}
                placeholder="John Doe"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.fullname} />
            </View>
            </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email address</Text>

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={email => setForm({ ...form, email })}
                placeholder="john@example.com"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.email} />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>

              <TextInput
                autoCorrect={false}
                onChangeText={password => setForm({ ...form, password })}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.password} />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Confirm Password</Text>

              <TextInput
                autoCorrect={false}
                onChangeText={confirmPassword =>
                  setForm({ ...form, confirmPassword })
                }
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.confirmPassword} />
            </View>

            <TouchableOpacity style={styles.loginButton} onPress={handleSignup}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

    

        </KeyboardAwareScrollView>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={{ marginTop: 'auto' }}>
          <Text style={styles.formFooter}>
            Already have an account?{' '}
            <Text style={{ textDecorationLine: 'underline' }}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
    container: {
      paddingVertical: 24,
      paddingHorizontal: 0,
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: 0,
    },
    header: {
      marginVertical: 24,
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#000000',
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 14,
      fontWeight: '500',
      color: '#929292',
      marginBottom: 20,
    },
    
    form: {
      paddingHorizontal: 24,
    },
    formAction: {
      marginVertical: 24,
    },
    formFooter: {
      fontSize: 15,
      fontWeight: '500',
      color: '#222',
      textAlign: 'center',
    },
    
    input: {
      marginBottom: 19,
    },
    inputLabel: {
      fontSize: 17,
      fontWeight: '600',
      color: '#222',
      marginBottom: 11,
    },
    inputControl: {
      height: 44,
      backgroundColor: '#E8FCEF',
      paddingHorizontal: 16,
      borderRadius: 12,
      fontSize: 15,
      fontWeight: '500',
      color: '#222',
    },
    
  loginButton: {
    backgroundColor: '#00E44D', 
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%', 
    alignItems: 'center',
    marginTop: 20, 
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  forgotPasswordLink: {
    marginTop: 10, 
  },
  
  signupContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  signupLink: {
    textDecorationLine: 'underline',
  },
  });
  
  

export default SignUpScreen;
