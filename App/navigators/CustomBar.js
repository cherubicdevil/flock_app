import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import OptionsModal from 'App/components/OptionsModal';
import NavButton from 'App/components/static/NavButton';
import {constants} from 'App/constants';

const CustomBar = ({descriptors, state, navigation}) => {
  const focusedOptions = descriptors[state.routes[state.index].key].options;

  if (focusedOptions.tabBarVisible === false) {
    return null;
  }
  return (
    <View style={styles.navStyle}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        if (options.title === undefined) {
          return null;
        }
        if (options.title === 'CamScreen') {
          console.log('und?', route === undefined);
          return (
            <AddItem
              image={options.image}
              text={options.cap}
              navigation={navigation}
              route={route}
            />
          );
        }
        const isFocused = state.index === index;
        return (
          <NavItem
            image={options.image}
            text={options.cap}
            focused={isFocused}
            navigation={navigation}
            route={route}
          />
        );
      })}
    </View>
  );
};
const AddItem = ({image, text, navigation, route}) => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <>
      <OptionsModal
        text1="I want to save..."
        text2="I want to recommend..."
        func1={() => {
          console.log('you chose 1');
        }}
        func2={() => {
          navigation.navigate('CamScreen');
        }}
        modalVisible={modalOpen}
        toggleFunc={() => {
          setModalOpen(false);
          //ImagePicker.showImagePicker(options, get)
        }}
      />
      <TouchableOpacity
        style={{flex: 1}}
        onPress={() => {
          setModalOpen(true);
        }}>
        <InItem image={image} text={text} />
      </TouchableOpacity>
    </>
  );
};

const InItem = ({image, text, focused}) => {
  return (
    <>
      <Image
        source={image}
        style={{
          height: '100%',
          width: null,
          marginTop: -5,
          resizeMode: 'contain',
          tintColor: focused ? constants.PURPLE : constants.ICONGREY,
        }}
      />
      <Text
        style={{
          fontFamily: constants.FONT,
          color: focused ? constants.PURPLE : constants.ICONGREY,
          textAlign: 'center',
        }}>
        {text}
      </Text>
    </>
  );
};
const NavItem = ({image, text, focused, navigation, route}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (navigation !== undefined) {
          navigation.navigate(route.name);
        }
      }}
      style={{flex: 1}}>
      <InItem image={image} text={text} focused={focused} />
    </TouchableOpacity>
  );
};

export default CustomBar;

const styles = {
  navStyle: {
    //borderWidth: 1,
    //borderColor: '#ff9933',
    shadowOpacity: 0.2,
    //boxShadow: '10px 5px 5px black',
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 0},

    paddingTop: 16,
    alignSelf: 'center',
    //backgroundColor: '#ff9933',
    backgroundColor: '#fff',
    borderRadius: 100,
    width: '90%',
    height: constants.NAVBARHEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 40,
    zIndex: 100,
    paddingBottom: 16,
    elevation: 5,
  },
};
