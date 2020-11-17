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
*/
/*
 * constants.js
 *
 * This file contains lots of constants for the rest of the app.
 * Use by importing `import {constants} from 'App/constants';`
 *
 */

import {Dimensions} from 'react-native';

export const constants = {
  NAVBARHEIGHT: 70,
  ORANGE: '#ff7009',
  GREY: 'rgb(229,229,234)',
  ICONGREY: 'rgb(99,99,102)',
  PURPLEORANGE: '#b72c51',
  LIGHTGREY: 'rgb(99,99,102)',
  PURPLE: '#b72c51',
  RED: '#f05054',
  HEIGHT: Dimensions.get('window').height * 2,
  DARKGREY: 'rgb(174,174,178)',
  BGGREY: 'rgb(242,242,242)',
  HEROKU: 'https://powerful-everglades-32172.herokuapp.com/',
  FONT: 'Nunito-Light',
  FONTBOLD: 'Nunito-Bold',
  TEST_URL:
    'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
  GRADIENT2: require('App/Assets/Images/UpsideDownBackground.png'),
  DEFAULT_PROFILE_
  ICON1: require('App/Assets/Images/default-profile-picture.jpg'),
};
