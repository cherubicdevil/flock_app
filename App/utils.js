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
*/

import {constants} from 'App/constants';

const fetchStreamableSource = async (src) => {
  if (src === null || src === undefined) {
    return new Promise(function (resolve, reject) {
      resolve(
        'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
      );
    });
  }
  const fetchVar = fetch(constants.HEROKU + 'getStreamableSource/' + src);
  const responseVar = fetchVar.then((response) => response.json());
  const urlVar = responseVar.then((response) => {
    return new Promise(function (resolve, reject) {
      // resolve(
      //   'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
      // );
      resolve({
        streamableVideo: response.streamableVideo,
        posterSource: response.posterSource,
      });
    });
  });
  return await urlVar;
};

const fetchAlbums = (lastVisible) => {
  const ar = [];
  var counter = 0;
  firebase
    .firestore()
    .collection('posts')
    .orderBy('title')
    .startAfter(lastVisible)
    .limit(7)
    .get()
    .then((querySnapshot) => {
      const n = querySnapshot.size;
      querySnapshot.forEach(async (doc) => {
        const newSource = await fetchStreamableSource(doc.data().video);
        const entity = {
          ...doc.data(),
          id: doc.id,
          video: newSource.streamableVideo,
          poster: newSource.posterSource,
        };
        ar.push(entity);
        counter = counter + 1;
        if (counter == n) {
          // TODO: change to setMyAr(...myAr,...ar) so that it appends
          lastVisible = doc;
          return {ar: ar, lastVisible: lastVisible};
          // dispatch({type: 'sendData', payload: ar[0]});
          // sends off the first datum in array...---
          // ---...presumably to carousel? is this still needed?
        }
      });
    });
  /*
  Fetch products from firebase.collections('products')
  Almost same code as for 'posts'.

  TODO: Should I extract it and put it in utils?
  */
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

export {fetchStreamableSource};
