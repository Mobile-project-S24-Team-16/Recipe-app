import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import MealItem from './MealItem';

const RecipeList = ({ recipes }) => {
    return (
        <ScrollView contentContainerStyle={styles.recipesContainer}>
            {recipes.length > 0 ? (
                recipes.map((recipe) => (
                    <MealItem key={recipe.idMeal} recipe={recipe} />
                ))
            ) : (
                <Text style={styles.noResultsText}>No Results Found!</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    recipesContainer: {
        padding: 10,
    },
    noResultsText: {
        textAlign: 'center',
        fontSize: 14,
    },
});

export default RecipeList;