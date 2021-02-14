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
import {CommonActions, useFocusEffect} from '@react-navigation/native';
import PriceSlider from 'App/components/PriceSlider';


const StartFlock = ({navigation, route}) => {
    const flockId =  route.params.flockId;
    // useFocusEffect(()=>{
    //         setFlockId((Math.random()*10000).toFixed(0));
    //     // return ()=>{
    //     //     setFlockId(undefined);
    //     // }
    // },[route.params.data]);
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
    {ar[route.params.index]}
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
            <Text style = {{textDecorationLine: 'line-through', color: constants.ORANGE, }}>${product.price}</Text>
            <LinearGradient
          colors={[constants.YELLOW, constants.ORANGE]}
          start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }}
          style={{
            borderRadius: 30,
            //alignItems: 'center',
            paddingLeft: 10,
            paddingTop: 10,
            paddingBottom: 10
          }}><Text style={{color: 'white', fontSize: 14, fontFamily: constants.FONTBOLD}}>{"$" + (product.price / 25 * 1.4).toFixed(2) + " to flock"}</Text>
</LinearGradient>
        </View>
    </View>
}



const styles = {
    container: {width:'100%', backgroundColor: 'white', marginTop: 5, padding: 20},
    inputBox: {borderColor: "grey", paddingLeft: 15, borderRadius: 80, borderWidth: 1, paddingLeft: 30, paddingRight: 30}
};

export default StartFlock;