import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, Image, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleLogin = () => { 
    const { email, password } = form;
    const auth = getAuth();
  
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('User ID:', userCredential.user.uid);
      AsyncStorage.setItem('userId', userCredential.user.uid)
        .then(() => {
          console.log('User ID stored successfully');
          navigation.navigate('Home');
          Alert.alert("Login Successful");
        })
        .catch((error) => {
          console.error('Error storing user ID:', error);
          Alert.alert("Login Failed", "An error occurred while processing your request. Please try again.");
        });
    })
    .catch((error) => {
      console.error('Login failed:', error);
      Alert.alert("Login Failed", "Please try again.");
    });
};
  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://img.hotimg.com/navigreenlogo.png' }}
            style={styles.headerImg}
          />
          <Text style={styles.title}>
            Sign in to <Text style={{ color: '#00F5A0' }}>NaviGreen</Text>
          </Text>
          <Text style={styles.subtitle}>
            Hop on board. Join the Eco-Ride Accord!
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.input}>
            <Text style={styles.inputLabel}>Email address</Text>
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(email) => setForm({ ...form, email })}
              placeholder="john@example.com"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              value={form.email}
            />
          </View>

          <View style={styles.input}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              autoCorrect={false}
              onChangeText={(password) => setForm({ ...form, password })}
              placeholder="********"
              placeholderTextColor="#6b7280"
              style={styles.inputControl}
              secureTextEntry={true}
              value={form.password}
            />
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
            }}
            style={styles.forgotPasswordLink}
          >
            <Text style={styles.formLink}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            style={styles.signupContainer}
          >
            <Text style={styles.signupLink}>
              Don't have an account?{' '}
              <Text style={{ textDecorationLine: 'underline' }}>Sign up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  title: {
    fontSize: 31,
    fontWeight: '700',
    color: '#1D2A32',
    marginBottom: 7,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#929292',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 36,
  },
  headerImg: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 29,
  },
  form: {
    marginBottom: 24,
    paddingHorizontal: 24,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: '600',
    color: '#075eec',
    textAlign: 'center',
  },
  formFooter: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    letterSpacing: 0.15,
  },
  input: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: '600',
    color: '#222',
    marginBottom: 13,
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
    marginTop: 50,
  },
  signupLink: {
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;

