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
  <TouchableOpacity style={{flex: 1}} onPress={()=>setEggModalOpen(true)}>
  <InItem image={image} text={text} color={constants.ORANGE} />
  </TouchableOpacity>
<AnimatedModal upPercent="30%" bgcolor="#FFD700" visible={eggModalOpen} fade={false} close={()=>{setEggModalOpen(false)}} content={<View style={{height: 40}}>
  <View style={{borderWidth: 1, borderColor: 'yellow', width: '60%', alignSelf: 'center', padding: 10, justifyContent: 'center', alignItems: 'center'}}>
  <Text style={{color: 'white', alignSelf: 'center'}}>You've got this many eggs.{select.userInfo.eggCoins}</Text>
  </View>
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
      {/* <OptionsModal
        text1="I want to save..."
        text2="I want to recommend..."
        func1={() => {
          console.log('you chose 1');
        }}
        func2={() => {
          navigation.navigate('CamScreen');
          console.log('camscreen');
        }}
        modalVisible={modalOpen}
        toggleFunc={() => {
          setModalOpen(false);
          //ImagePicker.showImagePicker(options, get)
        }}
      /> */}
      <AnimatedModal curve={false} visible = {modalOpen} close = {()=> setModalOpen(false)} navigation={navigation} content={<View style={{flex:1}}>
<View style={{flex: 1, justifyContent: 'center'}}><View style={{height: 70, borderRadius: 40, backgroundColor: 'white', marginLeft: 20, marginRight: 20}}><TouchableOpacity onPress={()=>{
  setModalOpen(false);
  navigation.navigate('CamScreen', {data: {}});

  }} style={{height: '100%', width: '100%', justifyContent: 'center'}}>
    <Text style={{alignSelf: 'center', color: constants.PURPLE, fontFamily: constants.FONT, fontSize: 24}}>
      Add Product to Flock
    </Text>
    </TouchableOpacity></View></View>
<View style={{flex: 1}}>
<View style={{height: 70, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.6)', marginLeft: 20, marginRight: 20, justifyContent: 'center'}}><TouchableOpacity onPress={()=>{
  setModalOpen(false);
  // navigation.navigate('CamScreen');

  }} style={{height: '100%', width: '100%', justifyContent: 'center'}}><Text style={{alignSelf: 'center', color: constants.PURPLE, fontFamily: constants.FONT, fontSize: 24}}>Cancel</Text></TouchableOpacity></View>
</View>
      </View>} viewParams={{width:1500, height: 1500, left: -300, bottom: -200}} bgcolor="transparent" upPercent="25%"/>
      <TouchableOpacity
        style={{flex: 1}}
        onPress={() => {
          setModalOpen(true);
          console.log('middle');
        }}>
        <InItem image={image} text={text} />
      </TouchableOpacity>
      
    </>
  );
};

const InItem = ({image, text, focused, color=constants.ICONGREY}) => {
  return (
    <>
      <Image
        source={image}
        style={{
          alignSelf: 'center',
          height: '100%',
          width: 50,
          marginTop: -5,
          resizeMode: 'contain',
          tintColor: focused ? constants.PURPLE : color,
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
      style={{flex: 1}}
      >
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

    paddingTop: 5,
    alignSelf: 'center',
    //backgroundColor: '#ff9933',
    backgroundColor: '#fff',
    borderRadius: 100,
    width: '70%',
    height: constants.NAVBARHEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 40,
    zIndex: 100,
    paddingTop: 10,
    paddingBottom: 16,
    paddingLeft: 20,
    paddingRight: 20,
    elevation: 5,
  },
};
