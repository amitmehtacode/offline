import {StyleSheet, Text, TextInput, View, Image, Platform} from 'react-native';
import React, {useState} from 'react';

const SearchTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const handleSearch = query => {
    setSearchQuery(query);
  };
  return (
    <View style={styles.wrapper}>
      <View style={styles.containerAlt}>
        <Text style={styles.heading}>Search</Text>
        <Image
          style={styles.image}
          source={require('../../icons/camera.png')}
        />
      </View>
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
    marginBottom: 40,
  },
  heading: {
    color: '#fff',
    marginBottom: 10,
    fontSize: 22,
    fontWeight: 'bold',
  },
  containerAlt: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'android' ? 20 : null,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : null,
  },
  input: {
    fontSize: 14,
  },
  image: {width: 30, height: 30},
});
