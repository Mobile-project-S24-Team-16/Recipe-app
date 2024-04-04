import { View, Text, StyleSheet, ScrollView, Button, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import Categories from '../components/Categories';
import Recipes from '../components/Recipes';
import SearchBar from '../components/SearchBar';
import RecipeList from '../components/RecipeList';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

// API URL from TheMealDB
const searchApi = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';

const Home = () => {

    // Navigation hook
    const navigation = useNavigation();
    // Active category state
    const [activeCategory, setActiveCategory] = useState('Beef');
    // Categories state (initialized as an empty array)
    const [categories, setCategories] = useState([]);
    // Recipes state (initialized as an empty array)
    const [meals, setMeals] = useState([]);
    // Loading state
    const [isLoading, setIsLoading] = useState(false);
    // Search state
    const [query, setQuery] = useState('');
    // Search term state
    const [search, setSearch] = useState('');
    // Recipes state
    const [recipes, setRecipes] = useState([]);

    // Get categories and recipes on component mount
    useEffect(() => {
        getCategories();
        getRecipes();
    }, []);

    // Handle category change
    const handleChangeCategory = (category) => {
        getRecipes(category);
        setActiveCategory(category);
        setMeals([]);
    };

    // Search recipes
    // useEffect(() => {
    //     searchRecipes();
    // }, []);

    // Handle search input
    const handleSubmit = (event) => {
        event.preventDefault();
        searchRecipes();
    };

    // Search recipes
    const searchRecipes = async () => {
        setIsLoading(true);
        const url = searchApi + query;
        const res = await fetch(url);
        const data = await res.json();
        setRecipes(data.meals);
        setIsLoading(false);
    };
    // Get categories from API
    const getCategories = async () => {
        try {
            const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
            if (response && response.data) {
                setCategories(response.data.categories);
            } else {
                setCategories([]); // Set to empty array in case of error
            }
        } catch (error) {
            console.error('error fetching categories', error);
            setCategories([]); // Set to empty array in case of error
        }
    };

    // Get recipes from API
    const getRecipes = async (category = "Beef") => {
        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
            if (response && response.data.meals) { // Check for both response.data and meals
                setMeals(response.data.meals);
            } else {
                setMeals([]); // Set to empty array if meals are not available
            }
        } catch (error) {
            console.error('error fetching recipes', error);
            setMeals([]); // Set to empty array in case of error
        }
    };

    return (
        <SafeAreaView style={styles.scrollContent}>
            <ScrollView style={styles.scrollContent}>
                <View styles={styles.container}>
                    <Text style={{ fontSize: 18, marginBottom: 20, marginTop: 10, alignItems: 'center' }}></Text>
                </View>

                {/* Search bar */}
                <View style={styles.container}>
                    <Text style={styles.heading}>Food Wonders</Text>
                    <Text style={styles.title}>Our food recipes</Text>
                    <SearchBar
                        isLoading={isLoading}
                        query={query}
                        setQuery={setQuery}
                        handleSubmit={handleSubmit}
                    />
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#FFBA5A" />
                    ) : (
                        <RecipeList recipes={recipes} />
                    )}
                </View>

                {/* Categories */}
                <View>
                    {categories.length > 0 && ( // Only render if categories exist
                        <Categories
                            categories={categories}
                            activeCategory={activeCategory}
                            handleChangeCategory={handleChangeCategory}
                        />
                    )}
                </View>

                {/* Recipes */}
                <View>
                    {meals.length === 0 && query !== '' ? (
                        <Text style={{ textAlign: 'center' }}>Recipe not found!</Text> // Display message if no recipes found
                    ) : meals.length > 0 ? (
                        <Recipes meals={meals} categories={categories} />
                    ) : (
                        <Text style={{ textAlign: 'center' }}>Loading recipes...</Text>
                    )}
                    {meals.length > 0 && ( // Only show button if recipes are displayed
                        <View style={styles.backButtonContainer}>
                            <Button style={styles.backButton} title="Back" onPress={() => navigation.navigate('Home')} />
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    scrollContent: {
        backgroundColor: '#FFC786',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffdaaf',
        marginTop: 20,
        paddingHorizontal: 40,
    },
    searchBarContainer: {
        alignItems: 'center',
        backgroundColor: '#FFC786',
        paddingHorizontal: 10,
    },
    searchIcon: {
        marginRight: 10,
        marginTop: 65,
        marginLeft: 10,
    },
    backButtonContainer: {
        marginTop: 20,
        paddingHorizontal: 40,
    },
    backButton: {
        backgroundColor: '#012636',
        color: '#ffffff',
    },
    heading: {
        fontSize: 30,
        marginBottom: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
        marginTop: 10,
        alignItems: 'center',
    },
});

export default Home;