import React, {useState} from 'react';
import {Image, Dimensions} from 'react-native';

const ResizeableImage = ({source, limitHorizontal=true, hLimit, wLimit}) => {
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  const maxWidth = wLimit || Dimensions.get('window').width;
  const maxHeight = hLimit || Dimensions.get('window').height;
  if (source?.uri !== undefined && source?.uri !== null ) {
  Image.getSize(source.uri, (w, h) => {
    if (limitHorizontal) {
    const ratio = maxWidth / w;
    setHeight(h * ratio);
    setWidth(maxWidth);
    } else {
      const ratio = maxHeight / h;
      setWidth(w * ratio);
      setHeight(maxHeight);
    }
  });
}

  return (
    <Image
    defaultSource={require('App/Assets/Images/flock_logo_white.png')}
      source={{uri: source.uri}}
      style={{
        //position: 'absolute',
        zIndex: -10,
        opacity: 0.935,
        width: width,
        height: height == 0?100:height,
      }}
    />
  );
};


  export default ResizeableImage;