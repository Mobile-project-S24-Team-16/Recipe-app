import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { db, USERS_REF, RECIPES_REF } from '../firebase/Config';
import { RadioButton } from 'react-native-paper';
import { auth } from '../firebase/Config';
import {
    collection,
    addDoc,
    doc
} from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../firebase/Config';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AddRecipe = () => {

    const [recipeName, setRecipeName] = useState('');
    const [prepareTime, setPrepareTime] = useState('');
    const [difficulty, setDifficulty] = useState('Easy');
    const [ingredients, setIngredients] = useState('');
    const [instructions, setInstructions] = useState('');
    const [image, setImage] = useState(null);

    // Request permission to access the camera roll
    const handleAddImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        // Launch the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);
    
        // Set the image if the user selected one
        if (!result.cancelled) {
            setImage(result.assets[0].uri);
        }
    }

    // Upload image to Firebase Storage
    const uploadImage = async () => {
        const storageRef = ref(storage, `images/${auth.currentUser.uid}/${recipeName.replace(/\s/g, '-')}`);
    
        // Fetch the image data
        const response = await fetch(image);
        const blob = await response.blob();
    
        // Upload the image
        const uploadTask = uploadBytesResumable(storageRef, blob);

        // Return a promise that resolves when the image is uploaded
        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed', 
                (snapshot) => {
                    console.log('Upload progress:', snapshot.bytesTransferred / snapshot.totalBytes * 100 + '%');
                }, 
                (error) => {
                    console.error('Error uploading file', error);
                    reject(error);
                }, 
                async () => {
                    const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log('Image URL:', imageUrl);
                    resolve(imageUrl);
                }
            );
        });
    }
    
    // Add recipe to Firestore
    const addRecipe = async () => {
        if (!recipeName || !prepareTime || !difficulty || !ingredients || !instructions) {
            alert('Please fill in all fields');
            return;
        }
        try {
            const user = auth.currentUser;
            let imageUrl = null;

            // Upload the image if the user selected one
            if (image) {
                imageUrl = await uploadImage();
            }

            // Add the recipe to Firestore
            const recipe = {
                recipeName,
                prepareTime,
                difficulty,
                ingredients,
                instructions,
                userId: user.uid,
                image: imageUrl,
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
        setImage(null);
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
                    <RadioButton.Item color='#007AFF' label="Easy" value="Easy" />
                    <RadioButton.Item color='#007AFF' label="Medium" value="Medium" />
                    <RadioButton.Item color='#007AFF' label="Hard" value="Hard" />
                    </View>
                </RadioButton.Group>
                <Text style={styles.title}>Ingredients</Text>
                <TextInput style={styles.input} value={ingredients} onChangeText={setIngredients} placeholder={"Enter each ingredient on a new line \n - Ingredient 1 \n - Ingredient 2 \n ..."} multiline />
                <Text style={styles.title}>Instructions</Text>
                <TextInput style={styles.input} value={instructions} onChangeText={setInstructions} placeholder="Enter instructions" multiline />
                {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                <TouchableOpacity style={styles.button} onPress={handleAddImage}>
                    <MaterialCommunityIcons style={{marginRight: 5, marginLeft: -5}} name="image-plus" size={24} color="white" />
                    <Text style={[styles.buttonText]}>Add image</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={addRecipe}>
                    <MaterialCommunityIcons style={{marginRight: 5, marginLeft: -5}} name="plus" size={24} color="white" />
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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