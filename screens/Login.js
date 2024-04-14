import React from 'react';
import { useState, useEffect } from 'react';
import { login, logout, } from '../components/Auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/Config';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const LoginInformationScreen = ({ navigation }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    login(email, password);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail('');
        setPassword('');
        navigation.navigate('Home');
      }
    });
  }

  const handleLogout = () => {
    logout();
  }

  if (isLoggedIn) {
    return(
    <View style={styles.container}>
      <Text style={styles.title}>You are already logged in</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
        <Text style={styles.buttonText}>Go to Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
    );
  }
  else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            onChangeText={(email) => setEmail(email.trim())}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
          <Text style={styles.forgotPasswordText}>Forgot your password? Reset it by clicking this.</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
          <Text style={styles.registerText}>Don't have an account yet? Register by clicking this.</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFC786',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  button: {
    width: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    marginTop: 10,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  registerText: {
    marginTop: 20,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});

export default LoginInformationScreen;
