import {
  DeviceEventEmitter,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CircularProgressBar from '../CircularProgressBar';
import {showToast} from '../../screens/AudioPlayer';

const DownloadModal = ({
  isModalVisible = false,
  onClosePress = () => {},
  onAndroidBackPress = () => {},
  onDownloadFinished = false,
  contentId,
}) => {
  const [isDownloading, setDownloading] = useState(false);
  const [downloadPercentage, setDownloadPercentage] = useState(0);

  useEffect(() => {
    const downloadListener = DeviceEventEmitter.addListener(
      'downloadProgress',
      e => {
        if (e.contentId === contentId) {
          setDownloading(true);
          setDownloadPercentage(e?.progressValue);
        } else if (e.contentId === contentId) {
          // for single content
          setDownloading(true);
          setDownloadPercentage(e?.progressValue);
        } else {
          setDownloading(false);
        }
      },
    );
    return () => {
      downloadListener.remove();
      //   setAlreadyDownload(false);
    };
  }, []);

  useEffect(() => {
    const downloadListenerStatus = DeviceEventEmitter.addListener(
      'downloadDone',
      e => {
        if (e?.contentId === contentId) {
          showToast(
            'success',
            'Content Downloaded',
            'The content downloaded successfully 👋',
          );
          onDownloadFinished(true);
          onClosePress();
        }
      },
    );
    return () => {
      downloadListenerStatus.remove();
    };
  }, []);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={() => {
        onAndroidBackPress();
        onClosePress();
      }}>
      <View style={styles.modalContainer}>
        <View style={styles.modalViewAlt}>
          <TouchableOpacity
            onPress={onClosePress}
            style={styles.crossContainer}>
            <Image
              style={{width: 25, height: 25}}
              source={require('../../icons/cross.png')}
            />
          </TouchableOpacity>
          <CircularProgressBar
            percentage={JSON.parse(downloadPercentage)}
            centerText={JSON.parse(downloadPercentage)}
          />
          <Text style={styles.subHeading}>Downloading...</Text>
        </View>
      </View>
    </Modal>
  );
};

export default DownloadModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#00000080',
  },
  modalViewAlt: {
    backgroundColor: '#59904B',
    borderRadius: 4,
    alignItems: 'center',
    width: '40%',
    height: '15%',
    paddingTop: 10,
  },

  heading: {
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    color: '#000',
    lineHeight: 18,
    fontWeight: '700',
  },
  subHeading: {
    textAlign: 'center',
    marginBottom: 21,
    fontSize: 15,
    width: '150%',
    color: '#fff',
  },
  keepAccount: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    borderTopColor: '#606060',
  },
  crossContainer: {position: 'absolute', alignSelf: 'flex-end', padding: 4},
});
