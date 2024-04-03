import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const MealItem = ({ meal }) => {
  return (
    <View style={styles.mealItem}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.mealImage} />
      <View style={styles.mealInfo}>
        <Text style={styles.mealTitle}>{meal.strMeal}</Text>
        <Text style={styles.mealArea}>{meal.strArea} food</Text>
        <Text style={styles.mealArea}>{meal.strTags} tag</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mealItem: {
    flex: 1,
    margin: 10,
    borderRadius: 8,
    backgroundColor: '#ffbb46',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  mealImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  mealInfo: {
    padding: 10,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealArea: {
    fontSize: 16,
    color: '#606060',
  },
});

export default MealItem;