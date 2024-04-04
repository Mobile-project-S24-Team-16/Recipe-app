import React from 'react';
import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { register, logout } from '../components/Auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/Config';

const Registration = ({ navigation }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  const handleRegister = () => {
    if (!nickname || !email || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    register(email, password, nickname);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setNickname('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        navigation.navigate('Login');
      }
    });
  }

  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>You are already logged in</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Go to Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => logout()}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
  else {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nickname:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your nickname"
            onChangeText={(nickname) => setNickname(nickname.trim())}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            onChangeText={(email) => setEmail(email.trim())}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            onChangeText={(password) => setPassword(password)}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password:</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            onChangeText={(confirmPassword) => setConfirmPassword(confirmPassword)}
            secureTextEntry={true}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register account</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Already have an account? Login here!</Text>
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
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
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
  loginText: {
    marginTop: 20,
    color: '#007AFF',
    textDecorationLine: 'underline',
  }
});

export default Registration;
