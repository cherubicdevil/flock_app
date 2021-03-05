import React, {useState, useEffect} from 'react';
import {Image, Dimensions} from 'react-native';

const ResizeableImage = ({source, limitHorizontal=true, hLimit, wLimit, aspectRatio=1, optimize=false}) => {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const maxWidth = wLimit || Dimensions.get('window').width;
  const maxHeight = hLimit || Dimensions.get('window').height;

  useEffect(()=>{
    let isMounted = true;
    // console.log('iSMOUNTED', isMounted, );

  if (source?.uri !== undefined && source.uri !== null ) {

  Image.getSize(source?.uri, (w, h) => {
    if (limitHorizontal) {
    const ratio = maxWidth / w;
    if (optimize && w/h > aspectRatio) {
      if (isMounted) {
      setWidth(w * ratio);
      setHeight(maxHeight);
      }
    } else {
      if (isMounted) {
    setHeight(h * ratio);
    setWidth(maxWidth);
      }
    }
    } else {
      const ratio = maxHeight / h;
      if (optimize && w/h <= aspectRatio) {
        if (isMounted) {
        setHeight(h * ratio);
        setWidth(maxWidth);}
      } else {
        if (isMounted) {
      setWidth(w * ratio);
      setHeight(maxHeight);
        }

      }
    }
  }, (err)=>{
    console.log('image failure', err)
  });

}

  return ()=>{
    isMounted = false;
  }
},[]);
  return (
    <Image
    defaultSource={require('App/Assets/Images/flock_logo_white.png')}
      source={{uri: source.uri}}
      style={{
        //position: 'absolute',
        zIndex: -10,
        opacity: 0.935,
        width: width || 100,
        height: height == 0?100:height || 100,
      }}
    />
  );
};


  export default ResizeableImage;