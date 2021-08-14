import React, {useEffect, useState, useRef,Fragment} from 'react';
import {constants} from 'App/constants';
import Collapsible from 'react-native-collapsible';
import {useStore} from 'react-redux';
import { Bubble } from 'react-native-gifted-chat'
import Wrapper from 'App/components/Wrapper';
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
  KeyboardAvoidingView
} from 'react-native';
import NewTutorial from 'App/components/NewTutorial';
import SmartCheckout from "App/components/SmartCheckout";
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

import TooltipFirst from 'App/components/TooltipFirst';

import Checkout from 'App/components/Checkout';
import {useFocusEffect} from '@react-navigation/native';
import PriceSlider from 'App/components/PriceSlider';
import {toDateTime, checkFlockExpired} from 'App/utils';
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
import HowTo from 'App/HowTo';
import ChatComponent from 'App/components/ChatComponent';
import StripeCheckout from '../../StripeCheckout';

const barHeight = 25;
var initialPercentTemp;

var eventify = function (arr, callback) {
  arr.push = function (e) {
    Array.prototype.push.call(arr, e);
    callback(arr);
  };
};

const updateCache = (id, messages) => {
  //data[id].messages = messages;
};

const systemMessages = [];

function ChatInterface({route, navigation}) {
  const [stripeHook, setStripeHook] = useState(()=>()=>{
    console.log('hello')
});
  const chatColor = route.params.data.completed?constants.LAVENDER:constants.ORANGE;
  const chatColors = route.params.data.completed?[constants.LAVENDER, constants.PURPINK]:[constants.PEACHBG, constants.PEACHBG];

  const [creditModal, setCreditModal] = useState(false);
  // determines if asking for credit modal is open or not.

  const [priceStartPercent, setPriceStartPercent] = useState(0);
  // the priceStartPercent is what?

  const [priceShare, setPriceShare] = useState(route.params.data.maximums[au.currentUser.uid] || 0);
  const [initialDialog, setInitialDialog] = useState(false);
  const [remainingPercent, setRemainingPercent] = useState(0);


  // const [UUID, setUUID] = useState(0);
  console.log('remaning percent', remainingPercent);
  console.log('importants', route.params.data.maximums);


  useFocusEffect(()=>{
    if (select?.auth?.guest) {
      navigation.replace("Login");
    }
  }, []);

  useFocusEffect(()=>{
    // setUUID(Math.random());
    if (select?.auth?.guest) return;
    setPriceShare(route.params.data.maximums[au.currentUser.uid]);

    console.log(route.params.data.id, route.params.data.maximums[au.currentUser.uid]);
  }, []);
  console.log("PRICE SHAre", priceShare);
  useFocusEffect(()=>{
    const unsub = db.collection('chatGroups').doc(route.params.data.id).onSnapshot(docSnapshot => {
      const datums = docSnapshot.data();
      const members = datums.memberIds;
      const maximums = datums.maximums;
      console.log('initial maximums!!!!', maximums);
      route.params.data.maximums = maximums;
      var remaining = route.params.data.product.price * 1.4;

      var theirPer = 0;
      for (const m of members) {
        if (m !== au.currentUser.uid) {
        remaining -= maximums[m];

        theirPer += 100* maximums[m]/(route.params.data.product.price * 1.4)
        }
      }
      // console.log(remaining/route.params.data.product.price);
      // console.log('first set', Math.round(100 * remaining/route.params.data.product.price));
      const remPer = Math.round(100 * remaining/(route.params.data.product.price * 1.4));
      // setRemainingPercent(Math.round(100 * remaining/(route.params.data.product.price * 1.4)));
      setRemainingPercent(remPer);
      const youPer = 100* maximums[au.currentUser.uid]/(route.params.data.product.price * 1.4);
      console.log(theirPer, youPer, maximums);
    }, err => {
      console.log(`Encountered error: ${err}`);
    });

    return ()=>{
      unsub();
    }
  },[])

  useFocusEffect(()=>{
    if (select?.auth?.guest) return;
    setPartOf(part);
  }, []);

  // for error handling... connection issues?
  // useEffect(()=>{
  //   socket.current.on("error", ()=>{
  //     Alert.alert("Something went wrong.")
  //   })
  // },[])
  const completeFunc = (customerId, maximums) => {
    if (maximums === undefined) {
      maximums = route.params.data.maximums;
    }
    // send to socket, which pushes a broadcast
    // test signal, send test, on receive, console log "RECEIVED"
    // condition
      // FLOCK_UPDATE
      console.log(route.params.data.product.price);
      console.log(route.params.data.maximums);
    // const res = splitAlgorithm(route.params.data.members, route.params.data.maximums, route.params.data.product.price)
    const flockTookOff = didFlockTakeOff(maximums, route.params.data.product.price* 1.4);
    if (flockTookOff) {
    socket.current.emit('complete', {chatId: route.params.data.id, groupData: {prices: route.params.data.maximums}});
    db.collection('chatGroups').doc(route.params.data.id).update({
      // members: res,
      completed: true,
      markedDates: {},
      
      // rentPrice: ((route.params.data.product.price * .15 + route.params.data.product.price / route.params.data.members.length) / 2).toFixed(2),
      // FLOCK_UPDATE this should go in the backend so that prices can be adjusted easily
      
    });
    //purchase order addd
    // route.params.data.members = res;

    //purchase order added by backend
    // db.collection('purchaseOrders').doc().set({
    //   product: route.params.data,
    //   user: {name: auth.currentUser.displayName, uid: auth.currentUser.uid},
    //   transaction: "price here",
    // });
    let postData = {
      // ...route.params.data,
      memberIds: route.params.data.memberIds,
      // customerId: customerId,
      chatId: route.params.data.id,
      maximums: route.params.data.maximums,
      // userId: au.currentUser.uid,
    }
    fetch(constants.CHARGE_FLOCK_COMPLETE_ENDPOINT, {
    method: 'POST',
    body: JSON.stringify(postData),
    headers: { 'Content-Type': 'application/json' }
}).then(res => res.json())
  .then(json => console.log(json));
    
    navigation.navigate('FlockSuccess', {data: route.params.data})
    }
  };

const enterFlockFunc = () => {
  const data = route.params.data;
  const memberInfo = {name: au.currentUser.displayName, uid: au.currentUser.uid};
  db.collection('users').doc(au.currentUser.uid).update({
    chatIds: firebase.firestore.FieldValue.arrayUnion(data.id)
  });
  // data.maximums[au.currentUser.uid] = (initialPercent/100 * parseFloat(data.product.price * 1.4)).toFixed(2);
  data.maximums[au.currentUser.uid] = (priceStartPercent * parseFloat(data.product.price * 1.4)).toFixed(2);
  db.collection('chatGroups').doc(data.id).update({
    memberIds: firebase.firestore.FieldValue.arrayUnion(memberInfo.uid),
    maximums: {...data.maximums},
  });
  setPartOf(true);
  data.memberIds.push(au.currentUser.uid);
  completeFunc(store.getState().userInfo.customerId);
  navigation.navigate("ChatInterface", {data:{...route.params.data}});
  // possible remove... refresh for new information. ^
}


  const store = useStore();
  const select = useSelector((state) => state);

  const [creditEmail, setCreditEmail] = useState(select.userInfo.email || "");
  const socket = useRef(null);
  const dispatch = useDispatch();
  const [testMessages, setTestMessages] = useState("");
  const [descriptionCollapsed, setDescriptionCollapsed]  = useState(false);


  console.log(route.params.data);
  const user = firebase.auth().currentUser;
  var part = route.params.data.memberIds.includes(au.currentUser.uid);
  part = route.params.data.memberIds.includes(user.uid);
for (const member of route.params.data.members) {
if (user.uid === member.uid) {
part = true;
break;
}
}
  const [partOf, setPartOf] = useState(part);
  // console.log(route.params.data.maximums, user.uid);

  const convertArrayToDict = (arr) => {
    // format [{"dadsfa": "ADFadsf"},{"asdfadsf":"adsfasdfa"}]
    if (typeof arr === "Object") return arr;
    const dicti = {};
    for (const item of arr) {
      var obj = Object.entries(item);
            dicti[obj[0][0]] = obj[0][1]
    }
    return dicti;
  }
  console.log('changing price');
  const yourPrice = route.params.data.maximums[user.uid];
  console.log('your price', route.params.data.maximums);
  const ChangePayment = ({data, setState}) => {
  const NumericTextInput = ({data=0}) => {
    const [dataValue, setDataValue] = useState(data);
    const [dialVisible, setDialVisible] = useState(false);
    const dial = <Dialog.Container visible={dialVisible}>
    <Dialog.Title>Confirm Change</Dialog.Title>
    <Dialog.Description>
      You will only be charged if the flock completes.
    </Dialog.Description>
    <Dialog.Button label="Cancel" onPress={()=>{
      setDataValue(data);
      setDialVisible(false);
    }}/>
    <Dialog.Button label="Confirm" onPress={()=>{
      route.params.data.maximums[au.currentUser.uid] = dataValue;
      route.params.data.memberIds.push(au.currentUser.uid);
      setState(dataValue);
      completeFunc(select.userInfo.customerId);
      // setDataValue()
      setDialVisible(false);
    }}/>
  </Dialog.Container>;
    return <View style={{flexDirection:'row', alignItems: 'center'}}><TextInput
    // contextMenuHidden={numeric}
    style={{width: 75, backgroundColor: 'white', borderRadius: 40, paddingLeft: 20}}
    keyboardType={"numeric"}
    blurOnSubmit placeholder={"0.00"} onBlur = {(e)=> {
        // console.log("BLUR", e.nativeEvent.text);
    }} 
    value={(typeof dataValue)==="string"?dataValue:dataValue.toFixed(2)}
    defaultValue={data}
    onChangeText={(text)=>{
            if (text === "") {
                setDataValue("");
            } else {
                setDataValue(parseInt(text.replace(".",""))/100);
            }
    }}
    
    />
    {dial}
    <Text style={{color: 'white', marginLeft: 10, width: 30}}>{100*(parseInt(dataValue) / route.params.data.product.price)>100?"100%":100*(parseInt(dataValue) / route.params.data.product.price)<1?"<1%":(100*parseInt(dataValue) / route.params.data.product.price).toFixed(0) + "%"}</Text>
    <TouchableOpacity onPress={()=>{
      if (dataValue !== data) {
      setDialVisible(true);
      }
    }}>
      <View style={{marginLeft: 10, borderRadius: 40, backgroundColor: 'green'}}>
      <Icon name="check" size={10} color="white" />
      </View>
      </TouchableOpacity>
    </View>;
}
return <ScrollView  style={{marginLeft: 15, overflow: 'visible', backgroundColor: 'yellow'}} keyboardShouldPersistTaps="never">
  
  <NumericTextInput data={data} />
  </ScrollView>
  }
  
  console.log("PARTOF?", partOf, part, route.params.data.memberIds, au.currentUser.uid);
  console.log("ID", route.params.data.id);
  console.log("priceshare", priceShare);
  console.log(creditModal, "open?");
  console.log(parseFloat(priceShare) / parseFloat(route.params.data.product.price) * 100);
  // console.log("prices", priceShare, route.params.data.product.price, parseFloat(priceShare) / parseFloat(route.params.data.product.price) * 100);
  
  // useEffect(()=>{
  //   giftedRef.current.scrollToBottom();
  // },[]);

  console.log("id? is a numbeer",route.params.data.id);
  return (<>
        <NewTutorial screenId = "chatinterface">
        <Text style={{color: 'white', position: 'absolute', bottom: '55%', left: 20, fontFamily: 'Noteworthy-Bold', fontSize: 18}}>Pay attention to the specifications here.</Text>
        <Text style={{color: 'white', position: 'absolute', top: 70, right: 20,width: 170, fontFamily: 'Noteworthy-Bold', fontSize: 18}}>Reach 100% before time runs out. Share!</Text>
        <Text style={{color: 'white', position: 'absolute',  top: '20%', right: '30%',width: 150,fontFamily: 'Noteworthy-Bold', fontSize: 18}}>Change your ownership percentage.</Text>
        <Text style={{position: 'absolute', bottom: 130, textAlign: 'center',alignSelf:'center', color: 'white', width: 250,fontFamily: 'Noteworthy-Bold', fontSize: 18}}>Once you join, you can chat with your fellow flockers.</Text>
      </NewTutorial>
  <Wrapper>
  
<HeaderGradient navigation={navigation} absolute={false} >
  
  <View style={{marginBottom:0, justifyContent: 'flex-end'}}>
{/* <Text style={{fontSize: 14, textAlign: 'center'}}>%{route.params.data.id}</Text> */}
  {route.params.data.completed?<></>:!checkFlockExpired(route.params.data.time)?<Countdown dateObj={route.params.data.time} fontSize = {14} />:<Text>expired</Text>}
  {/* <Text>{testMessages}</Text> */}
  </View>
  <View style={{bottom: 20, right: 20, position: 'absolute', zIndex: 400, flexDirection:'row', alignItems:'center'}}>
    <Text style={{fontFamily: constants.FONT, marginRight: 2}}>id: %{route.params.data.id}</Text>
    <TouchableOpacity 
    hitSlop={{top: 30, bottom: 30, left: 30, right: 30}} 
    onPress={()=>{
      navigation.navigate('ShareSocial', {id: route.params.data.id, flockId: route.params.data.id, product: route.params.data.product, data: {}})
    }}>
  <Image style={{height: 25, width: 25, tintColor: chatColor}} source={require('App/Assets/Images/Share_Icon_White.png')} />
  </TouchableOpacity>
  </View>
</HeaderGradient>

      <View style={{zIndex: 200, overflow: 'visible', width: '100%', borderRadius: 0, borderBottomRightRadius: 70, borderBottomLeftRadius: 70}}>
      <View style={{
        
        // shadowColor: "#ff7009", shadowOffset: {height: 0, width: 0}, shadowOpacity: 0.42, elevation: 13, shadowRadius: 28.30,
       borderBottomLeftRadius: 70, borderBottomRightRadius: 70}}>
      <ScrollView scrollEnabled={false} keyboardShouldPersistTaps="never" >
      
      <LinearGradient
          colors={chatColors}
          start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
          style={{
            borderRadius: 20,
            // overflow: 'visible',
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
            
            padding: 10,
            shadowColor: "#ff7009", shadowOffset: {height: 10, width: 0}, shadowOpacity: 0.39, elevation: 13, shadowRadius: 8.30,
            //alignItems: 'center',
            flex: 1,
          }}>
            <View style={{width: '90%', alignSelf: 'center'}}>
            {/* <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Current flock price: ${route.params.data?.product?.price || ""}</Text> */}
            {/* <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Total price: ${route.params.data?.product?.price || ""}</Text> */}
            
            {part?
            
            route.params.data.completed?<></>:<PriceSlider id={route.params.data.id} key={Math.random()} othersPercent={100-remainingPercent} remainingPercent={Math.min(68,remainingPercent)} priceShare = {priceShare} priceShareInitialPercent={parseFloat(priceShare)/ parseFloat(route.params.data.product.price*1.4) * 100} completeFunc={completeFunc} productPrice={route.params.data.product.price} maximums={route.params.data.maximums} />
            :
            <PriceTextPreview remainingPercent={remainingPercent} productPrice={route.params.data.product.price} />
            }
            </View>
            {/* <TooltipFirst tooltipId="slider" width={100} height={100} info="Slide to adjust your ownership."><Text>Hi</Text></TooltipFirst> */}
            <TouchableOpacity onPress={()=>{
              if (!route.params.data.completed) {
              navigation.navigate("Product", {album: route?.params?.data?.product, data: route.params.data, id: route?.params?.data?.id});
              } else {
                navigation.navigate("FlockReserve", {data: route.params.data});
              }
            }}>
            <View style={{flexDirection: 'row', verflow: 'visible', padding: 20, paddingLeft: 30, paddingRight: 30,borderRadius: 50, shadowRadius: 2.62, backgroundColor: 'white', shadowOpacity: 0.23, shadowOffset:{height: 2,width:0}, elevation: 1}}>
            <Image style={{width: 50, height: 50}} source={{uri: route.params.data.product.image}} />
            <View style={{overflow: 'visible',flex:1, marginLeft: 5, marginRight: 5,}}>
            <Text numberOfLines={2}>{route.params.data.product.title}</Text>
            <Text>${route.params.data.product.price}</Text>
            </View>
            <Icon name="chevron-right" style={{position:'absolute', right: 20, alignSelf: 'center'}} size={25} color={chatColor} />
            </View>
            
            </TouchableOpacity>

            {/* <View style={{marginLeft: 40}}>
            <Text>Description and Size/Variant Information:</Text>
            <Text style={{marginTop: 5}}>{route.params.data.description}</Text>
            <Text style={{marginTop: 5}}>{route.params.data.specifications}</Text>
            </View> */}
            {/* <Text style={{marginLeft: 85, marginBottom: -20}}>
          {route.params.data.description}
        </Text> */}

<Collapsible collapsed={descriptionCollapsed}>
      <View style={{marginTop: 20, flexDirection: 'row',
      shadowColor: constants.GREYBLUE, shadowOffset: {height: 5, width: 0}, shadowOpacity: 0.42, elevation: 13, shadowRadius: 8.30,
    }}>
        <Image style = {{width: 40, height: 40, marginRight: 20, marginLeft: 10, borderRadius: 50}} source ={constants.PLACEHOLDER_IMAGE } />
        <View style={{borderRadius: 30, flex: 1, backgroundColor:"#9eacc5", padding: 15, paddingVertical: 5, marginRight: 20, 
          // shadowColor: constants.GREYBLUE, shadowOffset: {height: 10, width: 0}, shadowOpacity: 0.82, elevation: 13, shadowRadius: 18.30,
          }}>
          <View>
            <Text>Description {"&"} Size/Variant Information
            </Text>
            <View style={{backgroundColor: 'rgba(255,255,255,0.2)', padding: 5, borderRadius: 15}}>
              <Text>{route.params.data.specifications}; {route.params.data.description}</Text>
            </View>

          </View>
          </View>
      </View>
      </Collapsible>
      
          </LinearGradient>
          </ScrollView>
        </View>
        <TouchableOpacity style={{alignSelf: 'flex-end', position: 'absolute', bottom: -20,right: 30}} onPress={()=>{setDescriptionCollapsed(!descriptionCollapsed)}}>
        <View style={{backgroundColor: chatColors[1], padding: 5, paddingTop: 9, marginTop: -3, borderBottomEndRadius:5, borderBottomLeftRadius: 5}}>
        <Icon name={descriptionCollapsed?"chevron-down":"chevron-up"} />
        </View>
      </TouchableOpacity>

      </View>
      <MemberPics memberIds={route.params.data.memberIds} />
      <View style={{backgroundColor: constants.PINK_BACKGROUND_OPAQUE, flex: 1, justifyContent: 'flex-end'}}>
        <ChatComponent navigation={navigation} route={route} socket={socket} />
 </View>
      <JoinDialog navigation={navigation} route={route} data={route.params.data} creditModal={creditModal} setCreditModal={setCreditModal} initialDialog={initialDialog} setInitialDialog={setInitialDialog} setPriceStartPercent={setPriceStartPercent} setPartOf = {setPartOf} maxPercent = {remainingPercent} productPrice={route.params.data.product.price} remainingPercent={remainingPercent} />
      {partOf?route.params.data.memberIds.length <= 1?<></>:<>
        
      <TouchableOpacity onPress={()=>{
        if (route.params.data.memberIds.length == 1) {
          Alert.alert("You are the only one in this flock. You can't leave")
          return;
        }
        console.log('leave flock');
              db.collection('users').doc(au.currentUser.uid).update({
        chatIds: firebase.firestore.FieldValue.arrayRemove(route.params.data.id)
      });
    //   data.maximums[au.currentUser.uid] = (initialPercent/100 * parseFloat(data.product.price * 1.4)).toFixed(2);
    if (au.currentUser.uid in route.params.data.maximums) {
      delete (route.params.data.maximums)[au.currentUser.uid]
      console.log('deleting shit')
    }
    
      db.collection('chatGroups').doc(route.params.data.id).update({
        memberIds: firebase.firestore.FieldValue.arrayRemove(au.currentUser.uid),
        maximums: {...route.params.data.maximums},
      });
      setPartOf(false);
      navigation.navigate("ChatInterface", {data:{...route.params.data}});
      }}>
<Text>LEAVE</Text>
      </TouchableOpacity>
      </>:<View style={{position: 'absolute', bottom: 0, width: '100%', height: 100, backgroundColor: 'white'}}><View style={{height: '100%', backgroundColor: constants.PINK_BACKGROUND }}>
        <TouchableOpacity style={{width: '90%', height: 50, backgroundColor: constants.ORANGE, alignSelf: 'center', borderRadius: 30, justifyContent: 'center'}} onPress={()=>{
          setInitialDialog(true);
          // setCreditModal(true);
      }}><Text style={{color: 'white', alignSelf: 'center', fontWeight: 'bold'}}>JOIN</Text></TouchableOpacity></View></View>}
    
      </Wrapper>
      {/* <PreCheckout visible={creditModal} /> */}
      <StripeCheckout amount={(1.4 *priceStartPercent/100 * route.params.data.product.price).toFixed(2)} setHook={setStripeHook} delayedCharge={true} completeFunc = {()=>{
        // navigation.navigate()
        enterFlockFunc();
    }}>
      <AnimatedModal upPercent="70%" colored={true} colors={[constants.ORANGE, constants.GREYORANGE]} nested={false} visible={creditModal} close={()=>setCreditModal(false)} navigation={navigation} 
     >
       <KeyboardAvoidingView behavior="position" style={{flex: 1}} keyboardVerticalOffset={-200}>
<ScrollView>

         <View style={{marginHorizontal: 30, marginTop: 10}}>
         <Text>Email</Text>
         <TextInput style={{paddingLeft: 20, borderWidth: 1, borderColor: constants.DARKGREY, borderRadius: 40, paddingVertical: 5, marginTop: 15}} keyboardType="email-address" defaultValue={au.currentUser.email} 
         value={creditEmail}
         keyboardType="email-address"
         onChangeText={(text)=>{
          setCreditEmail(text.toLowerCase());
         }}
         />
         <TouchableOpacity 
         style={{margin: 5, backgroundColor: constants.ORANGE, borderRadius: 20, padding: 5, justifyContent: 'center',alignItems: 'center'}}
         onPress={()=>{
           setCreditModal(false);
           setTimeout(()=> {
            stripeHook();
           }, 800);
         }}>
           <Text style={{color: 'white'}}>
             Proceed
           </Text>
         </TouchableOpacity>
         </View>
       <View style={{marginHorizontal: 30, marginTop: 20}}>
              <Text >
              * Your credit card will only be charged if combined ownership reaches 100%. You can change how much you want to pay any time before the flock takes off.
       </Text>
       <Text style={{marginTop: 20}}>
         ** Your email is necessary for receiving receipts and reporting status of the flock.
       </Text>
       </View>
       
       </ScrollView>
       </KeyboardAvoidingView>
       </AnimatedModal>
      
    
      {/* <Modal transparent={false} visible={creditModal}>
        <View style={{backgroundColor: 'white'}}>
        <TouchableOpacity  style = {{marginTop: 400}} onPress={()=>setCreditModal(false)}>
          <Text>touch me</Text>
        </TouchableOpacity>
        </View>
      </Modal> */}
      </StripeCheckout>
      </>
  );
}

const JoinDialog = ({navigation, route, data, creditModal, setCreditModal, initialDialog, setInitialDialog, setPriceStartPercent, setPartOf, completeFunc, minPercent=4, maxPercent, productPrice, remainingPercent}) =>{
  const store = useStore();
  const dispatch = useDispatch();

  const [initialPercent, setInitialPercent] = useState(8);

  return <Dialog.Container visible={initialDialog}>
  <Dialog.Title>Choose Your Share</Dialog.Title>
  <Dialog.Description>
    The more you pay, the more you own. The more you can use.
  </Dialog.Description>
    {/* <View style={{alignItems: 'center', flexDirection: 'row', height: 45,paddingTop: 10, justifyContent: 'center'}}>
    <View style={{borderRadius: 40, backgroundColor: constants.ORANGE, width: 25, height: 25, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={()=>{
          if (initialPercent > minPercent) {
            setInitialPercent(initialPercent-4);
          }
          
        }}>
          <Icon name="minus" color="white" size={20} />
        </TouchableOpacity>
      </View> */}
<View style={{flexDirection:'column',}}>
      <PriceSlider setOutsideState={(number)=>{
        const perc = parseFloat(number)/(1.4 * productPrice) * 100;
        setInitialPercent(perc);
      }} id={route.params.data.id} confirm={false} showPlusMinus={false}  showInfo={true} maximumWidth={150} othersPercent={100-remainingPercent} remainingPercent={Math.min(68,remainingPercent)} priceShare = {0} priceShareInitialPercent={0} productPrice={route.params.data.product.price} maximums={route.params.data.maximums} />
      </View>
      {/* <View style={{width: 100, alignSelf: 'center'}}>
      <Text style={{width: 100, textAlign: 'center',fontSize:14, fontWeight: 'bold'}}>${(parseFloat(productPrice) * initialPercent/100).toFixed(2)}</Text>
      <Text style={{width: 120,textAlign: 'center',fontSize:14, fontWeight: 'bold', alignSelf: 'center'}}>({initialPercent}% yours)</Text>
      </View>
      <View style={{borderRadius: 40, backgroundColor: constants.ORANGE, width: 25, height: 25, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={()=>{
          if (initialPercent < maxPercent) {
            setInitialPercent(initialPercent+4);
          }
          
        }}>
          <Icon name="plus" color="white" size={20} />
        </TouchableOpacity>
      </View> */}

    {/* </View> */}
  <Dialog.Button label="Cancel" onPress={()=>{
    // console.log(route.params.data.id,"ID");
    setInitialDialog(false);
  }}/>
  <Dialog.Button label="Confirm" onPress={()=>{
    var hasBillingInfo = store.getState().userInfo.customerId !== "none"
    hasBillingInfo = false;
    if (hasBillingInfo) {
      enterFlockFunc();
      setInitialDialog(false);
    } else {
      setPriceStartPercent(initialPercent);
      setInitialDialog(false);
      setTimeout(()=>{
        setCreditModal(true);
      }, 500);
    }

  }}/>
</Dialog.Container>
}

const PriceTextPreview = ({productPrice, remainingPercent}) =>{
  console.log('remin', remainingPercent);
const [infoModal, setInfoModal] = useState(false);


  return <>
  <View style={{flexDirection: 'row', justifyContent: 'center', }}>
  <View style={{alignItems: 'center', width: 175}}>
  <Text style={{color:'black'}}>Others are paying</Text>
    <Text style={{fontSize: 18, color: 'black'}}>${(parseFloat(productPrice) * ((100-remainingPercent)/100)).toFixed(2)} ({(100-remainingPercent).toFixed(0)}%)</Text>
  </View>
  </View>
  <View style={{flexDirection: 'row', alignItems: 'center'}}>
  <View style={{flex: 1, marginTop: 10, flexDirection: 'row', paddingLeft: 0, alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
  <View style={{width: barHeight,  height: barHeight, backgroundColor: constants.GREYORANGE, borderBottomLeftRadius: 40, borderTopLeftRadius: 40}}/>
          <View style={{flex: 100-remainingPercent,  height: barHeight, backgroundColor: constants.GREYORANGE, borderBottomLeftRadius: 0, borderTopLeftRadius: 0}}/>
        <View style={{flex:remainingPercent, marginRight: 0, paddingRight: 0, borderTopRightRadius: 40, borderBottomRightRadius: 40,backgroundColor: constants.PINK_BACKGROUND_OPAQUE, borderColor: constants.GREYORANGE, borderWidth: 1,height: barHeight,}}>
</View>
</View>
</View>
<View style={{alignItems: 'center',paddingTop: 10, justifyContent: 'center'}}>
  <Text style={{color:'black', marginBottom: 10, textAlign: 'center', alignSelf: 'center'}}>Increase to own more and use more.</Text>
  <View style={{width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 50, position: 'absolute', right: 25, borderWidth:1, borderColor: constants.LAVENDER}}>
    <TouchableOpacity onPress={()=>{
      setInfoModal(true);
    }}>
  <Icon name="info" size={10} color={constants.LAVENDER} />
  </TouchableOpacity>
  </View>
  </View>
    <AnimatedModal colored={true} colors={[constants.PEACH, constants.GREYORANGE]} nested={true} visible={infoModal} close={()=>{setInfoModal(false)}}>
      <HowTo />

    </AnimatedModal>
  </>;
}


const MemberPics = ({memberIds}) => {
  const [collapsed, setCollapsed] = useState(false);
  
  const [membersData, setMembersData] = useState([]);

  console.log(membersData, memberIds);
  useEffect(()=>{
    console.log(memberIds, 'undefined?');
    fetch('https://us-central1-flock-46ffc.cloudfunctions.net/getUsers', {
      method: 'POST',
      body: JSON.stringify({"membersIds": memberIds || []}),
      headers: { 'Content-Type': 'application/json' }
  }).then(res => res.json()
  .then((json)=>{
    setMembersData(json.result);
  }).catch((err)=>console.log('error one',err))
  ).catch(err=>console.log('errrorrr',err))
    
  },[]);
  // return <Text>hi</Text>
  return <View
  style={{
    width: '100%',
    top: 0,

    //backgroundColor: constants.TRANSLUCENT,
    // borderBottomLeftRadius: 15,
    // borderBottomRightRadius: 15,
  }}>
    

  
          <TouchableOpacity onPress={()=>{ setCollapsed(!collapsed); }}>
            <Text style={{marginLeft: 20, marginTop: 10}}>Your co-flockers <Icon name="chevron-down" /></Text>
          </TouchableOpacity>
  <View style={{marginHorizontal: 20}}>
  {/* <Countdown dateObj={route.params.data.time} fontSize={18} /> */}
  
  <Collapsible collapsed={collapsed}>
    <ScrollView horizontal >
  {membersData.map((item)=>{
    const name = item.displayName;
    const picture = item.photoURL;
  return <View key={item.displayName}>
  <Image
  defaultSource={constants.PLACEHOLDER_IMAGE}
    style={{
      height: 46,
      marginRight: 10,
      marginTop: 10,
      width: 46,
      borderWidth: 3,
      borderColor:
        'transparent',
      borderRadius: 50,
    }}
    source={{uri: picture}}
  />
  <Text
    numberOfLines={1}
    style={{
      color: 'black',
      fontSize: 10,
      width: 48,
      textAlign: 'center',
      overflow: 'hidden',
    }}>
    {name}
  </Text>
</View>;
  })}
      </ScrollView>
      </Collapsible>
  </View>

</View>
};

const PreCheckout = ({visible, stripehook}) => {
  useEffect(()=>{
      Alert.alert('test precheckout');

  }, [visible])

  return <></>
}

const data = {
  0: {
    flock: 'squad up',
    id: '0',
    buys: [
      {
        title: 'Game boy',
        url: null,
        price: '24.99',
        buyers: ['xxxHacker', 'jasonny'],
      },
      {
        title: 'Nintendo Switch',
        url: null,
        price: '300.99',
        buyers: [
          'xxxHacker',
          'jasonny',
          'danielpark',
          'Qrowsaki',
          'Me',
          'Hello',
        ],
      },
    ],
    boughts: [],
    friends: ['xxxHacker', 'stupidbro', 'jasonny', 'danielpark', 'Qrowsaki'],
    messages: [],
  },
  1: {
    flock: 'church friends',
    id: '1',
    buys: [],
    boughts: [],
    friends: ['Qrowsaki'],
    messages: [],
  },
};

var didFlockTakeOff = (maximums, totalPrice) => {
  var sumTotal = 0;
  var ar = Object.entries(maximums);
  for (const item of ar) {
    var entry = item[1];
    // entry = entry.replace("$","").replace("-","");
    sumTotal += parseFloat(entry);
  }
  return sumTotal >= totalPrice;
}
var splitAlgorithm = (members, maximums, totalPrice) => {


  var splitFunc = (currIndex, completed) => {
  if (completed.length == 0) return null;
  if (satisfy(completed)) return completed;
  if (currIndex >= members.length) {
  return null;
  }
  var r1, r2;

  r1 = splitFunc(currIndex+1, completed=[...completed, members[currIndex]]);

  r2 = splitFunc(currIndex+1, completed=[...completed])
  return r2 || r1;
  }

  var satisfy = (ar) => {
  var works = true;
  const split = totalPrice / ar.length;
  for (var item of ar) {
  if (maximums[item.uid] < split) works = false;
  }

  return works;
  }

  var res = splitFunc(1, [members[0]]);
  return res;
}
export default ChatInterface;
