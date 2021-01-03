import React, {useState, useRef} from 'react';
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

const StartFlock = ({navigation, route}) => {
    const dispatch = useDispatch();
    const Tab = createMaterialTopTabNavigator();
    console.log('start flock index is', route.params);
    var ar = [<PageOne product = {route.params.product} data = {route.params.data} />, <PageTwo product = {route.params.product} data = {route.params.data} />, <PageThree product = {route.params.product} data = {route.params.data} />, <PageFour product = {route.params.product} data = {route.params.data} />];
    return <ScrollView scrollEnabled={false} keyboardShouldPersistTaps="never"><ProgressHeader
    nextRoute="StartFlock"
    backRoute="StartFlock"
    headerText="Start a Flock"
    goBack={true}
    navigation={navigation}
    index={route.params.index}
    number={3}
    data={route.params.data}
    closeText="done"
    closeFunc={()=> {
        const user  = firebase.auth().currentUser;
        const salt = Math.random(100).toFixed(10);
        const data = {
          name: 'testNew'+salt,
          flock: 'testNew'+salt,
          product: route.params.product,
          completed: false,
          // FLOCK_BUG use id later, for now use title
          productTitle: route.params.product.title,
          messages: [],
          
          time: Math.round(Date.now() / 1000),
          members: [{name: user.displayName, uid: user.uid}]
        };
        firebase.firestore().collection("chatGroups").add(data).then((docRef)=>{
            data["id"] = docRef.id;
            db.collection('users').doc(firebase.auth().currentUser.uid).update({
                chatIds: firebase.firestore.FieldValue.arrayUnion(docRef.id)
              });
            dispatch({type: "UPDATE_DATA", payload: ["chatIds", "add", "array", docRef.id]});
            dispatch({type: "UPDATE_DATA", payload: ["chatGroups", "add", "array", data]});
        });
        //navigation.navigate("Carousel");

        navigation.goBack();
    }}
  />
    {ar[route.params.index]}
  </ScrollView>
}

const PageOne = ({product, data}) => {
    return <View style={{width:'100%', backgroundColor: 'white', marginTop: 5, padding: 20}}>
        <InputText data = {data} title = "specifications" numLines = {2} placeholder = "Size 4? Size 10? Red? Green?" label="List specifications like size and color if applicable."/>
        <InputText data = {data} title = "description" numLines = {4} placeholder = "What do you want others to know about this product? Hype it up so they join your flock and lower your price!" label="Message" defaultValue = "Hey! What do you think of this? Want to flock it with me? Together we split the cost and share the item."/>
        <ProductPreview product = {product} toggle={true} egg={true} />

    </View>;
}

const PageTwo = ({product, data}) => {
    return <View style={styles.container}>
    <Text style={{fontWeight: 'bold', marginBottom: 20}}>Enter the maximum you are willing to pay.</Text>
    <View style={[{flexDirection: 'row', width: 150, height: 25, alignItems: 'center'}]}>
        <Text style={{color:constants.DARKGREY, marginRight: 5, marginTop:1, fontWeight: 'bold'}}>USD</Text>
    <View style={[styles.inputBox,{flex: 1, height: 35, paddingLeft: 5, marginLeft: 1, flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: constants.DARKGREY}]}>
    <Text style={{color: constants.DARKGREY}}>$</Text>
    <BasicInputText data={data} title="maxPrice" defaultValue = {(product.price / 2).toFixed(2)} style={[styles.inputBox,{flex: 1, paddingLeft: 0, marginLeft: 3, borderWidth: 0}]} />
    </View>
    </View>

    <Text style={{marginTop: 20, marginBottom: 20, }}>The price of the item is split evenly amongst the flock. The sale will go through as soon as the split price meets two or more flockers’ maximum limit. So don’t set your maximum too low because your flock may take off without you!</Text>
    <ProductPreview product = { product } />
    </View>
}

const PageThree = ({product, data}) => {
    const img = useRef();

    data['imgRef'] = img;
    return <><View style={[styles.container, {marginBottom: -2,}]}>
        <Text style={{fontWeight:'bold'}}>Want to pay less? Get more people to join, and earn eggs when you share!</Text>
    </View>
    <ShareRow label="Tag a flocker"  product = {product} data={data} toggle={false} egg={false} />
    <ShareRow label="Share on Facebook" app="facebook" product = {product} data={data} toggle={true} egg={true} />
    <ShareRow label="Share on Instagram" app="instagram" product = {product} data={data} toggle={true} egg={true} />
    <ShareRow label="Share on Snapchat" app="snapchat" product = {product} data={data} toggle={true} egg={true} />
    {/* <ShareRow label="Share on Tiktok" app="tiktok" product = {product} data={data} toggle={true} egg={true} /> */}
    <ShareRow label="Share on Twitter" app="twitter" product = {product} data={data} toggle={true} egg={true} />
    <ShareRow label="Share on Whatsapp" app="whatsapp" product = {product} data={data} toggle={true} egg={true} />
    {/* <ShareRow label="Text" app="text" product = {product} data={data} toggle={false} egg={true} /> */}
    {/* <ShareRow label="Email" app="email" product = {product} data={data} toggle={false} egg={true} /> */}

    <ViewShot ref={img} options={{ format: "jpg", quality: 0.9 }}>
        <Image style = {{height: 250,}} source = {{uri: product.image}} />
      </ViewShot>
    </>
}

const PageFour = () => {
    return <Text>Test 4</Text>
}

const InputText = ({numLines, data, title, placeholder, label, defaultValue=""}) => {
    console.log(data[label]);
    data[title] = defaultValue;
    return <View style={{marginBottom: 10}}><Text style={{fontWeight: 'bold'}}>{label}</Text>
    <TextInput defaultValue={data[title] || defaultValue} blurOnSubmit placeholder={placeholder} style={{marginTop: 5, borderColor: "grey", paddingLeft: 15, borderRadius: 10, borderWidth: 1, height: numLines * 25}} multiline numberOfLines = {numLines} onBlur = {(e)=> {
        console.log("BLUR", e.nativeEvent.text);
        data[title] = e.nativeEvent.text;
    }} /></View>
}

const BasicInputText = ({numLines=1, data, placeholder, label, title, defaultValue=""}) => {
    console.log(data[label]);
    data[title] = defaultValue;
    return <TextInput defaultValue={data[title] || defaultValue} blurOnSubmit placeholder={placeholder} onBlur = {(e)=> {
        console.log("BLUR", e.nativeEvent.text);
        data[title] = e.nativeEvent.text;
    }} />;
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

const ShareRow = ({toggle, label, app, egg, product, data}) => { 
    const animation = useRef();
    const onFailure = () => {
        setToggle(false);
    }
  console.log("IMAGE", product);
    const toggleFunc = () => {
        setToggle(!tog);
        //animation.play();
        const content = {product: product, data: data};
      shareActions[app](content, onFailure);

    }
    const [tog, setToggle] = useState(false);
    var shareAction = toggle?<Switch value={tog}
    onValueChange={toggleFunc}
    trackColor={{ false: constants.DARKGREY, true: constants.ORANGE }}
    style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }} />:<Image source={require('App/Assets/Images/Front_Icon.png')} style={{width:20, height: 20, tintColor: constants.DARKGREY}} />;
var shareContainer = <View style={{alignItems: 'center', flexDirection: 'row'}}>{egg?<Image style={{width: 25, height: 25}} source={constants.PLACEHOLDER_IMAGE} />:<View />}{shareAction}</View>;
    return <>
    {/* <LottieView style={{backgroundColor:'black'}} speed = { 1.5} source={require('App/Assets/coins.json')} autoPlay loop /> */}
    
    <View style={{alignItems: 'center', backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, paddingLeft: 20, paddingRight: 20, height: 40}}>
        <Text style={{fontWeight: 'bold'}}>
            {label}
        </Text>
        
        {shareContainer}
        {/* <Animation ref={animation} style= {{position: 'absolute', right: 20, width: 50, height: 50, }}source={require('App/Assets/coins.json')} /> */}
        </View>
        
        </>
}

const styles = {
    container: {width:'100%', backgroundColor: 'white', marginTop: 5, padding: 20},
    inputBox: {borderColor: "grey", paddingLeft: 15, borderRadius: 10, borderWidth: 1}
};

export default StartFlock;