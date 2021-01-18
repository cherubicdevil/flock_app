import React, {useState} from 'react';
import {Image, Dimensions} from 'react-native';

const ResizeableImage = ({source, limitHorizontal=true, hLimit, wLimit}) => {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const maxWidth = wLimit || Dimensions.get('window').width;
  const maxHeight = hLimit || Dimensions.get('window').height;
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
  if (source == null) {
    source = {uri:''};
  }
  return (
    <Image
      source={source?.uri == ''?require('App/Assets/Images/flock_logo_white.png'):source}
      style={{
        //position: 'absolute',
        zIndex: -10,
        opacity: 0.935,
        width: width,
        height: height,
      }}
    />
  );
};


  export default ResizeableImage;