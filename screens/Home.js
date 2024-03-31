import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TextInput } from 'react-native-paper';
import { Entypo } from '@expo/vector-icons';
import Categories from '../components/Categories';
import Recipes from '../components/Recipes';
import axios from 'axios';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const Home = () => {

    // Active category state
    const [activeCategory, setActiveCategory] = useState('Beef');
    // Categories state
    const [categories, setCategories] = useState([]);
    // Recipes state
    const [meals, setMeals] = useState([]);

    // Get categories and recipes on component mount
    useEffect(() => {
        getCategories();
        getRecipes();
    }, []);

    // Handle category change
    const handleChangeCategory = category => {
        getRecipes(category);
        setActiveCategory(category);
        setMeals([]);
    }

    // Get categories from API
    const getCategories = async () => {
        try {
            const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
            //console.log('get categories', response.data);
            if(response && response.data) {
                setCategories(response.data.categories);

            }
        }catch (error) {
            console.log('error', error.message);
        }
    }

    // Get recipes from API
    const getRecipes = async (category="Beef") => {
        try {
            const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
            // console.log('get recipes', response.data);
            if(response && response.data) {
                setMeals(response.data.meals);

            }
        }catch (error) {
            console.log('error', error.message);
        }
    }
    
    return (
        <ScrollView>
            <View styles={styles.container}>
                <Text style={{ fontSize: 18, marginBottom: 20, marginTop: 10, alignItems: 'center' }}>Make your own food with these recipes</Text>
            </View>
            {/* Search bar */}
            <View styles={styles.searchBar}>
                <TextInput
                    placeholder="Search any recipe"
                    placeholderTextColor="gray"
                    style={{
                        flex: 1,
                        fontSize: 16,
                        fontWeight: 'bold',
                        borderRadius: 10,
                        backgroundColor: '#fff7d8',
                        paddingLeft: 35,
                        position: 'relative',
                    }}
                />
                <Entypo
                    name="magnifying-glass"
                    size={24}
                    color="gray"
                    style={{
                        position: 'absolute',
                        top: 12,
                        left: 10,
                    }}
                />
            </View>

            {/* Categories */}
            <View>
                { categories.length > 0 && <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} /> }
            </View>

            {/* Recipes */}
            <View>
                <Recipes meals={meals} categories={categories} />
            </View>

        </ScrollView>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginTop: 20,
        paddingHorizontal: 40,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
});

export default Home;