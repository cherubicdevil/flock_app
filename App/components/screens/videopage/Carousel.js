import React, {useState, useEffect, useRef} from 'react';
import {
  Dimensions,
  View,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {useDispatch} from 'react-redux';
import VideoPage from './VideoPage';
import {fetchAlbums, fetchFlockables, fetchRentables} from 'App/utils';

const VideoCarousel = ({route, navigation, array, index = 0, data}) => {
  const dispatch = useDispatch();
  const [ar, setAr] = useState([]);
  //const [dat, setDat] = useState(data);
  const [flockData, setFlockData] = useState([]);
  var lastVisible = null;
  if (route?.params?.scrollIndex !== undefined) {
    index = route.params.scrollIndex;
  } // scrollIndex used here because redux takes a little to update.
  useEffect(() => {
    (async () => {
      if (route?.params?.array === undefined) {
        const arr = await fetchAlbums();
        setAr(arr.ar);
        lastVisible = arr.lastVisible;
        // I'm going to assume data is always defined when array is
        // possible FLOCK_BUG
        // also, what if array is empty?
        //setDat(arr[0]);

        fetchFlockables().then((ar) => {
          setFlockData(ar);
          //setTestString("worldhello");
        });
      }
    })();
  }, []);

  // assert: is array and data always going to be defined now?
  // try {
  //   ar.length;
  // } catch (err) {
  //   console.log('ERR: looks like array is not defined', err);
  // }
  return (
    <View>
      <ScrollView
        contentOffset={{y: index * Dimensions.get('window').height}}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={1}
        onScrollEndDrag={(event )=> {
          const ind = event.nativeEvent.contentOffset.y /
          Dimensions.get('window').height;
          if (ind >= ar.length - 1) {
            console.log('getting more');
            fetchAlbums().then((al) => {
              setAr([...ar, ...al]);
            })
          }
        }}
        onScroll={function (event) {
          index = event.nativeEvent.contentOffset.y /
          Dimensions.get('window').height;
          
          dispatch({
            type: 'sendCarouselIndex',
            payload: index
          });


        }}
        horizontal={false}
        pagingEnabled={true}>
        {renderAlbums(route?.params?.array || ar, route, navigation, index)}
      </ScrollView>
      {renderClose(navigation, dispatch, route?.params?.array|| ar, lastVisible, flockData)}
    </View>
  );
};

const renderAlbums = (array, route, navigation, currIndex) => {
  try {
    return array.map((al) => (
      <View key={al.id + Math.random()} style={styles.outer}>
        <VideoPage
          key={Math.random()}
          route={route}
          navigation={navigation}
          array={array}
          index={array.indexOf(al)}
          currIndex={currIndex}
          data={al}></VideoPage>
      </View>
    ));
  } catch (err) {
    console.log('error:', err);
  }
};

const renderClose = (navigation, dispatch, array, lastVisible, flockData) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        dispatch({
          type: 'sendCarouselIndex',
          payload: -1,
        });
        //let navIndex = navigation.dangerouslyGetParent().state.index;
        if (navigation.canGoBack()) {
          navigation.goBack();
        } else {
          navigation.navigate('VideoMasonry', {
            videoData: array,
            lastVisible: lastVisible,
            hello: 'hello',
            flockData: flockData
          });
        }
      }}>
      <Image
        style={{
          height: 20,
          width: 20,
          paddingLeft: 10,
          paddingBottom: 10,
          position: 'absolute',
          top: 55,
          right: 25,
          zIndex: 30,
        }}
        source={require('App/Assets/Images/Close_Icon_White.png')}
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  innerText: {color: '#fff'},
});

export default VideoCarousel;
