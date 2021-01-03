import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Image, Dimensions} from 'react-native';

const FlockListing = ({album}) => {
    const width = Dimensions.get('window') / 2 - 20;
    const [height, setHeight] = useState(200);
    useEffect(()=>{
        Image.getSize(album.image, (w,h)=>{
            setHeight(h/w * width);
        });
    },[]);
    return <View>
        <Image style={{width: width, height: height}} source={{uri: album.image }} />
    </View>
}

export default FlockListing;