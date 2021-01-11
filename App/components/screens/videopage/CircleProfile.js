import React from 'react';
import {ImageBackground, Image, View} from 'react-native';

const CircleBorderProfile = ({photoUrl}) => {
    // Possible FLOCK_BUG
    // don't know why each of these have to be absolute position
    // if the profile pictures look uncentered later, look at this again.
    return (
      <View
        style={{
          //justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          bottom: 230,
        }}>
        <ImageBackground
          source={require('App/Assets/Images/Orange_Gradient_Small.png')}
          imageStyle={{borderRadius: 45}}
          style={{
            position: 'absolute',
            height: 62,
            width: 60,
            borderRadius: 45,
            left: 15,
            //borderWidth: 3,
            borderColor: '#f73',
            backgroundColor: 'rgba(255,255,255,0)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            marginBottom: 4,
            height: 54,
            width: 54,
            left: 18,
            borderRadius: 45,
            //borderWidth: 5,
            borderColor: '#f23',
            backgroundColor: 'rgba(255,255,255,0)',
          }}
        />
        <Image
          style={{
            position: 'absolute',
            marginBottom: 6,
            height: 50,
            left: 20,
            width: 50,
            borderRadius: 25,
          }}
          source={photoUrl}
        />
      </View>
    );
  };

  export default CircleBorderProfile;