import { View, Text } from 'react-native'
import React from 'react'
import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db, USERS_REF } from '../firebase/Config'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { logout } from '../components/Auth'
import { getDoc, doc, onSnapshot } from 'firebase/firestore'
import { StyleSheet } from 'react-native'
import AccountNavigator from '../components/AccountNavigator'
import { MaterialIcons } from '@expo/vector-icons'

const MyAccount = ({ navigation }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [nickname, setNickname] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let unsubscribeSnapshot;
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
            }
            if (user) {
                setIsLoggedIn(true);
                setIsLoading(true);
                const docRef = doc(db, USERS_REF, auth.currentUser.uid);
                unsubscribeSnapshot = onSnapshot(docRef, (doc) => {
                    if (doc.exists()) {
                        setNickname(doc.data().nickname);
                        setIsLoading(false);
                    } else {
                        console.log('No such document!');
                    }
                });
            } else {
                setIsLoggedIn(false);
                setIsLoading(false);
            }
        });
        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
            }
        }
    }, []);

    const handleLogout = () => {
        logout();
        setIsLoggedIn(false);
    }

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }
    if (!isLoggedIn) {
        return (
            <View style={styles.loggedoutContainer}>
                <Text>You are not logged in</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Registration')}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
        );
    }
    else {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
                            <MaterialIcons name="logout" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.nickname}>{nickname}</Text>
                        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Settings')}>
                            <MaterialIcons name="settings" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
                <AccountNavigator />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 0.3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFC786',
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFC786',
        paddingHorizontal: 20,
    },
    button: {
        width: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 5,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    headerButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 50,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    nickname: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 5,
        backgroundColor: '#FFC786',
    },
    loggedoutContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFC786',
        paddingHorizontal: 20,
    },
});

export default MyAccount