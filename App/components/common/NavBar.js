import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import NavButton from './NavButton';
import {constants} from 'App/constants';
import OptionsModal from 'App/navigators/OptionsModal';
//import OptionsModalModified from 'App/components/OptionsModalModified';
import ImagePicker from 'react-native-image-picker';
import {fadeIn} from 'App/utils';

const imagePickerOptions = {
  //customButtons: [{name: 'fb', title: 'Choose Photo From Facebook'}],
  maxWidth: 512,
  maxHeight: 512,
};

const navOptions = {
  Home: {
    name: 'Home',
    desc: 'play',
    vidVisible: true,
    icon: require('App/Assets/Images/Play.png'),
    coloredIcon: require('App/Assets/Images/colored-play.png'),
    index: 0,
    text: 'watch',
  },

  Video: {
    name: 'VideoMasonry',
    desc: 'shop',
    vidVisible: false,
    icon: require('App/Assets/Images/Happy_Shopping_Icon.png'),
    coloredIcon: require('App/Assets/Images/colored_happy_shopping.png'),
    index: 1,
    text: 'discover',
  },

  CamScreen: {
    name: 'CamScreen',
    desc: 'add',
    vidVisible: false,
    icon: require('App/Assets/Images/Add_Icon.png'),
    coloredIcon: require('App/Assets/Images/colored-add-icon.png'),
    index: 2,
    text: 'post',
  },

  Products: {
    name: 'Products',
    desc: 'flocks',
    vidVisible: false,
    icon: require('App/Assets/Images/Group_Chat_Icon.png'),
    coloredIcon: require('App/Assets/Images/colored_search_discount.png'),
    index: 3,
    text: 'coupons',
  },

  Egg: {
    name: 'Egg',
    desc: 'earn',
    vidVisible: false,
    icon: require('App/Assets/Images/Goose_Egg_White.png'),
    coloredIcon: require('App/Assets/Images/colored-egg-outline.png'),
    index: 4,
    text: 'save',
  },
};

const NavBar = ({style, route, navigation}) => {
  const routeName = route.name; // navigation.state.routeName
  const {navigate} = navigation;
  const [modalOpen, setModalOpen] = useState(false);
  const [fade, setFade] = useState(new Animated.Value(0));

  useEffect(() => {
    fadeIn(fade, 500);
    return () => {
      console.log('unmounting navbar from chat');
    };
  }, []);
  const renderNavButton = (navItem) => {
    return (
      <NavButton
        colored={routeName === navItem.name}
        text={navItem.desc}
        navFunc={() => {
          if (navItem.name === 'CamScreen') {
            setModalOpen(true);
            console.log('opening');
          } else {
            navigate(navItem.name, {vidVisible: navItem.vidVisible});
          }
        }}
        icon={navItem.icon}
      />
    );
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        zIndex: 900,
        bottom: constants.NAVBARHEIGHT / 4,
        height: 90,
        opacity: fade,
        width: Dimensions.get('window').width,
      }}>
      <OptionsModal
        text1="I want to save..."
        text2="I want to recommend..."
        func1={() => {
          console.log('you chose 1');
        }}
        func2={() => {
          //navigation.navigate('CamScreen');
          // ImagePicker.launchImageLibrary(imagePickerOptions, (response) => {
          // 	//console.log('Response = ', response);
          // 	//navigation.navigate('CamScreen');
          // 	if (response.didCancel) {
          // 		console.log('User cancelled image picker');
          // 	} else if (response.error) {
          // 		console.log('ImagePicker Error: ', response.error);
          // 	} else if (response.customButton) {
          // 		console.log('User tapped custom button: ', response.customButton);
          // 	} else {
          // 		console.log(response.uri);
          // 		//uploadImage(response);
          // 	}
          // 	//navigation.navigate('CamScreen');
          // });
          navigation.navigate('CamScreen');
        }}
        modalVisible={modalOpen}
        toggleFunc={() => {
          setModalOpen(false);
          //ImagePicker.showImagePicker(options, get)
        }}
      />

      <View style={[styles.navStyle, style]}>
        {renderNavButton(navOptions.Home)}
        {renderNavButton(navOptions.Video)}
        {renderNavButton(navOptions.CamScreen)}
        {renderNavButton(navOptions.Products)}
        {renderNavButton(navOptions.Egg)}
      </View>
    </Animated.View>
  );
};

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
    position: 'absolute',
    bottom: 40,
    zIndex: 900,
    paddingBottom: 16,
    elevation: 5,
  },
};
export default NavBar;
