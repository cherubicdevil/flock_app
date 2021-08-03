import React, {useState, useRef} from 'react';
import {View, Text, Image, TouchableOpacity, Button,SafeAreaView, TextInput, Alert} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator,CardStyleInterpolators,} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {constants} from 'App/constants';
import Icon from 'react-native-vector-icons/FontAwesome';
import AnimatedModal from 'App/components/AnimatedModal';
import WebView from 'react-native-webview';
import PriceSlider from 'App/components/PriceSlider';
import StripeCheckout from 'App/components/StripeCheckout';
import ShareSocial from 'App/components/ShareSocial';
import {firebase, db, au} from 'App/firebase/config';
import {CommonActions} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const StartFlockNavigator = ({navigation, route}) => {
    const flockId =  route.params.flockId;
//   const select = useSelector(state => state.auth);
  return <SafeAreaView style={{flex:1, backgroundColor: constants.TRANSLUCENT}}>
      <Tab.Navigator
  initialRouteName="Page1"
  //initialRouteName="ProfileMain"
  screenOptions={{
    headerShown: false,
    // swipeEnabled:true
    // unmountOnBlur: true,
    //animationEnabled: false,
    tabBarVisible: false,
  }}>
  <Tab.Screen
    name="Page1"
    component={Page1}
    options={{
    }}
    initialParams={{vidVisible: true, scrollIndex: 0, data:{}, product: route.params.product, flockId: flockId}}
    // FLOCK_BUG when click carousel nav bar, doesn't play automatically
  />
  <Tab.Screen
    name="Page2"
    component={Page2}
    options={{
        unmountOnBlur: true,
    }}
    initialParams={{vidVisible: true, scrollIndex: 0, data:{}, product:route.params.product, flockId: flockId}}
    // FLOCK_BUG when click carousel nav bar, doesn't play automatically
  />
    <Tab.Screen
    name="Page3"
    component={Page3}
    options={{
    }}
    initialParams={{data:{}, product:route.params.product, flockId: flockId}}
    // FLOCK_BUG when click carousel nav bar, doesn't play automatically
  />

  
</Tab.Navigator>
</SafeAreaView>
}

const Page1 = ({navigation, route}) => {
    const data= route?.params?.data || {};
    const product = route?.params?.product;
    const [can1, setCan1] = useState(data['specifications']!==undefined && data['specifications'].length > 0);
    const [can2, setCan2] = useState(data['description']!==undefined && data['description'].length > 0);
    const [openWebView, setOpenWebView] = useState(false);
    console.log(can1, can2)
    const webViewRef= useRef();
    return <View>
        <ProgressHeader header = {"id: %"+route.params.flockId} goBack={navigation.goBack} nextFunc = {()=>{
            if (can1 && can2) {
                navigation.navigate("Page2", {data: data})
            } else {
                Alert.alert("Please fill out info")
            }
            
        }}
            />
        <ContentWrapper>
        
        <View style={{width:'100%', backgroundColor: 'white', marginTop: 5, padding: 20}}>
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
        {/* <ProductPreview product = {product} toggle={true} egg={true} /> */}
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
    </View>
        </ContentWrapper>
    </View>
}

const Page2=({navigation, route})=>{
    const data = route?.params?.data;
    const product = route?.params?.product;
    const [openInfo, setOpenInfo] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [priceValue, setPriceValue] = useState((1.4 * product.price / 2).toFixed(2));

    const [stripeHook, setStripeHook] = useState(()=>()=>{
        console.log('hello')
    });
    const select = useSelector(state=>state.userInfo);

    
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

    const createChat = ()=> {
        const flockId = route.params.flockId;
        const user  = firebase.auth().currentUser;
        const salt = Math.random(100).toFixed(10);
        route.params.product.id = route.params.flockId;
        const data = {
            specifications: route.params.data.specifications,
            description: route.params.data.description,
          name: 'testNew'+salt,
          flock: 'testNew'+salt,
          product: route.params.product,
          completed: false,
          productTitle: route.params.product.title,
          messages: [],
          time: Math.round(Date.now() / 1000),
          members: [{name: user.displayName, uid: user.uid}],
          memberIds: [user.uid],
          likes: 0,
          comments: 0,
          id: route.params.flockId,
        };
        const maximums = {};
        maximums[user.uid] = route.params.data.maxPrice;
        data["maximums"] = maximums;
        firebase.firestore().collection("chatGroups").doc(flockId).set(data).then((docRef)=>{
            db.collection('users').doc(firebase.auth().currentUser.uid).update({
                chatIds: firebase.firestore.FieldValue.arrayUnion(docRef.id)
              }).catch(err=>{
                  console.log("NESTED ERROR", err);
              });
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
        // navigation.goBack();
        return data;
        
    }

    return <View>
    <ProgressHeader index={1} header = {"id: %"+route.params.flockId} goBack={navigation.goBack} nextFunc = {()=>{
        // navigation.navigate("Page3")
        navigation.navigate("Disclaimer", {after: () => {
            // setCreditModal(true);
            // console.log('type of ', typeof(stripeHook))
            stripeHook();
        }});
    }}
        />
        <ContentWrapper>
        <View style={styles.container}>
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
    </ContentWrapper>
    <StripeCheckout amount={5.00} setHook={setStripeHook} delayedCharge={true} completeFunc = {()=>{
        // navigation.navigate()
        const new_data = createChat();
        navigation.navigate("Page3", {data: new_data})
    }}/>
</View>
}

const Page3 = ({navigation, route}) => {
    
    const data= route?.params?.data || {};
    console.log('data', data)
    const product = route?.params?.product;
    return <View>
        <ProgressHeader header = {"id: %"+route.params.flockId} index={2} goBack={navigation.goBack} noBack = {true} nextText="finish" nextFunc={()=>{
            // navigation.navigate('ChatInterface', {data: data});
        //             navigation.dispatch(
        //     CommonActions.reset({
        //       index: 2,
        //       routes: [
        //         { name: 'Product', params:{album: route.params.product, data: route.params.data, id: route.params.data.id} },
        //         { name: 'Carousel'},
        //         {name: 'ChatInterface', params:{data:data}},
        //       ],
        //     })
        //   );

            // navigation.navigate('ChatInterface', {data:data})
          navigation.dispatch(state => {
            // Remove the home route from the stack
            // const routes = state.routes.filter(r => r.name !== 'StartFlock');
            // routes.push({name: 'ChatInterface', params:{data:data}});
            const routes = [{name: 'Tabs'}, {name: 'Product', params: {album: product, id: route.params.flockId, data: data}} , {name: 'ChatInterface', params:{data:data}}]
            return CommonActions.reset({
              routes,
              index: routes.length - 1,
            });
          });
        }} />
        <ContentWrapper>
        <ShareSocial product = {product} data = {data} flockId={route.params.flockId} />
        </ContentWrapper>
    </View>
}

const ProgressHeader = ({goBack, nextFunc, noBack = false, nextText = "next", header="", canGoNext = true, maxIndex = 3, index=0}) => {
    const renderCircle = (localIndex, globalIndex) => {
        return (
          <View
            style={{
              borderWidth: 1,
              marginTop: 15,
              width: 15,
              height: 15,
              borderRadius: 20,
              borderColor: constants.DARKGREY,
              //fontSize: 70,
              backgroundColor: localIndex <= globalIndex ? constants.ORANGE: constants.GREY,
              justifyContent: 'center',
            }}>
            {/* <Text
              style={{
                color: 'white',
                fontSize: 8,
                textAlign: 'center',
                //paddingBottom: 2,
              }}>
              {localIndex}
            </Text> */}
          </View>
        );
    };
    const result = [];
    for (i = 0; i < maxIndex; i++) {
      result.push(renderCircle(i, index));
    }
    const renderGoBack = () => {
        if (noBack) {
            return <></>;
        }
          return (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                position: 'absolute',
                left: 20,
                bottom: 0,
              }}
              onPress={() => {
                goBack();
              }}>
              <Icon name="chevron-left" color={constants.DARKGREY} size={30} style={{marginBottom: 20}} />
            </TouchableOpacity>
          );
        
      };
    return <View
      style={{
        //marginBottom: 30,
        height:90,
        paddingTop: 10,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: constants.TRANSLUCENT,
      }}>
      <Text style={{fontFamily: 'Nunito-Bold', fontSize: 14, marginTop: 10}}>
        {header}
      </Text>

      <View
        style={{
          marginTop: -14,
          width: 150,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            backgroundColor: constants.GREY,
            height: 3,
            width: 150,
            position: 'absolute',
            alignSelf: 'center',
            bottom: 6,
          }}
        />
        {result}
      </View>
      <View style={{
          position: 'absolute',
          right: 20,
          bottom: 15,
          justifyContent: 'center',
          alignItems: 'center',
          height: 40, backgroundColor: constants.ORANGE, width: 60, borderRadius: 30, opacity: canGoNext ? 1 : 0.2,

          }}>
      <TouchableOpacity
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
        onPress={() => {

            nextFunc();
            
        }}>
          <View>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Nunito-Bold',
              color: 'white',
            }}>
            {nextText}
          </Text>
          </View>
      </TouchableOpacity>
      </View>
      {renderGoBack()}
    </View>
}

const ContentWrapper = ({children}) => {
    return <View style={{width:'100%', backgroundColor: 'white', marginTop: 5, padding: 20}}>{children}</View>
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

const ProductPreview = ({product={}}) => {
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

export default StartFlockNavigator;