import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ListScreen from '../screens/ListScreen';
import VideoGrid from '../screens/VideoGrid';
import AudioGrid from '../screens/AudioGrid';
import AudioPlayer from '../screens/AudioPlayer';

const Stack = createNativeStackNavigator();
function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="ListScreen" component={ListScreen} />
        <Stack.Screen name="VideoScreen" component={VideoGrid} />
        <Stack.Screen name="AudioScreen" component={AudioGrid} />
        <Stack.Screen name="PlayerScreen" component={AudioPlayer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default MainNavigator;
