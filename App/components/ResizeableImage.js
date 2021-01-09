import React, {useState} from 'react';
import {Image, Dimensions} from 'react-native';

const ResizeableImage = ({source, limitHorizontal=true}) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    Image.getSize(source.uri, (w, h) => {
      if (limitHorizontal) {
      const ratio = Dimensions.get('window').width / w;
      setHeight(h * ratio);
      setWidth(Dimensions.get('window').width);
      } else {
        const ratio = Dimensions.get('window').height / h;
        setWidth(w * ratio);
        setHeight(Dimensions.get('window').height);
      }
    });
  
    return (
      <Image
        source={source}
        style={{
          position: 'absolute',
          zIndex: -10,
          opacity: 0.935,
          width: width,
          height: height,
        }}
      />
    );
  };

  export default ResizeableImage;