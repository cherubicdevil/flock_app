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
import {fetchAlbums} from 'App/utils';

const VideoCarousel = ({route, navigation, array, index = 0, data}) => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const [ar, setAr] = useState([]);
  const [dat, setDat] = useState(data);
  var lastVisible = null;
  if (route?.params?.scrollIndex !== undefined) {
    index = route.params.scrollIndex;
  }
  console.log('index', index);
  useEffect(() => {
    (async () => {
      if (route?.params?.array === undefined) {
        const arr = await fetchAlbums();
        setAr(arr.ar);
        lastVisible = arr.lastVisible;
        //console.log('ARR', arr);
        // I'm going to assume data is always defined when array is
        // possible FLOCK_BUG
        // also, what if array is empty?
        setDat(arr[0]);
      }
    })();
  }, []);

  // assert: is array and data always going to be defined now?
  try {
    ar.length;
  } catch (err) {
    console.log('ERR: looks like array is not defined', err);
  }

  return (
    <View>
      <ScrollView
        contentOffset={{y: index * Dimensions.get('window').height}}
        showsVerticalScrollIndicator={false}
        onScroll={function (event) {
          dispatch({
            type: 'sendCarouselIndex',
            payload:
              event.nativeEvent.contentOffset.y /
              Dimensions.get('window').height,
          });
        }}
        horizontal={false}
        pagingEnabled={true}>
        {renderAlbums(ar, route, navigation, index)}
      </ScrollView>
      {renderClose(navigation, dispatch, ar, lastVisible)}
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

const renderClose = (navigation, dispatch, array, lastVisible) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        dispatch({
          type: 'sendCarouselIndex',
          payload: -1,
        });
        navigation.navigate('VideoMasonry', {
          videoData: array,
          lastVisible: lastVisible,
          hello: 'hello',
        });
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
