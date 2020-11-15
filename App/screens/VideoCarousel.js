import React, {useState, useRef, createRef} from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  FlatList,
  SectionList,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {useDispatch} from 'react-redux';
import VideoPageNewNew from 'App/screens/VideoPageNewNew';
import DynImage from 'App/components/masonry/DynImage';
import AlbumDetail from 'App/screens/products/AlbumDetail';
import NavBar from 'App/components/static/NavBar';

const renderArray = (navigation, array) => {
  //console.log('array is!: ', array);
  return array.map((data) => {
    <VideoPageNewNew navigation={navigation} data={data} array={array} />;
  });
};

const renderClose = (navigation, dispatch) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        dispatch({
          type: 'sendCarouselIndex',
          payload: -1,
        });
        navigation.navigate('VideoMasonry', {vidVisible: false});
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
const VideoCarousel = ({route, navigation, array, index = 0}) => {
  const dispatch = useDispatch();
  const scrollRef = useRef(null);
  const {myArray, setArray} = useState(array);
  const {myIndex, setIndex} = useState(index);

  const renderAlbums = (albums) => {
    return array.map((al) => (
      <View key={al.id + Math.random()} style={styles.outer}>
        <VideoPageNewNew
          key={Math.random()}
          route={route}
          navigation={navigation}
          array={array}
          index={array.indexOf(al)}
          data={al}></VideoPageNewNew>
      </View>
    ));
  };

  const renderAlbum = (al) => {
    return (
      <View key={al.id + Math.random()} style={styles.outer}>
        <VideoPageNewNew
          key={Math.random()}
          route={route}
          navigation={navigation}
          array={array}
          index={array.indexOf(al)}
          data={al}></VideoPageNewNew>
      </View>
    );
  };
  // console.log('array is: ', array);
  // return (
  // 	<ScrollView
  // 		style={{height: '100%', width: '100%'}}
  // 		horizontal={false}
  // 		pagingEnabled={true}>
  // 		<View>{renderAlbums(array)}</View>
  // 	</ScrollView>
  // );
  // return (
  // 	<View>
  // 		<ScrollView>
  // 			<View key="0" style={{flexDirection: 'row', flex: 1}}>
  // 				<View style={{flex: 1}}>{renderAlbums(array)}</View>
  // 				<View key="1" style={{flex: 1}}>
  // 					{renderAlbums(array)}
  // 				</View>
  // 			</View>
  // 		</ScrollView>
  // 	</View>
  // );

  //scrollRef.current.scrollTo(0, index * Dimensions.get('window').height);
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
        {renderAlbums(array)}
      </ScrollView>
      {renderClose(navigation, dispatch)}
    </View>
  );

  // return (
  // 	<FlatList
  // 		keyExtractor={() => {
  // 			return '' + Math.random();
  // 		}}
  // 		data={array}
  // 		renderItem={renderAlbum}
  // 		onScroll={function (event: Object) {
  // 			dispatch({
  // 				type: 'sendCarouselIndex',
  // 				payload:
  // 					event.nativeEvent.contentOffset.y / Dimensions.get('window').height,
  // 			});
  // 		}}
  // 		horizontal={false}
  // 	/>
  // );
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
