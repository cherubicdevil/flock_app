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
*/
/*
 * constants.js
 *
 * This file contains lots of constants for the rest of the app.
 * Use by importing `import {constants} from 'App/constants';`
 *
 */

import {Dimensions} from 'react-native';
<<<<<<< HEAD
import {debug_consts} from 'App/debug_consts';



console.log("ENDPOINT_STRIPE", debug_consts.STRIPE_ENDPOINT);
=======
import {DEBUG, STRIPE_ENDPOINT} from 'App/debug_consts';



console.log("ENDPOINT_STRIPE", STRIPE_ENDPOINT);
>>>>>>> main
export const constants = {
  API_URL: debug_consts.STRIPE_ENDPOINT,
  DEBUG: debug_consts.DEBUG,
  BLUE_FADE: "rgba(166,184,205,0.5)",
  LIGHT_PURPLE_BG: '#8796b5',
  MENU_COLOR: 'rgba(239, 232, 237,1)',
  BLUEBORDER: "#7791b0",
  PURPLEBORDER: "#C09BAE",
  NAVBARHEIGHT: 75,
  HEADERHEIGHT: 50,
  LIGHTORANGE: '#ff9100',
  YELLOW: '#ffb700',
  ORANGE: '#ff7009',
  GREYORANGE: "#ff9966",
  GREY: 'rgb(229,229,234)',
  ICONGREY: 'rgb(99,99,102)',
  PURPLEORANGE: '#b72c51', // 183,44,81
  LIGHTGREY: 'rgb(99,99,102)',
  PURPLE: '#b72c51',
  // RED: '#f05054',
  RED:'#ff8f97',
  HEIGHT: Dimensions.get('window').height * 2,
  DARKGREY: 'rgb(174,174,178)',
  BGGREY: 'rgb(242,242,242)',
  HEROKU: 'https://powerful-everglades-32172.herokuapp.com/',
  FONT: 'Nunito-Light',
  FONTBOLD: 'Nunito-Bold',
  TEST_URL:
    'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
  GRADIENT2: require('App/Assets/Images/UpsideDownBackground.png'),
  DEFAULT_PROFILE_ICON1: require('App/Assets/Images/default-profile-picture.jpg'),
  BERRY: require('App/Assets/Images/Berry_Percent.png'),
  BERRY_RATE: 0.2,
  // PLACEHOLDER_IMAGE: require('App/Assets/Images/cute_duck.png'),
  // PLACEHOLDER_IMAGE: require('App/Assets/Images/goose_headshot.png'),
  PLACEHOLDER_IMAGE: require('App/Assets/Images/duck_placeholder.png'),
  ERROR_IMAGE: require('App/Assets/Images/error_image.png'),
  EGG_GOLD: require('App/Assets/Images/goose_egg_rose_gold.png'),
  EGG_PROFILE: require('App/Assets/Images/Profile_Egg_Icon.png'),
  OFF_BLACK: 'rgba(50,30,30,1)',
  DARK_BLUE: 'rgba(70, 50, 140,1)',
  LIGHT_BLUE: 'rgba(70, 100, 200,0.5)',
  BIRDS: require('App/Assets/Images/birds.png'),
  COMMENT_COLOR: 'rgb(255, 245, 240)',
  BLUE: '#2c82c9',
  LAVENDER: "#968bab",
  PURPINK: "#c2a4b1",
  BRIGHT_BLUE: '#22a7f0',
  PINK_BACKGROUND: 'rgba(223, 210, 220,0.5)',
  PINK_BACKGROUND_OPAQUE: 'rgba(239, 232, 237,1)',
  PINK_BACKGROUND_OPAQUE_LIGHT: 'rgba(247, 244, 246, 1)',
  TRANSLUCENT: '#f2f2f7',
  PEACH: '#ff9966',
  PEACHBG: "#f1d4c6",
  DONE:"#f2f2f7",
  GREYBLUE: '#8291b0',
  BLUERGREY: '#7488b0',
  CHAT_ENDPOINT: 'https://enigmatic-bastion-86695.herokuapp.com/',
  PAY_ENDPOINT: 'https://protected-thicket-47492.herokuapp.com/', // ?price=&token=
  RETR_CUST: debug_consts.STRIPE_ENDPOINT+'/retrieveCustomer/', // ?id=
  RETR_CARD: debug_consts.STRIPE_ENDPOINT+'/retrieveCard/', // ?id=&card=
  CHARGE_CUSTOMER: debug_consts.STRIPE_ENDPOINT+'/chargeCustomer', // ?id=&amount=
  CHARGE_CUSTOMER_POST: debug_consts.STRIPE_ENDPOINT+'/chargeCustomerPost',
  UPDATE_CUST: debug_consts.STRIPE_ENDPOINT+'/updateCustomer/', // post query
  UPDATE_CARD: debug_consts.STRIPE_ENDPOINT+'/updateCard/', // post query
  CREATE_CARD_SWITCH_DEFAULT: debug_consts.STRIPE_ENDPOINT+'/createCardSwitchDefault/', // post query
  CHARGE_FLOCK_COMPLETE_ENDPOINT: debug_consts.STRIPE_ENDPOINT+'/chargeCustomerFlockComplete/',
  CUSTOMER_ENDPOINT: debug_consts.STRIPE_ENDPOINT+'/createCustomer/', // ?token=
  // CUSTOMER_ENDPOINT: 'http://localhost:5000/createCustomer/',
  ALGOLIA_SEARCH: '3a59c3ff5dd5ec3b1fc14e11a2044115',
  ALGOLIA_ID: 'QDYS7569GL',
  EGG_RATIO: 40,
};
