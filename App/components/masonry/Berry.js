import React, {useState} from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {constants} from 'App/constants';
import {useDispatch} from 'react-redux';

const Berry = () => {
  const [berryVisible, setBerry] = useState(true);
  const ran = Math.random();
  const dispatch = useDispatch();
  if (ran < constants.BERRY_RATE && berryVisible) {
    return <View />;
  }
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
        setBerry(false);
        dispatch({type: 'increase'});
      }}>
      <Image style={{width: 30, height: 30}} source={constants.BERRY} />
    </TouchableOpacity>
  );
};

export default Berry;
