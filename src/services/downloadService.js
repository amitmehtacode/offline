import {Platform, DeviceEventEmitter} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';

export const sendDownloadedDataToLocalDir = async (
  callback = () => {},

  contentId,
  src,
  artistName,
  songName,
  posterImage,
  isAudio,
) => {
  const {dirs} = RNFetchBlob.fs;
  const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.CacheDir;
  const path = RNFetchBlob.fs.dirs.CacheDir + `/.file.json`;

  var offlineMusicPlayerUrl = '';
  var imageUrl = '';
  var roundOffValue = 0;
  let getNewTime = new Date().getTime();

  const commonConfig = {
    fileCache: true,
    useDownloadManager: true,
    notification: true,
    title: songName,
    path: isAudio
      ? `${dirToSave}/${getNewTime}.mp3`
      : `${dirToSave}/${getNewTime}.mp4`,
    mediaScannable: true,
    description: 'file download',
  };

  const configOptions = Platform.select({
    ios: {
      fileCache: commonConfig.fileCache,
      title: commonConfig.title,
      path: commonConfig.path,
      appendExt: isAudio ? 'mp3' : 'mp4',
    },
    android: commonConfig,
  });

  const startDownloadingTheRestContent = async cb => {
    // for Images
    try {
      let res = await RNFetchBlob.config({
        fileCache: true,
        path: `${dirToSave}/${contentId}.webp`,
        IOSBackgroundTask: true,
      }).fetch('GET', posterImage, {});
      if (res) {
        imageUrl = res.path();
      }
    } catch (e) {}

    var offlineObjData = {
      contentId: contentId,
      source: offlineMusicPlayerUrl,
      artistName: artistName,
      songName: songName,
      downloadDate: new Date(),
      posterImage: imageUrl,
      isAudio: isAudio,
    };

    let offlinDonwloadList = [];
    //fetching local downloads from storage
    try {
      let localDownloads = await RNFetchBlob.fs.readFile(path, 'utf8');
      localDownloads = JSON.parse(localDownloads);
      if (Array.isArray(localDownloads)) {
        offlinDonwloadList = localDownloads;
      }
    } catch (e) {}

    //adding new downloads
    offlinDonwloadList.push(offlineObjData);
    await RNFetchBlob.fs
      .writeFile(path, JSON.stringify(offlinDonwloadList), 'utf8')
      .then(r => {
        cb && cb();
      })
      .catch(e => {});
  };

  // for video
  if (src) {
    RNFetchBlob.config(configOptions)
      .fetch('get', src, {})
      .progress((received, total) => {
        const percentageValue = (received / total) * 100;
        roundOffValue = Math.round(percentageValue);

        var params = {
          contentId: contentId,
          source: src,
          artistName: artistName,
          songName: songName,
          progressValue: JSON.stringify(roundOffValue),
        };
        DeviceEventEmitter.emit('downloadProgress', params);
        DeviceEventEmitter.emit('downloadProgress', params);
      })
      .then(async res => {
        let downloadContents = {};
        if (Platform.OS === 'ios') {
          await RNFetchBlob.fs.writeFile(commonConfig.path, res.data, 'base64');
          offlineMusicPlayerUrl = commonConfig.path;
          await startDownloadingTheRestContent(() => {
            var params = {
              contentId: contentId,
              source: src,
              artistName: artistName,
              songName: songName,
              progressValue: JSON.stringify(roundOffValue),
            };

            DeviceEventEmitter.emit('downloadDone', params);
            DeviceEventEmitter.emit('downloadProgress', params);
          });
        } else {
          // for Android
          offlineMusicPlayerUrl = res.path();
          startDownloadingTheRestContent(() => {
            var params = {
              contentId: contentId,
              source: src,
              artistName: artistName,
              songName: songName,
              progressValue: JSON.stringify(roundOffValue),
            };
            DeviceEventEmitter.emit('downloadDone', params);
            DeviceEventEmitter.emit('downloadProgress', params);
          });
        }
      })

      .catch(err => {
        callback('error');
        DeviceEventEmitter.emit('downloadError', true);
      });
  }
};

export const fetchDownloadedDataFromLocalDir = async (sendData = () => {}) => {
  const trackFolder =
    Platform.OS === 'ios'
      ? RNFetchBlob.fs.dirs.DocumentDir
      : RNFetchBlob.fs.dirs.CacheDir;
  const MyPath = RNFetchBlob.fs.dirs.CacheDir + `/.file.json`;
  await RNFetchBlob.fs
    .ls(trackFolder)
    .then(files => {})
    .catch(err => {});
  try {
    let localDownloads = await RNFetchBlob.fs.readFile(MyPath, 'utf8');
    localDownloads = JSON.parse(localDownloads);
    if (Array.isArray(localDownloads)) {
      sendData(localDownloads);
    }
  } catch (e) {}
};

export const deleteContentFromLocalDir = async downloadedId => {
  let jsonObj = [];
  const MyPath = RNFetchBlob.fs.dirs.CacheDir + `/.file.json`;
  try {
    let localDownloads = await RNFetchBlob.fs.readFile(MyPath, 'utf8');
    localDownloads = JSON.parse(localDownloads);
    if (Array.isArray(localDownloads)) {
      jsonObj = localDownloads;
    }
  } catch (e) {}

  let flag = '';
  const contentIdToFind = downloadedId;
  jsonObj.map((item, index) => {
    if (item.id === contentIdToFind) {
      flag = index;
    }
  });
  jsonObj.splice(flag, 1);
  await RNFetchBlob.fs
    .writeFile(MyPath, JSON.stringify(jsonObj), 'utf8')
    .then(r => {})
    .catch(e => {});
};

export const deleteAllDownloadDataFromLocal = async () => {
  let jsonObj = [];
  const MyPath = RNFetchBlob.fs.dirs.CacheDir + `/.file.json`;
  await RNFetchBlob.fs
    .writeFile(MyPath, JSON.stringify(jsonObj), 'utf8')
    .then(r => {})
    .catch(e => {});
};
