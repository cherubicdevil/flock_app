import React, {useState, useRef, useEffect} from 'react';
import {View, ScrollView, Text, Switch, TextInput, Image, KeyboardAvoidingView,Dimensions, TouchableOpacity, Alert} from 'react-native';
import ProgressHeader from 'App/components/ProgressHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {constants} from 'App/constants';
import LinearGradient from 'react-native-linear-gradient';
import {shareActions} from 'App/utils';
import {useDispatch, useSelector} from 'react-redux';
import ViewShot from 'react-native-view-shot';
import Animation from 'lottie-react-native';
import {firebase, db, au} from 'App/firebase/config';
import ShareSocial from 'App/components/ShareSocial';
import { set } from 'react-native-reanimated';
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import PriceSlider from 'App/components/PriceSlider';
import AnimatedModal from 'App/components/AnimatedModal';
import SmartCheckout from 'App/components/SmartCheckout';
import Icon from 'react-native-vector-icons/FontAwesome';
import WebView from 'react-native-webview';
import Wrapper from 'App/components/Wrapper';

import StripeCheckout from 'App/components/StripeCheckout';


const StartFlock = ({navigation, route}) => {
    const flockId =  route.params.flockId;
    // useFocusEffect(()=>{
    //         setFlockId((Math.random()*10000).toFixed(0));
    //     // return ()=>{
    //     //     setFlockId(undefined);
    //     // }
    // },[route.params.data]);
    const dispatch = useDispatch();
    const select = useSelector(state=>state.userInfo);
    const [canNext, setCanNext] = useState(true);
    const [stripeHook, setStripeHook] = useState(()=>()=>{
        console.log('hello')
    });

    const [creditEmail, setCreditEmail] = useState(select.email);
    const [localEmail, setLocalEmail] = useState(creditEmail);
    const [creditModal, setCreditModal] = useState(false);


    const Tab = createMaterialTopTabNavigator();

    useEffect(()=>{
        console.log('adsfasdfaf mount startflock')
    },[])
    useEffect(()=>{
        setCreditEmail(select.email);
        
    }, [select]);
    var ar = [<PageOne product = {route.params.product} data = {route.params.data} setCanNext={setCanNext} />, <PageTwo product = {route.params.product} data = {route.params.data} setCanNext={setCanNext} />, <ShareSocial product = {route.params.product} data = {route.params.data} flockId={flockId} />, <PageFour product = {route.params.product} data = {route.params.data} />];
    return <Wrapper><ScrollView scrollEnabled={false} keyboardShouldPersistTaps="never" style={{backgroundColor: constants.PINK_BACKGROUND}}>
    <StripeCheckout amount={5.00} setHook={setStripeHook} delayedCharge={true} />
    <ProgressHeader
    idText={"id: %"+flockId}
    nextRoute="StartFlock"
    backRoute="StartFlock"
    headerText="Start a Flock"
    goBack={true}
    canGoNext={canNext}
    navigation={navigation}
    index={route.params.index}
    number={3}
    checkIndex={1}
    checkFunc = {()=>{
        // return select.customerId !== "none" && select.customerId !== undefined && select.email !== "";
        return select.hasCard;
    }}
    checkOpen={()=>{
        navigation.navigate("Disclaimer", {after: () => {
            // setCreditModal(true);
            // console.log('type of ', typeof(stripeHook))
            stripeHook();
        }});
    }}
    data={route.params.data}
    closeText="done"
    closeFunc={()=> {
        
        const user  = firebase.auth().currentUser;
        const salt = Math.random(100).toFixed(10);
        route.params.product.id = "%"+flockId;
        const data = {
            specifications: route.params.data.specifications,
            description: route.params.data.description,
          name: 'testNew'+salt,
          flock: 'testNew'+salt,
          product: route.params.product,
          completed: false,
          // FLOCK_BUG use id later, for now use title
          productTitle: route.params.product.title,
          messages: [],
        //   createdAt: Date.now(),
          
          time: Math.round(Date.now() / 1000),
          members: [{name: user.displayName, uid: user.uid}],
          memberIds: [user.uid],
          likes: 0,
          comments: 0,
          id: flockId,
        };
        // const maximums = [{}];
        // maximums[0][user.uid] = route.params.data.maxPrice;
        // data["maximums"] = maximums;

        const maximums = {};
        maximums[user.uid] = route.params.data.maxPrice;
        data["maximums"] = maximums;


        // firebase.firestore().collection("chatGroups").add(data).then((docRef)=>{
        //     data["id"] = docRef.id;
        //     db.collection('users').doc(firebase.auth().currentUser.uid).update({
        //         chatIds: firebase.firestore.FieldValue.arrayUnion(docRef.id)
        //       });
        //     dispatch({type: "UPDATE_DATA", payload: ["chatIds", "add", "array", docRef.id]});
        //     dispatch({type: "UPDATE_DATA", payload: ["chatGroups", "add", "array", data]});
        // });
        //navigation.navigate("Carousel");
        firebase.firestore().collection("chatGroups").doc(flockId).set(data).then((docRef)=>{
            // data["id"] = docRef.id;
            // console.log(docRef.id, "IDDDDDD");
            db.collection('users').doc(firebase.auth().currentUser.uid).update({
                chatIds: firebase.firestore.FieldValue.arrayUnion(docRef.id)
              }).catch(err=>{
                  console.log("NESTED ERROR", err);
              });
            // dispatch({type: "UPDATE_DATA", payload: ["chatIds", "add", "array", docRef.id]});
            // dispatch({type: "UPDATE_DATA", payload: ["chatGroups", "add", "array", data]});
        }).catch(err=>{
            console.log("make start flock eeorr", err);
        });

        // navigation.dispatch(
        //     CommonActions.reset({
        //       index: 2,
        //       routes: [
        //         { name: 'Product', params:{album: route.params.product, data: route.params.data, id: route.params.data.id} },
        //         { name: 'Carousel'},
        //         {name: 'ChatInterface', params:{data:data}},
        //       ],
        //     })
        //   );
        navigation.goBack();
    }}
  />
  <View style={{backgroundColor: 'white', overflow: 'hidden', marginTop: 10, backgroundColor: 'white', borderBottomLeftRadius: 40, borderBottomRightRadius: 40}}>
    {ar[route.params.index]}
    </View>
    <View style={{marginTop: 10, width: '90%', alignSelf: 'center'}}>
        <Text style={{textAlign: 'center'}}>
            Start a Flock
        </Text>
        <Text style={{marginTop: 20}}>Want a specific size, color, or specification? Start your own flock!</Text>
        <Text style={{marginTop: 20}}>When enough flockers join and ownership reaches 100%, your flock takes flight!</Text>
        <Text style={{marginTop: 20}}>We will order the item. When you want to use it, just choose the dates, and it will be shipped to you.</Text>
        <Text style={{marginTop: 20}}>When another flocker requests it, you will ship it to them using the shipping label we provide.</Text>
    </View>
    <AnimatedModal upPercent="70%" colored={true} colors={[constants.ORANGE, constants.GREYORANGE]} nested={false} visible={creditModal} close={()=>setCreditModal(false)} 
     >
       <KeyboardAvoidingView behavior="position" style={{flex: 1}} keyboardVerticalOffset={-200}>
<ScrollView>
        
       <SmartCheckout billingOnly={true} 
       navigation={navigation}
       delayedCapture = {true}
       cancelFunc={()=>{
           setCreditModal(false);
       }}

       allowConfirm={(creditChanged, shippingChanged, hasId)=>{
         const validEmail = (em)=>{
          return em !== "" && em !== undefined && em.indexOf("@") != -1;
         }
         console.log("valid email????", validEmail(localEmail));
         console.log((creditChanged || hasId) && validEmail(localEmail))
         if (!(creditChanged || hasId)) {
             return {allowed: false, errorMessage: "Please fill out billing info."}
         }
         if (!validEmail) {
             return {allowed: false, errorMessage: "Please input a valid email."};
         }
         return {allowed: true, errorMessage: 'shoulndt happen here'};
       }} 
       
       confirmFunc={(customerId)=>{
        //  au.currentUser.updateEmail(creditEmail);
        dispatch({type:'UPDATE_DATA', payload: ["email", null, null, localEmail]});
        db.collection('users').doc(au.currentUser.uid).update({
          email: localEmail,
        });
        //  console.log("dAtA",data);
        //  route.params.data.maxValue = priceValue;
         // console.log('route  id', route.params.data.id);
        //  db.collection('chatGroups').doc(data.id).update({
        //   //  members: firebase.firestore.FieldValue.arrayUnion(memberInfo),
        //    memberIds: firebase.firestore.FieldValue.arrayUnion(au.currentUser.uid),
        //    maximums: data.maximums,
        //  });
    //   data.memberIds.push(au.currentUser.uid);
//   setTimeout(()=>{
//     navigation.navigate("ChatInterface", {data:{...route.params.data}});
//   }, 500);
    // navigation.navigate("ChatInterface", {data:route.params.data});
    setCreditModal(false);
    setCreditEmail(localEmail);

  // setCreditModal(false);
       }} 


       cancelFunc={()=>{
            setCreditModal(false);
       }}
       >
         <View style={{marginHorizontal: 30, marginTop: 10}}>
         <Text>Email</Text>
         <TextInput keyboardType="email-address" style={{paddingLeft: 20, borderWidth: 1, borderColor: constants.DARKGREY, borderRadius: 40, paddingVertical: 5, marginTop: 15}} keyboardType="email-address" defaultValue={au.currentUser.email} 
         value={localEmail}
         onChangeText={(text)=>{
          setLocalEmail(text.toLowerCase());
         }}
         />
         </View>
       </SmartCheckout>
       <View style={{marginHorizontal: 30, marginTop: 20}}>
              <Text >
              * Your credit card will only be charged if combined ownership reaches 100%. You can change how much you want to pay any time before the flock takes off.
       </Text>
       <Text style={{marginTop: 20}}>
         ** Your email is necessary for receiving receipts and tracking updates.
       </Text>
       </View>
       
       </ScrollView>
       </KeyboardAvoidingView>
       </AnimatedModal>
  </ScrollView></Wrapper>
}

const PageOne = ({product, data, setCanNext}) => {
    const [can1, setCan1] = useState(data['specifications']!==undefined && data['specifications'].length > 0);
    const [can2, setCan2] = useState(data['description']!==undefined && data['description'].length > 0);

    const [openWebView, setOpenWebView] = useState(false);
    const webViewRef= useRef();
    
    useEffect(()=>{
        // setCanNext(can1 && can2);
        setCanNext(can1);
    }, [can1,
        //  can2
        ]);

    return <View style={{width:'100%', backgroundColor: 'white', marginTop: 5, padding: 20}}>
        <InputText data = {data} title = "specifications" numLines = {2} setCanNext={setCan1} placeholder = "If not applicable, type N/A" label="List specifications like size and color if applicable." />
        <View style={{marginBottom: 20}}>
            <TouchableOpacity onPress={()=>setOpenWebView(true)} >
            <Text style={{color:constants.LIGHTGREY}}>Don't remember the sizes? Click me.</Text>
            </TouchableOpacity>
        </View>
        <InputText data = {data} title = "description" numLines = {4}  setCanNext={setCan2}  placeholder = "What do you want others to know? Hype it up so they complete your flock!" label="Message"/>
        <TouchableOpacity onPress={()=>{
            setOpenWebView(true);
        }}>
        <ProductPreview product = {product} toggle={true} egg={true} />
        </TouchableOpacity>

<AnimatedModal noPadding={true} nested={true} upPercent="80%" colored={true} colors={[constants.ORANGE, constants.PEACH]} visible={openWebView} close={()=>setOpenWebView(false)}>
        <View style={{flex: 1}}>
        <WebView source={{uri: product.url}} 
        onShouldStartLoadWithRequest={(request)=>{
            return request.url === product.url;
        }}
        ref={webViewRef}
        startInLoadingState={true}
        onNavigationStateChange={(event) => {
            if (event.url !== product.url) {
            //   webViewRef.current.stopLoading()
              Alert.alert('Please finish creating your flock before shopping more.');
              webViewRef.current.goBack();
            }
          }}
        />
        </View>
</AnimatedModal>
    </View>;
}

const PageTwo = ({product, data, setCanNext}) => {
    console.log("DATA", data);

    const [openInfo, setOpenInfo] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");
    const [priceValue, setPriceValue] = useState((1.4 * product.price / 2).toFixed(2));


    const select = useSelector(state=>state.userInfo);

    useFocusEffect(()=>{
        setCanNext
    }, []);
    
    console.log("newPCE", priceValue);
    // data['maxPrice'] = priceValue;
    var initialMax;
    if (!data['maxPrice']) {
        initialMax = priceValue;
    } else {
        initialMax = data['maxPrice'];
    }
    const maxPricePercentage = Math.round(100 * parseFloat(initialMax) / (1.4 * parseFloat(product.price)));
    data['maxPrice'] = priceValue;
    return <View style={styles.container}>
        <Text style={{color: 'red'}}>{errorMessage}</Text>
        <View style={{marginBottom: 20}}>
    <Text style={{fontWeight: 'bold'}}>Choose how much you want to own. 
    {/* Minimum: ${(product.price/25 * 1.4).toFixed(2)}. */}
    </Text>
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
    {/* <Text style={{color: constants.DARKGREY, fontSize: 14}}>Why is the maximum higher?</Text>
    <TouchableOpacity onPress={()=>{
        setOpenInfo(true);
    }}>
    <View style={{justifyContent: 'center', alignItems: 'center', borderRadius: 20, width: 15, height: 15, marginLeft: 5, borderWidth: 1, borderColor: constants.DARKGREY}}>
    <Icon name="question" size={12} color={constants.DARKGREY} />

    </View></TouchableOpacity> */}
    </View>
    </View>
    <PriceSlider showInfo={false} priceShareInitialPercent={maxPricePercentage} productPrice ={product.price} othersPercent={0} remainingPercent={68} maximums={{}} setOutsideState={setPriceValue} confirm = {false} initialSlider={true} />
    
    

    <Text style={{marginTop: 20, marginBottom: 20, }}>The more you pay, the more you own, and the more frequently you can use this item compared to your co-flockers.</Text>
    <ProductPreview product = { product } />
    
    <AnimatedModal visible={openInfo} colored = {true} colors={[constants.PEACH, constants.ORANGE]} nested={true} close={()=>{setOpenInfo(false)}} >
        <View style={{marginLeft: 20, marginRight: 20}}>
            <Text style={{textAlign: 'center', fontWeight: 'bold'}}>
                Why is the Max Higher than the Retail Price?
            </Text>
            <Text style = {{marginTop: 20}}>
                The markup for the total price takes care of shipping fees, cleaning fees, and storage fees.
            </Text>
            <Text style = {{marginTop: 20}}>
                But don't worry, the total doesn't affect how much you choose to pay, you do! Choose your price. Other flockers will flock to you, and together you'll reach the total.
            </Text>
            <Text style = {{marginTop: 20}}>
                It doesn't matter how expensive the item is. When you flock, you can buy anything.
            </Text>
        </View>
    </AnimatedModal>
    </View>
}



const PageFour = () => {
    return <Text>Test 4</Text>
}

const InputText = ({numLines, data, title, placeholder, label, setCanNext, defaultValue=""}) => {
    console.log(data[label]);
    // data[title] = defaultValue;

    const [textValue, setTextValue] = useState(data[title]);
    return <View style={{marginBottom: 10}}><Text style={{fontWeight: 'bold'}}>{label}</Text>
    <View style={{marginTop: 5, borderColor: "grey", borderRadius: 80, paddingHorizontal: 25, paddingTop: 5, borderWidth: 1, height: numLines * 25}}>
    <TextInput
    value={textValue}
    onChangeText={(text)=>{
        setTextValue(text);
        if (text === "") {
            setCanNext(false);
        } else {
            setCanNext(true);
        }
    }}
    defaultValue={data[title]} blurOnSubmit placeholder={placeholder}  multiline numberOfLines = {numLines} onBlur = {(e)=> {
        console.log("BLUR", e.nativeEvent.text);
        data[title] = e.nativeEvent.text;
        if (e.nativeEvent.text !== "") {
            setCanNext(true);
        }
    }} />
    </View>
    </View>
}

const BasicInputText = ({setOutsideValue=()=>{},numLines=1, numeric, data, placeholder, label, title, defaultValue="", setFunc=()=>{}}) => {
    
    console.log(data[label]);
    data[title] = defaultValue;
    const [dataValue, setDataValue] = useState(data[title] || defaultValue);
    console.log(dataValue, "why no change?");
    return <TextInput
    // contextMenuHidden={numeric}
    keyboardType={numeric?"numeric":"default"}
    defaultValue={data[title] || defaultValue} blurOnSubmit placeholder={placeholder} onBlur = {(e)=> {
        console.log("BLUR", e.nativeEvent.text);
        data[title] = e.nativeEvent.text;
    }} 
    value={(typeof dataValue)==="string"?dataValue:dataValue.toFixed(2)}
    onChangeText={(text)=>{
        if (numeric) {
            console.log("THis is undefined?", parseInt(text.replace(".",""))/100);
            if (text === "") {
                setDataValue("");
            } else {
                setDataValue(parseInt(text.replace(".",""))/100);
            }
            setFunc(text);
            setOutsideValue(text);
        } else {
            setDataValue(text);
        }
    }}
    
    />;
}

const ProductPreview = ({product}) => {
    return <View style={{flexDirection: 'row'}}>
        <Image style={{width: 50, height: null, marginRight: 10}} source={{uri: product.image}} />
        <View style={{flex:1}}>
            <Text style={{fontWeight: 'bold'}}>{product.title}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 15}}>
            <Text style = {{textDecorationLine: 'line-through', color: constants.ORANGE, marginRight: 10,}}>${product.price}</Text>
            {/* <LinearGradient
          colors={[constants.YELLOW, constants.ORANGE]}
          start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 30,
            //alignItems: 'center',
            paddingVertical: 5,
            width: 130,
            alignItems: 'center'
          }}> */}
              <Text style={{color: constants.ORANGE, fontSize: 14, fontFamily: constants.FONT}}>{"$" + (product.price / 25 * 1.4).toFixed(2) + " to flock"}</Text>
{/* </LinearGradient> */}
</View>
        </View>
        
    </View>
}



const styles = {
    container: {width:'100%', backgroundColor: 'white', marginTop: 5, padding: 20},
    inputBox: {borderColor: "grey", paddingLeft: 15, borderRadius: 80, borderWidth: 1, paddingLeft: 30, paddingRight: 30}
};

export default StartFlock;