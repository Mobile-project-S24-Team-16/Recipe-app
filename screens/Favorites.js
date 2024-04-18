import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image} from 'react-native';
import { collection, query, getDocs, doc, getDoc, deleteDoc, onSnapshot, querySnapshot } from 'firebase/firestore';
//import { useAuthState } from 'react-firebase-hooks/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { db, FAVORITES_REF, USERS_REF } from '../firebase/Config';
import { auth } from '../firebase/Config';
import { logout } from '../components/Auth';
import YoutubeIframe from 'react-native-youtube-iframe';
import { set } from 'firebase/database';
import { Card, Button } from 'react-native-paper';

const Favorites = ({ recipeId }) => {
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    // State to check if the recipe is a favourite
    const [isFavourite, setIsFavourite] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [nickname, setNickname] = useState('');
    const [meal, setMeal] = useState(null);


    // Listen for changes in the user's authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsLoggedIn(true);
                setIsLoading(true);
                const docRef = doc(db, USERS_REF, user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setIsLoading(false);
                    loadFavoriteRecipes(user.uid);
                } else {
                    console.log('No such document!');
                    setIsLoading(false);
                }
            } else {
                setIsLoggedIn(false);
                setIsLoading(false);
                setFavoriteRecipes([]);
                unsubscribe();
            }
        });

        return () => unsubscribe();
    }, []);

    // fetch data from farorite recipe from Firbase Firestore
    const loadFavoriteRecipes = () => {
        const favoriteRef = collection(db, USERS_REF, auth.currentUser.uid, FAVORITES_REF);

        const unsubscribe = onSnapshot(favoriteRef, (querySnapshot) => {
            const favoriteRecipes = [];
            querySnapshot.forEach((doc) => {
                const { recipeId, strMeal, strMealThumb, strCategory, strInstructions, ingredients, measure } = doc.data();
                favoriteRecipes.push({
                    id: doc.id,
                    recipeId,
                    strMeal,
                    strMealThumb,
                    strCategory,
                    strInstructions,
                    ingredients,
                    measure
                });
            });
            setFavoriteRecipes(favoriteRecipes);
        });

        // Clean up the subscription on unmount
        return () => unsubscribe();
    };

    useEffect(() => {
        const unsubscribe = loadFavoriteRecipes(currentUser);
        return unsubscribe;
    }, [currentUser]);

    // remove favorite recipe from Firebase Firestore
    const removeFromFavorites = async (idMeal) => {
        try {
            const favoriteQuery = collection(db, USERS_REF, auth.currentUser.uid, FAVORITES_REF);
            const snapshot = await getDocs(favoriteQuery);
            snapshot.forEach(async (doc) => {
                if (doc.data().recipeId === idMeal) {
                    await deleteDoc(doc.ref);
                    setFavoriteRecipes(favoriteRecipes.filter(recipe => recipe.recipeId !== idMeal));
                    setIsFavourite(false);
                }
            });
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
    };

    // check if the recipe is a favorite
    useEffect(() => {
        const checkIfFavourite = async (idMeal) => {
            const favoriteQuery = collection(db, USERS_REF, auth.currentUser.uid, FAVORITES_REF);
            const snapshot = await getDocs(favoriteQuery);
            snapshot.forEach((doc) => {
                if (doc.data().recipeId === idMeal) {
                    setIsFavourite(true);
                }
            });
        };

        checkIfFavourite(recipeId);
    }, [recipeId]);


    const handleLogout = () => {
        logout();
    };

    // render favorite recipe
    const renderFavoriteRecipe = ({ item }) => (
        <Card style={styles.container}>
            <Card.Cover source={{ uri: item.strMealThumb }} style={styles.image} />
            <Card.Title title={item.strMeal} titleStyle={{fontWeight: 'bold'}}/>
            <Card.Content>
                <Text style={styles.category}>{item.strCategory}</Text>
                <Text style={styles.instructions}>{item.strInstructions}</Text>
                {item.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientsContainer}>
                        <Text style={styles.measure}>{ingredient.measure}</Text>
                        <Text style={styles.ingredient}>{ingredient.ingredient}</Text>
                    </View>
                ))}
            </Card.Content>
            <Card.Actions>
                <Button
                    mode="contained"
                    onPress={() => removeFromFavorites(item.recipeId)}
                    style={styles.button}
                >
                    Remove
                </Button>
            </Card.Actions>
        </Card>
    );

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isLoggedIn ? (
                <>
                    <Text style={styles.favoriteRecipesTitle}>Favorite Recipes</Text>
                    {favoriteRecipes.length > 0 ? (
                        <FlatList
                            data={favoriteRecipes}
                            renderItem={renderFavoriteRecipe}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    ) : (
                        <Text>No favorite recipes found.</Text>
                    )}
                </>
            ) : (
                <Text>You are not logged in.</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffd3a1',
        paddingHorizontal: 20,
        marginBottom: 20,
        

    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    image: {
        width: 150,
        height: 150,
        resizeMode: 'cover',
        alignSelf: 'center',
        borderRadius: 20,
        marginBottom: 20,
    },
    category: {
        fontSize: 16,
        marginBottom: 20,
    },
    meal: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    instructions: {
        fontSize: 14,
        marginBottom: 10,
    },
    youtube: {
        marginBottom: 20,
    },
    ingredientsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    measure: {
        marginRight: 5,
    },
    ingredient: {
        flex: 1,
    },
    button: {
        marginTop: 20,
        color: '#2d8cff',
    },
    favoriteRecipesTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    flatListContainer: {
        paddingBottom: 20,
    },
    noFavoriteRecipes: {
        fontSize: 16,
        fontStyle: 'italic',
    },
});
export default Favorites;