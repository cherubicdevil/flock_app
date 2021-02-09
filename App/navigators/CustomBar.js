import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Image, Button, Dimensions} from 'react-native';
import OptionsModal from './OptionsModal';
import {constants} from 'App/constants';
import AnimatedModal from 'App/components/AnimatedModal';
import {useSelector, useDispatch} from 'react-redux';
import ShareSocial from 'App/components/ShareSocial';

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

  const onSuccessfulShare = () => {
    dispatch({type:'getEggs', payload: 10});
  }
  return <>
  <View style={{marginBottom:-1, marginTop: 1,}}>
  <TouchableOpacity style={{flex: 1}} onPress={()=>setEggModalOpen(true)}>
  <InItem image={image} text={text} color={constants.GREYORANGE} />
  </TouchableOpacity>
  </View>
<AnimatedModal 
fadeOpacity={0.90}
contentTop={
  <View style={{width: '80%', alignSelf: 'center', padding: 10, justifyContent: 'center', alignItems: 'center'}}>
  <View style={{flexDirection: 'row', justifyContent:'space-between', marginTop: 10,}}>
<View style={{flex: 1}}>
  <Text style={{color: 'white', alignSelf: 'center'}}>Eggs</Text>
<Text style={{color: 'white', alignSelf: 'center', fontWeight: 'bold', fontSize: 32}}>{select.userInfo.eggCoins}</Text>

</View>
<View style={{flex: 1}}>
  <Text style={{color: 'white', alignSelf: 'center'}}>Value</Text>
<Text style={{color: 'white', alignSelf: 'center', fontWeight: 'bold', fontSize: 32}}>${(select.userInfo.eggCoins/40).toFixed(2)}</Text>

</View>

</View>
<Text style={{color: 'white', alignSelf: 'center', marginTop: 20}}>You can apply your earned eggs at checkout.</Text>
<Text style={{color: 'white', alignSelf: 'center', marginTop: 20}}>Get more eggs by using the app: share, post, flock, and add products.</Text>
  </View>
}
// viewParams={{bottom: 0, height: Dimensions.get('window').height, width:Dimensions.get('window').width + 300, left: -400}}
colored={true} colors={[constants.ORANGE, constants.GREYORANGE]} behind={false} upPercent="60%" visible={eggModalOpen} fade={false} close={()=>{setEggModalOpen(false)}} content={<View style={{flex: 1}}>

  <ShareSocial flockId="1234" product={null} shareApp={true} onSuccess={onSuccessfulShare}/>
  {/* <Button title="spend" onPress={()=>{
    dispatch({type:'spendEggs', payload: 50});
}} />
    <Button title="get" onPress={()=>{
    dispatch({type:'getEggs', payload: 25});
}} /> */}
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
    <Text style={{alignSelf: 'center', color: constants.ORANGE, fontFamily: constants.FONT, fontSize: 24}}>
      Add Product to Flock
    </Text>
    </TouchableOpacity></View></View>
<View style={{flex: 1}}>
<View style={{height: 70, borderRadius: 40, backgroundColor: constants.DARKGREY, marginLeft: 20, marginRight: 20, justifyContent: 'center'}}><TouchableOpacity onPress={()=>{
  setModalOpen(false);
  // navigation.navigate('CamScreen');

  }} style={{height: '100%', width: '100%', justifyContent: 'center'}}><Text style={{alignSelf: 'center', color: 'white', fontFamily: constants.FONT, fontSize: 24}}>Cancel</Text></TouchableOpacity></View>
</View>
      </View>} 
      // viewParams={{width:1500, height: 1500, left: -300, bottom: -200}}
      modalAnimationType="fade"
       bgcolor="transparent" upPercent="25%"/>
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
          tintColor: focused ? constants.ORANGE : color,
        }}
      />
      <Text
        style={{
          fontFamily: constants.FONT,
          color: focused ? constants.ORANGE : constants.ICONGREY,
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
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
    // shadowOffset: {width: 0, height: 0},

    paddingTop: 5,
    alignSelf: 'center',
    //backgroundColor: '#ff9933',
    backgroundColor: constants.MENU_COLOR,
    borderRadius: 100,
    width: '100%',
    height: constants.NAVBARHEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    zIndex: 100,
    paddingTop: 10,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20,
    elevation: 5,
  },
};
