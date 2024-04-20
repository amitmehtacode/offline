import {StyleSheet, View} from 'react-native';
import React from 'react';
import ListScreen from './src/screens/ListScreen';
import MainNavigator from './src/navigation/rootNavigator';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <SafeAreaProvider>
      <MainNavigator />
      <Toast />
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
});
