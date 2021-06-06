import React, {Fragment, useState} from 'react';
import {View, SafeAreaView,Text, TouchableOpacity, Image} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {constants} from 'App/constants';
import Login from 'App/components/screens/login/Login';

import MultiSlider from '@ptomasroos/react-native-multi-slider';

const Tab = createMaterialTopTabNavigator();

const background = constants.PINK_BACKGROUND_OPAQUE;

const InitialScreen = ({navigation}) => {
    return <Fragment><SafeAreaView style={{marginTop: 50, flex: 1,}}>
        <TouchableOpacity onPress={()=>{
            navigation.navigate('Login')
        }}>
            <Text style={{fontFamily: constants.FONT, alignSelf: 'center', fontSize: 20}}>login</Text>
        </TouchableOpacity>
        <SwipeNavigator navigation = {navigation}>

        </SwipeNavigator>
    </SafeAreaView><SafeAreaView style={{backgroundColor: background}} /></Fragment>;
}

const SwipeNavigator = ({navigation}) => {
    var navigator = 
  <Tab.Navigator
  tabBarOptions={{
      showLabel:false,
      showIcon: false,
      style: {
          height:0
      }
  }}
  screenOptions={{
    headerShown: false
  }}
  swipeEnabled={true}
  >
    <Tab.Screen name="screen1" component = {Screen1}/>
    <Tab.Screen name="screen2" component = {Screen2}/>
    <Tab.Screen name="screen3" component = {Screen3}/>
    <Tab.Screen name="screen4" component = {Screen4}/>
    <Tab.Screen name="screenchoose" component = {ScreenChoose}/>
    <Tab.Screen name="screencalendar" component = {ScreenCalendar}/>
    <Tab.Screen name="screen5" component = {Screen5}/>
    <Tab.Screen name="screen6" component = {Screen6} initialParams={{parentNavigator: navigation}}/>


</Tab.Navigator>;


return <>
{navigator}
</>;
}

const screens = ["screen1", "screen2", "screen3","screen4", 'screenchoose', 'screencalendar', "screen5", 'enjoy']

const Circle = ({color='white'}) =>{
    const height = 10;

    return <View style={{height: height, width: height, borderRadius: 20, backgroundColor: color}}>

    </View>
}

const ScreenTemplate = ({page, children}) => {
    return <View style={{backgroundColor:background, flex: 1}}>
            <View style={{flex:1, marginHorizontal:20, marginTop:'40%', height: '70%'}}>
            {children}
            </View>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            {screens.map((item, index)=>{
                const gap = 10
                if (index != page) return <View style={{marginHorizontal: gap}}><Circle></Circle></View>
                return <View style={{marginHorizontal: gap}}><Circle color="black"></Circle></View>
            })}
            </View>
        </View>
}

const Screen1 = () => {
    return <ScreenTemplate page={0}>
        <Text style={{textAlign:'center', fontFamily: constants.FONT, fontSize: 24}}>Welcome to Flock!</Text>
        <Image source={require("App/Assets/Images/duck.png")} style={{height: '80%',width:'80%', alignSelf: 'center'}}/>
        </ScreenTemplate>

}

const Screen2 = () => {
    return <ScreenTemplate page={1}>
        <Text style={{textAlign:'center', fontFamily: constants.FONT, fontSize: 24}}>Flock is a co-owning service that lets you buy expensive clothes for cheap</Text>
        <Image source={require("App/Assets/Images/money_clothes.png")} style={{marginTop: -50,height: '100%',width:'100%', alignSelf: 'center'}}/>
        </ScreenTemplate>

}

const Screen3 = () => {
    return <ScreenTemplate page={2}>
        <Text style={{textAlign:'center', fontFamily: constants.FONT, fontSize: 24}}>Search the world wide web for your favorite clothes</Text>
        <Image source={require("App/Assets/Images/gucci.png")} style={{height: '80%',width:'80%', alignSelf: 'center'}}/>
        </ScreenTemplate>

}

const Screen4 = () => {
    return <ScreenTemplate page={3}>
        <Text style={{textAlign:'center', fontFamily: constants.FONT, fontSize: 24}}>Find others to split the cost!</Text>
        <View style={{flex:1, }}>
        <Image source={require("App/Assets/Images/chat_demo.png")} style={{marginTop: 70, resizeMode: 'cover',width:'80%', alignSelf: 'center'}}/>
        </View>
        </ScreenTemplate>

}

const ScreenChoose = () => {
    const [percent, setPercent] = useState(0);
    return <ScreenTemplate page={4}>
        <Text style={{textAlign:'center', fontFamily: constants.FONT, fontSize: 24}}>Choose how much you want to pay</Text>
<View style={{marginHorizontal:50, flex:1,flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
    <Text style={{flex:2, marginBottom:100,fontSize:60, overflow:'hidden'}}>{percent}%</Text>
        <View style={{flex:1}}><MultiSlider min={1} max={100.5} defaul vertical={true} onValuesChange={(stuff)=>{
            setPercent(stuff[0])
        }}>
        </MultiSlider>
        </View>
</View>
        </ScreenTemplate>

}

const ScreenCalendar = () => {
    return <ScreenTemplate page={5}>
        <Text style={{textAlign:'center', fontFamily: constants.FONT, fontSize: 24}}>Use when you want</Text>
        <View style={{flex:1, marginTop:30}}>
        <Image source={require("App/Assets/Images/reserve.png")} style={{height: '80%',width:'80%', alignSelf: 'center'}}/>
        </View>
        </ScreenTemplate>

}

const Screen5 = () => {
    return <ScreenTemplate page={6}>
        <Text style={{textAlign:'center', fontFamily: constants.FONT, fontSize: 24}}>Ship to your co-owners when you are done.</Text>
        <Image source={require("App/Assets/Images/share_houses.png")} style={{height: '80%',width:'80%', alignSelf: 'center'}}/>
        </ScreenTemplate>
}

const Screen6 = ({route}) => {
    return <ScreenTemplate page={7}>
        <Text style={{textAlign:'center', fontFamily: constants.FONT, fontSize: 24}}>Enjoy!</Text>
        <Image source={require("App/Assets/Images/duck_butler.png")} style={{height: '80%',width:'80%', alignSelf: 'center'}}/>
        <TouchableOpacity style={{alignSelf: 'center', padding: 20, width: 150, borderRadius: 30, alignItems: 'center', backgroundColor: constants.LAVENDER}} onPress={()=>route.params.parentNavigator.navigate("Login")}><Text style={{color: 'white', fontSize: 18}}>Get Started!</Text></TouchableOpacity>
        </ScreenTemplate>
}

export default InitialScreen;