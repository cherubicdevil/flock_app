import React, {useState} from 'react';
import {Dimensions, View, Text, Image, TouchableOpacity} from 'react-native';
//import InView from 'react-native-component-inview';
import InViewPort from 'App/components/InViewPort';
import {useDispatch} from 'react-redux';
//import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
//import AnimatedLoader from 'react-native-animated-loader';
import {increaseAction} from 'App/actions';
import {firebase} from 'App/firebase/config';
import Video from 'App/components/Video';
import RVideo from 'react-native-video';
import LinearGradient from 'react-native-linear-gradient';
import {constants} from 'App/constants';
import {getIndexByTitle} from 'App/utils';
const berryRate = 0.2;

const DynImage = ({
  mute,
  repeat,
  ar,
  index,
  style,
  source,
  title,
  type,
  video,
  videoAr,
  navigation,
  data,
}) => {
  const [width, setWidth] = useState(Dimensions.get('window').width / 2 - 10);
  const [height, setHeight] = useState(0);
  const [vHeight, setVHeight] = useState(20);
  const [loading, setLoad] = useState(false);
  const maxWidth = Dimensions.get('window').width / 2 - 10;
  const maxHeight = Dimensions.get('window').height;
  if (data.type !== 'video') {
    Image.getSize(
      source.uri,
      (srcWidth, srcHeight) => {
        const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
        //console.log(source.uri, srcWidth, srcHeight);
        setWidth(srcWidth * ratio);
        setHeight(srcHeight * ratio);
        // console.log(`successful imageGet: ${srcWidth} ${srcHeight}`)
      },
      () => {
        //console.log(source.uri);
        setWidth(Dimensions.get('window').width / 2 - 10);
        setHeight(100);
      },
    );
  }
  //console.log(width, height);

  const [isInView, setIsInView] = useState(false);
  const checkVisible = (isVisible) => {
    if (isVisible) {
      setIsInView(isVisible);
    } else {
      setIsInView(isVisible);
    }
  };
  const RenderMedia = () => {
    const [vh, setVH] = useState(0);
    const changeViewHeight = (height) => {
      //console.log('changing vheight:', vh);
      //console.log(height);
      setVH(height);
      //console.log('changed vheight: ', vh);
    };
    if (type !== null && type === 'video') {
      const dispatch = useDispatch();
      return (
        <TouchableOpacity
          onPress={() => {
            console.log('DYN index', getIndexByTitle(videoAr, data));
            dispatch({type: 'sendData', payload: data});
            dispatch({
              type: 'sendCarouselIndex',
              payload: videoAr.indexOf(data),
            });
            // dispatch({type: 'showVid'});
            navigation.navigate('Carousel', {
              scrollIndex: videoAr.indexOf(data),
              vidData: data,
            });
          }}>
          <View style={{backgroundColor: '#ddd'}}>
            <Video
              viewHeight={vh}
              persistHeightFunc={changeViewHeight}
              visible={isInView}
              masonry={true}
              muted={true}
              paused={false}
              repeat={repeat}
              data={data}
              maxWidth={width}
            />
          </View>
          <LinearGradient
            colors={['transparent', '#000']}
            style={{
              height: 70,
              width: '100%',
              position: 'absolute',
              bottom: 0,
              justifyContent: 'center',
              //backgroundColor: 'rgba(0,0,0,0.7)',
              zIndex: 40,
            }}>
            <Text
              style={{
                marginLeft: 10,
                color: isInView ? '#fff' : '#aea',
                fontFamily: 'Nunito-Bold',
              }}>
              {title}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    } else {
      return (
        <FastImage
          style={[styles.mediaStyle, {width: width, height: height}]}
          source={{
            uri: source.uri,
          }}
        />
      );
    }
  };
  return (
    <InViewPort
      onChange={(isVisible) => {
        setIsInView(isVisible);
      }}>
      <View
        style={{
          borderRadius: 15,
          overflow: 'hidden',
          marginLeft: 5,
          width: width,
          //height: 400,
        }}>
        {renderBerry()}

        <RenderMedia />

        {renderProduct(data)}
        <View style={{height: 10}} />
      </View>
    </InViewPort>
  );
};

const renderRightBlurb = (product, title) => {
  if (product.image) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          color: '#000',
          opacity: 1.0,
          //borderLeftWidth: 1,
          //borderColor: '#aeaeb2',
          paddingLeft: 15,
        }}>
        <Image
          source={{uri: product.image}}
          style={{
            borderRadius: 10,
            marginTop: 5,
            opacity: 1.0,
            width: '100%',
            height: undefined,

            aspectRatio: 1,
            resizeMode: 'cover',
            flex: 1,
          }}
        />
        <View style={{flex: 2, paddingLeft: 5}}>
          <View
            style={{
              flex: 1,
              marginTop: 5,
              height: 70,
              marginRight: 5,
              flexDirection: 'column',
              justifyContent: 'space-around',
              color: '#000',
            }}>
            <Text
              style={{
                fontFamily: 'Nunito-Light',
                flex: 2,
                paddingRight: 5,
                fontSize: 14,
                color: '#000',
              }}>
              {title}
            </Text>
            <Text
              style={{
                flex: 1,
                color: constants.PURPLEORANGE,
                fontFamily: 'Nunito-Light',
              }}>
              ${product.price}
            </Text>
          </View>
        </View>
      </View>
    );
  } else {
    return <View />;
  }
};
const renderProduct = (data) => {
  if (data && data.product) {
    return (
      <View
        style={{
          width: '100%',
          overflow: 'hidden',
          backgroundColor: 'rgb(255,255,255)',
          //borderRadius: 15,
          borderBottomLeftRadius: 15,
          borderBottomRightRadius: 15,
        }}>
        {renderRightBlurb(data.product, data.product.title)}
      </View>
    );
  } else {
    return <View />;
  }
};
const renderBerry = () => {
  const [berryVisible, setBerry] = useState(true);
  const ran = Math.random();
  const dispatch = useDispatch();
  if (ran < berryRate && berryVisible) {
    return (
      <TouchableOpacity
        style={{
          position: 'absolute',
          width: 64,
          height: 64,
          top: 0,
          left: 0,
          zIndex: 50,
        }}
        onPress={() => {
          const userId = firebase.auth().currentUser.uid;
          //const value = database.ref('users/'+userId).
          //database.ref('users/' + userId).set({eggs: 100});
          setBerry(false);
          dispatch({type: 'increase'});
        }}>
        <Image
          style={{width: 30, height: 30}}
          source={require('App/Assets/Images/Berry_Percent.png')}
        />
      </TouchableOpacity>
    );
  } else {
    return <View />;
  }
};

const styles = {
  textStyle: {
    color: '#fff',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  mediaStyle: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,

    backgroundColor: 'rgba(0,0,0,0.3)',
  },
};

export default DynImage;
