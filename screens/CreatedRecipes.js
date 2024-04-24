import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { db, USERS_REF, RECIPES_REF } from '../firebase/Config';
import { auth } from '../firebase/Config';
import { doc, collection, getDocs, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';


const CreatedRecipes = () => {

    const [recipes, setRecipes] = useState([]);
    const [editedRecipes, setEditedRecipes] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, USERS_REF, auth.currentUser.uid, RECIPES_REF), (querySnapshot) => {
            const recipes = [];
            querySnapshot.forEach((doc) => {
                if (doc.data().userId === auth.currentUser.uid) {
                    recipes.push({
                        id: doc.id,
                        ...doc.data()
                    });
                }
            }
            );
            setRecipes(recipes);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        setEditedRecipes(recipes);
    }, [recipes]);

    const handleDeleteRecipe = async (id) => {
        Alert.alert(
            'Delete recipe',
            'Are you sure you want to delete this recipe?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    onPress: async () => {
                        await deleteDoc(doc(db, USERS_REF, auth.currentUser.uid, RECIPES_REF, id));
                    }
                }
            ]
        );
    }

    const handleInputChange = (id, field, value) => {
        setEditedRecipes(editedRecipes.map(recipe => 
            recipe.id === id ? { ...recipe, [field]: value } : recipe
        ));
    }       

    const handleEditRecipe = async (id) => {
        const recipe = editedRecipes.find(recipe => recipe.id === id);
        try{
            await updateDoc(doc(db, USERS_REF, auth.currentUser.uid, RECIPES_REF, id), recipe);
            Alert.alert('Recipe updated successfully');
        }
        catch (error) {
            console.error('Error updating recipe:', error);
            Alert.alert('Error updating recipe');
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <Text style={styles.header}>My recipes</Text>
                {editedRecipes.map((recipe) => (
                    <View style={styles.recipeContainer} key={recipe.id}>
                        <TextInput
                           style={styles.recipeName}
                           value={recipe.recipeName}
                           onChangeText={(value) => handleInputChange(recipe.id, 'recipeName', value)}
                        />
                        <View style={styles.timeDifficulty}>
                            <Text style={styles.detailHeader}>Prepare time:</Text>
                            <TextInput
                                style={styles.timeDifficultyText}
                                value={recipe.prepareTime}
                                onChangeText={(value) => handleInputChange(recipe.id, 'prepareTime', value)}
                            />
                            <Text>min.</Text>
                        </View>
                        <View style={styles.timeDifficulty}>
                            <Text style={styles.detailHeader}>Difficulty:</Text>
                            <TextInput
                                style={styles.timeDifficultyText}
                                value={recipe.difficulty}
                                onChangeText={(value) => handleInputChange(recipe.id, 'difficulty', value)}
                            />
                        </View>
                        <Text style={styles.detailHeader}>Ingredients: </Text>
                        <TextInput
                            style={styles.ingredientsContainer}
                            value={recipe.ingredients}
                            onChangeText={(value) => handleInputChange(recipe.id, 'ingredients', value)}
                            multiline
                        />
                        <Text style={styles.detailHeader}>Instructions: </Text>
                        <TextInput
                            style={styles.instructions}
                            value={recipe.instructions}
                            onChangeText={(value) => handleInputChange(recipe.id, 'instructions', value)}
                            multiline
                        />
                        <TouchableOpacity onPress={() => handleEditRecipe(recipe.id, recipe)} style={styles.button}>
                            <Text style={styles.editText}>Save edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteRecipe(recipe.id, recipe)} style={styles.button}>
                            <Text style={styles.deleteText}>Delete recipe</Text>
                        </TouchableOpacity>
                    </View>
                ))}
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
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
    recipeContainer: {
        backgroundColor: '#f9f4e2ff',
        marginBottom: 20,
        width: '100%',
        padding: 10,
        borderRadius: 5,
        alignItems: 'flex-start'
    },  
    detailHeader: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    recipeName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    timeDifficulty: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeDifficultyText: {
        marginLeft: 5,
        marginTop: 1,
    },
    ingredientsContainer: {
        marginLeft: 10,
        marginBottom: 10,
        marginTop: 10,
    },
    instructions: {
        marginBottom: 10,
        marginTop: 10,
    },
    editText: {
        color: 'blue',
    },
    deleteText: {
        color: 'red',
    },
    button: {
        alignSelf: 'flex-end',
        marginBottom: 5
    }
});

export default CreatedRecipes;