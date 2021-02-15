import React, {useState, useRef, useEffect} from 'react';
import {View, ScrollView, Text, Switch, TextInput, Image, KeyboardAvoidingView} from 'react-native';
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

    const [creditEmail, setCreditEmail] = useState("");
    const [creditModal, setCreditModal] = useState(false);

    const Tab = createMaterialTopTabNavigator();
    console.log('start flock index is', route.params);
    var ar = [<PageOne product = {route.params.product} data = {route.params.data} setCanNext={setCanNext} />, <PageTwo product = {route.params.product} data = {route.params.data} setCanNext={setCanNext} />, <ShareSocial product = {route.params.product} data = {route.params.data} flockId={flockId} />, <PageFour product = {route.params.product} data = {route.params.data} />];
    return <ScrollView scrollEnabled={false} keyboardShouldPersistTaps="never" style={{backgroundColor: constants.PINK_BACKGROUND}}>
    <ProgressHeader
    idText={"%"+flockId}
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
        return select.customerId !== "none" && select.customerId !== undefined && select.email !== "";
    }}
    checkOpen={()=>{
        setCreditModal(true);
    }}
    data={route.params.data}
    closeText="done"
    closeFunc={()=> {
        
        const user  = firebase.auth().currentUser;
        const salt = Math.random(100).toFixed(10);
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
  
       <SmartCheckout billingOnly={true} allowConfirm={(creditChanged, )=>{
         const validEmail = (em)=>{
          return em !== "" && em.indexOf("@") != -1;
         }
         console.log("valid email????", validEmail(creditEmail));
         return creditChanged && validEmail(creditEmail);
       }} confirmFunc={(customerId)=>{
        //  au.currentUser.updateEmail(creditEmail);
        console.log("YYYYYYYYYYYYYYYYY");
        dispatch({type:'UPDATE_DATA', payload: ["email", null, null, creditEmail]});
        db.collection('users').doc(au.currentUser.uid).update({
          email: creditEmail,
        });
         
         data.maxValue = priceValue;
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

  // setCreditModal(false);
       }} 
       cancelFunc={()=>{
         
       }}
       >
         <View style={{marginHorizontal: 30, marginTop: 10}}>
         <Text>Email</Text>
         <TextInput style={{paddingLeft: 20, borderWidth: 1, borderColor: constants.DARKGREY, borderRadius: 40, paddingVertical: 5, marginTop: 15}} keyboardType="email-address" defaultValue={au.currentUser.email} 
         value={creditEmail}
         onChangeText={(text)=>{
          setCreditEmail(text);
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
  </ScrollView>
}

const PageOne = ({product, data, setCanNext}) => {
    const [can1, setCan1] = useState(data['specifications']!==undefined && data['specifications'].length > 0);
    const [can2, setCan2] = useState(data['description']!==undefined && data['description'].length > 0);
    useEffect(()=>{
        setCanNext(can1 && can2);
    }, [can1, can2]);

    return <View style={{width:'100%', backgroundColor: 'white', marginTop: 5, padding: 20}}>
        <InputText data = {data} title = "specifications" numLines = {2} setCanNext={setCan1} placeholder = "Size 4? Size 10? Red? Green?" label="List specifications like size and color if applicable." />
        <InputText data = {data} title = "description" numLines = {4}  setCanNext={setCan2}  placeholder = "What do you want others to know about this product? Hype it up so they join your flock and lower your price!" label="Message"/>
        <ProductPreview product = {product} toggle={true} egg={true} />

    </View>;
}

const PageTwo = ({product, data, setCanNext}) => {


    const [errorMessage, setErrorMessage] = useState("");
    const [priceValue, setPriceValue] = useState((product.price / 2).toFixed(2));

    const select = useSelector(state=>state.userInfo);

    useFocusEffect(()=>{
        setCanNext
    }, []);
    data.maxPrice = priceValue;
    return <View style={styles.container}>
        <Text style={{color: 'red'}}>{errorMessage}</Text>
    <Text style={{fontWeight: 'bold', marginBottom: 20}}>Enter your price. Minimum: ${(product.price/25 * 1.4).toFixed(2)}.</Text>
    
    <PriceSlider priceShareInitialPercent={50} productPrice ={product.price} remainingPercent={100} maximums={{}} setOutsideState={setPriceValue} confirm = {false} />
    
    

    <Text style={{marginTop: 20, marginBottom: 20, }}>The more you pay, the more you own, and the more frequently you can use this item compared to your co-flockers.</Text>
    <ProductPreview product = { product } />
 
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
            <LinearGradient
          colors={[constants.YELLOW, constants.ORANGE]}
          start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 30,
            //alignItems: 'center',
            paddingVertical: 5,
            width: 130,
            alignItems: 'center'
          }}><Text style={{color: 'white', fontSize: 14, fontFamily: constants.FONTBOLD}}>{"$" + (product.price / 25 * 1.4).toFixed(2) + " to flock"}</Text>
</LinearGradient>
</View>
        </View>
        
    </View>
}



const styles = {
    container: {width:'100%', backgroundColor: 'white', marginTop: 5, padding: 20},
    inputBox: {borderColor: "grey", paddingLeft: 15, borderRadius: 80, borderWidth: 1, paddingLeft: 30, paddingRight: 30}
};

export default StartFlock;