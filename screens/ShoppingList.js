import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

// Get window dimensions
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// Define a key for AsyncStorage
const STORAGE_KEY = '@shoppingList';

const ShoppingList = () => {

    // Define state variables
    const [itemsToAcquire, setItemsToAcquire] = useState([]);
    const [itemsAcquired, setItemsAcquired] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const loadShoppingList = async () => {

        // Load data from AsyncStorage
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            if (data) {
                const parsedData = JSON.parse(data);
                if (parsedData) {
                    setItemsToAcquire(parsedData.itemsToAcquire || []);
                    setItemsAcquired(parsedData.itemsAcquired || []);
                }
            }
        } catch (error) {
            console.error('Error loading shopping list:', error);
        }
    };

    // Save shopping list data to AsyncStorage
    const saveShoppingList = async () => {
        try {
            const data = {
                itemsToAcquire,
                itemsAcquired,
            };
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (error) {
            console.error('Error saving shopping list:', error);
        }
    };

    // Load data on app launch
    useEffect(() => {
        loadShoppingList();
    }, []);

    // Save data on any state change
    useEffect(() => {
        saveShoppingList();
    }, [itemsToAcquire, itemsAcquired]);

    // Define functions to add, acquire, and unacquire items
    const addItem = () => {
        if (inputValue) {
            // Check if item already exists
            const itemExists = itemsToAcquire.some(item => item.text.toLowerCase() === inputValue.toLowerCase());
    
            if (itemExists) {
                Alert.alert('Item already exists', 'This item is already in your shopping list.');
            } else {
                setItemsToAcquire([...itemsToAcquire, { id: uuid.v4(), text: inputValue, acquired: false }]);
                setInputValue(''); // Clear the input field
            }
        }
    };


    // handleItemAcquired and handleItemUnacquired functions
    const handleItemAcquired = (id) => {
        const updatedItemsToAcquire = [...itemsToAcquire];
        const updatedItemsAcquired = [...itemsAcquired];
        const index = updatedItemsToAcquire.findIndex(item => item.id === id);
        const item = updatedItemsToAcquire.splice(index, 1)[0]; // Remove from To Acquire
        item.acquired = true; // Mark acquired
        updatedItemsAcquired.push(item); // Add to Acquired
        setItemsToAcquire(updatedItemsToAcquire);
        setItemsAcquired(updatedItemsAcquired);
    };

    // handleItemUnacquired function
    const handleItemUnacquired = (id) => {
        const updatedItemsAcquired = [...itemsAcquired];
        const updatedItemsToAcquire = [...itemsToAcquire];
        const index = updatedItemsAcquired.findIndex(item => item.id === id);
        const item = updatedItemsAcquired.splice(index, 1)[0]; // Remove from Acquired
        item.acquired = false; // Mark unacquired
        updatedItemsToAcquire.push(item); // Add to To Acquire
        setItemsAcquired(updatedItemsAcquired);
        setItemsToAcquire(updatedItemsToAcquire);
    };

    // Define function to delete all acquired items
    const deleteAllAcquiredItems = async () => {
        Alert.alert(
            'Delete All Acquired Items?',
            'Are you sure you want to delete all items from the "Items Acquired" list?',
            [
                { text: 'Yes', onPress: () => removeAcquiredItems() },
                { text: 'No', onPress: () => console.log('Cancel deletion') },
            ],
            { cancelable: false }
        );
    };

    // Remove all acquired items
    const removeAcquiredItems = async () => {
        setItemsAcquired([]);
        await AsyncStorage.removeItem(STORAGE_KEY); // Clear storage
    };

    // Define renderItem function
    const renderItem = ({ item, index, list }) => {
        const iconName = item.acquired ? 'check-circle' : 'radio-button-unchecked'; // Change icon based on acquired status
        const iconColor = item.acquired ? 'green' : 'black'; // Change icon color based on acquired status
        const onPress = list === 'toAcquire' ? () => handleItemAcquired(item.id) : () => handleItemUnacquired(item.id);

        return (
            <View style={styles.listItem}>
                <Text style={styles.itemText}>{item.text}</Text>
                <TouchableOpacity onPress={onPress} style={styles.iconContainer}>
                    <MaterialIcons name={iconName} size={24} color={iconColor} />
                </TouchableOpacity>
            </View>
        );
    };
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Grocery shopping list</Text>
            <TextInput
                style={styles.input}
                placeholder="Add an ingredient..."
                value={inputValue} // Set the TextInput value
                onChangeText={(text) => setInputValue(text)} // Update inputValue on each keystroke
                onSubmitEditing={addItem} // Call addItem when the user submits the form
            />
            <MaterialIcons name="add" size={24} color="gray" style={styles.plusIcon} />
            <View style={styles.listsContainer}>
                <Text style={styles.listTitle}>Items to Acquire</Text>
                <FlatList
                    data={itemsToAcquire}
                    ListEmptyComponent={<Text>No items to acquire</Text>}
                    renderItem={({ item, index }) => renderItem({ item, index, list: 'toAcquire' })}
                    keyExtractor={(item) => item.id.toString()} // Use the unique ID here
                    style={styles.list}
                />
                <Text style={styles.listTitle}>Items Acquired</Text>
                <FlatList
                    data={itemsAcquired}
                    ListEmptyComponent={<Text>No acquired items</Text>}
                    renderItem={({ item, index }) => renderItem({ item, index, list: 'acquired' })}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.list}
                />
            </View>
            <TouchableOpacity style={styles.deleteAllButton} onPress={deleteAllAcquiredItems}>
                <Text style={styles.deleteAllText}>Delete All Acquired Items</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#FFC786',
    },

    title: {
        fontSize: windowWidth * 0.06,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    input: {
        fontSize: windowWidth * 0.045,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 10,
    },

    plusIcon: {
        position: 'absolute',
        right: windowWidth * 0.060,
        top: windowHeight * 0.095,
    },

    listsContainer: {
        flex: 1,
    },

    removeIconContainer: {
        marginLeft: 10, // Add some margin between item text and remove icon
    },
    
    listTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },

    list: {
        marginBottom: 10,
    },
    listItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 2,
        borderColor: '#ccc',
    },

    itemText: {
        fontSize: 16,
    },

    iconContainer: {
    },
     
    deleteAllButton: {
        padding: 10,
        backgroundColor: '#54acffff',
        borderRadius: 12,
        alignItems: 'center',
    },
     
    deleteAllText: {
        fontSize: 16,
        color: 'white',
    },
});

export default ShoppingList;