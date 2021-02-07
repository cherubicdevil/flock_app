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
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
// import Slider from '@react-native-community/slider';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Dialog from 'react-native-dialog';
import {firebase, db, auth} from 'App/firebase/config';
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

  const [creditModal, setCreditModal] = useState(false);
  const [priceShare, setPriceShare] = useState(route.params.data.maximums[auth.currentUser.uid] || 0);
  const [initialDialog, setInitialDialog] = useState(false);
  const [remainingPercent, setRemainingPercent] = useState(0);

  useEffect(()=>{
    setPriceShare(route.params.data.maximums[auth.currentUser.uid]);
  }, [route.params.data]);
  useFocusEffect(()=>{
    const unsub = db.collection('chatGroups').doc(route.params.data.id).onSnapshot(docSnapshot => {
      const data = docSnapshot.data();
      const members = data.memberIds;
      const maximums = data.maximums;
      var remaining = route.params.data.product.price;
      for (const m of members) {
        if (m != auth.currentUser.uid) {
        remaining -= maximums[m];
        }
      }
      // console.log(remaining/route.params.data.product.price);
      setRemainingPercent(Math.round(100 * remaining/route.params.data.product.price));
    }, err => {
      console.log(`Encountered error: ${err}`);
    });

    return ()=>{
      unsub();
    }
  },[])
  const completeFunc = (customerId) => {
    // send to socket, which pushes a broadcast
    // test signal, send test, on receive, console log "RECEIVED"
    // condition
    // FLOCK_UPDATE

    // const res = splitAlgorithm(route.params.data.members, route.params.data.maximums, route.params.data.product.price)
    const flockTookOff = didFlockTakeOff(route.params.data.members, route.params.data.maximums, route.params.data.product.price);
    if (flockTookOff) {
    socket.current.emit('complete', route.params.data.id);
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
      ...route.params.data,
      customerId: customerId,
      chatId: route.params.data.id,
      userId: auth.currentUser.uid,
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
  const store = useStore();
  const select = useSelector((state) => state);
  const socket = useRef(null);
  const [recvMessages, setRecvMessages] = useState(route.params.data.messages);
  //const [recvMessages, setRecvMessages] = useState([testSystemMessage]);
  const [dummyState, setDummyState] = useState(0);
  const dispatch = useDispatch();
  //firebase.firestore().collection("posts").get();
  useEffect(function () {
    //firebase.firestore().collection("posts").get();
    eventify(systemMessages, (message) => {
      console.log('adding');
      setRecvMessages((prevState) => GiftedChat.append(prevState, message));
    });
    //socket.current = io('https://enigmatic-bastion-86695.herokuapp.com/');
    socket.current = io('http://10.0.0.228:5000');
    console.log('WHY IS THIS RUNNING AGAIN');
    socket.current.emit('join', route.params.data.id);
    socket.current.on('message', (message) => {
      console.log(message);
      setRecvMessages((prevState) => GiftedChat.append(prevState, message));
    });
    socket.current.on('complete', () => {
      console.log('completingggg');
      navigation.navigate('FlockSuccess', {data: route.params.data});
    });
    console.log("MESSAGES");
    setRecvMessages(route.params.data.messages);
    dispatch({type: 'emptySystemMessages'});
  }, []);

  useEffect(() => {
    for (const message of select.chat.systemMessages) {
      setRecvMessages((prevState) => GiftedChat.append(prevState, message));
    }
  }, [select.chat.systemMessages]);

  // const setRecvMessages = (messages) => {
  //   recvMessages = messages;
  //   setDummyState(!dummyState);
  // };
  const onSend = (messages) => {
    if (route.params.data.id === 'self') {
      setRecvMessages((prevState) => GiftedChat.append(prevState, messages));
      return;
    }
    socket.current.emit('message', {
      text: messages[0].text,
      id: route.params.data.id,
    });
    console.log(route.params.data);
    updateCache(route.params.data.id, recvMessages);
      //data["id"] = docRef.id;
      console.log("DAT", route.params.data);
      db.collection('chatGroups').doc(route.params.data.id).update({
          messages: firebase.firestore.FieldValue.arrayUnion({sender: {name: firebase.auth().currentUser.displayName, uid: firebase.auth().currentUser.uid}, ...messages[0]}),
        });
        //console.log("messages format",recvMessages);
    setRecvMessages((prevState) => GiftedChat.append(prevState, messages));
  };

  console.log(route.params.data);
  const user = firebase.auth().currentUser;
  var part = false;
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
      route.params.data.maximums[auth.currentUser.uid] = dataValue;
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
  
  console.log("PARTOF?", partOf, part);
  // console.log("prices", priceShare, route.params.data.product.price, parseFloat(priceShare) / parseFloat(route.params.data.product.price) * 100);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      
<HeaderView navigation={navigation} route={route} />
      <View style={{ position: 'absolute', zIndex: 200, top: 100, width: '100%', borderRadius: 0, borderBottomRightRadius: 70, borderBottomLeftRadius: 70}}>
      <View style={{
        // shadowColor: "#ff7009", shadowOffset: {height: 0, width: 0}, shadowOpacity: 0.42, elevation: 13, shadowRadius: 28.30,
       borderBottomLeftRadius: 70, borderBottomRightRadius: 70}}>
      <ScrollView scrollEnabled={false} keyboardShouldPersistTaps="never" >
      <LinearGradient
          colors={[constants.PEACHBG, constants.PEACHBG]}
          start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
          style={{
            borderRadius: 20,
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
            
            {part?<PriceText remainingPercent={remainingPercent} priceShareInitialPercent={parseFloat(priceShare) / parseFloat(route.params.data.product.price) * 100} completeFunc={completeFunc} productPrice={route.params.data.product.price} />:<></>}
            </View>
            <TouchableOpacity onPress={()=>{
              navigation.navigate("Product", {album: route?.params?.data?.product, id: route?.params?.data?.id});
            }}>
            <View style={{flexDirection: 'row', padding: 20, marginBottom: 15, paddingLeft: 30, borderRadius: 50, shadowRadius: 2.62, backgroundColor: 'white', shadowOpacity: 0.23, shadowOffset:{height: 2,width:0}, elevation: 1}}>
            <Image style={{width: 50, height: 50}} source={{uri: route.params.data.product.image}} />
            <Text>{route.params.data.product.title}</Text>
            </View>
            </TouchableOpacity>
          </LinearGradient>
          </ScrollView>
        </View>
      <View style={{marginTop: 20, flexDirection: 'row'}}>
        <Image style = {{width: 40, height: 40}} source ={constants.PLACEHOLDER_IMAGE } />
        <View style={{borderRadius: 30, flex: 1, backgroundColor: constants.GREYBLUE, padding: 20, marginRight: 20, shadowColor: constants.GREYBLUE, shadowOffset: {height: 10, width: 0}, shadowOpacity: 0.82, elevation: 13, shadowRadius: 18.30,}}>
          <View>
            <Text>Important Size and Specification requirements:</Text>
            <View style={{borderWidth: 1}}>
              <Text>{route.params.data.specifications}</Text>
            </View>
          {/* <Text>{route.params.data.description}</Text> */}
          </View>
          </View>
      </View>
      </View>
      
      <View style={{backgroundColor: constants.PINK_BACKGROUND, flex: 1}}>
      <GiftedChat
      
        renderSystemMessage={(props) => {
          //console.log("SYSTEM MESSAGE PROPS", props);
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Info', {
                  openId: props.currentMessage.openId,
                });
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  //borderWidth: 1,
                  shadowOpacity: 0.2,
                  shadowOffset: {height: 5, width: 2},
                  backgroundColor: '#22a',
                  borderRadius: 2,
                  paddingRight: 15,
                  paddingLeft: 15,
                  paddingTop: 10,
                  paddingBottom: 10,
                  alignSelf: 'center',
                  marginBottom: 10,

                  width: '75%',
                }}>
                <Text style={{textAlign: 'center', color: 'white'}}>
                  {props.currentMessage.text}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        messages={recvMessages}
        onSend={onSend}
        user={{_id: 1}}
      /></View>
      <Dialog.Container visible={initialDialog}>
    <Dialog.Title>Set Your Price</Dialog.Title>
    <Dialog.Description>
      You will not be charged immediately, only if and when the flock completes.
    </Dialog.Description>
    <Dialog.Button label="Cancel" onPress={()=>{
      setInitialDialog(false);
    }}/>
    <Dialog.Button label="Confirm" onPress={()=>{
      if (store.getState().userInfo.customerId !== "none") {
        const memberInfo = {name: auth.currentUser.displayName, uid: auth.currentUser.uid, max: priceShare};
        db.collection('users').doc(auth.currentUser.uid).update({
          chatIds: firebase.firestore.FieldValue.arrayUnion(route.params.data.id)
        });
        route.params.data.maximums[firebase.auth().currentUser.uid] = 100;
        db.collection('chatGroups').doc(route.params.data.id).update({
          members: firebase.firestore.FieldValue.arrayUnion(memberInfo),
          memberIds: firebase.firestore.FieldValue.arrayUnion(memberInfo.uid),
          maximums: route.params.data.maximums,
        });
        setPartOf(true);
      dispatch({type: "UPDATE_DATA", payload: ["chatIds", "add", "array", route.params.data.id]});
      dispatch({type: "UPDATE_DATA", payload: ["chatGroups", "add", "array", route.params.data]});
        route.params.data.members.push(memberInfo);
        completeFunc(store.getState().userInfo.customerId);
      } else {
        setCreditModal(true);
      }
      setInitialDialog(false);
    }}/>
  </Dialog.Container>
      {partOf?<></>:<View style={{position: 'absolute', bottom: 0, width: '100%', height: 100, backgroundColor: 'white'}}><View style={{height: '100%', backgroundColor: constants.PINK_BACKGROUND }}>
        <TouchableOpacity style={{width: '90%', height: 50, backgroundColor: constants.ORANGE, alignSelf: 'center', borderRadius: 30, justifyContent: 'center'}} onPress={()=>{
          setInitialDialog(true);
      }}><Text style={{color: 'white', alignSelf: 'center', fontWeight: 'bold'}}>JOIN</Text></TouchableOpacity></View></View>}
    <AnimatedModal visible={creditModal} close={()=>setCreditModal(false)} navigation={navigation} content={<Checkout navigation={navigation} route={route} doneFunc={(token)=> {
      fetch(constants.CUSTOMER_ENDPOINT + "?token=" + token).then((response)=>response.json().then((res)=> {
        console.log(res.id, "customerid");
        dispatch({type: "UPDATE_DATA", payload: ['customerId',null, null,res.id]})
        db.collection('users').doc(auth.currentUser.uid).update({customerId: res.id});

        const memberInfo = {name: auth.currentUser.displayName, uid: auth.currentUser.uid};
        db.collection('users').doc(auth.currentUser.uid).update({
          chatIds: firebase.firestore.FieldValue.arrayUnion(route.params.data.id)
        });
        route.params.data.maximums[firebase.auth().currentUser.uid] = priceShare;
        db.collection('chatGroups').doc(route.params.data.id).update({
          members: firebase.firestore.FieldValue.arrayUnion(memberInfo),
          maximums: route.params.data.maximums,
        });
        setPartOf(true);
      dispatch({type: "UPDATE_DATA", payload: ["chatIds", "add", "array", route.params.data.id]});
      dispatch({type: "UPDATE_DATA", payload: ["chatGroups", "add", "array", route.params.data]});
        route.params.data.members.push(memberInfo);


        completeFunc(res.id);
        setCreditModal(false);
      }).catch((err)=>{
        console.log(err);
      }));
      
      
      }} price = {0}/>} />
    </SafeAreaView>
  );
}

const PriceText = ({priceShareInitialPercent, completeFunc, productPrice, remainingPercent}) => {
  // console.log(priceShareInitialPercent+"%");
  const [pricePercent, setPricePercent] = useState(priceShareInitialPercent);
  const [changed, setChanged] = useState(false);

  const select = useSelector(state=>state.userInfo);

  console.log('remaining', remainingPercent);

  if (true) {
    // console.log(priceShare, "priceShare");
    return <>
    <View style={{flexDirection: 'row', justifyContent: 'center', }}>
      {changed?<View style={{backgroundColor: constants.DONE, marginRight: 30, justifyContent: 'center', borderRadius: 40, padding: 10}}>
        <TouchableOpacity onPress={()=>{
          setPricePercent(priceShareInitialPercent);
          setChanged(false);
        }}><Text>Cancel</Text></TouchableOpacity>
      </View>:<></>}
    <View style={{alignItems: 'center', width: 175}}>
    <Text style={{color:'black'}}>You are paying</Text>
      <Text style={{fontSize: 18, color: 'black'}}>${(parseFloat(productPrice) * pricePercent/100).toFixed(2)} ({pricePercent}%)</Text>
    </View>
    {changed?<View style={{backgroundColor: constants.DONE, marginLeft: 30, justifyContent: 'center', borderRadius: 40, padding:10}}>
        <TouchableOpacity onPress={()=>{
          completeFunc(select.customerId);
          setChanged(false);
        }}><Text>Confirm</Text></TouchableOpacity>
      </View>:<></>}
    </View>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
    <View style={{borderRadius: 40, backgroundColor: constants.ORANGE, width: 25, height: 25, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={()=>{
          if (pricePercent>=4) {
            setPricePercent(pricePercent-4);
            setChanged(true);
          }
          
        }}>
          <Icon name="minus" color="white" size={20} />
        </TouchableOpacity>
      </View>

    <View style={{flex: 1, flexDirection: 'row', paddingLeft: 10, alignItems: 'center', justifyContent: 'center', alignSelf: 'center'}}>
            <View style={{flex: 100-remainingPercent,  height: 15, backgroundColor: constants.GREYORANGE, borderBottomLeftRadius: 40, borderTopLeftRadius: 40}}/>
          <View style={{flex:remainingPercent, marginRight: 0, paddingRight: 0}}>
          <MultiSlider
          values={[pricePercent]}
          // style={{flex: remainingPercent}}
          onValuesChange={(stuff)=>{
            // setPriceShare((parseInt(stuff[0])/100 * productPrice).toFixed(2));
            setPricePercent(stuff[0]);
            // console.log(stuff);
            setChanged(true);
          }}
  // style={{width: 200, height: 40}}
  // snapped={true}
  markerStyle={{width: 40, height: 40, shadowOpacity:0}}
  selectedStyle={{backgroundColor: constants.BLUERGREY}}
  trackStyle={{height: 15, borderRadius: 20, borderTopLeftRadius: remainingPercent<100?0:20, borderBottomLeftRadius: remainingPercent<100?0:20}}
  // containerStyle={{height: 20}}
  selectedStyle={{backgroundColor:constants.ORANGE}}
  markerContainerStyle={{alignSelf: 'center', marginTop: 7.5}}
  // markerStyle={{marginTop: 15,justifyContent: 'center', alignItems: 'center'}}
  smoothSnapped={true}
  sliderLength={280 * remainingPercent/100}
  step = {4}
  min={0}
  max={remainingPercent+4}
  markerSize={100}
  showSteps={true}
  containerStyle={{width: 30}}
  // markerSize={20}

/>

</View>
<View style={{borderRadius: 40, backgroundColor: constants.ORANGE, width: 25, height: 25, justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity onPress={()=>{
          if (pricePercent < 100) {
            setPricePercent(pricePercent+4);
            setChanged(true);
          }
          
        }}>
          <Icon name="plus" color="white" size={20} />
        </TouchableOpacity>
      </View>
</View>
</View>

    <Text style={{color:'black', marginBottom: 10, textAlign: 'center'}}>Increase to own more and use more.</Text>
    <View style={{flexDirection: 'row'}}>
      
    {/* <Text style={{color:'white', marginBottom: 10}}>Change your payment:</Text> */}
    {/* <ChangePayment data={priceShare} setState={setPriceShare}/> */}
    </View>
    {/* <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Have it now if you  ${(route.params.data.product.price / route.params.data.members.length).toFixed(2)}.</Text>
    <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Want to pay less? Get more people to join!</Text> */}
    </>;

  } else {
    return <><Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>You can have it now if you join for ${(route.params.data.product.price / (route.params.data.members.length+1)).toFixed(2)}.</Text>
    <Text style={{color:'white', marginBottom: 10, fontWeight: 'bold'}}>Want to pay less? Get more people to join!</Text>
    </>;
  }
}

const HeaderView = ({navigation, route}) => {
  const [collapsed, setCollapsed] = useState(true);
  return <View
  style={{
    position: 'absolute',
    zIndex: 90,

    borderBottomColor: '#efefef',
    borderBottomWidth: 1,
    height: 100,
    width: '100%',
    top: 0,

    //backgroundColor: constants.TRANSLUCENT,
    // borderBottomLeftRadius: 15,
    // borderBottomRightRadius: 15,
  }}>
    <LinearGradient
    colors={[constants.TRANSLUCENT, 'white']}
    start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
    style={{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      paddingLeft: 20,
      paddingBottom: 20,
      // borderBottomRightRadius:20,
      // borderBottomLeftRadius: 20,
      //shadowColor: "#ff7009", shadowOffset: {height: 10, width: 0}, shadowOpacity: 0.39, elevation: 13, shadowRadius: 28.30,
      //alignItems: 'center',
    }}>
    
          <TouchableOpacity onPress={()=>{ navigation.goBack()}}><Image style={{width: 35, height: 35}} source = {require('App/Assets/Images/Back_Icon.png')} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={()=>{ setCollapsed(!collapsed); }}>
  <View>
    
  <Text style={{fontSize: 14}}>{route.params.data.flock}</Text>
  <Countdown dateObj={route.params.data.time} />
  <Collapsible collapsed={collapsed}>
    <ScrollView horizontal >
  {route.params.data.members.map((item)=>{
    const buyer = item.name;
    const user = firebase.auth().currentUser;
  return <View>
  <Image
    key={Math.random()}
    style={{
      height: buyer === user.displayName ? 50 : 46,
      marginRight: 10,
      marginTop: 10,
      width: buyer === user.displayName ? 50 : 46,
      borderWidth: 3,
      borderColor:
        buyer === user.displayName ? '#3cf' : 'transparent',
      borderRadius: 50,
    }}
    source={{uri: 'https://placeimg.com/140/140/any'}}
  />
  <Text
    numberOfLines={1}
    style={{
      fontWeight:
        buyer === user.displayName ? 'bold' : 'normal',
      color: buyer === user.displayName ? '#3cf' : 'black',
      fontSize: 10,
      width: 48,
      textAlign: 'center',
      overflow: 'hidden',
    }}>
    {buyer === user.displayName ? 'You' : buyer}
  </Text>
</View>;
  })}
      </ScrollView>
      </Collapsible>
  </View>
  </TouchableOpacity>
  <Button
    title="
      ⓘ"
    onPress={() => {
      navigation.navigate('Info', {
        friends: [],
        data: route.params.data,
      });
    }}
  />
  </LinearGradient>
</View>
};

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

var didFlockTakeOff = (members, maximums, totalPrice) => {
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
