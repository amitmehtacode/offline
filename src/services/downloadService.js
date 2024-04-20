import {Platform, DeviceEventEmitter} from 'react-native';

import RNFetchBlob from 'rn-fetch-blob';

export const sendDownloadedDataToLocalDir = async (
  callback = () => {},
  //   coverImageUrl,
  //   category,
  //   title,
  //   userUniqueId,
  //   badgeText,
  //   language,
  //   duration,
  //   description,
  //   teacherName,
  //   ownerAvatarImageUrl,
  //   offlineUrl,
  //   widePosterImageUrl,
  //   //   contentId,
  //   contentType,
  //   teacherId,
  //   userMusicProperty,
  //   musicType,
  //   trackTitle,
  //   trackDuration,

  contentId,
  src,
  artistName,
  songName,
  posterImage,
) => {
  console.log('first', contentId, src, artistName, songName, posterImage);

  const {dirs} = RNFetchBlob.fs;
  const dirToSave = Platform.OS === 'ios' ? dirs.DocumentDir : dirs.CacheDir;
  const path = RNFetchBlob.fs.dirs.CacheDir + `/.file.json`;

  var offlineMusicPlayerUrl = '';
  var imageUrl = '';
  var ownerUrl = '';
  var roundOffValue = 0;
  let getNewTime = new Date().getTime();
  let uniqueId = Math.floor(JSON.stringify(Date.now() + Math.random()));
  let customId = Math.floor(Math.random() * 100000);

  const commonConfig = {
    fileCache: true,
    useDownloadManager: true,
    notification: true,
    title: songName,
    path: `${dirToSave}/${getNewTime}.mp4`,
    mediaScannable: true,
    description: 'file download',
  };

  const configOptions = Platform.select({
    ios: {
      fileCache: commonConfig.fileCache,
      title: commonConfig.title,
      path: commonConfig.path,
      appendExt: 'mp4',
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

    // for owner Image
    // const imageConvert = ownerAvatarImageUrl && changeImageFormat(ownerAvatarImageUrl);

    // if (ownerAvatarImageUrl) {
    //   try {
    //     let res = await RNFetchBlob.config({
    //       fileCache: true,
    //       path: `${dirToSave}/${contentId}.jpg`,
    //     }).fetch('GET', imageConvert, {});
    //     if (res) {
    //       ownerUrl = res.path();
    //     }
    //   } catch (e) {}
    // }

    var offlineObjData = {
      //   userId: userUniqueId,
      //   id: contentId,
      //   title: title,
      //   duration: duration,
      //   longDescription: description,
      //   teacher: teacherName,
      //   contentType: contentType,
      //   trackDuration: trackDuration,
      //   playUrl: offlineMusicPlayerUrl,
      //   posterImage: imageUrl,
      //   ownerAvatarImageUrl: ownerUrl,
      //   trackTitle: trackTitle,
      //   teacherId: teacherId,
      //   userMusicProperty: userMusicProperty,
      //   musicType: musicType,
      //   downloadDate: new Date(),
      //   category: category,
      //   badgeText: badgeText,
      //   language: language,
      //   imageUrl: coverImageUrl,

      contentId: contentId,
      source: offlineMusicPlayerUrl,
      artistName: artistName,
      songName: songName,
      downloadDate: new Date(),
      posterImage: posterImage,
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
        console.log('🚀 ~ res:', res);
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
        console.log('error-----', err);
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
    .catch(err => {
      // console.log('err----->>>>', err)
    });
  try {
    let localDownloads = await RNFetchBlob.fs.readFile(MyPath, 'utf8');
    localDownloads = JSON.parse(localDownloads);
    if (Array.isArray(localDownloads)) {
      sendData(localDownloads);
    }
  } catch (e) {}
};

export const deleteContentFromLocalDir = async (
  downloadedId,
  downloadedContentType,
  downloadedTrackTitle,
  musicTypeValue,
  musicProperty,
  // eventObj
) => {
  let jsonObj = [];
  const MyPath = RNFetchBlob.fs.dirs.CacheDir + `/.file.json`;
  try {
    let localDownloads = await RNFetchBlob.fs.readFile(MyPath, 'utf8');
    localDownloads = JSON.parse(localDownloads);
    if (Array.isArray(localDownloads)) {
      jsonObj = localDownloads;
    }
  } catch (e) {
    let obj = {
      type: CONSTANTS_ENUM.OFFLINE_DOWNLOAD_READ_FILE,
      error: JSON.stringify(e),
    };
    registerAnalyticsEvent(
      ANALYTICS_EVENTS.DELETE_SINGLE_DATA_FROM_LOCAL_FAILED,
      obj,
    );
  }

  if (musicTypeValue === MUSIC_TYPE_BOTH && musicProperty) {
    let flag = '';
    const contentIdToFind = downloadedId;
    jsonObj.map((item, index) => {
      if (
        item.id === contentIdToFind &&
        item?.musicType === MUSIC_TYPE_BOTH &&
        item?.userMusicProperty === musicProperty
      ) {
        flag = index;
      }
    });
    jsonObj.splice(flag, 1);
    newArrObj = jsonObj;
    // jsonObj = jsonObj?.filter((item) => item.id === downloadedId && item?.musicType === MUSIC_TYPE_BOTH && item?.userMusicProperty === musicProperty);
  } else if (
    downloadedContentType === CONSTANTS_ENUM.TYPE_SINGLE &&
    musicTypeValue !== MUSIC_TYPE_BOTH &&
    downloadedId
  ) {
    jsonObj = jsonObj?.filter(obj => obj?.id !== downloadedId); // for single without music type --> both
  } else if (
    downloadedContentType === CONSTANTS_ENUM.TYPE_COURSE &&
    downloadedTrackTitle
  ) {
    jsonObj = jsonObj?.filter(
      obj => obj?.trackTitle !== downloadedTrackTitle, // for courses
    );
  }

  await RNFetchBlob.fs
    .writeFile(MyPath, JSON.stringify(jsonObj), 'utf8')
    .then(r => {})
    .catch(e => {});
};

export const deleteAllDownloadDataFromLocal = async userId => {
  // if userID doesn't exist.
  if (!userId) {
    return;
  }

  let jsonObj = [];
  const MyPath = RNFetchBlob.fs.dirs.CacheDir + `/.file.json`;

  try {
    let localDownloads = await RNFetchBlob.fs.readFile(MyPath, 'utf8');
    localDownloads = JSON.parse(localDownloads);
    if (Array.isArray(localDownloads)) {
      jsonObj = localDownloads;
    }
  } catch (e) {}

  //delete all operation
  jsonObj = jsonObj?.filter(item => item.userId !== userId);

  await RNFetchBlob.fs
    .writeFile(MyPath, JSON.stringify(jsonObj), 'utf8')
    .then(r => {})
    .catch(e => {});
};
