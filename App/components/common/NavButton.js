import React from 'react';
import {Image, TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import {constants} from 'App/constants';

const NavButton = ({navFunc, icon, text, colored}) => {
  return (
    <TouchableOpacity onPress={navFunc} style={styles.buttonStyle}>
      <Image
        source={icon}
        style={[
          styles.imageStyle,
          {tintColor: colored ? constants.PURPLE : constants.ICONGREY},
        ]}
      />
      <Text
        style={{
          fontSize: 10,
          textAlign: 'center',
          //tintColor: constants.ICONGREY,
          marginBottom: -10,
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    flex: 1,
  },
  imageStyle: {
    flex: 8,
    tintColor: constants.ICONGREY,
    height: '100%',
    width: null,
    resizeMode: 'contain',
  },
});

export default NavButton;
