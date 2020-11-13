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
* Home.js
*
* This file contains code for the Home page of flock the app.
* By Home, it refers to both the FeedList gallery of videos, and also
* the VideoCarousel overlay of videos.
*
* This may seem counter-intuitive. It was designed so that both Feedlist
* and VideoCarousel could share the same array of data without using a 
* store. (We may be using redux anyway, so this may be outdated. TODO: 
	separate into two files. Keep the data array in redux).
*
*/

import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
  ImageBackground,
} from 'react-native';
import NavBar from 'App/components/static/NavBar';
import FeedList from 'App/components/masonry/FeedList';
import VideoCarousel from 'App/screens/VideoCarousel';
import {useSelector, useDispatch} from 'react-redux';
import {firebase} from 'App/firebase/config';
import {constants} from 'App/constants';
import {fetchStreamableSource} from 'App/utils';

const Home = ({route, navigation, lastVisible = null}) => {
  // These are the params of this class ^^.
  // {route} and {navigation} come by default when using React navigator.
  // {lastVisible} I put here so that it doesn't get re-initialized
  //   every render.
  //
  //
  const [myAr, setMyAr] = useState([]);
  const [productAr, setProductAr] = useState([]);
  // {myAr} and {productAr} are the two arrays that get merged in FeedList.
  // Thus they both get passed in to FeedList.
  // They are both fetched from firebase server.

  const [vidVisible, setVidVisible] = useState(true);
  // {vidVisible} determines the visibility of the overlay containing--
  // --VideoCarousel.
  // {vidVisible} is set to true in the beginning, but it don't matter--
  // --because it is determined by route.params.

  useEffect(() => {
    setVidVisible(route.params.vidVisible);
    // React navigator determines which screen to navigate to through--
    // --{route.params.vidVisible}.
  });

  const [index, setIndex] = useState(0);
  // I'm not sure what this does. Perhaps set the index of VideoCarousel?
  // In which case it should be set by a route param, coming from FeedList

  const dispatch = useDispatch();
  // Should useDispatch be initialized here? Every render?? Maybe put it--
  // --in useEffect.

  const fetchAlbums = () => {
    const ar = [];
    var counter = 0;
    firebase
      .firestore()
      .collection('posts')
      .orderBy('title')
      .startAfter(lastVisible)
      .limit(10)
      .get()
      .then((querySnapshot) => {
        //console.log(querySnapshot.getKey());
        const n = querySnapshot.size;

        querySnapshot.forEach(async (doc) => {
          console.log('THIS IS TEH KEY', doc.id);
          const newSource = await fetchStreamableSource(doc.data().video);
          const entity = {...doc.data(), id: doc.id, video: newSource};
          ar.push(entity);
          counter = counter + 1;
          if (counter == n) {
            setMyAr(ar);
            console.log(ar);
            lastVisible = doc;
            dispatch({type: 'sendData', payload: ar[0]});
          }
        });
      });

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
            setProductAr(productAr);
          }
        });
      });
  };

  const renderNavBar = (route, navigation) => {
    if (!vidVisible) {
      return <NavBar route={route} navigation={navigation} />;
    } else {
      return <View />;
    }
  };
  const renderOverview = () => {
    const vidIndex = useSelector((state) => state.videopage.vidIndex);
    const {vidData: vidData} = useSelector((state) => state.videopage);
    if (vidVisible) {
      return (
        <View
          style={{
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
          }}>
          <VideoCarousel
            route={route}
            navigation={navigation}
            array={myAr}
            index={index}
            data={vidData}
            style={{}}
          />
        </View>
      );
    } else {
      return <View />;
    }
  };

  var user = firebase.auth().currentUser;
  return (
    <View style={{flex: 1, backgroundColor: constants.GREY}}>
      <View style={styles.sectionOneStyle}>
        <ImageBackground
          imageStyle={{borderRadius: 25}}
          style={styles.topBox}
          source={require('App/Assets/Images/Orange_Gradient_Small.png')}>
          <View
            style={{
              flexDirection: 'row',
              margin: 2.2,
              marginLeft: 4.3,
              marginRight: 4.3,
              backgroundColor: constants.GREY,
              width: '98%',
              borderRadius: 25,
              paddingLeft: 15,
              paddingRight: 15,
              paddingTop: 7,
              paddingBottom: 7,
            }}>
            <TextInput style={styles.textBoxStyle} />
            <Image
              source={require('App/Assets/Images/Search.png')}
              style={{
                tintColor: constants.ICONGREY,
                flex: 1,
                width: 20,
                resizeMode: 'contain',
                height: 20,
                marginRight: -10,
              }}
            />
          </View>
        </ImageBackground>
      </View>

      <View style={styles.sectionThreeStyle}>
        <FeedList
          vidVisible={vidVisible}
          fetchAlbums={fetchAlbums}
          array={myAr}
          productArray={productAr}
          navigation={navigation}
        />
      </View>

      {renderOverview()}
      {renderNavBar(route, navigation)}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionOneStyle: {
    paddingLeft: 5,
    paddingBottom: 4,
    paddingRight: 5,
    width: '100%',
    flex: 3,

    flexDirection: 'row',
    paddingTop: 35,
    marginTop: 0,
    marginBottom: 5,
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
});

export default Home;
