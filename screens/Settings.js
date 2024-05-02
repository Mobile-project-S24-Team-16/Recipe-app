import { View, Text, StyleSheet, TextInput, Alert, ScrollView, Modal, TouchableOpacity } from 'react-native';
// import { TouchableOpacity } from 'react-native-gesture-handler';
import { RadioButton } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { auth, db, USERS_REF } from '../firebase/Config';
import { doc, collection, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { changePassword, changeEmail, reauthenticate, removeUser } from '../components/Auth';
import { onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../components/constants';
// import { List } from 'react-native-paper';


const Settings = ({ navigation }) => {

    const [unit, setUnit] = useState('metric');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    const saveUnit = async (newUnit) => {
        try {
            const jsonValue = JSON.stringify(newUnit);
            await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        } catch (e) {
            console.log(e);
        }
    }

    const loadUnit = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            if (jsonValue != null) {
                setUnit(JSON.parse(jsonValue));
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        loadUnit();
    }, []);

    useEffect(() => {
        saveUnit(unit);
    }, [unit]);

    useEffect(() => {
        let unsubscribeSnapshot;
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
            }
            if (user) {
                const docRef = doc(db, USERS_REF, auth.currentUser.uid);
                unsubscribeSnapshot = onSnapshot(docRef, (doc) => {
                    if (doc.exists()) {
                        const userData = doc.data();
                        setNickname(userData.nickname);
                        setEmail(userData.email);
                    } else {
                        console.log('No such document!');
                    }
                });
            }
        });
        return () => {
            unsubscribeAuth();
            if (unsubscribeSnapshot) {
                unsubscribeSnapshot();
            }
        }
    }, []);

    const handleChangeNickname = async () => {
        if (!nickname) {
            Alert.alert('Nickname field is empty');
        }
        else {
            const colRef = collection(db, USERS_REF);
            await updateDoc(doc(colRef, auth.currentUser.uid), {
                nickname: nickname
            })
                .then(() => {
                    console.log('Nickname updated successfully!');
                    Alert.alert('Nickname updated successfully!');
                })
                .catch((error) => {
                    console.log('Nickname update failed: ', error.message);
                    Alert.alert('Nickname update failed', error.message);
                })
        }
    }

    const handleChangeEmail = async () => {
        if (!email) {
            Alert.alert('Email field is empty');
        }
        else {
            try {
                await changeEmail(email, db, USERS_REF);
            }
            catch (error) {
                if (error.message.includes('auth/requires-recent-login')) {
                    setModalVisible(true);
                }
                else {
                    console.log('Email update failed: ', error.message);
                    Alert.alert('Email update failed', error.message);
                }
            }
        }
    }

    const handleReauthenticate = async () => {
        try {
            await reauthenticate(password);
            setModalVisible(false);
            Alert.alert('Reauthentication successful!');
            // await changeEmail(email, db, USERS_REF);
            setPassword('');
        }
        catch (error) {
            console.log('Reauthentication failed: ', error.message);
            Alert.alert('Reauthentication failed', error.message);
        }
    }

    const handleChangePassword = async () => {
        if (!password) {
            Alert.alert('Password field is empty');
        }
        else if (!confirmedPassword) {
            Alert.alert('Confirmed password field is empty');
        }
        else if (password !== confirmedPassword) {
            Alert.alert('Passwords do not match');
        }
        else {
            try {
                setPassword('');
                setConfirmedPassword('');
                await changePassword(password);
            }
            catch (error) {
                if (error.message.includes('auth/requires-recent-login')) {
                    setModalVisible(true);
                }
                else {
                    console.log('Password update failed: ', error.message);
                }
            }
        }
    }

    const handleDeleteAccount = async () => {
        Alert.alert(
            'Delete account',
            'Are you sure you want to delete your account?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                       try {
                        await removeUser();
                        navigation.navigate('Login');
                    } catch (error) {
                        if (error.message.includes('auth/requires-recent-login')) {
                            setModalVisible(true);
                        }
                        else {
                            console.log('Account deletion failed: ', error.message);
                        }
                    }
                }
            }
            ]
        );
    }

            return (
                <>
                    <ScrollView>
                        <View style={styles.container}>
                            <Text style={styles.headerText}>Change nickname</Text>
                            <TextInput
                                placeholder='New Nickname'
                                style={styles.input}
                                value={nickname}
                                onChangeText={(nickname) => setNickname(nickname)}
                            />
                            <TouchableOpacity style={styles.button} onPress={handleChangeNickname}>
                                <Text style={styles.buttonText}>Change nickname</Text>
                            </TouchableOpacity>
                            <Text style={styles.headerText}>Change email</Text>
                            <TextInput
                                placeholder='New Email'
                                keyboardType='email-address'
                                style={styles.input}
                                value={email}
                                onChangeText={(email) => setEmail(email)}
                            />
                            <TouchableOpacity style={styles.button} onPress={handleChangeEmail}>
                                <Text style={styles.buttonText}>Change email</Text>
                            </TouchableOpacity>
                            <Text style={styles.headerText}>Change password</Text>
                            <TextInput
                                placeholder='New Password'
                                style={styles.input}
                                value={password}
                                onChangeText={(password) => setPassword(password)}
                                secureTextEntry={true}
                            />
                            <TextInput
                                placeholder=' Confirm new Password'
                                style={styles.input}
                                value={confirmedPassword}
                                onChangeText={(confirmedPassword) => setConfirmedPassword(confirmedPassword)}
                                secureTextEntry={true}
                            />
                            <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
                                <Text style={styles.buttonText}>Change password</Text>
                            </TouchableOpacity>
                            <Text style={styles.headerText}>Change units</Text>
                            <RadioButton.Group onValueChange={newUnit => setUnit(newUnit)} value={unit}>
                                <View style={styles.radioButtonContainer}>
                                    <View style={styles.radioOption}>
                                    <Text>Metric</Text>
                                    <RadioButton color='#007AFF' value='metric' />
                                    </View>
                                    <View style={styles.radioOption}>
                                    <Text>Imperial</Text>
                                    <RadioButton color='#007AFF' value='imperial' />
                                    </View>
                                </View>
                            </RadioButton.Group>
                            <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteButton}>
                                <Text style={styles.buttonText}>DELETE ACCOUNT</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <View style={styles.container}>
                        <Modal
                            animationType='slide'
                            // transparent={true}
                            visible={modalVisible}
                        >
                            <View style={styles.modalContainer}>
                                <Text style={styles.headerText}>Please reauthenticate your login.</Text>
                                <TextInput
                                    placeholder='Password'
                                    style={styles.input}
                                    value={password}
                                    onChangeText={(password) => setPassword(password)}
                                    secureTextEntry={true}
                                />
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                        handleReauthenticate();
                                    }}
                                >
                                    <Text style={styles.buttonText}>Reauthenticate</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </View>
                </>
            )
        }

        const styles = StyleSheet.create({
            container: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFC786',
                paddingHorizontal: 20,
            },
            modalContainer: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFC786',
            },
            input: {
                height: 40,
                width: 300,
                margin: 12,
                borderWidth: 1,
                padding: 10,
                borderRadius: 5,
                backgroundColor: '#FFFFFF',
            },
            radioButtonContainer: {
                backgroundColor: '#FFFFFF',
                padding: 10,
                width: 200,
                borderRadius: 5,
                justifyContent: 'space-between',
                alignItems: 'center',
            },
            radioOption: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            },
            deleteButton: {
                width: '100%',
                backgroundColor: '#FF5252',
                borderRadius: 5,
                padding: 15,
                alignItems: 'center',
                marginTop: 20,
                marginBottom: 20,
            },
            button: {
                width: '60%',
                backgroundColor: '#007AFF',
                borderRadius: 5,
                padding: 15,
                alignItems: 'center',
                marginTop: 10,
                marginBottom: 10,
            },
            buttonText: {
                color: '#FFFFFF',
                fontSize: 18,
                fontWeight: 'bold',
            },
            headerText: {
                fontSize: 24,
                fontWeight: 'bold',
                padding: 10,
            },
        });

        export default Settings;
