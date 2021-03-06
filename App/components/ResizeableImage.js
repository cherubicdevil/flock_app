import React, {useState, useEffect} from 'react';
import {Image, Dimensions} from 'react-native';

const ResizeableImage = ({source, limitHorizontal=true, hLimit, wLimit, aspectRatio=1, optimize=false}) => {
  const [widthHeight, setWidthHeight] = useState({width:0, height: 0});
  // const [width, setWidth] = useState(100);
  // const [height, setHeight] = useState(100);
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
        setWidthHeight({width:w*ratio, height: maxHeight})
      }
    } else {
      if (isMounted) {
        setWidthHeight({width:maxWidth, height: h*ratio})
      }
    }
    } else {
      const ratio = maxHeight / h;
      if (optimize && w/h <= aspectRatio) {
        if (isMounted) {
          setWidthHeight({width:maxWidth, height: h*ratio})
      }
      } else {
        if (isMounted) {
          setWidthHeight({width:w*ratio, height: maxHeight})
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
    defaultSource={require('App/Assets/Images/flock_preloader.png')}
      source={{uri: source.uri}}
      style={{
        //position: 'absolute',
        zIndex: -10,
        opacity: 0.935,
        width: widthHeight.width,
        height: widthHeight.height,
      }}
    />
  );
};


  export default ResizeableImage;