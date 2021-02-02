import React, {useState, useRef, useEffect} from 'react';
import {View, ScrollView, Text, Switch, TextInput, Image,} from 'react-native';
import ProgressHeader from 'App/components/ProgressHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {constants} from 'App/constants';
import LinearGradient from 'react-native-linear-gradient';
import {shareActions} from 'App/utils';
import {useDispatch} from 'react-redux';
import ViewShot from 'react-native-view-shot';
import Animation from 'lottie-react-native';
import {firebase, db} from 'App/firebase/config';
import ShareSocial from 'App/components/ShareSocial';
import { set } from 'react-native-reanimated';
import {CommonActions} from '@react-navigation/native';

const StartFlock = ({navigation, route}) => {
    const [flockId, setFlockId] = useState(route.params.flockId);
    useEffect(()=>{
        if (flockId === undefined) {
            setFlockId((Math.random()*10000).toFixed(0));
        }
    },[]);
    const dispatch = useDispatch();
    const [canNext, setCanNext] = useState(true);
    const Tab = createMaterialTopTabNavigator();
    console.log('start flock index is', route.params);
    var ar = [<PageOne product = {route.params.product} data = {route.params.data} setCanNext={setCanNext} />, <PageTwo product = {route.params.product} data = {route.params.data} setCanNext={setCanNext} />, <ShareSocial product = {route.params.product} data = {route.params.data} flockId={flockId} />, <PageFour product = {route.params.product} data = {route.params.data} />];
    return <ScrollView scrollEnabled={false} keyboardShouldPersistTaps="never"><ProgressHeader
    idText={"%"+flockId}
    nextRoute="StartFlock"
    backRoute="StartFlock"
    headerText="Start a Flock"
    goBack={true}
    canGoNext={canNext}
    navigation={navigation}
    index={route.params.index}
    number={3}
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
          
          time: Math.round(Date.now() / 1000),
          members: [{name: user.displayName, uid: user.uid}],
          memberIds: [user.uid],
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
            data["id"] = docRef.id;
            db.collection('users').doc(firebase.auth().currentUser.uid).update({
                chatIds: firebase.firestore.FieldValue.arrayUnion(docRef.id)
              });
            dispatch({type: "UPDATE_DATA", payload: ["chatIds", "add", "array", docRef.id]});
            dispatch({type: "UPDATE_DATA", payload: ["chatGroups", "add", "array", data]});
        });

        // navigation.dispatch(
        //     CommonActions.reset({
        //       index: 0,
        //       routes: [
        //         { name: 'Product', params:{album: route.params.product, id: route.params.data.id} },
        //       ],
        //     })
        //   );
        navigation.goBack();
    }}
  />
    {ar[route.params.index]}
  </ScrollView>
}

const PageOne = ({product, data, setCanNext}) => {
    const [can1, setCan1] = useState(false);
    const [can2, setCan2] = useState(false);
    useEffect(()=>{
        setCanNext(can1 && can2);
    }, [can1, can2]);

    return <View style={{width:'100%', backgroundColor: 'white', marginTop: 5, padding: 20}}>
        <InputText data = {data} title = "specifications" numLines = {2} setCanNext={setCan1} placeholder = "Size 4? Size 10? Red? Green?" label="List specifications like size and color if applicable." />
        <InputText data = {data} title = "description" numLines = {4}  setCanNext={setCan2}  placeholder = "What do you want others to know about this product? Hype it up so they join your flock and lower your price!" label="Message" defaultValue = "Hey! What do you think of this? Want to flock it with me? Together we split the cost and share the item."/>
        <ProductPreview product = {product} toggle={true} egg={true} />

    </View>;
}

const PageTwo = ({product, data, setCanNext}) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [priceValue, setPriceValue] = useState((product.price / 2).toFixed(2));
    return <View style={styles.container}>
        <Text style={{color: 'red'}}>{errorMessage}</Text>
    <Text style={{fontWeight: 'bold', marginBottom: 20}}>Enter your price. Minimum: ${(product.price/40).toFixed(2)}.</Text>
    <View style={[{flexDirection: 'row', height: 25, alignItems: 'center'}]}>
        <Text style={{color:constants.DARKGREY, marginRight: 5, marginTop:1, fontWeight: 'bold'}}>USD</Text>
    <View style={[styles.inputBox,{flex: 1, height: 35, paddingLeft: 5, marginLeft: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: constants.DARKGREY}]}>
    <Text style={{color: constants.DARKGREY}}>$</Text>
    <View style={{width: 100}}>
    <BasicInputText setOutsideValue={setPriceValue} numeric = {true} data={data} title="maxPrice" defaultValue = {(product.price / 2).toFixed(2)} style={[styles.inputBox,{flex: 1, paddingLeft: 0, marginLeft: 3, borderWidth: 0}]} 
    setFunc={(numString)=>{
        if (numString === "") {
            setErrorMessage("Please insert a price.");
            setCanNext(false);
        } else if (parseInt(numString.replace(".","")) < product.price/40 * 100) {
            setErrorMessage("Please insert a price greater than the minimum");
            setCanNext(false);
        } else {
            setErrorMessage("");
            setCanNext(true);
        }
    }}
    /></View>
    </View>
    <Text style={{color: constants.GREYORANGE, marginLeft: 30, width: 150}}>{(parseInt(priceValue.replace(".","")) / product.price)>100?"100%":(parseInt(priceValue.replace(".","")) / product.price).toFixed(0) + "%"} ownership</Text>
    </View>
    

    <Text style={{marginTop: 20, marginBottom: 20, }}>The more you pay, the more you own, and the more frequently you can use this item compared to your co-flockers.</Text>
    <ProductPreview product = { product } />
    </View>
}



const PageFour = () => {
    return <Text>Test 4</Text>
}

const InputText = ({numLines, data, title, placeholder, label, setCanNext, defaultValue=""}) => {
    console.log(data[label]);
    data[title] = defaultValue;
    return <View style={{marginBottom: 10}}><Text style={{fontWeight: 'bold'}}>{label}</Text>
    <TextInput defaultValue={data[title] || defaultValue} blurOnSubmit placeholder={placeholder} style={{marginTop: 5, borderColor: "grey", paddingLeft: 15, borderRadius: 10, borderWidth: 1, height: numLines * 25}} multiline numberOfLines = {numLines} onBlur = {(e)=> {
        console.log("BLUR", e.nativeEvent.text);
        data[title] = e.nativeEvent.text;
        if (e.nativeEvent.text !== "") {
            setCanNext(true);
        }
    }} /></View>
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
            <Text style = {{textDecorationLine: 'line-through', color: 'red', }}>${product.price}</Text>
            <LinearGradient
          colors={[constants.YELLOW, constants.ORANGE]}
          start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 30,
            //alignItems: 'center',
            paddingLeft: 10,
            paddingTop: 10,
            paddingBottom: 10
          }}><Text style={{color: 'white', fontSize: 14, fontFamily: constants.FONTBOLD}}>{"$" + Math.floor(product.price / 2) + " or less when you split with flockers"}</Text>
</LinearGradient>
        </View>
    </View>
}



const styles = {
    container: {width:'100%', backgroundColor: 'white', marginTop: 5, padding: 20},
    inputBox: {borderColor: "grey", paddingLeft: 15, borderRadius: 10, borderWidth: 1}
};

export default StartFlock;