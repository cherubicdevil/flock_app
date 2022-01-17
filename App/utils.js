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
import moment from 'moment';
import {throttle} from 'lodash';
import {firebase, db, au} from 'App/code/firebase/config';
import {Animated, Share, Linking} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';
import {useDispatch} from 'react-redux';
import {ShareDialog, LoginButton, AccessToken} from 'react-native-fbsdk';
import { AppInstalledChecker, CheckPackageInstallation } from 'react-native-check-app-install';
import {createToken, Card} from '@stripe/stripe-react-native';

// var sizeOf = require('image-size');


// var lastVisible = null;
// var lastVisibleFlock = null;
// var lastVisibleRent = null;
// var lastVisiblePost = null;


const getCurrentTime = () => {
  return Math.round(Date.now() / 1000);
}

const checkFlockExpired = (time) => {
  return getCurrentTime() - time > 24 * 3600 * 7;
}

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
            type: 'rec',
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

const resetLastVisible = () => {
  lastVisible = null;
}

const fetchProducts = (lastVisible = null) => {
  const productAr = [];
  firebase
    .firestore()
    .collection('products')
    .limit(6)
    .get()
    .then((querySnapshot) => {
      let counter = 0;
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
      setPic({uri: response.uri});
    },
  );
};

const pickImage = (setPic) => {
  ImagePicker.launchImageLibrary(
    {maxWidth: 1024, maxHeight: 1024, mediaType: 'photo'},
    (response) => {
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


const fetchFlockables = async (lastVisible = null) => {
  return new Promise(async (resolve) => {
    var filtered = await db.collection('products')
      .limit(10)
      // .orderBy("time", "desc")
      // .where('completed', '==', false)

      if (lastVisible != null) {
        filtered = await filtered.startAfter(lastVisible);
      }

      filtered
.get()
      .then((querySnapshot) => {
        var counter = 0;
        let numFiltered = 0;
        const n = querySnapshot.size;
        if (n == 0) {
          resolve({ar:[], lastVisible: null})
        }
        const ar = [];
        querySnapshot.forEach((doc) => {
          
          const entity = doc.data();
          if (!checkFlockExpired(entity.time)) {
            ar.push({...entity, id:doc.id});
            counter = counter + 1;
          } else {
            numFiltered = numFiltered + 1
          }
          if (counter === n - numFiltered) {
            console.log('num filtered', numFiltered)
            console.log("FLOCKABLE", lastVisible)

            resolve({ar: ar, lastVisible: doc});
            
          }
        });
      });
  });
};
// const fetchFlockables = async () => {
//   return new Promise((resolve) => {
//     db.collection('chatGroups')
//       .limit(10)
//       .orderBy("time", "desc")
//       .where('completed', '==', false)
//       .startAfter(lastVisibleFlock)
//       .get()
//       .then((querySnapshot) => {
//         var counter = 0;
//         const n = querySnapshot.size;
//         const ar = [];
//         if (n == 0) {
//           resolve(ar);
//           return;
//         }
//         querySnapshot.forEach((doc) => {
//           console.log('doing')
//           const entity = doc.data();
//           ar.push({...entity, id:doc.id});
//           counter = counter + 1;
//           if (counter === n) {
//             resolve(ar);
//             lastVisibleFlock = doc;
//           }
//         });
//       });
//   });
// };

const fetchPosts = async (lastVisible = null) => {
  if (lastVisible == null) {
    return new Promise((resolve) => {
      db.collection('posts')
        .limit(10)
        .orderBy("createdAt", "desc")
        .get()
        .then((querySnapshot) => {
          var counter = 0;
          const n = querySnapshot.size;
          if (n == 0) {
            resolve({ar:[], lastVisible: null})
          }
          const ar = [];
          querySnapshot.forEach((doc) => {
            const entity = doc.data();
            ar.push({...entity, id:doc.id});
            counter = counter + 1;
            if (counter === n) {
              resolve({ar: ar, lastVisible: doc});
            }
          });
        });
    });
  }
  return new Promise((resolve) => {
    db.collection('posts')
      .limit(10)
      .orderBy("createdAt", "desc")
      .startAfter(lastVisible)
      .get()
      .then((querySnapshot) => {
        var counter = 0;
        const n = querySnapshot.size;
        if (n == 0) {
          resolve({ar:[], lastVisible: null})
        }
        const ar = [];
        querySnapshot.forEach((doc) => {
          const entity = doc.data();
          ar.push({...entity, id:doc.id});
          counter = counter + 1;
          if (counter === n) {
            resolve({ar: ar, lastVisible: doc});
          }
        });
      });
  });
};

const fetchPostsFirst = async () => {
  return new Promise((resolve) => {
    db.collection('posts')
      .limit(10)
      .orderBy("createdAt", "desc")
      .get()
      .then((querySnapshot) => {
        var counter = 0;
        const n = querySnapshot.size;
        const ar = [];
        querySnapshot.forEach((doc) => {
          const entity = doc.data();
          ar.push({...entity, id:doc.id});
          counter = counter + 1;
          if (counter === n) {
            resolve(ar);
            lastVisiblePost = doc;
          }
        });
      });
  });
};

const fetchRentables = async (lastVisible = null) => {
  if (lastVisible == null ) {
    return new Promise((resolve) => {
      db.collection('chatGroups')
        .limit(10)
        .orderBy("time", "desc")
        .where('completed', '==', true)
        .get()
        .then((querySnapshot) => {
          var counter = 0;
          const n = querySnapshot.size;
          if (n == 0) {
            resolve({ar:[], lastVisible: null})
          }
          const ar = [];
          if (n == 0) {
            resolve(ar);
            return;
          }
          querySnapshot.forEach((doc) => {
            const entity = doc.data();
            ar.push({...entity, id:doc.id});
            counter = counter + 1;
            if (counter === n) {
              resolve({ar:ar, lastVisible: doc});
            }
          });
        });
    });
  }
  return new Promise((resolve) => {
    db.collection('chatGroups')
      .limit(10)
      .orderBy("time", "desc")
      .where('completed', '==', true)
      .startAfter(lastVisible)
      .get()
      .then((querySnapshot) => {
        var counter = 0;
        const n = querySnapshot.size;
        if (n == 0) {
          resolve({ar:[], lastVisible: null})
        }
        const ar = [];
        if (n == 0) {
          resolve(ar);
          return;
        }
        querySnapshot.forEach((doc) => {
          const entity = doc.data();
          ar.push({...entity, id:doc.id});
          counter = counter + 1;
          if (counter === n) {
            resolve({ar:ar, lastVisible: doc});
          }
        });
      });
  });
};

const fetchRentablesFirst = async () => {
  return new Promise((resolve) => {
    db.collection('chatGroups')
      .limit(10)
      .orderBy("time", "desc")
      .where('completed', '==', true)
      .get()
      .then((querySnapshot) => {
        var counter = 0;
        const n = querySnapshot.size;
        const ar = [];
        querySnapshot.forEach((doc) => {
          const entity = doc.data();
          ar.push({...entity, id:doc.id});
          counter = counter + 1;
          if (counter === n) {
            resolve({ar:ar, lastVisible: lastVisible});
          }
        });
      });
  });
};

const updateCache = (member, actiontype, data) => {
  
}

const shareActions = {
//   "facebook": function(content, failure) {
//   const {image: image, data: data, shareApp: shareApp, successCallback: successCallback} = content;
//   var shareLinkContent;
//   var sharePhotoContent;
//   var imgRef = data.imgRef.current;

//   if (true) {
//     shareLinkContent = {
//       contentType:'link',
//       contentUrl: "https://facebook.com",
//       contentDescription: 'Facebook sharing is easy!',
//     }
//     var sharePhotoContent = {
//       contentType :'photo',
//       photos: [{ imageUrl:  null}],
//       };
//   } else {
//   var shareLinkContent = {
//     contentType: 'link',
//      contentUrl: "https://facebook.com",
// contentDescription: 'Facebook sharing is easy!',
// };
// var sharePhotoContent = {
//   contentType :'photo',
//   photos: [{ imageUrl:  image}],
//   };
//   }

// //console.log("ShareDialog", FB);
// console.log('bout to show');
// imgRef.capture((uri)=>{
//   var sharePhotoContent = {
//     contentType :'photo',
//     photos: [{ imageUrl:  uri}],
//     };
// ShareDialog.canShow(sharePhotoContent).then((canShow)=>{
//   console.log('showing', uri.substring(0,5));

//     ShareDialog.show(sharePhotoContent).then(
//       function(result) {
//         console.log(result);
//         if (result.isCancelled) {
//           console.log('Share cancelled');
//           failure();
//         } else {
//           console.log('Share success with postId: '
//             + result.postId);
//           successCallback();
          
//         }
//       },
//     function(error) {
//       console.log('Share fail with error: ' + error);
//     }
//     );
//   //ShareDialog.show(sharePhotoContent);
//   });
  

// });

// // AppInstalledChecker
// // .checkURLScheme('whatsapp') // omit the :// suffix
// // .then((isInstalled) => {
// //   // isInstalled is true if the app is installed or false if not
// //   console.log(isInstalled, "is installed");
// // })
// },

"facebook": function (content, failure) {
  const availableTypes = ["net.whatsapp.WhatsApp.ShareExtension", "com.apple.UIKit.activity.Message",  "com.apple.UIKit.activity.PostToTwitter", "com.zhiliaoapp.musically.ShareExtension", 'com.burbn.instagram.shareextension', 'com.apple.UIKit.activity.PostToFacebook', 'com.toyopagroup.picaboo.share'];
  const {data: data, successCallBack: successCallBack} = content;
  var img = data.imgRef.current;
  img.capture().then(uri=>{
    Share.share({
      // message: 'hello world',
      // title: 'Flock Content',
      message: "https://apps.apple.com/us/app/flock-share-cost-buy-designer/id1551725800",
      url: "data:image/png;base64,"+uri,
    }).then((result)=> {
      if (result.action === Share.dismissedAction) {
        failure();
      } else if (result.action === Share.sharedAction) {
        if (availableTypes.includes(result.activityType)) {
          successCallBack();
        } else {
          failure();
        }
      }
    })
  })
  ;
},

// "twitter": function (content, failure) {
//   const img = content.data.imgRef.current;
//   const successCallback = content.successCallback;
//   img.capture().then(uri=>{
//     Share.share({
//       message: 'Become a flocker today!',
//       title: 'flock',
//       url: uri,
//     }).then((result)=> {
//       if (result.action === Share.dismissedAction) {
//         failure();
//         console.log('cancelled for real');
//       } else if (result.action === Share.sharedAction) {
//         successCallback();
//       }
//       console.log('cancelled');
//     })
//   })
//   ;
// },
"twitter": function (content, failure) {
  const availableTypes = ["net.whatsapp.WhatsApp.ShareExtension", "com.apple.UIKit.activity.Message",  "com.apple.UIKit.activity.PostToTwitter", "com.zhiliaoapp.musically.ShareExtension", 'com.burbn.instagram.shareextension', 'com.apple.UIKit.activity.PostToFacebook', 'com.toyopagroup.picaboo.share'];
  const {data: data, successCallBack: successCallBack} = content;
  var img = data.imgRef.current;
  img.capture().then(uri=>{
    Share.share({
      // message: 'hello world',
      // title: 'Flock Content',
      message: "https://apps.apple.com/us/app/flock-share-cost-buy-designer/id1551725800",
      url: "data:image/png;base64,"+uri,
    }).then((result)=> {
      if (result.action === Share.dismissedAction) {
        failure();
      } else if (result.action === Share.sharedAction) {
        if (availableTypes.includes(result.activityType)) {
          successCallBack();
        } else {
          failure();
        }
      }
    })
  })
  ;
},
"snapchat": function (content, failure) {
  const availableTypes = ["net.whatsapp.WhatsApp.ShareExtension", "com.apple.UIKit.activity.Message",  "com.apple.UIKit.activity.PostToTwitter", "com.zhiliaoapp.musically.ShareExtension", 'com.burbn.instagram.shareextension', 'com.apple.UIKit.activity.PostToFacebook', 'com.toyopagroup.picaboo.share'];
  const {data: data, successCallBack: successCallBack} = content;
  var img = data.imgRef.current;
  img.capture().then(uri=>{
    Share.share({
      // message: 'hello world',
      // title: 'Flock Content',
      message: "https://apps.apple.com/us/app/flock-share-cost-buy-designer/id1551725800",
      url: "data:image/png;base64,"+uri,
    }).then((result)=> {
      if (result.action === Share.dismissedAction) {
        failure();
      } else if (result.action === Share.sharedAction) {
        if (availableTypes.includes(result.activityType)) {
          successCallBack();
        } else {
          failure();
        }
      }
    })
  })
  ;
},
// "instagram": function (content) {
//   console.log(content.data);
//   const img = content.data.imgRef.current;
//   const successCallback = content.successCallback;

//   img.capture().then(uri => {
//     console.log("do something with ", uri);
//     let instagramURL = `instagram://library?LocalIdentifier=`;;//+uri;
//     console.log(uri);
//     CameraRoll.save(uri).then(()=> {
//       Linking.openURL(instagramURL);
//       successCallback();
//     });
    
//   });

// },

"instagram": function (content, failure) {
  const availableTypes = ["net.whatsapp.WhatsApp.ShareExtension", "com.apple.UIKit.activity.Message",  "com.apple.UIKit.activity.PostToTwitter", "com.zhiliaoapp.musically.ShareExtension", 'com.burbn.instagram.shareextension', 'com.apple.UIKit.activity.PostToFacebook', 'com.toyopagroup.picaboo.share'];
  const {data: data, successCallBack: successCallBack} = content;
  var img = data.imgRef.current;
  img.capture().then(uri=>{
    Share.share({
      // message: 'hello world',
      // title: 'Flock Content',
      message: "https://apps.apple.com/us/app/flock-share-cost-buy-designer/id1551725800",
      url: "data:image/png;base64,"+uri,
    }).then((result)=> {
      if (result.action === Share.dismissedAction) {
        failure();
      } else if (result.action === Share.sharedAction) {
        if (availableTypes.includes(result.activityType)) {
          successCallBack();
        } else {
          failure();
        }
      }
    })
  })
  ;
},

"whatsapp": function (content, failure) {
  const availableTypes = ["net.whatsapp.WhatsApp.ShareExtension", "com.apple.UIKit.activity.Message",  "com.apple.UIKit.activity.PostToTwitter", "com.zhiliaoapp.musically.ShareExtension", 'com.burbn.instagram.shareextension', 'com.apple.UIKit.activity.PostToFacebook', 'com.toyopagroup.picaboo.share'];
  const {data: data, successCallBack: successCallBack} = content;
  var img = data.imgRef.current;
  img.capture().then(uri=>{
    Share.share({
      // message: 'hello world',
      // title: 'Flock Content',
      message: "https://apps.apple.com/us/app/flock-share-cost-buy-designer/id1551725800",
      url: "data:image/png;base64,"+uri,
    }).then((result)=> {
      if (result.action === Share.dismissedAction) {
        failure();
      } else if (result.action === Share.sharedAction) {
        if (availableTypes.includes(result.activityType)) {
          successCallBack();
        } else {
          failure();
        }
      }
    })
  })
  ;
},
"tiktok": function (content, failure) { // doesn't work right now
  Share.share({
    message: 'hello world',
    title: 'Flock Content',
    url: 'https://twitter.com',
  }).then((result)=> {
    if (result.action === Share.dismissedAction) {
      failure();
    } else if (result.action === Share.sharedAction) {

    }
  });
}
};

const generateUserObject = (displayName, uid) => {
  return {displayName: displayName, uid: uid};
}

const shuffle = (array) => {
  for (var i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i)
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array;
}




const rentPrice = (totalPrice) => {
return (.15 * totalPrice).toFixed(2);
}

function validateCard (value) {
  // Accept only digits, dashes or spaces
    if (/[^0-9-\s]+/.test(value)) return false;

    // The Luhn Algorithm. It's so pretty.
    let nCheck = 0, bEven = false;
    value = value.replace(/\D/g, "");

    for (var n = value.length - 1; n >= 0; n--) {
        var cDigit = value.charAt(n),
              nDigit = parseInt(cDigit, 10);

        if (bEven && (nDigit *= 2) > 9) nDigit -= 9;

        nCheck += nDigit;
        bEven = !bEven;
    }

    return (nCheck % 10) == 0;
}


const createOrUpdate = async (hasId, customerId, info) => {
  return new Promise(async (resolve) => {
    if (!hasId) {
      
      try {
        // const newInfo = {type:'Person'}
        // console.log('input to ge ttoken,', info);
      const token = await createToken({type:'Card'});
      // info['address'] = {'city': 'Livermore', 'country': 'USA', 'line1':'1662 Call of the Wild Court', 'line2':'1662 Call of the Wild Court','postalCode': '94550', 'state':'CA'}
      // console.log('credit info', info);
      if (token?.error?.code == "Failed") resolve({message:"Something went wrong."});
      console.log("tokenn", token);

      // const endpoint = constants.PAY_ENDPOINT + `?price=${100}&token=${token.tokenId}`;
      // fetch(endpoint);
    
      //create customer if no customerid
      var createCustomerEndpoint = constants.CUSTOMER_ENDPOINT + "?token=" + token.tokenId;
    fetch(createCustomerEndpoint).then(resp=>{
      resp.json().then((cid)=>{
          
          db.collection('users').doc(au.currentUser.uid).update({customerId: cid.id}).catch(err=>{
              resolve({message:"Something went wrong."});
          });
          resolve(cid.id);
      }).catch(err=>{
        console.log('create or update error', err)
        resolve({message:"Something went wrong."});
      })
    });

  } catch (err) {
    resolve(err);
    // resolve({message:"Something went wrong."});
  }
    
    } else {
      await fetch(constants.UPDATE_CUST, {
          method: 'POST',
          body: JSON.stringify({info: info, id: customerId}),
          headers: { 'Content-Type': 'application/json' }
      });
    
      resolve(customerId);
    }
  });

}

const updateCard = async (customerId, cardInfo) => {
  fetch(constants.CREATE_CARD_SWITCH_DEFAULT, {
    method: 'POST',
    body: JSON.stringify({cardInfo: cardInfo, id: customerId}),
    headers: { 'Content-Type': 'application/json' }
  });
}

const fetchCustomerInfo = (customerId) =>{
  return new Promise((resolve) => {
      fetch(constants.RETR_CUST+`?id=${customerId}`).then((resp)=> {
      resp.json().then((res) =>{
              var customerInfo = res;
              const cardId = res.default_source;
              // console.log("CARDID", cardId);
              fetch(constants.RETR_CARD+"?id="+customerId+"&card="+cardId).then((cardRes)=>{
                  cardRes.json().then((card)=>{
                    // console.log("THIS IS CARD", card);
                  resolve({customer: res, card: card});
                  }).catch(err=>console.log(err))
              })

      }).catch(err=>console.log(err))
  })
});
};

const fetchShipping = (userId) =>{
  return new Promise((resolve) => {
      db.collection('users').doc(userId).get().then((doc)=>{
        resolve(doc.data().shipping);
      })
});
};

function cc_brand_id(cur_val) {
  // the regular expressions check for possible matches as you type, hence the OR operators based on the number of chars
  // regexp string length {0} provided for soonest detection of beginning of the card numbers this way it could be used for BIN CODE detection also

  //JCB
  let jcb_regex = new RegExp('^(?:2131|1800|35)[0-9]{0,}$'); //2131, 1800, 35 (3528-3589)
  // American Express
  let amex_regex = new RegExp('^3[47][0-9]{0,}$'); //34, 37
  // Diners Club
  let diners_regex = new RegExp('^3(?:0[0-59]{1}|[689])[0-9]{0,}$'); //300-305, 309, 36, 38-39
  // Visa
  let visa_regex = new RegExp('^4[0-9]{0,}$'); //4
  // MasterCard
  let mastercard_regex = new RegExp('^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$'); //2221-2720, 51-55
  let maestro_regex = new RegExp('^(5[06789]|6)[0-9]{0,}$'); //always growing in the range: 60-69, started with / not something else, but starting 5 must be encoded as mastercard anyway
  //Discover
  let discover_regex = new RegExp('^(6011|65|64[4-9]|62212[6-9]|6221[3-9]|622[2-8]|6229[01]|62292[0-5])[0-9]{0,}$');
  ////6011, 622126-622925, 644-649, 65


  // get rid of anything but numbers
  cur_val = cur_val.replace(/\D/g, '');

  // checks per each, as their could be multiple hits
  //fix: ordering matter in detection, otherwise can give false results in rare cases
  var sel_brand = "Unknown";
  if (cur_val.match(jcb_regex)) {
      sel_brand = "JCB";
  } else if (cur_val.match(amex_regex)) {
      sel_brand = "American Express";
  } else if (cur_val.match(diners_regex)) {
      sel_brand = "Diners Club";
  } else if (cur_val.match(visa_regex)) {
      sel_brand = "Visa";
  } else if (cur_val.match(mastercard_regex)) {
      sel_brand = "MasterCard";
  } else if (cur_val.match(discover_regex)) {
      sel_brand = "Discover";
  } else if (cur_val.match(maestro_regex)) {
      if (cur_val[0] == '5') { //started 5 must be mastercard
          sel_brand = "Mastercard";
      } else {
          sel_brand = "Maestro"; //maestro is all 60-69 which is not something else, thats why this condition in the end
      }
  }

  return sel_brand;
}

function toDateTime(secs) {
  var t = new Date(Date.UTC(1970, 0, 1)); // Epoch
  t.setUTCSeconds(secs);
  return moment(t).local().format('YYYY-MM-DD HH:mm');
}

export {
  resetLastVisible, 
  getCurrentTime,
  checkFlockExpired,
  rentPrice,
  fetchStreamableSource,
  fetchAlbums,
  fetchProducts,
  fetchFlockables,
  // fetchFlockablesFirst,
  fetchRentables,
  fetchRentablesFirst,
  fetchPosts,
  fetchPostsFirst,
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
  generateUserObject,
  shuffle,
  pinLocalFunc,
  validateCard,
  createOrUpdate,
  fetchCustomerInfo,
  fetchShipping,
  cc_brand_id,
  updateCard,
  pickImage,
  toDateTime,
};
