import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
// import { StatusBar } from 'expo-status-bar';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { HeartIcon } from 'react-native-heroicons/solid';
import { ClockIcon } from 'react-native-heroicons/outline';
import { UsersIcon } from 'react-native-heroicons/outline';
import { FireIcon } from 'react-native-heroicons/outline';
import { Square3Stack3DIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import YouTubeIframe from 'react-native-youtube-iframe';
import axios from 'axios';
import Loading from '../components/loading';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const RecipeDetails = (props) => {
    // Get the recipe item from the navigation params
    let item = props.route.params;

    // State to check if the recipe is a favourite
    const [isFavourite, setIsFavourite] = useState(false);

    // State to store the meal data
    const [meal, setMeal] = useState(null);

    // Loading stage
    const [loading, setLoading] = useState(true);

    // Navigation hook
    const navigation = useNavigation();

    // useEffect to get meal data
    useEffect(() => {
        getMealData(item.idMeal);
    }, []);

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

    return (
        <>
        {/* <StatusBar style="light" /> */}
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 30, backgroundColor: '#FFC786' }}
        >
            {/* Recipe Image */}
            <View style={styles.recipeDetailContainer}>
                <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage}  sharedTransitionTag={item.strMeal}/>
            </View>

            {/* Back button */}
            <Animated.View entering={FadeIn.delay(200).duration(1000)} style={styles.recipeBackButton}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <ChevronLeftIcon name="chevron-left" size={24} strokeWidth={6.5} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.recipeFavourite} onPress={() => setIsFavourite(!isFavourite)}>
                    <HeartIcon name="heart" size={24} strokeWidth={4.5} color={isFavourite ? "#ff7171" : "white"} />
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
                        <View style={styles.detailItem}>
                            <ClockIcon size={32} strokeWidth={2.5} color="#000000" />
                            <Text style={styles.detailText}>35</Text>
                            <Text style={styles.detailText}>Mins</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <UsersIcon size={32} strokeWidth={2.5} color="#000000" />
                            <Text style={styles.detailText}>3</Text>
                            <Text style={styles.detailText}>Servings</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <FireIcon size={32} strokeWidth={2.5} color="#000000" />
                            <Text style={styles.detailText}>103</Text>
                            <Text style={styles.detailText}>Cal</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Square3Stack3DIcon size={32} strokeWidth={2.5} color="#000000" />
                            <Text style={styles.detailText}></Text>
                            <Text style={styles.detailText}>Easy</Text>
                        </View>
                    </Animated.View>

                    {/* Ingredients */}
                    <Animated.View entering={FadeInDown.delay(200).duration(700).springify().damping(12)} style={styles.ingredientsContainer}>
                        <Text style={styles.ingredientsTitle}>Ingredients</Text>
                        {ingredientsIndexes(meal).map(i => (
                            <View key={i} style={styles.ingredientItem}>
                                <View style={styles.bulletPoint}></View>
                                <Text style={styles.ingredientText}>
                                    {meal['strMeasure' + i]} {meal['strIngredient' + i]}
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
                            />
                        </Animated.View>


                    )}
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
        height: 400,
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
        top: 130,
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
    },
});

export default RecipeDetails;