import React from 'react';
import { View, Text, Image, Button, ImageBackground, StyleSheet } from 'react-native';
import { Linking } from 'react-native';
import { RawButton } from 'react-native-gesture-handler';

const MealItem = ({ recipe }) => {
  const { idMeal, strMeal, strCategory, strMealThumb } = recipe;

  return (
    <View style={styles.recipeCard}>
      <ImageBackground source={{ uri: strMealThumb }} style={styles.cardImage}>
        <View style={styles.cardDetails}>
          <Text style={styles.categoryText}>{strCategory}</Text>
          <Text style={styles.recipeTitle}>{strMeal}</Text>
          <Button style={styles.recipeButton}
            title="Instructions"
            onPress={() => Linking.openURL(`https://www.themealdb.com/meal/${idMeal}`)}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  recipeCard: {
    flex: 1,
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10, 
    borderRadius: 10, 
  },
  cardImage: {
    width: '100%', 
    height: 200, 
    resizeMode: 'cover', 
    borderRadius: 10,
  },
  cardDetails: {
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    padding: 10,
  },
  categoryText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 5,
  },
  recipeTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  recipeButton: {
    fontSize: 16,
    width: '50%',
    marginTop: 10,
    backgroundColor: '#2fa8f9',
    color: '#ffffffff',
  },
});

export default MealItem;