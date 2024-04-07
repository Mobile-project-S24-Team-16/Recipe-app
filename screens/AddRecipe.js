import { View, Text, StyleSheet } from 'react-native';

const AddRecipe = () => {
    return (
        <View style={styles.container}>
            <Text>Add Recipe</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFC786',
        paddingHorizontal: 20,
    },
});

export default AddRecipe;