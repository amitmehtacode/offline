import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {VIDEO_DATA} from '../../data';

const VideoGrid = ({navigation}) => {
  const handlePlay = (url, thumbnail, item) => {
    // Handle play action here
    console.log(`Playing song with ID ${navigation}`);
    navigation.navigate('PlayerScreen', {
      source: url,
      posterImage: thumbnail,
      data: item,
    });
  };

  // Render item for FlatList
  const renderSongItem = ({item, index}) => (
    <TouchableOpacity
      style={styles.songItemContainer}
      onPress={() => handlePlay(item.videoUrl, item.thumbnailUrl, item)}>
      <ImageBackground
        resizeMode="cover"
        source={{uri: item.thumbnailUrl}}
        style={styles.songItem}>
        <View style={styles.overlay} />
        <Text style={styles.title}>{item.title}</Text>
        <View style={{position: 'absolute', top: -10, left: 0}}>
          <Text style={styles.numberStyle}>{index + 1}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>List of Videos</Text>
      <FlatList
        data={VIDEO_DATA}
        renderItem={renderSongItem}
        keyExtractor={item => item.id}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.flatlistContent}
        bounces={false}
      />
    </View>
  );
};

export default VideoGrid;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginHorizontal: 10,
    color: '#fff',
  },
  flatlistContent: {
    alignItems: 'center',
  },
  songItemContainer: {
    marginHorizontal: 5,
  },
  songItem: {
    width: 160,
    height: 250,
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 20,
    borderRadius: 4,
    overflow: 'hidden',
  },
  title: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: -10,
    width: '150%',
  },
  artist: {
    fontSize: 14,
    color: '#888',
    fontWeight: '700',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  playIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff', // Adjust the play icon color as needed
  },
  numberStyle: {
    fontSize: 70,
    color: '#fff',
    fontWeight: 'bold',
  },
});
