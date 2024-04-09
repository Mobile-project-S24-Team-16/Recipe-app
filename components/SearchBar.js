import React from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';

const SearchBar = ({ handleSubmit, query, isLoading, setQuery, noResults, clearSearch }) => {
  return (
    <View style={styles.searchBar}>
      <TextInput
        value={query}
        style={styles.inputSearch}
        placeholder="Search for a recipe by name or by category"
        onChangeText={setQuery}
        disabled={isLoading}
      />
      <Button title="Search" onPress={handleSubmit} disabled={isLoading} />
      {clearSearch && <Button title="Clear search" onPress={() => setQuery('')} disabled={isLoading} />}
      {noResults && <Text style={styles.noResultsText}>Recipe not found!</Text>}
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
    borderRadius: 10, 
  },
  inputSearch: {
    flex: 1, 
    backgroundColor: '#fff',
    padding: 10, 
    borderRadius: 5, 
    fontSize: 16, 
  },
  noResultsText: {
    marginTop: 5,
    color: 'red',
    textAlign: 'center',
  },
});

export default SearchBar;