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
 * Home.style.ios.js
 *
 * This file contains style code for the Home page of flock the app
 *
 * For ios only. Check Home.style.android.js for android styling.
 */

import {constants} from 'App/constants';

const styles = {
  wrapperAll: {flex: 1, backgroundColor: constants.GREY},
  sectionOneStyle: {
    paddingLeft: 5,
    paddingBottom: 4,
    paddingRight: 5,
    width: '100%',
    flex: 3,

    flexDirection: 'row',
    paddingTop: 35,
    marginTop: 0,
    //marginBottom: 5,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  topInnerBox: {
    width: '100%',
    backgroundColor: constants.GREY,
  },
  topBox: {
    flexDirection: 'row',
    flex: 8,
    marginLeft: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBoxWrapper: {
    flexDirection: 'row',
    margin: 2.2,

    backgroundColor: constants.GREY,
    //width: '98%',
    flex: 1,
    height: '90%',
    borderRadius: 25,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 7,
    paddingBottom: 7,
  },
  textBoxStyle: {
    fontFamily: 'Nunito-Light',
    flex: 10,
  },
  sectionTwoStyle: {
    flex: 1.5,
    marginBottom: 5,
  },
  sectionThreeStyle: {
    flex: 55,
  },
  twoColumnStyle: {
    flexDirection: 'row',
  },
  columnStyle: {
    flex: 1,
  },
  carouselWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
    position: 'absolute',
    bottom: 0,
    left: 0,
    zIndex: 200,
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  logout: {
    flex: 1,
    borderRadius: 2,
    backgroundColor: '#000',
  },
  sectionFourStyle: {
    marginTop: 10,
    flex: 7,
  },
  iconStyle: {
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 15,
    flex: 1,
    resizeMode: 'cover',
    height: '100%',
    width: 24,
    borderRadius: 12,
  },
  searchIcon: {
    tintColor: constants.ICONGREY,
    flex: 1,
    width: 20,
    resizeMode: 'contain',
    height: 20,
    marginRight: -10,
  },
  loadingBackground: {
    position: 'absolute',
    flex: 1,
    height: '100%',
    width: '100%',
    zIndex: -10,
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default styles;
