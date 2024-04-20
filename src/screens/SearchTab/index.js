import {StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useState} from 'react';

const SearchTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = query => {
    // Handle search action here
    setSearchQuery(query);
  };
  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>Search</Text>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="What do you want to listen to?"
          placeholderTextColor={'#000'}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );
};

export default SearchTab;

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 10,
    marginBottom: 40
  },
  heading: {
    color: '#fff',
    marginBottom: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  input: {
    fontSize: 14,
  },
});
