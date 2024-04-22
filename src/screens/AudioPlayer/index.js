// VideoPlayer.js
import React, {useLayoutEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';

import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import LinearGradient from 'react-native-linear-gradient';

import {toHHMMSS} from '../../constants';
import DownloadModal from '../../components/DownloadModal';
import {
  fetchDownloadedDataFromLocalDir,
  sendDownloadedDataToLocalDir,
} from '../../services/downloadService';
import Toast from 'react-native-toast-message';

const AudioPlayer = ({route, navigation}) => {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [totalVideoDuration, setTotalVideoDuration] = useState(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isAlreadyDownload, setAlreadyDownload] = useState(false);

  const src = route?.params?.source;
  const posterImage = route?.params?.posterImage;
  const isAudio = route.params?.isAudio || false;
  const data = route?.params?.data;
  const artistName = data?.artist ? data?.artist : data?.author;
  const songName = data?.title;
  const offlineMode = route?.params?.offline;
  const isFromAudio = data?.isAudio;

  useLayoutEffect(() => {
    fetchDownloadedDataFromLocalDir(item => {
      if (item?.length > 0) {
        item.find(obj => {
          if (obj?.contentId === data.id) {
            setTimeout(() => {
              setAlreadyDownload(true);
            }, 100);
          }
        });
      } else {
        setAlreadyDownload(false);
      }
    });
  }, []);

  const onSliderValueChange = value => {
    videoRef.current.seek(value);
    setCurrentTime(value);
  };

  const onEnd = () => {
    videoRef.current.seek(0);
    setCurrentTime(0);
    setIsPaused(true);
  };

  const onLoad = data => {
    data?.duration > 0 && setTotalVideoDuration(data?.duration - 0.1 || 0);
    setDuration(data.duration);
  };

  const onProgress = data => {
    let currentTime = Math.floor(data.currentTime) || 0;
    setSliderValue(currentTime);
    setCurrentTime(data.currentTime);
  };

  const togglePlay = () => {
    setIsPaused(!isPaused);
  };

  const onDownloadPress = () => {
    setIsPaused(true);
    setModalVisible(true);

    sendDownloadedDataToLocalDir(
      callback => {},
      data.id,
      src,
      artistName,
      songName,
      posterImage,
      isAudio,
    );
  };

  const onAlreadyDownloadPress = () => {
    showToast(
      'success',
      'Already downloaded',
      'This content is already downloaded 👋',
    );
  };

  const getPosterImage = () => {
    if (isAudio || isFromAudio) {
      return posterImage;
    } else {
      return null;
    }
  };

  const poster = getPosterImage();

  return (
    <>
      <Video
        ref={videoRef}
        source={{uri: src}}
        style={styles.video}
        resizeMode="contain"
        onLoad={onLoad}
        onProgress={onProgress}
        onEnd={onEnd}
        paused={isPaused}
        audioOnly={true}
        autoplay={true}
        ignoreSilentSwitch={'ignore'}
        playWhenInactive={true}
        playInBackground={true}
        poster={poster}
        posterResizeMode="cover"
      />
      <LinearGradient
        colors={['#000000', '#0000000F', '#000000', '#000000', '#0000000F']}
        start={{x: 0, y: 0.06}}
        end={{x: 0, y: 1.4}}
        style={styles.controlsContainer}
      />

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconContainer}>
        <Image
          style={styles.closeIcon}
          source={require('../../icons/closeAlt.png')}
        />
      </TouchableOpacity>

      <View style={styles.titleContainer}>
        <Text style={styles.songName}>{songName}</Text>
        <Text style={styles.artistName}>{artistName}</Text>
      </View>

      <View style={styles.wrapper}>
        {isAlreadyDownload ? (
          <TouchableOpacity onPress={onAlreadyDownloadPress}>
            <Image
              style={[styles.suffelIcon, {marginRight: 20}]}
              source={require('../../icons/downloaded.png')}
            />
          </TouchableOpacity>
        ) : offlineMode ? null : (
          <TouchableOpacity onPress={onDownloadPress}>
            <Image
              style={[styles.suffelIcon, {marginRight: 20}]}
              source={require('../../icons/downloadIcon.png')}
            />
          </TouchableOpacity>
        )}

        <Image
          style={[styles.suffelIcon, {}]}
          source={require('../../icons/likeAlt.png')}
        />
      </View>

      <Slider
        step={1}
        thumbTouchSize={{
          width: 10,
          height: 10,
        }}
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={sliderValue}
        onValueChange={() => {}}
        minimumTrackTintColor="#fff"
        maximumTrackTintColor="#888"
        thumbTintColor="#fff"
      />

      <View style={{position: 'absolute', bottom: 150, left: 22}}>
        <Text style={{fontSize: 10, color: '#fff'}}>
          {toHHMMSS(currentTime)}
        </Text>
      </View>

      <View style={{position: 'absolute', bottom: 150, right: 20}}>
        <Text style={{fontSize: 10, color: '#fff'}}>
          {toHHMMSS(totalVideoDuration)}
        </Text>
      </View>

      <PlayPauseComponent isPaused={isPaused} togglePlay={togglePlay} />
      <FastForwardComponent />
      <BackWardComponent />
      <RepeatComponent />
      <SuffelComponent />
      <DownloadModal
        isModalVisible={isModalVisible}
        onClosePress={() => setModalVisible(false)}
        contentId={data.id}
        onDownloadFinished={item => {
          if (item) {
            setAlreadyDownload(true);
          }
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  video: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    backgroundColor: 'black',
    width: '100%',
    height: '100%',
  },
  slider: {
    width: Platform.OS === 'ios' ? '90%' : '100%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 160 : 170,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  controlButton: {
    color: '#000',
    fontSize: 200,
  },
  playIcon: {
    width: 70,
    height: 70,
  },
  fastIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  fastContainer: {
    position: 'absolute',
    bottom: 90,
    right: 90,
    alignSelf: 'center',
  },
  backContainer: {
    position: 'absolute',
    bottom: 90,
    left: 90,
    alignSelf: 'center',
  },
  reloadContainer: {
    position: 'absolute',
    bottom: 100,
    left: 25,
    alignSelf: 'center',
  },
  reloadIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  suffelContainer: {
    position: 'absolute',
    bottom: 104,
    right: 25,
    alignSelf: 'center',
  },
  suffelIcon: {
    width: 30,
    height: 30,
  },
  closeIcon: {
    width: 30,
    height: 30,
  },
  iconContainer: {
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 60 : 20,
    paddingHorizontal: 20,
    borderWidth: 0,
  },
  controlsContainer: {
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    justifyContent: 'flex-end',
  },
  wrapper: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: 200,
    alignSelf: 'flex-end',
    right: 20,
  },
  titleContainer: {
    position: 'absolute',
    bottom: 200,
    marginHorizontal: 20,
  },
  songName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  artistName: {color: '#888', fontSize: 14},
});

export default AudioPlayer;

const PlayPauseComponent = ({togglePlay, isPaused}) => {
  return (
    <TouchableOpacity
      onPress={togglePlay}
      style={{
        position: 'absolute',
        bottom: 85,
        alignSelf: 'center',
        borderRadius: 50,
      }}>
      {isPaused ? (
        <Image
          style={styles.playIcon}
          source={require('../../icons/playWhite.webp')}
        />
      ) : (
        <Image
          style={styles.playIcon}
          source={require('../../icons/pauseWhite.jpeg')}
        />
      )}
    </TouchableOpacity>
  );
};

const FastForwardComponent = () => {
  return (
    <TouchableOpacity style={styles.fastContainer}>
      <Image style={styles.fastIcon} source={require('../../icons/fast.png')} />
    </TouchableOpacity>
  );
};

const BackWardComponent = () => {
  return (
    <TouchableOpacity style={styles.backContainer}>
      <Image
        style={styles.fastIcon}
        source={require('../../icons/newBack.png')}
      />
    </TouchableOpacity>
  );
};

const RepeatComponent = () => {
  return (
    <TouchableOpacity style={styles.reloadContainer}>
      <Image
        style={styles.reloadIcon}
        source={require('../../icons/rewindAlt.png')}
      />
    </TouchableOpacity>
  );
};

const SuffelComponent = () => {
  return (
    <TouchableOpacity style={styles.suffelContainer}>
      <Image
        style={styles.suffelIcon}
        source={require('../../icons/new.png')}
      />
    </TouchableOpacity>
  );
};

export const showToast = (type, text1, text2) => {
  Toast.show({
    type: type,
    text1: text1,
    text2: text2,

    position: 'top',
    topOffset: 50,
    visibilityTime: 4000,
    autoHide: true,
  });
};
