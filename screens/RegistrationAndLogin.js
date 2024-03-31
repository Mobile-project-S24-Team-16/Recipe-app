import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const RegistrationAndLogin = () => {
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require("../assets/images/foodRecipeAppLogo.jpeg")}
                    style={{
                        height: 180,
                        width: 180,
                        position: "absolute",
                    }}
                />
            </View>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton}>
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
