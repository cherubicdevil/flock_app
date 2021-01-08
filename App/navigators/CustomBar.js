import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, Button} from 'react-native';
import OptionsModal from './OptionsModal';
import {constants} from 'App/constants';
import AnimatedModal from 'App/components/AnimatedModal';
import {useSelector, useDispatch} from 'react-redux';

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
          return (
            <AddItem
              image={options.image}
              text={options.cap}
              navigation={navigation}
              route={route}
            />
          );
        }
        else if (options.title === 'Chat') {
          return <EggItem image={options.image} text={options.cap} />
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

const EggItem = ({image, text}) => {
  const select = useSelector(state => state);
  const dispatch = useDispatch();
  const [eggModalOpen, setEggModalOpen] = useState(false);
  return <>
  <TouchableOpacity onPress={()=>setEggModalOpen(true)}>
  <InItem image={image} text={text} />
  </TouchableOpacity>
<AnimatedModal upPercent="30%" bgcolor="#FFD700" visible={eggModalOpen} fade={false} close={()=>{setEggModalOpen(false)}} content={<View style={{backgroundColor:'black', height: 40}}>
  <Text style={{color: 'white', alignSelf: 'center'}}>You've got this many eggs.{select.userInfo.eggCoins}</Text>
  <Button title="spend" onPress={()=>{
    dispatch({type:'spendEggs', payload: 50});
}} />
    <Button title="get" onPress={()=>{
    dispatch({type:'getEggs', payload: 25});
}} />
  </View>} />
  </>;
}
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
