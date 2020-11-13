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
      resolve(response.streamableVideo);
    });
  });
  return await urlVar;
};

export {fetchStreamableSource};
