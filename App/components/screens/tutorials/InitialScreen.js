import React, {Fragment, useState} from 'react';
import {View, SafeAreaView,Text, TouchableOpacity, Image} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {constants} from 'App/constants';
import {useDispatch} from 'react-redux';
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

const ScreenTemplate = ({page, text="", children}) => {
    return <View style={{backgroundColor:background, flex: 1, paddingBottom: 30}}>
            <View style={{flex:1, marginHorizontal:20, marginTop:'10%', height: '70%'}}>
                <View style={{flex: 1,
                // borderColor: 'yellow',
                // borderWidth: 1,
                justifyContent: 'flex-end'
                
                }}><Text style={{textAlign:'center', fontFamily: constants.FONT, fontSize: 24}}>{text}</Text></View>
                <View style={{flex: 3}}>
<View style={{flex: .5, 
// borderColor: 'orange',
// borderWidth: 1,
}} />
<View style={{flex: 5,
// borderColor: 'green',
// borderWidth: 3,
justifyContent: 'flex-start'
}}>
            {children}
            </View>
            <View style={{flex: .5, 
// borderColor: 'red',
// borderWidth: 1,
}} />
            </View>
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
    return <ScreenTemplate page={1} text="Flock is a co-owning service that lets you buy expensive clothes for cheap">
        <Image source={require("App/Assets/Images/money_clothes.png")} style={{marginTop: -50,height: '100%',width:'100%', alignSelf: 'center'}}/>
        </ScreenTemplate>

}

const Screen3 = () => {
    return <ScreenTemplate page={2} text="Search the internet for your favorite clothes">
        <Image source={require("App/Assets/Images/gucci.png")} style={{resizeMode: 'contain', height: '80%',width:'80%', alignSelf: 'center'}}/>
        </ScreenTemplate>

}

const Screen4 = () => {
    return <ScreenTemplate page={3} text="Find others to split the cost!">
        <View style={{flex:1, }}>

        <Image source={require("App/Assets/Images/chat_demo.png")} style={{marginTop: 10, resizeMode: 'contain',width:'80%', alignSelf: 'center'}}/>

        </View>
        </ScreenTemplate>

}

const ScreenChoose = () => {
    const [height, setHeight] = useState(0);
    const [percent, setPercent] = useState(25);
    return <ScreenTemplate page={4} text="Choose how much you want to pay">
<View 
onLayout={(event)=>{
    // console.log('height', event.nativeEvent.layout.height)
    setHeight(event.nativeEvent.layout.height * .7);
}}
style={{marginHorizontal:50, height: '100%', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
    <Text style={{flex:2, marginBottom:100,fontSize:60, overflow:'hidden'}}>{percent}%</Text>
        <View style={{flex:1}}>
            <View style={{flex: 2}} />
            <MultiSlider 
            values={[percent]}
            sliderLength={height}
            min={1} max={100} vertical={true} 
            markerStyle={{width: 40, height: 40, shadowOpacity:0}}
            selectedStyle={{backgroundColor: constants.BLUERGREY}}
            trackStyle={{height: 15, borderRadius: 10,  backgroundColor:constants.BLUERGREY}}
            // containerStyle={{height: 20}}
            selectedStyle={{backgroundColor:constants.ORANGE}}
            markerContainerStyle={{alignSelf: 'center', marginTop: 7.5}}
            
            onValuesChange={(stuff)=>{
            setPercent(stuff[0])
        }}>
        </MultiSlider>
        <View style={{flex: 1, zIndex: -19}} />
        </View>
</View>
        </ScreenTemplate>

}

const ScreenCalendar = () => {
    return <ScreenTemplate page={5} text="Use when you want">
        <View style={{flex:1,}}>
        <Image source={require("App/Assets/Images/reserve.png")} style={{resizeMode: 'contain', height: "80%", alignSelf: 'center'}}/>
        </View>
        </ScreenTemplate>

}

const Screen5 = () => {
    return <ScreenTemplate page={6} text="Ship to your co-owners when you are done">
        
        <Image 
        source={require("App/Assets/Images/share_houses.png")} style={{alignSelf: 'center', height: '80%', width: '80%', resizeMode: 'contain'}}
        />

        </ScreenTemplate>
}

const Screen6 = ({route}) => {
    const dispatch = useDispatch();

    return <ScreenTemplate page={7} text="Enjoy!">
        <Image source={require("App/Assets/Images/duck_butler.png")} style={{height: '80%',width:'80%', alignSelf: 'center'}}/>
        <TouchableOpacity style={{alignSelf: 'center', padding: 20, width: 150, borderRadius: 30, alignItems: 'center', backgroundColor: constants.LAVENDER}} onPress={()=>{
            // route.params.parentNavigator.navigate("Login")
            dispatch({type: 'guest'})
        }
            }><Text style={{color: 'white', fontSize: 18}}>Get Started!</Text></TouchableOpacity>
        </ScreenTemplate>
}

export default InitialScreen;