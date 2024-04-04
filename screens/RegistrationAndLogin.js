import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const RegistrationAndLogin = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require("../assets/images/foodRecipeAppLogo.png")}
                    style={{
                        height: 180,
                        width: 180,
                        position: "absolute",
                    }}
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Registration")}>
                <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={() => navigation.navigate("Home")}>
                <Text style={styles.skipButtonText}>Skip and continue to home</Text>
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
    },
    logoContainer: {
        marginBottom: 30,
        borderRadius: 100,
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoImage: {
        flex: 1,
        width: undefined,
        height: undefined,
    },
    button: {
        width: '80%',
        marginVertical: 10,
        paddingVertical: 15,
        backgroundColor: '#E0E0E0',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
    },
    skipButton: {
        marginTop: 50,
    },
    skipButtonText: {
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default RegistrationAndLogin;
