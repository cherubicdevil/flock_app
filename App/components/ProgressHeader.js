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
    return (
      <View
        style={{
          borderWidth: 1,
          marginTop: 15,
          width: 15,
          height: 15,
          borderRadius: 20,
          borderColor: constants.DARKGREY,
          //fontSize: 70,
          backgroundColor: localIndex <= globalIndex ? constants.ORANGE: constants.GREY,
          justifyContent: 'center',
        }}>
        {/* <Text
          style={{
            color: 'white',
            fontSize: 8,
            textAlign: 'center',
            //paddingBottom: 2,
          }}>
          {localIndex}
        </Text> */}
      </View>
    );
};
const ProgressHeader = ({
  navigation,
  goBack = true,
  headerText,
  index,
  nextRoute,
  number,
  canGoNext = true,
  backRoute,
  data,
  nextText="next",
  closeText="close",
  idText="",
  nextFunc=() => {
  },
  closeFunc = ()=>{
    navigation.goBack();
  }
}) => {
  const renderGoBack = () => {

    if (goBack) {
      return (
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            position: 'absolute',
            left: 20,
            bottom: 8,
          }}
          onPress={() => {
            if (index === 0) {
              navigation.goBack();
              return;
            }
            if (goBack) {
              navigation.navigate(backRoute, {index: index-1, data: data});
            }
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
      <Text style={{marginBottom: 5,fontFamily:constants.FONT}}>{idText}</Text>

      <View
        style={{
          marginTop: -14,
          width: 150,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            backgroundColor: constants.GREY,
            height: 3,
            width: 150,
            position: 'absolute',
            alignSelf: 'center',
            bottom: 6,
          }}
        />
        {result}
      </View>
      <View style={{
          position: 'absolute',
          right: 20,
          bottom: 25,
          justifyContent: 'center',
          alignItems: 'center',
          height: 40, backgroundColor: constants.ORANGE, width: 60, borderRadius: 30, opacity: canGoNext ? 1 : 0.2,

          }}>
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
        onPress={() => {
          if (index === number - 1) {
            closeFunc();
            //navigation.goBack();
            return;
          }
          if (canGoNext) {
            nextFunc();
            navigation.navigate(nextRoute, {index: index+1, data: data, flockId: idText.replace("%","")});
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
          <View>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Nunito-Bold',
              color: 'white',
            }}>
            {index === number - 1 ? closeText : nextText}
          </Text>
          </View>
        {/* </ImageBackground> */}
      </TouchableOpacity>
      </View>
      {renderGoBack()}
    </View>
  );
};

const styles = StyleSheet.create({});

export default ProgressHeader;
