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
  number,
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
            style={{height: 30, width: 30, marginBottom: 25, tintColor: constants.DARKGREY}}
          />
        </TouchableOpacity>
      );
    }
  };

  const result = [];
  for (i = 0; i < number; i++) {
    result.push(renderCircle(i, index));
  }
  return (
    <View
      style={{
        //marginBottom: 30,
        height:120,
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
      <Text style={{marginBottom: 5,fontFamily:constants.FONT}}>%12345</Text>

      <View
        style={{
          marginTop: -14,
          width: 150,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            backgroundColor: constants.DARKGREY,
            height: 1,
            width: 150,
            position: 'absolute',
            alignSelf: 'center',
            bottom: 7,
          }}
        />
        {result}
      </View>
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 10,
          bottom: 5,
        }}
        onPress={() => {
          if (index === number - 1) {
            navigation.goBack();
            return;
          }
          if (canGoNext) {
            navigation.navigate(nextRoute, {index: index+1});
          }
        }}>
        {/* <ImageBackground
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
          source={require('App/Assets/Images/Orange_Gradient_Small.png')}> */}
          <View style={{marginBottom: 25, justifyContent: 'center', padding: 10, height: 40, backgroundColor: constants.ORANGE, width: 60, borderRadius: 30, opacity: canGoNext ? 1 : 0.2,}}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Nunito-Bold',
              color: 'white',
            }}>
            {index === number - 1 ? 'close' : 'next'}
          </Text>
          </View>
        {/* </ImageBackground> */}
      </TouchableOpacity>
      {renderGoBack()}
    </View>
  );
};

const styles = StyleSheet.create({});

export default ProgressHeader;
