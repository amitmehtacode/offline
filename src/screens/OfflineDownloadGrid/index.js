import {
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  DeviceEventEmitter,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {fetchDownloadedDataFromLocalDir} from '../../services/downloadService';

const OfflineDownloadGrid = ({navigation}) => {
  const [data, setData] = useState([]);
  const [reRender, setReRender] = useState(false);

  const fetchDownloadedData = () => {
    fetchDownloadedDataFromLocalDir(item => {
      const sortedData = item.sort((a, b) => {
        const dateA = new Date(a.downloadDate);
        const dateB = new Date(b.downloadDate);
        return dateB - dateA;
      });

      setData(sortedData);
    });
  };

  useEffect(() => {
    fetchDownloadedData();
  }, [reRender]); // Add reRender to dependencies

  useEffect(() => {
    const downloadListenerStatus = DeviceEventEmitter.addListener(
      'downloadDone',
      e => {
        setReRender(true);
      },
    );
    return () => {
      downloadListenerStatus.remove();
    };
  }, []);

  const handlePlay = (url, thumbnail, item) => {
    console.log('item---------', item);

    // Handle play action here
    navigation.navigate('PlayerScreen', {
      source: url,
      posterImage: thumbnail,
      data: item,
    });
  };

  // Render item for FlatList
  const renderSongItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        style={styles.songItemContainer}
        onPress={() => handlePlay(item.source, item.posterImage, item)}>
        <ImageBackground
          resizeMode="cover"
          source={{uri: item.posterImage}}
          style={styles.songItem}>
          <View style={styles.overlay} />
          <Text style={styles.title}>{item.songName}</Text>
          <Text style={styles.artist}>{item.artistName}</Text>
        </ImageBackground>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Your Downloads</Text>
      {data?.length > 0 ? (
        <FlatList
          data={data}
          renderItem={renderSongItem}
          keyExtractor={item => item.id}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.flatlistContent}
          bounces={false}
        />
      ) : (
        <Image
          resizeMode="contain"
          style={{width: '100%', marginTop: -40}}
          source={require('../../icons/noDownload.jpeg')}
        />
      )}
    </View>
  );
};

export default OfflineDownloadGrid;

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
    paddingBottom: 60,
  },
  songItemContainer: {
    marginHorizontal: 5,
  },
  songItem: {
    width: 120,
    height: 150,
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
    marginBottom: 5,
    width: '150%',
  },
  artist: {
    fontSize: 13,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
    width: '150%',
    marginBottom: -17,
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
