import { View, Text, StyleSheet, ActivityIndicator, Image, ScrollView, Pressable, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
//import { mealData } from "./constants";
import Animated, { FadeInDown } from 'react-native-reanimated';
import Loading from "./loading";

// Add responsive design
const screenWidth = Dimensions.get('window').width;

const Recipes = ({ categories, meals }) => {
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading
    useEffect(() => {
        setTimeout(() => {

            setIsLoading(false);
        }, 1000);
    }, []);

    return (
        <View style={styles.recipesContainer}>
            <Text style={styles.recipesText}>Recipes</Text>
            {isLoading ? (
                <View style={styles.activityIndicatorWrapper}>
                    {categories.length === 0 || meals.length === 0 ? (
                        <Loading size="large" /> // Loading spinner
                    ) : (
                        <Text>Loading recipes...</Text>// Loading recipes message
                    )}
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    <View style={styles.cardsContainer}>
                        {meals.map((item, index) => (
                            <RecipeCard key={item.idMeal} item={item} index={index} />
                        ))}
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

// Recipe card
const RecipeCard = ({ item, index }) => {

    // Check if index is even for styling
    let isEven = index % 2 === 0;

    return (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(600).springify().damping(12)} style={styles.recipeCard}>
            <Pressable style={{ width: '100%', paddingLeft: isEven ? 0 : 8, paddingRight: isEven ? 8 : 0 }}
            >
                <Image source={{ uri: item.strMealThumb }} style={styles.recipeImage} />
                <Text style={styles.recipeName}>
                    {item.strMeal.length > 20 ? item.strMeal.slice(0, 20) + '...' : item.strMeal}
                </Text>
            </Pressable>
        </Animated.View>
    )
};

const styles = StyleSheet.create({
    recipesContainer: {
        marginTop: 10,
        marginHorizontal: 4,
        marginVertical: 3,
    },

    recipesText: {
        fontSize: 18,
        fontWeight: "semibold",
    },

    activityIndicatorWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    scrollViewContent: {
        padding: 10,
        paddingBottom: 20,
    },

    recipeCard: {
        backgroundColor: '#ffd78e',
        borderRadius: 20,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginVertical: 5,
        width: screenWidth / 2 - 20,
    },

    cardsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },

    recipeImage: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
        borderRadius: 10,
    },

    recipeName: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
});

export default Recipes;