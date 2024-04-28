import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { db, USERS_REF, RECIPES_REF } from '../firebase/Config';
import { RadioButton } from 'react-native-paper';
import { auth } from '../firebase/Config';
import {
    collection,
    addDoc,
    doc
} from "firebase/firestore";

const AddRecipe = () => {

    const [recipeName, setRecipeName] = useState('');
    const [prepareTime, setPrepareTime] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');

    const addRecipe = async () => {
        if (!recipeName || !prepareTime || !difficulty || !ingredients || !instructions) {
            alert('Please fill in all fields');
            return;
        }
        try {
            const user = auth.currentUser;
            const recipe = {
                recipeName,
                prepareTime,
                difficulty,
                ingredients,
                instructions,
                userId: user.uid,
            }
            const docRef = await addDoc(collection(db, USERS_REF, auth.currentUser.uid, RECIPES_REF), recipe);
            console.log('Recipe added successfully', docRef.id);
            Alert.alert('Recipe added successfully');
        } catch (e) {
            console.error('Error adding document: ', e);
        }
        setRecipeName('');
        setPrepareTime('');
        setDifficulty('Easy');
        setIngredients('');
        setInstructions('');
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.title}>Recipe name</Text>
                <TextInput style={styles.input} value={recipeName} onChangeText={setRecipeName} placeholder="Enter recipe name" />
                <Text style={styles.title}>Prepare time</Text>
                <TextInput inputMode='numeric' value={prepareTime} onChangeText={setPrepareTime} style={styles.input} placeholder="Enter prepare time (min.)" />
                <Text style={styles.title}>Difficulty</Text>
                <RadioButton.Group onValueChange={setDifficulty} value={difficulty}>
                    <View style={styles.radioBackground}>
                    <RadioButton.Item label="Easy" value="Easy" />
                    <RadioButton.Item label="Medium" value="Medium" />
                    <RadioButton.Item label="Hard" value="Hard" />
                    </View>
                </RadioButton.Group>
                <Text style={styles.title}>Ingredients</Text>
                <TextInput style={styles.input} value={ingredients} onChangeText={setIngredients} placeholder={"Enter each ingredient on a new line \n - Ingredient 1 \n - Ingredient 2 \n ..."} multiline />
                <Text style={styles.title}>Instructions</Text>
                <TextInput style={styles.input} value={instructions} onChangeText={setInstructions} placeholder="Enter instructions" multiline />
                <TouchableOpacity style={styles.button} onPress={addRecipe}>
                    <Text style={styles.buttonText}>Add recipe</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
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
        width: '100%',
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#FFF',
        borderRadius: 5,
        textAlignVertical: 'top',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        marginBottom: 10,
        marginTop: 10,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
    },
    radioBackground: {
        backgroundColor: '#FFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default AddRecipe;