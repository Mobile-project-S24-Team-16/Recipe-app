import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

const LoginInformationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
        />
      </View>
      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forgot your password? Reset it by clicking this.</Text>
      </TouchableOpacity>
      <TouchableOpacity>
        <Text style={styles.registerText}>Don't have an account yet? Register by clicking this.</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    width: '100%',
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
