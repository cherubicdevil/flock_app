import React, {useEffect, useState, useRef,Fragment} from 'react';
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
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

import {constants} from 'App/constants';
import Wrapper from 'App/components/Wrapper';
import Countdown from 'App/components/Countdown';
import StripeCheckout from 'App/code/stripe/StripeCheckout';

import ChatComponent from './ChatComponent';

const barHeight = 25;
var initialPercentTemp;

function Group({route, navigation}) {
  const [stripeHook, setStripeHook] = useState(()=>()=>{});
  const chatColor = route.params.data.completed?constants.LAVENDER:constants.ORANGE;
  const chatColors = route.params.data.completed?[constants.LAVENDER, constants.PURPINK]:[constants.PEACHBG, constants.PEACHBG];

  const [datapath, _] = useState({collection: "chatGroups", doc: route.params.data.id});
  const [data, setData] = useState(route.params.data);
  const [partOf, setPartOf] = useState(null);
  const [currentUser, setCurrentUser] = useState();
  const [addToGroup, setAddToGroup] = useState(()=>{});

  const select = useSelector((state) => state);

  const set4Percent = () => {

  }

  const updateNumberConfirmed = () => {

  }

  useEffect(()=>{
    if (select?.auth?.guest) {
      navigation.replace("Login");
      return;
    }
  },[])

  useEffect(()=>{
    data.memberIds = Object.entries(data.splits).keys();
    if (currentUser) {
      setPartOf(currentUser.uid in data.memberIds);
    }
  }, [data.splits, currentUser]);

  const joinGroup = (splits, currentUserId, userSplit, paymentIntent) => {
    db.collection('chatGroups').doc(data.id).update({
      splits: {...data.splits, [au.currentUser.uid]:splitFrac},
      // paymentIntents: {...data.paymentIntents, [au.currentUser.uid]: stripeContext.paymentIntentId},
    });
  }
  
  return (<>
  <User setUser={setCurrentUser} />
  <Wrapper header footer headerLeft=["back"] headerRight=["share", data.id]>

      <ChatEntry navigation={navigation} />
  </Wrapper>
      <AddToGroup user={currentUser} path={datapath} splits={data.splits} setHook={addToGroup} />
      <RemoveFromGroup user={currentUser} path={datapath} splits={data.splits} setHook={removeFromGroup} />
      <FirebaseListener path={datapath} setData={setData} />
      <Confirmer splits = {data.splits} productId = {data.productId} />
      </>
  );
}

const JoinButton = ({data, visible, onPress}) => {
  return <View style={{width: '100%', height: 100, backgroundColor: 'white'}}><View style={{height: '100%', backgroundColor: constants.PINK_BACKGROUND }}>
        <TouchableOpacity style={{width: '90%', height: 50, backgroundColor: constants.ORANGE, alignSelf: 'center', borderRadius: 30, justifyContent: 'center'}} onPress={()=>{
          // setInitialDialog(true);
          // the above commented out for now...
          // instead directly give it 4%
          onPress();
          // setCreditModal(true);
      }}><Text style={{color: 'white', alignSelf: 'center', fontWeight: 'bold'}}>JOIN</Text>
      </TouchableOpacity></View></View>;
}

const LeaveButton = ({data, visible}) => {
  if (!visible) {
    return <></>;
  }
  return <TouchableOpacity onPress={()=>{
        if (data.memberIds.length == 1) {
          Alert.alert("You are the only one in this flock. Leaving will end this flock.")
        }
        delete (data.maximums)[au.currentUser.uid]
        db.collection('chatGroups').doc(data.id).update({
          maximums: {...data.maximums},
      });
      }}>
<Text>LEAVE</Text>
      </TouchableOpacity>
}


export default Group;
