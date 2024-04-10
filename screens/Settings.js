import { View, Text, StyleSheet, TextInput } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RadioButton } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { auth } from '../firebase/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY } from '../components/constants';
// import { List } from 'react-native-paper';


const Settings = ({ navigation }) => {

    const [unit, setUnit] = useState('metric');

    const saveUnit = async (newUnit) => {
        try {
            const jsonValue = JSON.stringify(newUnit);
            await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        } catch (e) {
            console.log(e);
        }
    }

    loadUnit = async () => {
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
    },[]);

    useEffect(() => {
        saveUnit(unit);
    }, [unit]);


    return (
        <View style={styles.container}>
            <TextInput 
            placeholder='Old Password'
            style={styles.input}
            />
            <TextInput
            placeholder='New Password'
            style={styles.input}
            />
            <Text style={styles.headerText}>Change units</Text>
            <RadioButton.Group onValueChange={newUnit => setUnit(newUnit)} value={unit}>
                <View style={styles.radioButtonContainer}>
                    <Text>Metric</Text>
                    <RadioButton value='metric'/>
                </View>
                <View style={styles.radioButtonContainer}>
                    <Text>Imperial</Text>
                    <RadioButton value='imperial'/>
                </View>
            </RadioButton.Group>
            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>DELETE ACCOUNT</Text> 
            </TouchableOpacity>
        </View>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    button: {
        width: '100%',
        backgroundColor: '#FF5252',
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
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 10,
    },
});

export default Settings;
