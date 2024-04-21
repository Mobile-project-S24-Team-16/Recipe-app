import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Linking, Dimensions, TextInput, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
// import { StatusBar } from 'expo-status-bar';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { HeartIcon } from 'react-native-heroicons/solid';
import { ClockIcon } from 'react-native-heroicons/outline';
import { UsersIcon } from 'react-native-heroicons/outline';
import { FireIcon } from 'react-native-heroicons/outline';
import { Square3Stack3DIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, deleteDoc, doc, addDoc, getDoc, query, where, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
//import { useAuthState } from 'react-firebase-hooks/auth';
import { db, USERS_REF, FAVORITES_REF, REVIEWS_REF } from '../firebase/Config';
import { auth } from '../firebase/Config';
import YouTubeIframe from 'react-native-youtube-iframe';
import axios from 'axios';
import Loading from '../components/loading';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { STORAGE_KEY } from '../components/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StarRating, { StarRatingDisplay } from 'react-native-star-rating-widget';
import * as Speech from 'expo-speech';
import { FontAwesome } from '@expo/vector-icons';
// import { List } from 'react-native-paper';


const screenWidth = Dimensions.get('window').width;

const RecipeDetails = (props) => {

    const [unit, setUnit] = useState('metric');

    // Get the unit from async storage
    const getUnit = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            if (jsonValue !== null) {
                setUnit(JSON.parse(jsonValue));
            }
        } catch (e) {
            console.log(e);
        }
    }

    // Get the unit on focus
    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            getUnit();
        });
        return unsubscribe;
    }, [props.navigation]);

    function convertUnits(measurement, unit) {

        // Conversion tables for metric to imperial and vice versa

        const metricToImperial = {
            'g': { ratio: 0.035274, newUnit: 'oz' },
            'kg': { ratio: 2.20462, newUnit: 'lb' },
            'ml': { ratio: 0.033814, newUnit: 'fl oz' },
            'l': { ratio: 1.05669, newUnit: 'qt' },
            // Add more units as needed
        };

        const imperialToMetric = {
            'oz': { ratio: 28.3495, newUnit: 'g' },
            'lb': { ratio: 0.453592, newUnit: 'kg' },
            'fl oz': { ratio: 29.5735, newUnit: 'ml' },
            'qt': { ratio: 0.946353, newUnit: 'l' },
            'cup': { ratio: 236.588, newUnit: 'ml' },
            'cups': { ratio: 236.588, newUnit: 'ml' },
            'ounce': { ratio: 28.3495, newUnit: 'g' },
            'ounces': { ratio: 28.3495, newUnit: 'g' },
            // Add more units as needed
        };

        const conversionTable = unit === 'metric' ? imperialToMetric : metricToImperial;

        const regex = /(\d+\.?\d*)\s*(\w+)/;
        const match = measurement.match(regex);

        if (match) {
            const value = parseFloat(match[1]);
            const originalUnit = match[2];

            if (conversionTable[originalUnit]) {
                const convertedValue = value * conversionTable[originalUnit].ratio;
                const newUnit = conversionTable[originalUnit].newUnit;

                return `${convertedValue.toFixed(0)} ${newUnit}`;
            }
        }

        // If no conversion was possible, return the original measurement
        return measurement;
    }

    // Get the recipe item from the navigation params
    let item = props.route.params;

    // State to check if the recipe is a favourite
    const [isFavourite, setIsFavourite] = useState(false);

    // State to store the meal data
    const [meal, setMeal] = useState(null);

    // State to store cooking time
    const [cookingTime, setCookingTime] = useState(null);

    // Loading stage
    const [loading, setLoading] = useState(true);

    const [favoriteRecipes, setFavoriteRecipes] = useState([]);

    // Navigation hook
    const navigation = useNavigation();

    // Speech states
    const [isPlaying, setIsPlaying] = useState(false);
    const [speechText, setSpeechText] = useState('');

    // Auth state
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [nickname, setNickname] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Listen for changes in the user's authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                setIsLoggedIn(true);
                setIsLoading(true);
                (async () => {
                    const docRef = doc(db, USERS_REF, user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setNickname(docSnap.data().nickname);
                        setIsLoading(false);
                        // checkIfFavourite(user, item);
                    }
                    else {
                        console.log('No such document!');
                        setIsLoading(false);
                    }
                })();
            } else {
                setCurrentUser(null);
                setIsLoggedIn(false);
                setIsLoading(false);
                unsubscribe();
            }
        });

        // Clean up the listener when the component is unmounted
        return () => unsubscribe();
    }, []);

    // useEffect(() => {
    //     let unsubscribeSnapshot;
    //     const unsubscribe = onAuthStateChanged(auth, (user) => {
    //         if (unsubscribeSnapshot) {
    //             unsubscribeSnapshot();
    //         }
    //         if (user) {
    //             setCurrentUser(user);
    //             setIsLoggedIn(true);
    //             setIsLoading(true);
    //                 const docRef = doc(db, USERS_REF, user.uid);
    //                 unsubscribeSnapshot = onSnapshot(docRef, (docSnap) => {
    //                 if (docSnap.exists()) {
    //                     setNickname(docSnap.data().nickname);
    //                     setIsLoading(false);
    //                     // checkIfFavourite(user, item);
    //                 }
    //                 else {
    //                     console.log('No such document!');
    //                     setIsLoading(false);
    //                 }
    //             });
    //         } else {
    //             setCurrentUser(null);
    //             setIsLoggedIn(false);
    //             setIsLoading(false);
    //         }
    //     });

    //     // Clean up the listener when the component is unmounted
    //     return () => {
    //         unsubscribe();
    //         if (unsubscribeSnapshot) {
    //             unsubscribeSnapshot();
    //         }
    //     }
    // }, []);

    // useEffect to get meal data
    useEffect(() => {
        getMealData(item.idMeal);
    }, []);

    // Add recipe to favorites
    const addToFavorites = async () => {
        try {
            const favoriteRef = collection(db, USERS_REF, auth.currentUser.uid, FAVORITES_REF);
            await addDoc(favoriteRef, {
                recipeId: meal?.idMeal,
                strMealThumb: meal?.strMealThumb,
                strMeal: meal?.strMeal,
                strCategory: meal?.strCategory,
                strInstructions: meal?.strInstructions,
                strYouTube: meal?.strYoutube,
                ingredients: Array.from({ length: 20 }, (_, i) => ({
                    measure: meal?.[`strMeasure${i + 1}`],
                    ingredient: meal?.[`strIngredient${i + 1}`]
                })).filter(ingredient => ingredient.measure || ingredient.ingredient)
            });
            setIsFavourite(true);
        } catch (error) {
            console.error('Error adding to favorites:', error);
        }
    };

    // Remove recipe from favorites
    const removeFromFavorites = async () => {
        try {
            const favoriteQuery = collection(db, USERS_REF, auth.currentUser.uid, FAVORITES_REF);
            const snapshot = await getDocs(favoriteQuery);
            snapshot.forEach(async (doc) => {
                if (doc.data().recipeId === item.idMeal) {
                    await deleteDoc(doc.ref);
                    setIsFavourite(false);
                }
            });
        } catch (error) {
            console.error('Error removing from favorites:', error);
        }
    };

    // Check if recipe is a favorite
    useEffect(() => {
        const checkIfFavourite = async () => {
            const favoriteQuery = collection(db, USERS_REF, auth.currentUser.uid, FAVORITES_REF);
            const snapshot = await getDocs(favoriteQuery);
            snapshot.forEach((doc) => {
                if (doc.data().recipeId === item.idMeal) {
                    setIsFavourite(true);
                }
            });
        };

        checkIfFavourite();
    }, []);


    // Function to extract cooking time from instructions
    const extractCookingTime = (instructions) => {
        const regexMinutes = /\b(\d+)\s*(?:minutes?|mins?)\b/gi; // Match minutes or mins
        const regexHours = /\b(\d+)\s*hours?\b/gi; // Match hours
        const regexSeconds = /\b(\d+)\s*seconds?\b/gi; // Match seconds

        let totalMinutes = 0;

        // Extract minutes
        const matchesMinutes = instructions.matchAll(regexMinutes);
        for (const match of matchesMinutes) {
            totalMinutes += parseInt(match[1]);
        }

        // Extract hours and convert to minutes
        const matchesHours = instructions.matchAll(regexHours);
        for (const match of matchesHours) {
            totalMinutes += parseInt(match[1]) * 60; // Convert hours to minutes
        }

        // Extract seconds and convert to minutes
        const matchesSeconds = instructions.matchAll(regexSeconds);
        for (const match of matchesSeconds) {
            totalMinutes += Math.ceil(parseInt(match[1]) / 60); // Convert seconds to minutes
        }

        return totalMinutes;
    };

    // Function to extract difficulty making from instructions
    const extractDifficultyMaking = (totalMinutes) => {
        if (totalMinutes <= 15) {
            return "Quick";
        } else if (totalMinutes <= 30) {
            return "Easy";
        } else if (totalMinutes <= 45) {
            return "Moderate";
        } else if (totalMinutes >= 60) {
            return "Hard";
        }
    };

    // Function to extract serving size from instructions
    const extractServings = (instructions) => {
        const regexServings = /\b(\d+)\s*serving(s?)\b/gi; // Match servings with number capture group
        const regexNumbers = /\b([1-9]|10)\b/gi; // Match numbers between 1 and 10
        let totalServings = null;

        // Extract servings and numbers from instructions
        const matchesServings = instructions.matchAll(regexServings);
        for (const match of matchesServings) {
            totalServings = parseInt(match[1]); // Set captured number as total servings
        }

        // If no servings are found, extract numbers between 1 and 10 from instructions
        if (totalServings === null || isNaN(totalServings)) {
            const matchesNumbers = instructions.matchAll(regexNumbers);
            for (const match of matchesNumbers) {
                totalServings = parseInt(match[0]); // Set matched number as total servings
            }
        }

        return totalServings;
    };

    // Function to extract calories from instructions
    const extractServingsAndCalculateCalories = (instructions) => {
        const regexServings = /\b(\d+)\s*serving(s?)\b/gi;
        const regexNumbers = /\b([1-9]|10)\b/gi;
        let totalServings = null;

        // Extract servings and numbers from instructions
        const matchesServings = instructions.matchAll(regexServings);
        for (const match of matchesServings) {
            totalServings = parseInt(match[1]); // Set captured number as total servings
        }

        // If no servings are found, extract numbers between 1 and 10 from instructions
        if (totalServings === null || isNaN(totalServings)) {
            const matchesNumbers = instructions.matchAll(regexNumbers);
            for (const match of matchesNumbers) {
                totalServings = parseInt(match[0]); // Set matched number as total servings
            }
        }

        // Calculate total calories based on servings (assuming one serving is 130 calories)
        const totalCalories = totalServings * 130;

        return totalCalories;
    };

    // Get meal data details
    const getMealData = async (id) => {
        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            if (response && response.data.meals) // Check for both response.data and meals
            {
                setMeal(response.data.meals[0]);
                setLoading(false);
            }
        } catch (error) {
            console.error('error', error.message);
        }
    };

    // Get the ingredients indexes
    const ingredientsIndexes = (meal) => {
        if (!meal) return [];
        let indexes = [];
        for (let i = 1; i <= 20; i++) {
            if (meal['strIngredient' + i]) {
                indexes.push(i);
            }
        }

        return indexes;
    }

    // Function to handle opening the recipe video link and get the video id
    const getYoutubeVideoId = url => {
        const regex = /[?&]v=([^&]+)/;
        const match = url.match(regex);
        if (match && match[1]) {
            return match[1];
        }
        return null;
    }

    // Review states
    const [stars, setStars] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState('');

    // Submit review
    const submitReview = async () => {
        if (review.trim() === '' || stars === 0) {
            Alert.alert('Error', 'Please enter a review and rating');
            return;
        }
        try {
            const querySnapshot = await getDocs(query(collection(db, REVIEWS_REF), where('recipeId', '==', meal?.idMeal), where('userId', '==', auth.currentUser.uid)));
            if (!querySnapshot.empty) {
                Alert.alert('Error', 'You have already reviewed this recipe');
                return;
            }
            if (review.trim() !== '' && stars !== 0) {
                await addDoc(collection(db, REVIEWS_REF), {
                    recipeId: meal?.idMeal,
                    stars: stars,
                    review: review,
                    user: nickname,
                    userId: auth.currentUser.uid,
                    date: new Date().toLocaleString()
                });
                setReview('');
                setStars(0);
            }
        } catch (error) {
            console.error('Error adding review:', error);
        }
    }

    // Remove review
    const removeReview = async (review) => {
        try {
            const querySnapshot = await getDocs(query(collection(db, REVIEWS_REF), where('recipeId', '==', meal?.idMeal), where('userId', '==', auth.currentUser.uid)));
            if (querySnapshot.empty) {
                Alert.alert('Error', 'You cannot delete other users reviews');
                return;
            }
            querySnapshot.forEach(async (doc) => {
                if (doc.data().review === review) {
                    await deleteDoc(doc.ref);
                }
            });
        } catch (error) {
            console.error('Error removing review:', error);
        }
    }

    // Get reviews
    useEffect(() => {
        const reviewsQuery = collection(db, REVIEWS_REF);

        const unsubscribe = onSnapshot(reviewsQuery, (snapshot) => {
            let reviews = [];
            snapshot.forEach(doc => {
                if (doc.data().recipeId === item.idMeal) {
                    reviews.push(doc.data());
                }
            });
            setReviews(reviews);
        });
        return () => unsubscribe();
    }, []);

    // Average rating state
    const [averageRating, setAverageRating] = useState(0);

    // Calculate average rating
    useEffect(() => {
        let total = 0;
        reviews.forEach(review => {
            total += review.stars;
        });
        setAverageRating(total / reviews.length);
    }, [reviews]);
    
    // Text-to-Speech function
    const startSpeech = async () => {
        if (!meal) {
            Alert.alert('Error', 'No recipe details found');
            return;
        }
    
        let speechContent = '';
    
        // Read ingredients
        speechContent += 'Ingredients: ';
        ingredientsIndexes(meal).forEach(i => {
            const measure = meal['strMeasure' + i];
            const ingredient = meal['strIngredient' + i];
    
            if (measure && ingredient) {
                speechContent += convertUnits(measure, unit) + ' ' + ingredient + '. ';
            }
        });
    
        // Read instructions
        if (meal.strInstructions) {
            speechContent += 'Instructions: ' + meal.strInstructions;
        }
    
        // Start speech
        if (speechContent) {
            setSpeechText(speechContent);
            try {
                await Speech.speak(speechContent, { language: 'en' });
                setIsPlaying(true);
            } catch (error) {
                console.error('Failed to start speech:', error);
            }
        }
    };
    
    // Stop text-to-speech function
    const stopSpeech = async () => {
        try {
            await Speech.stop();
            setIsPlaying(false);
        } catch (error) {
            console.error('Failed to stop speech:', error);
        }
    };

    return (
        <>
            {/* <StatusBar style="light" /> */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 30, backgroundColor: '#FFC786' }}
            >
                {/* Recipe Image */}
                <View style={styles.recipeDetailContainer}>
                    <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} sharedTransitionTag={item.strMeal} />
                </View>

                {/* Text-to-Speech buttons */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                    <Text>Speak ingredients and instructions</Text>
                    <TouchableOpacity
                        onPress={() => {
                            if (!isPlaying) {
                                startSpeech();
                            } else {
                                stopSpeech();
                            }
                        }}
                        style={[styles.playButton, isPlaying && styles.stopButton]}>
                        <FontAwesome
                            name={isPlaying ? 'stop-circle' : 'play-circle'}
                            size={24}
                            color="white"
                            style={styles.playIcon}
                        />
                    </TouchableOpacity>
                </View>

                {/* Back button */}
                <Animated.View entering={FadeIn.delay(200).duration(1000)} style={styles.recipeBackButton}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <ChevronLeftIcon name="chevron-left" size={24} strokeWidth={6.5} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.recipeFavourite} onPress={() => {
                        if (!isLoggedIn) {
                            Alert.alert('Please log in to add or remove favorites');
                        } else {
                            isFavourite ? removeFromFavorites() : addToFavorites();
                        }
                    }}
                    >
                        <HeartIcon name="heart" size={24} strokeWidth={4.5} color={isFavourite ? "red" : "white"} />
                    </TouchableOpacity>
                </Animated.View>

                {/* Meal description */}
                {loading ? (
                    <Loading size="large" />
                ) : (
                    <View style={styles.mealDetailsContainer}>
                        {/* Name and area */}
                        <Animated.View entering={FadeInDown.duration(700).springify().damping(12)} style={styles.detailsRow}>
                            <Text style={styles.mealName}>{meal?.strMeal}</Text>
                            <Text style={styles.mealArea}>{meal?.strArea}</Text>
                        </Animated.View>
                        {/* misc data */}

                        <Animated.View entering={FadeInDown.delay(100).duration(700).springify().damping(12)} style={styles.detailsRow}>
                            <StarRatingDisplay
                                rating={averageRating}
                                color="#000000"
                                starSize={20}
                                style={{ paddingVertical: 5 }}
                            />
                        </Animated.View>

                        {/* can be used if someone figures out formula to check from strInstructions data filtering for each type */}

                        <Animated.View entering={FadeInDown.delay(100).duration(700).springify().damping(12)} style={styles.detailsRow}>
                            <View style={styles.detailItem}>
                                <ClockIcon size={32} strokeWidth={2.5} color="#000000" />
                                <Text style={styles.detailText}>{extractCookingTime(meal?.strInstructions)}</Text>
                                <Text style={styles.detailText}>Mins</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <UsersIcon size={32} strokeWidth={2.5} color="#000000" />
                                <Text style={styles.detailText}>{extractServings(meal?.strInstructions)}</Text>
                                <Text style={styles.detailText}>Servings</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <FireIcon size={32} strokeWidth={2.5} color="#000000" />
                                <Text style={styles.detailText}>{extractServingsAndCalculateCalories(meal?.strInstructions)}</Text>
                                <Text style={styles.detailText}>Cal</Text>
                            </View>
                            <View style={styles.detailItem}>
                                <Square3Stack3DIcon size={32} strokeWidth={2.5} color="#000000" />
                                <Text style={styles.detailText}>{extractDifficultyMaking(extractCookingTime(meal?.strInstructions))}</Text>
                            </View>
                        </Animated.View>

                        {/* Ingredients */}
                        <Animated.View entering={FadeInDown.delay(200).duration(700).springify().damping(12)} style={styles.ingredientsContainer}>
                            <Text style={styles.ingredientsTitle}>Ingredients</Text>
                            {ingredientsIndexes(meal).map(i => (
                                <View key={i} style={styles.ingredientItem}>
                                    <View style={styles.bulletPoint}></View>
                                    <Text style={styles.ingredientText}>
                                        {convertUnits(meal['strMeasure' + i], unit)} {meal['strIngredient' + i]}
                                    </Text>
                                </View>
                            ))}
                        </Animated.View>

                        {/* Instructions */}
                        <Animated.View entering={FadeInDown.delay(300).duration(700).springify().damping(12)} style={styles.instructionsContainer}>
                            <Text style={styles.instructionsTitle}>Instructions</Text>
                            <Text style={styles.instructionsText}>{meal?.strInstructions}</Text>
                        </Animated.View>

                        {/* Recipe video */}
                        {meal?.strYoutube && (
                            <Animated.View entering={FadeInDown.delay(400).duration(700).springify().damping(12)} style={styles.videoContainer}>
                                <Text style={styles.videoTitle}>Recipe Video</Text>
                                <YouTubeIframe
                                    videoId={getYoutubeVideoId(meal.strYoutube)}
                                    height={200}
                                    autoplay={false}
                                />
                            </Animated.View>


                        )}
                         {/* Rating system */}
                        <View>
                            {isLoggedIn ?
                                <>
                                    <Text style={styles.videoTitle}>Leave a review!</Text>
                                    <StarRating
                                        rating={stars}
                                        onChange={setStars}
                                        color="#000000"
                                        starSize={40}
                                        style={{ paddingVertical: 10 }}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder='Type your review here...'
                                        value={review}
                                        onChangeText={setReview}
                                        multiline={true}
                                    />
                                    <TouchableOpacity style={styles.button} onPress={submitReview}>
                                        <Text style={styles.buttonText}>Submit Review</Text>
                                    </TouchableOpacity>
                                </>
                                :
                                <>
                                    <Text style={styles.videoTitle}>Login to leave a review!</Text>
                                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                                        <Text style={styles.buttonText}>Login</Text>
                                    </TouchableOpacity>
                                </>
                            }
                        </View>
                       
                        <View>
                            <Text style={styles.videoTitle}>Reviews</Text>
                            {reviews.map((review, index) => (
                                <View key={index} style={styles.reviewContainer}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.reviewUser}>{review.user}</Text>
                                        {auth.currentUser && auth.currentUser.uid === review.userId && (
                                            <TouchableOpacity onPress={() => removeReview(review.review)}>
                                                <Text style={{ color: 'red', textAlign: 'right' }}>Delete</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    <StarRatingDisplay
                                        rating={review.stars}
                                        color="#000000"
                                        starSize={20}
                                        style={{ paddingVertical: 5 }}
                                    />
                                    <Text style={styles.reviewText}>{review.review}</Text>
                                    <Text style={styles.reviewDate}>{review.date}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    recipeDetailContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingTop: 25,
    },
    recipeImage: {
        width: '100%',
        height: screenWidth * 0.9,
        borderRadius: 20,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },
    recipeBackButton: {
        width: 50,
        height: 50,
        position: 'absolute',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        top: 40,
        left: 20,
        backgroundColor: 'rgba(55, 154, 220, 0.998)',
        padding: 10,
        borderRadius: 20,
    },
    recipeFavourite: {
        position: 'absolute',
        alignItems: 'center',
        top: 300,
        flexDirection: 'row',
        marginLeft: 5,
        justifyContent: 'space-between',
        backgroundColor: 'rgba(55, 154, 220, 0.998)',
        padding: 10,
        borderRadius: 20,
    },
    mealDetailsContainer: {
        padding: 20,
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    detailItem: {
        alignItems: 'center',
        width: 85,
        borderRadius: 50,
        backgroundColor: '#f9f4e2ff',
    },
    detailText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    mealName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    mealArea: {
        fontSize: 18,
        fontWeight: '600',
        top: 200,
    },
    ingredientsContainer: {
        marginBottom: 20,
    },
    ingredientsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#313131ff',
    },
    ingredientItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    bulletPoint: {
        height: 10,
        width: 10,
        backgroundColor: '#f9f4e2ff',
        borderRadius: 50,
        marginRight: 10,
    },
    ingredientText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#313131ff',
    },
    instructionsContainer: {
        marginBottom: 20,
    },
    instructionsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#313131ff',
    },
    instructionsText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#313131ff',
        marginTop: 5,
        marginBottom: 5,
    },
    videoContainer: {
        marginBottom: 20,
    },
    videoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#313131ff',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
        minHeight: 150,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
    },
    reviewContainer: {
        backgroundColor: '#f9f4e2ff',
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        marginTop: 10,
    },
    reviewUser: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    reviewText: {
        fontSize: 14,
        marginBottom: 5,
    },
    reviewDate: {
        fontSize: 12,
        color: '#313131ff',
    },
    playButton: {
        backgroundColor: '#007AFF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    stopButton: {
        backgroundColor: 'red',
    },
    playIcon: {
        paddingHorizontal: 5,
    },
});

export default RecipeDetails;