import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Button } from 'react-native';
import { collection, query, getDocs, db, doc, getDoc, deleteDoc, onSnapshot, querySnapshot } from 'firebase/firestore';
//import { useAuthState } from 'react-firebase-hooks/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, FAVORITES_REF, USERS_REF } from '../firebase/Config';
import { logout } from '../components/Auth';
import YoutubeIframe from 'react-native-youtube-iframe';

const Favorites = () => {
    const [favoriteRecipes, setFavoriteRecipes] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    // const [users, setUsers] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [nickname, setNickname] = useState('');
    const [meal, setMeal] = useState(null);

    // get youtube video id from url
    const getYoutubeVideoId = url => {
        const regex = /[?&]v=([^&]+)/;
        const match = url.match(regex);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    };

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
            }
        });
    
        return () => unsubscribe();
    }, []);


    // useEffect(() => {
    //     const unsubscribe = loadFavoriteRecipes(user);
    //     return unsubscribe;
    // }, [user]);

    // const loadFavoriteRecipes = (user) => {
    //     const userRef = doc(db, USERS_REF, user.uid);
    //     const favoriteRef = collection(userRef, FAVORITES_REF);

    //     const unsubscribe = favoriteRef.onSnapshot(querySnapshot => {
    //         const favoriteRecipes = [];
    //         querySnapshot.forEach((doc) => {
    //             const { recipeId, strMealThumb, strCategory, strInstructions, strYoutube, ingredients } = doc.data();
    //             favoriteRecipes.push({
    //                 id: doc.id,
    //                 recipeId,
    //                 strMealThumb,
    //                 strCategory,
    //                 strInstructions,
    //                 strYoutube,
    //                 ingredients,
    //             });
    //         });
    //         setFavoriteRecipes(favoriteRecipes);
    //     });

    //     // Clean up the subscription on unmount
    //     return () => unsubscribe();
    // };

    // fetch data from farorite recipe from Firbase Firestore
    const loadFavoriteRecipes = () => {
        const favoriteRef = collection(db, USERS_REF, auth.currentUser.uid, FAVORITES_REF);
    
        const unsubscribe = onSnapshot(favoriteRef, (querySnapshot) => {
            const favoriteRecipes = [];
            querySnapshot.forEach((doc) => {
                const { recipeId, strMealThumb, strCategory, strInstructions, strYoutube, ingredients, measure } = doc.data();
                favoriteRecipes.push({
                    id: doc.id,
                    recipeId,
                    strMealThumb,
                    strCategory,
                    strInstructions,
                    strYoutube,
                    ingredients,
                    measure
                });
            });
            setFavoriteRecipes(favoriteRecipes);
        });
    
        // Clean up the subscription on unmount
        return () => unsubscribe();
    };

    // useEffect(() => {
    //     const unsubscribe = loadFavoriteRecipes(user);
    //     return unsubscribe;
    // }, [user]); 

    // Remove a recipe from favorites
    const removeFromFavorites = async (id) => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const userRef = doc(db, USERS_REF, auth.currentUser.uid);
        const favoriteRef = doc(userRef, FAVORITES_REF, id);

        try {
            await deleteDoc(favoriteRef);
            console.log('Document successfully deleted!');
            // Update the favoriteRecipes state after a recipe is removed
            setFavoriteRecipes(favoriteRecipes.filter(recipe => recipe.recipeId !== id));
        } catch (error) {
            console.error('Error removing document: ', error);
        }
    };

    const handleLogout = () => {
        logout();
    };

    // render favorite recipe
    const renderFavoriteRecipe = ({ item }) => (
        <TouchableOpacity>
            <View style={styles.container}>
                <Image source={{ uri: item.strMealThumb }} style={styles.image} />
                <Text style={styles.category}>{item.strCategory}</Text>
                <Text style={styles.instructions}>{item.strInstructions}</Text>
                <YoutubeIframe
                    videoId={getYoutubeVideoId(item.strYoutube)}
                    height={200}
                    style={styles.youtube}
                />
                {item.ingredients.map((ingredient, index) => (
                    <View key={index} style={styles.ingredientsContainer}>
                        <Text style={styles.measure}>{ingredient.measure}</Text>
                        <Text style={styles.ingredient}>{ingredient.ingredient}</Text>
                    </View>
                ))}
                <Button
                    title="Remove from Favorites"
                    onPress={() => removeFromFavorites(item.id)}
                    style={styles.button}
                />
            </View>
        </TouchableOpacity>
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
        backgroundColor: '#FFC786',
        paddingHorizontal: 20,
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
        borderRadius: 20,
        marginBottom: 20,
    },
    category: {
        fontSize: 16,
        marginBottom: 20,
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
    },
    measure: {
        marginRight: 5,
    },
    ingredient: {
        flex: 1,
    },
    button: {
        marginTop: 20,
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