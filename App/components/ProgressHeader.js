import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import {constants} from 'App/constants';

const renderCircle = (localIndex, globalIndex) => {
  if (localIndex <= globalIndex) {
    return (
      <ImageBackground
        source={require('App/Assets/Images/Orange_Gradient_Small.png')}
        imageStyle={{borderRadius: 55}}
        style={{
          marginTop: 15,
          width: 15,
          height: 15,
          marginLeft: 20,
          marginRight: 20,
          //fontSize: 70,
          color: 'green',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 8,
            textAlign: 'center',
            //paddingBottom: 2,
          }}>
          {localIndex}
        </Text>
      </ImageBackground>
    );
  } else {
    return (
      <View
        style={{
          marginTop: 15,
          width: 15,
          height: 15,
          borderRadius: 20,
          marginLeft: 20,
          marginRight: 20,
          //fontSize: 70,
          backgroundColor: constants.DARKGREY,
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 8,
            textAlign: 'center',
            //paddingBottom: 2,
          }}>
          {localIndex}
        </Text>
      </View>
    );
  }
};
const ProgressHeader = ({
  navigation,
  goBack,
  headerText,
  index,
  nextRoute,
  canGoNext = true,
}) => {
  const renderGoBack = () => {
    if (goBack) {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            position: 'absolute',
            left: 10,
            bottom: 8,
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            source={require('App/Assets/Images/Back_Icon.png')}
            style={{height: 20, width: 20, tintColor: constants.DARKGREY}}
          />
          <Text
            style={{
              color: constants.DARKGREY,
              marginLeft: -5,
              fontFamily: 'Nunito-Bold',
            }}>
            Back
          </Text>
        </TouchableOpacity>
      );
    }
  };
  return (
    <View
      style={{
        //marginBottom: 30,
        height: 100,
        paddingTop: 30,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
      }}>
      <Text style={{fontFamily: 'Nunito-Bold', fontSize: 14, marginTop: 17}}>
        {headerText}
      </Text>

      <View
        style={{
          marginTop: -5,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            backgroundColor: constants.DARKGREY,
            height: 1,
            marginLeft: 30,
            width: 100,
            position: 'absolute',
            alignSelf: 'center',
            bottom: 8,
          }}
        />
        {renderCircle(1, index)}

        {renderCircle(2, index)}

        {renderCircle(3, index)}
      </View>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 10,
          bottom: 5,
        }}
        onPress={() => {
          console.log('hello');
          navigation.navigate(nextRoute);
        }}>
        <ImageBackground
          style={{width: 50, height: 25}}
          imageStyle={{
            paddingTop: 4,
            paddingBottom: 2,
            paddingRight: 15,
            paddingLeft: 15,
            borderRadius: 20,
            backgroundColor: constants.PURPLE,
            opacity: canGoNext ? 1 : 0.2,
          }}
          source={require('App/Assets/Images/Orange_Gradient_Small.png')}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Nunito-Bold',
              color: 'white',
              paddingTop: 2,
            }}>
            {index === 3 ? 'Finish' : 'Next'}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
      {renderGoBack()}
    </View>
  );
};

const styles = StyleSheet.create({});

export default ProgressHeader;
