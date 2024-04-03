import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import MealItem from './MealItem';

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchMeal = async () => {
    setIsLoading(true);

    try {
      // Construct the API URL based on search type (first letter or full word)
      const url = search.length === 1
        ? `https://www.themealdb.com/api/json/v1/1/search.php?f=${search}`
        : `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.meals) {
        setMeals(data.meals);
      } else {
        setMeals([]); // Set to empty array if no results found
      }
    } catch (error) {
      console.error('Error fetching meals:', error);
     
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.content}>
      <Text style={styles.heading}>Foody Recipes</Text>
      <Text style={styles.subheading}>Make your food to suit your taste preferences</Text>
      <TextInput
        style={styles.searchBar}
        placeholder='Search for a recipe...'
        onChangeText={setSearch}
        value={search}
        onSubmitEditing={searchMeal}
      />
      {isLoading ? (
        <ActivityIndicator size="large" style={styles.loadingIndicator} />
      ) : meals.length === 0 ? (
        <Text style={styles.notFoundText}>
          {search.length === 1
            ? 'No results found for you by first letter.'
            : 'No results found for your search by name.'}
        </Text>
      ) : (
        <ScrollView>
          {meals.map((item) => (
            <MealItem key={item.idMeal} meal={item} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFC786',
  },
  content: {
    padding: 20,
    backgroundColor: '#FFC786',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  searchBar: {
    height: 50,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#818181ff',
  },
  loadingIndicator: {
    marginTop: 20,
  },
  notFoundText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SearchBar;