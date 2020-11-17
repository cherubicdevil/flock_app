//import {createStackNavigator} from 'react-navigation-stack';
import React, {useState} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {createAppContainer} from 'react-navigation';
import Home from 'App/screens/home/Home';
import Profile from 'App/screens/profile/Profile';
import CamRoot from 'App/screens/camera/CamRoot';
import CamNavigator from './CamNavigator';
import Products from 'App/screens/products/Products';
import Product from 'App/screens/products/Product1/Product';
import Egg from 'App/screens/Egg';
import VideoPage from 'App/screens/VideoPage';
import PaymentInfo from 'App/screens/PaymentInfo';
import Success from 'App/screens/Success';
import PayTest from 'App/screens/PayTest';
import ProfileMain from 'App/screens/profile/ProfileMain';
import Carousel from 'App/screens/Carousel';
import NavButton from 'App/components/static/NavButton';
//import NavBar from 'App/components/static/NavBar';
import Chat from 'App/screens/Chat';
import OptionsModal from 'App/components/OptionsModal';

import {constants} from 'App/constants';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TestBar = ({descriptors, state, navigation}) => {
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
  const [modalOpen, setModalOpen] = useState(true);
  return (
    <>
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
      <TouchableOpacity
        onPress={() => {
          setModalOpen(true);
        }}>
        <NavItem
          image={image}
          text={text}
          navigation={navigation}
          route={route}
        />
      </TouchableOpacity>
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
      style={{flex: 1, marginBottom: 10}}>
      <Image
        source={image}
        style={{
          height: '100%',
          width: null,
          resizeMode: 'contain',
          tintColor: focused ? constants.PURPLE : constants.ICONGREY,
        }}
      />
      <Text
        style={{
          fontFamily: constants.FONT,
          marginBottom: 10,
          color: focused ? constants.PURPLE : constants.ICONGREY,
          textAlign: 'center',
        }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};
const AppNavigator5 = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={(props) => <TestBar {...props} />}
        initialRouteName="Carousel"
        screenOptions={{
          headerShown: false,
          animationEnabled: false,
        }}>
        <Tab.Screen
          name="Carousel"
          component={Carousel}
          options={{
            tabBarVisible: false,
            title: 'Carousel',
            cap: 'play',
            image: require('App/Assets/Images/Play.png'),
          }}
          initialParams={{vidVisible: true}}
        />
        <Tab.Screen
          name="VideoMasonry"
          component={Home}
          options={{
            title: 'VideoMasonry',
            cap: 'shop',
            image: require('App/Assets/Images/Happy_Shopping_Icon.png'),
          }}
          initialParams={{vidVisible: false}}
        />
        <Tab.Screen
          name="Home"
          component={Home}
          initialParams={{vidVisible: false}}
        />
        <Tab.Screen
          name="CamScreen"
          component={CamNavigator}
          initialParams={{vidVisible: false}}
          options={{
            title: 'CamScreen',
            cap: 'add',
            image: require('App/Assets/Images/Add_Icon.png'),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          initialParams={{vidVisible: false}}
        />
        <Tab.Screen
          name="ProfileMain"
          component={ProfileMain}
          initialParams={{vidVisible: false}}
        />
        <Tab.Screen
          name="Products"
          component={Products}
          initialParams={{vidVisible: false}}
        />
        <Tab.Screen
          name="Product"
          component={Product}
          initialParams={{vidVisible: false}}
        />
        <Tab.Screen
          name="PayTest"
          component={PayTest}
          initialParams={{vidVisible: false}}
        />
        <Tab.Screen
          name="Payment"
          component={PaymentInfo}
          initialParams={{vidVisible: false}}
        />
        <Tab.Screen
          name="Success"
          component={Success}
          initialParams={{vidVisible: false}}
        />
        <Tab.Screen
          name="Chat"
          component={Chat}
          options={{
            title: 'Chat',
            cap: 'flocks',
            image: require('App/Assets/Images/Group_Chat_Icon.png'),
          }}
        />
        <Tab.Screen
          name="Egg"
          component={Egg}
          options={{
            title: 'Egg',
            cap: 'save',
            image: require('App/Assets/Images/Goose_Egg_White.png'),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator5;
//export default createAppContainer(AppNavigator);

const navOptions = {
  Carousel: {
    name: 'Carousel',
    index: 0,
    desc: 'play',
    vidVisible: true,
    icon: require('App/Assets/Images/Play.png'),
    coloredIcon: require('App/Assets/Images/colored-play.png'),
    index: 0,
    text: 'watch',
  },

  Home: {
    name: 'Home',
    index: 1,
    desc: 'shop',
    vidVisible: false,
    icon: require('App/Assets/Images/Happy_Shopping_Icon.png'),
    coloredIcon: require('App/Assets/Images/colored_happy_shopping.png'),
    index: 1,
    text: 'discover',
  },

  CamScreen: {
    name: 'CamScreen',
    index: 2,
    desc: 'add',
    vidVisible: false,
    icon: require('App/Assets/Images/Add_Icon.png'),
    coloredIcon: require('App/Assets/Images/colored-add-icon.png'),
    index: 2,
    text: 'post',
  },

  Products: {
    name: 'Products',
    index: 3,
    desc: 'flocks',
    vidVisible: false,
    icon: require('App/Assets/Images/Group_Chat_Icon.png'),
    coloredIcon: require('App/Assets/Images/colored_search_discount.png'),
    index: 3,
    text: 'coupons',
  },

  Egg: {
    name: 'Egg',
    index: 4,
    desc: 'earn',
    vidVisible: false,
    icon: require('App/Assets/Images/Goose_Egg_White.png'),
    coloredIcon: require('App/Assets/Images/colored-egg-outline.png'),
    index: 4,
    text: 'save',
  },
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
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 40,
    zIndex: 100,
    paddingBottom: 16,
    elevation: 5,
  },
};
