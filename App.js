import {StyleSheet, View} from 'react-native';
import React from 'react';
import ListScreen from './src/screens/ListScreen';
import MainNavigator from './src/navigation/rootNavigator';

const App = () => {
  return <MainNavigator />;
};

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
});
