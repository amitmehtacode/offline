import React from 'react';
import {View, StyleSheet, ScrollView, SafeAreaView} from 'react-native';
import AudioGrid from '../AudioGrid';
import VideoGrid from '../VideoGrid';
import SearchTab from '../SearchTab';
import OfflineDownloadGrid from '../OfflineDownloadGrid';

const ListScreen = ({navigation}) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false} showsHorizontalScrollIndicator={false}>
        <SearchTab navigation={navigation} />
        <VideoGrid navigation={navigation} />
        <AudioGrid navigation={navigation} />
        <OfflineDownloadGrid navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
});

export default ListScreen;
