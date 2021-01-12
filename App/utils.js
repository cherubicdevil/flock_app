/* 
* Made by Kevin Gao, for Flock Shopping.
* All rights reserved.
* Flock © 2020
*
*
			 _______  ___        ______    ______   __   ___  
			/"     "||"  |      /    " \  /" _  "\ |/"| /  ") 
			(: ______)||  |     // ____  \(: ( \___)(: |/   /  
			\/    |  |:  |    /  /    ) :)\/ \     |    __/   
			// ___)   \  |___(: (____/ // //  \ _  (// _  \   
			(:  (     ( \_|:  \\        / (:   _) \ |: | \  \  
			\__/      \_______)\"_____/   \_______)(__|  \__)
*
*
* utils.js
* 
* This is for code that is used, but is a little unrelated in function
    to whatever context it's used in.
* 
* Table of Contents
*
*-- fetchStreamableSource
        takes in streamable base video url stored on firebase and returns
        the actual source that can be loaded off browser.
        Returns a promise.
        Is async.
*-- fetchAlbums
        takes in optional parameter lastVisible to mark firebase paging.
        main function to get data from firebase
        returns array of data and new lastVisible reference.
*-- fetchProducts
        takes in optional parameter lastVisible
        returns array of products and new lastVisible reference.
*-- mergeArrays
        used in feedlist to merge video and product arrays
*-- onGLContextCreate (unused) and create3dEgg (unused) and render3dEgg(unused)
        used to create a 3d egg for Egg.js

*-- updateCache( data member --like groupChats --, 'add' 'delete', data)
*/

import {constants} from 'App/constants';
import {firebase, db} from 'App/firebase/config';
import ImagePicker from 'react-native-image-picker';
import {Animated, Share, Linking} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';
import {useDispatch} from 'react-redux';
import {ShareDialog, LoginButton, AccessToken} from 'react-native-fbsdk';
import { AppInstalledChecker, CheckPackageInstallation } from 'react-native-check-app-install';
import CameraRoll from '@react-native-community/cameraroll';

var lastVisible = null;

const fetchStreamableSource = async (src) => {
  if (src === null || src === undefined) {
    return new Promise(function (resolve, reject) {
      resolve(constants.TEST_URL);
    });
  }
  const fetchVar = fetch(constants.HEROKU + 'getStreamableSource/' + src);
  const responseVar = fetchVar.then((response) => response.json());
  const urlVar = responseVar.then((response) => {
    return new Promise(function (resolve) {
      createThumbnail({
        url: response.streamableVideo,
        timeStamp: 0,
      }).then((resp) => {
        resolve({
          streamableVideo: response.streamableVideo,
          posterSource: resp.path,
          size: {height: resp.height, width: resp.width},
        });
      });
      // resolve({
      //   streamableVideo: response.streamableVideo,
      //   posterSource: response.posterSource,
      // });
    });
  });
  return await urlVar;
};

const fetchUserData = (user) => {
  return new Promise(async (resolve) => {
    const doc = await firebase
      .firestore()
      .collection('users')
      .doc(user.uid)
      .get();
    resolve(doc.data());
  });
};

const fetchAlbums = () => {
  return new Promise(async (resolve) => {
    console.log("LAST VISIBLE", lastVisible);
    var counter = 0;
    firebase
      .firestore()
      .collection('posts')
      .orderBy('title')
      .startAfter(lastVisible)
      .limit(7)
      .get()
      .then(async (querySnapshot) => {
        const n = querySnapshot.size;
        const ar = [];
        querySnapshot.forEach(async (doc) => {
          const newSource = await fetchStreamableSource(doc.data().video);
          const entity = {
            ...doc.data(),
            id: doc.id,
            video: newSource.streamableVideo,
            poster: newSource.posterSource,
            size: newSource.size,
          };
          ar.push(entity);
          counter = counter + 1;
          if (counter == n) {
            lastVisible = doc;
            resolve({ar: ar, lastVisible: lastVisible});
          }
        });
      });
  });
};

const fetchProducts = (lastVisible = null) => {
  const productAr = [];
  firebase
    .firestore()
    .collection('products')
    .limit(6)
    .get()
    .then((querySnapshot) => {
      counter = 0;
      const n = querySnapshot.size;
      querySnapshot.forEach((doc) => {
        const entity = doc.data();
        productAr.push(entity);
        counter = counter + 1;
        if (counter === n) {
          return {productAr: productAr, lastVisible: lastVisible};
        }
      });
    });
};

const mergeArrays = (ar1, ar2) => {
  let ar3 = [];
  for (var i = 0, j = 0; j < ar1.length + ar2.length; i++) {
    if (i < ar1.length) {
      ar3[j++] = ar1[i];
    }
    if (i < ar2.length) {
      ar3[j++] = ar2[i];
    }
  }

  return ar3;
};

const pickVideo = (setPic) => {
  ImagePicker.launchImageLibrary(
    {maxWidth: 1024, maxHeight: 1024, mediaType: 'video'},
    (response) => {
      console.log('setting', response.uri);
      setPic({uri: response.uri});
    },
  );
};

const fadeOut = (val, duration) => {
  Animated.timing(
    // Animate over time
    val, // The animated value to drive
    {
      toValue: 0, // Animate to opacity: 1 (opaque)
      duration: duration, // 2000ms
      useNativeDriver: true,
    },
  ).start();
};

const fadeIn = (val, duration) => {
  Animated.timing(
    // Animate over time
    val, // The animated value to drive
    {
      toValue: 1, // Animate to opacity: 1 (opaque)
      duration: duration, // 2000ms
      useNativeDriver: true,
    },
  ).start();
};

const springUp = (val, target, duration) => {
  Animated.spring(
    // Animate over time
    val, // The animated value to drive
    {
      toValue: 0,
      friction: 5,
      //toValue: target, // Animate to opacity: 1 (opaque)
      duration: duration, // 2000ms
      useNativeDriver: true,
    },
  ).start();
};

const uploadUserInfo = (info) => {
  const user = firebase.auth().currentUser.uid;
  firebase.firestore().collection('users').doc(user).set(info);
};

const getIndexOfData = (array, data) => {
  var counter = 0;
  for (const el of array) {
    if (el.title === data.title) {
      return counter;
    }
    counter += 1;
  }
  return -1;
};

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatMoney = (price, num) => {
  return formatter.format(price / num);
};

const getChatsFromId = async () => {
  const db = firebase.firestore();
  const user = firebase.auth().currentUser;
  const users = await db.collection('users');
  const userInfo = await users.doc(user.uid);
  const doc = await userInfo.get();
  const chatIds = doc.data().chatIds;

  const chatGroups = db.collection('chatGroups');
  const ar = [];
  for (const chatGroup of chatIds) {
    //console.log(chatGroup);
    const chatData = (await (await chatGroups.doc(chatGroup)).get()).data();
    ar.push(chatData);
  }
  return new Promise((resolve) => {
    resolve(ar);
  });
};

const fetchGlobalFlocks = async () => {
  return new Promise((resolve) => {
    db.collection('chatGroups')
      .get()
      .then((querySnapshot) => {
        var counter = 0;
        const n = querySnapshot.size;
        const ar = [];
        querySnapshot.forEach((doc) => {
          const entity = doc.data();
          ar.push(entity);
          counter = counter + 1;
          if (counter === n) {
            resolve(ar);
          }
        });
      });
  });
};

const fetchFlockables = async () => {
  return new Promise((resolve) => {
    db.collection('chatGroups')
      .limit(10)
      .where('completed', '==', 'false')
      .get()
      .then((querySnapshot) => {
        var counter = 0;
        const n = querySnapshot.size;
        const ar = [];
        querySnapshot.forEach((doc) => {
          const entity = doc.data();
          ar.push(entity);
          counter = counter + 1;
          if (counter === n) {
            resolve(ar);
          }
        });
      });
  });
};

const fetchRentables = async () => {
  return new Promise((resolve) => {
    db.collection('chatGroups')
      .limit(10)
      .where('completed', '==', 'true')
      .get()
      .then((querySnapshot) => {
        var counter = 0;
        const n = querySnapshot.size;
        const ar = [];
        querySnapshot.forEach((doc) => {
          const entity = doc.data();
          ar.push(entity);
          counter = counter + 1;
          if (counter === n) {
            resolve(ar);
          }
        });
      });
  });
};

const updateCache = (member, actiontype, data) => {
  
}

const shareActions = {"facebook": function(content, failure) {
  const {product: product, data: data} = content;
  const shareLinkContent = {
    contentType: 'link',
     contentUrl: "https://facebook.com",
contentDescription: 'Facebook sharing is easy!',
};

const sharePhotoContent = {
contentType :'photo',
photos: [{ imageUrl:  product.image}],
};
//console.log("ShareDialog", FB);
ShareDialog.canShow(shareLinkContent).then((canShow)=>{
console.log("canShow?", canShow);
ShareDialog.show(shareLinkContent).then(
  function(result) {
    console.log(result);
    if (result.isCancelled) {
      console.log('Share cancelled');
      failure();
    } else {
      console.log('Share success with postId: '
        + result.postId);
    }
  },
  function(error) {
    console.log('Share fail with error: ' + error);
  }
  );
//ShareDialog.show(sharePhotoContent);

});

AppInstalledChecker
.checkURLScheme('whatsapp') // omit the :// suffix
.then((isInstalled) => {
  // isInstalled is true if the app is installed or false if not
  console.log(isInstalled, "is installed");
})
},
"twitter": function (content, failure) {
  Share.share({
    message: 'hello world',
    title: 'Flock Content',
    url: 'https://twitter.com',
  }).then((result)=> {
    if (result.action === Share.dismissedAction) {
      failure();
      console.log('cancelled for real');
    } else if (result.action === Share.sharedAction) {

    }
    console.log('cancelled');
  });
  
},
"snapchat": function (content, failure) {
  Share.share({
    message: 'hello world',
    title: 'Flock Content',
    url: 'https://twitter.com',
  }).then((result)=> {
    if (result.action === Share.dismissedAction) {
      failure();
      console.log('cancelled for real');
    } else if (result.action === Share.sharedAction) {

    }
    console.log('cancelled');
  });
},
"instagram": function (content) {
  console.log(content.data);
  const img = content.data.imgRef.current;

  img.capture().then(uri => {
    console.log("do something with ", uri);
    let instagramURL = `instagram://library?LocalIdentifier=`+uri;
    console.log(uri);
    CameraRoll.save(uri).then(()=> {
      Linking.openURL(instagramURL);
    });
    
  });

},
"whatsapp": function (content, failure) {
  Share.share({
    message: 'hello world',
    title: 'Flock Content',
    url: 'https://twitter.com',
  }).then((result)=> {
    if (result.action === Share.dismissedAction) {
      failure();
      console.log('cancelled for real');
    } else if (result.action === Share.sharedAction) {

    }
    console.log('cancelled');
  });
},
"tiktok": function (content, failure) {
  Share.share({
    message: 'hello world',
    title: 'Flock Content',
    url: 'https://twitter.com',
  }).then((result)=> {
    if (result.action === Share.dismissedAction) {
      failure();
      console.log('cancelled for real');
    } else if (result.action === Share.sharedAction) {

    }
    console.log('cancelled');
  });
}
};

const generateUserObject = (displayName, uid) => {
  return {displayName: displayName, uid: uid};
}
export {
  fetchStreamableSource,
  fetchAlbums,
  fetchProducts,
  fetchFlockables,
  fetchRentables,
  mergeArrays,
  pickVideo,
  fadeIn,
  springUp,
  fetchUserData,
  uploadUserInfo,
  getIndexOfData,
  formatMoney,
  getChatsFromId,
  fetchGlobalFlocks,
  shareActions,
  generateUserObject
};
