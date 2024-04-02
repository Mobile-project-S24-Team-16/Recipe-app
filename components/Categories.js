import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import React from "react";
//import { categoryData } from "./constants";
import Animated, { FadeInDown } from 'react-native-reanimated';

// Add responsive design
const screenWidth = Dimensions.get('window').width;

const Categories = ({categories, activeCategory, handleChangeCategory }) => {
    return (
        <Animated.View entering={FadeInDown.duration(500).springify()} style={styles.categoryMain}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 15 }}
            >
                {categories.map((cat, index) => {
                    const isActive = cat.strCategory === activeCategory;
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => handleChangeCategory(cat.strCategory)}
                            style={[styles.categoryItem, isActive && styles.activeCategoryItem]} // Active category style
                            >
                            <View style={styles.categoryItemView}>
                                <Image 
                                    source={{ uri: cat.strCategoryThumb }} 
                                    style={styles.categoryImage} 
                                />
                            </View>
                            <Text style={styles.categoryName}>
                                {cat.strCategory}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    categoryMain: {
        backgroundColor: "#FFC786",
    },
    categoryItem: {
        backgroundColor: "#FFC786",
        padding: 10,
        marginRight: 10,
        marginTop: 15,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        minWidth: screenWidth / 3 - 20,
    },

    categoryItemView: {
        backgroundColor: "#b08446ff",
        borderRadius: 100,
        padding: 6,
    },

    categoryImage: {
        width: 50,
        height: 50,
        borderRadius: 50,
    },

    categoryName: {
        color: "gray",
        fontSize: 16,
    },

    activeCategoryItem: {
        backgroundColor: "#fff9ed", // Active category style
        borderRadius: 25,
    },
});

export default Categories;