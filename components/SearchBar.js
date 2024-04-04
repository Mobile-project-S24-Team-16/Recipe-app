import React from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const SearchBar = ({ handleSubmit, query, isLoading, setQuery }) => {
  return (
    <View style={styles.searchBar}>
      <TextInput
        value={query}
        style={styles.inputSearch}
        placeholder="Search Recipe"
        onChangeText={setQuery}
        disabled={isLoading}
      />
      <Button title="Search" onPress={handleSubmit} disabled={isLoading} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10, 
    borderRadius: 8, 
  },
  inputSearch: {
    flex: 1, 
    backgroundColor: '#fff',
    padding: 10, 
    borderRadius: 5, 
    fontSize: 16, 
  },
});

export default SearchBar;