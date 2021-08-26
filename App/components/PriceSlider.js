import React, {useEffect, useState, useRef} from 'react';
import {constants} from 'App/constants';
import Collapsible from 'react-native-collapsible';
import {useStore} from 'react-redux';
import {
  Button,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  SafeAreaView,
  ScrollView,
  View,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  Dimensions,
} from 'react-native';
import HowTo from 'App/HowTo';
import HeaderGradient from 'App/components/HeaderGradient';
import Icon from 'react-native-vector-icons/FontAwesome';
// import Slider from '@react-native-community/slider';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Dialog from 'react-native-dialog';
import {firebase, db, au} from 'App/firebase/config';
import io from 'socket.io-client';
import NavBar from 'App/components/common/NavBar';
import {GiftedChat} from 'react-native-gifted-chat';
import AnimatedModal from 'App/components/AnimatedModal';
import Checkout from 'App/components/Checkout';
import {useFocusEffect} from '@react-navigation/native';
// import NumericTextInput from 'App/components'
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  createDrawerNavigator,
  useIsDrawerOpen,
} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useSelector, useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import Countdown from 'App/components/Countdown';


const getPriceStringFromPercent = (percent, total) => {
  return (percent/100 * total * 1.4).toFixed(2)
}

const PriceSlider = ({id, priceShareInitialPercent, completeFunc=()=>{}, productPrice, othersPercent, remainingPercent, maximums, paymentIntents, setOutsideState=()=>{}, confirm=true, showInfo = true, initialSlider = false, maximumWidth=Dimensions.get('window').width *.55, showPlusMinus=true}) => {
    console.log("priceSlider maximums", maximums);
    const [initialPercent, setInitialPercent] = useState(priceShareInitialPercent);
    const [pricePercent, setPricePercent] = useState(initialPercent);
    const [changed, setChanged] = useState(false);
    const [infoModal, setInfoModal] = useState(false);
    const select = useSelector(state=>state.userInfo);


    var maxError;
    if (100-remainingPercent-othersPercent >0){
      maxError = "This is the maximum a single person can flock."
    } else {
      maxError = "Press confirm now to buy your item immediately.";
    }

    
  
    var changeable = false;
    console.log(pricePercent, "%")
    console.log('remaining', remainingPercent);
    console.log(zeroWarning, 'zero')

    var zeroWarning;
    if (pricePercent == 0) {
      zeroWarning = "If you pay $0.00, you cannot co-own this item.";
    } else if (pricePercent == remainingPercent) {
      zeroWarning = maxError;
    }
  
    if (true) {
      // console.log(priceShare, "priceShare");
      console.log(productPrice * pricePercent);
      return <>
      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        {changed && confirm?<View style={{backgroundColor: constants.DONE, marginRight: 30, justifyContent: 'center', borderRadius: 40, padding: 10}}>
          <TouchableOpacity onPress={()=>{
            setPricePercent(initialPercent);
            setChanged(false);
          }}><Text>Cancel</Text></TouchableOpacity>
        </View>:<View style={{opacity:0,padding: 10, marginRight:30}} ><Text>Cancel</Text></View>}
      <View style={{alignItems: 'center', width: 175}}>
      <Text style={{color:'black'}}>You are paying</Text>
        <Text style={{fontSize: 18, color: 'black'}}>${(parseFloat(productPrice)*1.4 * pricePercent/100).toFixed(2)} ({pricePercent>remainingPercent?remainingPercent:pricePercent.toFixed(0)}%)</Text>
      </View>
      {changed && confirm?<View style={{backgroundColor: constants.DONE, marginLeft: 30, justifyContent: 'center', borderRadius: 40, padding:10}}>
          <TouchableOpacity onPress={ async ()=>{
            if (pricePercent > initialPercent) {
                const postData = {
                  amount: getPriceStringFromPercent(pricePercent, productPrice),
                  paymentId: paymentIntents[au.currentUser.uid]
                }

              const result = await fetch(constants.CANCEL_AND_NEW, {
                method: 'POST',
                body: JSON.stringify(postData),
                headers: { 'Content-Type': 'application/json' }
            })
            const {error, new_paymentId} = await result.json();
            if (!error) {
              Alert.alert("If you see multiple pending transactions in your bank account, don't worry. They will disappear within a few days.")
              paymentIntents[au.currentUser.uid] = new_paymentId;
            } else {
              Alert.alert('Something went wrong. Please try again.')
              console.log("Cancel and make new error: ", error);
              return;
            }
            }
            setInitialPercent(pricePercent);
            console.log(select.customerId);
            maximums[au.currentUser.uid] = (pricePercent/100 * productPrice * 1.4).toFixed(2);
            console.log('maximums', maximums);
            completeFunc(select.customerId, maximums);
            db.collection('chatGroups').doc(id).update({maximums: maximums, paymentIntents: paymentIntents});
            setChanged(false);
            
          }}><Text>Confirm</Text></TouchableOpacity>
        </View>:<View style={{opacity:0,padding: 10, marginLeft:30}} ><Text>Confirm</Text></View>}
      </View>
      <View style={{alignItems: 'center'}}>
      <Text style={{color: constants.RED, textAlign: 'center', padding:-20, height: 16, fontSize: 12, marginBottom: -10}}>{zeroWarning}
      </Text></View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>



      <View style={{flex: 1, flexDirection: 'row', paddingLeft: 0, alignItems: 'center',justifyContent: 'space-between', alignSelf: 'center', alignSelf: 'center'}}>
      <View style={{borderRadius: 40, backgroundColor: constants.ORANGE, width: showPlusMinus?30:0, height: 30, justifyContent: 'center', alignItems: 'center'}}>
          <TouchableOpacity onPress={()=>{
            if (pricePercent>=0) {
              setPricePercent(pricePercent-4);
              setOutsideState(((pricePercent-4)*productPrice).toFixed(2));
              setChanged(true);
            }

            
          }}>
            <Icon name="minus" color="white" size={27} />
          </TouchableOpacity>
        </View>
              
              <View style={{flexDirection:'row', width: maximumWidth+ 30,alignItems: 'center', alignSelf: 'center',}}>
              <View style={{width: othersPercent*maximumWidth/100 + 16,  height: 15, backgroundColor: initialSlider || othersPercent==0?constants.ORANGE:constants.GREYORANGE, borderBottomLeftRadius: 40, borderTopLeftRadius: 40}}/>
            <View style={{flex:remainingPercent, marginRight: 0, paddingRight: 0}}>
            
            
            <MultiSlider
            values={[pricePercent]}
            // style={{flex: remainingPercent}}
            onValuesChangeStart={()=>{
              changeable = true;
            }}
            onValuesChangeFinish={()=>{
              changeable  = false;
            }}
            onValuesChange={(stuff)=>{
              // setPriceShare((parseInt(stuff[0])/100 * productPrice).toFixed(2));
              // if (!changeable) return;
              if (
                // stuff[0] >= 4 && 
                stuff[0] <= remainingPercent
                ) {
              setPricePercent(stuff[0]);
              }
              if (confirm == false) {
                setOutsideState((stuff[0]/100*1.4*parseFloat(productPrice)).toFixed(2));
              }
              // console.log(stuff);
              setChanged(true);
            }}
    // style={{width: 200, height: 40}}
    // snapped={true}
    markerStyle={{width: 40, height: 40, shadowOpacity:0}}
    selectedStyle={{backgroundColor: constants.BLUERGREY}}
    trackStyle={{height: 15, borderRadius: 0, borderTopLeftRadius: remainingPercent<100?0:20, borderBottomLeftRadius: remainingPercent<100?0:20, backgroundColor:constants.BLUERGREY}}
    // containerStyle={{height: 20}}
    selectedStyle={{backgroundColor:constants.ORANGE}}
    markerContainerStyle={{alignSelf: 'center', marginTop: 7.5}}
    // markerStyle={{marginTop: 15,justifyContent: 'center', alignItems: 'center'}}
    smoothSnapped={true}
    sliderLength={maximumWidth * remainingPercent/100}
    step = {4}
    min={4}
    max={remainingPercent+2}
    markerSize={100}
    showSteps={true}
    containerStyle={{width: 30}}
    // markerSize={20}
  
  />
  
  </View>
  <View style={{width: (100-othersPercent-remainingPercent)*maximumWidth/100+ 16,  height: 15, backgroundColor: constants.BLUERGREY, borderBottomRightRadius: 40, borderTopRightRadius: 40, zIndex: -40}}/>
  </View>
  <View style={{borderRadius: 40, backgroundColor: constants.ORANGE, width: showPlusMinus?30:0, height: 30, marginLeft: 0, justifyContent: 'center', alignItems: 'center', zIndex: -40}}>
          <TouchableOpacity onPress={()=>{
            if (pricePercent < remainingPercent && pricePercent < 100) {
              setPricePercent(pricePercent+4);
              setOutsideState(((pricePercent+4)*productPrice).toFixed(2))
              setChanged(true);
            }
            
          }}>
            <Icon name="plus" color="white" size={27} />
          </TouchableOpacity>
        </View>
  </View>

  </View>
  
  {!initialSlider?<View style={{alignItems: 'center',marginTop: -10, paddingTop: 10, justifyContent: 'center'}}>
    <View style={{marginLeft: 50, alignSelf:'flex-start'}}>
      <View style={{flexDirection:'row', alignItems: 'center'}}>
          <View style={{height: 15, aspectRatio:1, borderRadius: 20, backgroundColor: constants.PEACH, marginRight: 10}} />
          <Text>Others' contribution</Text>
      </View>
      <View style={{flexDirection:'row', alignItems: 'center'}}>
          <View style={{height: 15, aspectRatio:1, borderRadius: 20, backgroundColor: constants.ORANGE, marginRight: 10}} />
          <Text>Your share</Text>
      </View>
    </View>
    <View style={{height: 20}}/>
  {/* <Text style={{color:'black', marginBottom: 10, textAlign: 'center', alignSelf: 'center'}}>Increase to own more and use more.</Text> */}
  {showInfo?<View style={{width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 50, position: 'absolute', right: 25, borderWidth:1, borderColor: constants.LAVENDER}}>
    <TouchableOpacity style={{height:'100%', width: '100%', justifyContent:'center',alignItems:'center'}} onPress={()=>{
      setInfoModal(true);
    }}>
  <Icon name="info" size={10} color={constants.LAVENDER} />
  </TouchableOpacity>
  </View>:<></>}
  </View>:<></>}
      <View style={{flexDirection: 'row'}}>
        
      {/* <Text style={{color:'white', marginBottom: 10}}>Change your payment:</Text> */}
      {/* <ChangePayment data={priceShare} setState={setPriceShare}/> */}
      </View>
      {/* <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Have it now if you  ${(route.params.data.product.price / route.params.data.members.length).toFixed(2)}.</Text>
      <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Want to pay less? Get more people to join!</Text> */}
      {showInfo?<AnimatedModal colored={true} colors={[constants.PEACH, constants.GREYORANGE]} nested={true} visible={infoModal} close={()=>{setInfoModal(false)}}>
          <HowTo />
      </AnimatedModal>:<></>}
      </>;
  
    } else {
      return <><Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>You can have it now if you join for ${(route.params.data.product.price / (route.params.data.members.length+1)).toFixed(2)}.</Text>
      <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Want to pay less? Get more people to join!</Text>
      </>;
    }
  }

  export default PriceSlider;