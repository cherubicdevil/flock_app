import React, {useState, useRef, useEffect, createRef, Fragment} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  FlatList,
  ImageBackground,
  Dimensions,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';
import Video from 'react-native-video';
import {useSelector} from 'react-redux';
import {constants} from 'App/constants';
//import Input from 'App/components/common/Input';
import {firebase, db, auth} from 'App/firebase/config';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {getIndexOfData} from '../../../utils';
import ResizeableImage from 'App/components/ResizeableImage';
import AnimatedModal from 'App/components/AnimatedModal';
import Icon from 'react-native-vector-icons/FontAwesome';
//import Base64 from 'base-64';

// global.atob = Base64.encode;


/*

log: im changing the list for flocks and flockings
for profile to snapshot listeners because they are subject
to change by other users not current user

However, i am leaving likedVideos as cached because
the only thing that can change it is current user
so there is no chance that the data will be out of sync.


*/



const ProfilePicture = () => {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState({
    //user.photoUrl,
    uri: user.photoURL || '',
  });

  //ImagePicker.launchImageLibrary(options, getResponse);
  return (
    <View
      style={{
        backgroundColor: '#ddd',
        //alignSelf: 'center',
        width: 120,
        height: 120,
        borderRadius: 60,
      }}>
      <Image
      defaultSource={constants.PLACEHOLDER_IMAGE}
        style={{width: 120, height: 120, borderRadius: 60}}
        source={avatar}
      />
    </View>
  );
};
const ProfileMain = ({navigation}) => {
  const select = useSelector(state=>state);
  const userInfo = {
    username: auth.currentUser.displayName,
    bio: select.userInfo.bio || "This user likes to keep an air of mystery",
    // age: '20',
    // gender: 'Male',
  };
  const selector = useSelector((state) => state);
  //const user = firebase.auth().currentUser;
  const Test1 = () => {
    console.log("flockData length", flockData.length);
    const defaultView = <View
        style={{marginTop: 30, alignSelf: 'center', justifyContent: 'center'}}>
        <Image source={constants.PLACEHOLDER_IMAGE} />
        <Text
          style={{
            fontFamily: constants.FONT,
            marginTop: 10,
            width: 120,
            textAlign: 'center',
            flexWrap: 'wrap',
          }}>
          You don't have any posted clucks yet!
        </Text>
      </View>;

      return (
        <>
          <FlatList
            //contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
            numColumns={3}
            data={flockData}
            renderItem={(el) => {
              return <TouchableOpacity onPress={()=>{navigation.navigate("ChatInterface", {data: el.item})}}><View style={{width: Dimensions.get('window').width/3 - 10, margin: 5, paddingBottom: 30, borderBottomRightRadius: 40, borderBottomLeftRadius: 40, backgroundColor: 'white', resizeMode: 'contain'}} >
                <Text>Current Price: ${(el.item.product.price/el.item.members.length).toFixed(2)} </Text>
              <Text>Your Maximum: ${(el.item.maximums[firebase.auth().currentUser.uid])}</Text>
              <ResizeableImage limitHorizontal={false} hLimit={50} source={{uri: el.item.product.image}} style={{width:'100%', height: 50}} />
              </View>
              </TouchableOpacity>
            }}
          />
        </>
      );
  };

  const Test3 = () => {
    console.log("RENTDATA length", rentData.length);
    console.log(rentData);
    return (
      <>
        <FlatList
          //contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
          numColumns={3}
          data={rentData}
          renderItem={(el) => {
            return <TouchableOpacity onPress={()=>{navigation.navigate('FlockChatComplete', {data: el.item})}}><View style={{backgroundColor: 'black', width: Dimensions.get('window').width/3, height: 150, borderBottomRightRadius: 40, borderBottomLeftRadius: 40, backgroundColor: 'white'}} >
              <Image style={{width: '100%', height: 110}} source={{uri: el.item.product.image}} />
          <Text>{el.item.members.length} flockers</Text>
            </View>
            </TouchableOpacity>
          }}
        />
      </>
    );
  }
  const Test2 = () => {
    var data = selector.userInfo.likedVideos;
    //var data = selector.userInfo.chatGroups.filter((item)=> item.completed==false );
    return (
      <>
        <FlatList
          //contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap'}}
          numColumns={3}
          data={data}
          keyExtractor={(el) => {
            console.log(el.title);
            return el.title;
          }}
          renderItem={(el) => {
            //console.log(el.item);
            // fetchStreamableSource(el.item).then((resp) => {
            //   console.log('HELLOOOO');
            //   setResp(resp);
            //   console.log(resp);
            // });

            console.log('POSTER', el.item.poster);
            return (
              <TouchableOpacity
                onPress={() => {
                  console.log(data);
                  navigation.navigate('Carousel', {
                    scrollIndex: getIndexOfData(data, el.item),
                    array: data,
                  });
                }}>
                <Image
                  defaultSource={{uri: el.item.poster}}
                  source={{uri: el.item.poster}}
                  style={{
                    //backgroundColor: constants.LIGHTGREY,
                    borderRadius: 200,
                    borderWidth: 3,
                    borderColor: 'rgba(10,10,10,.2)',
                    margin: 5,
                    width: Dimensions.get('window').width / 3 - 10,
                    height: 200,
                  }}
                />
              </TouchableOpacity>
            );
          }}
        />
      </>
    );
  };

  const [flockData, setFlockData] = useState([]);
  const [rentData, setRentData] = useState([]);
  useEffect(() => {
    var citiesRef = db.collection("chatGroups");
    // this filter is kind of inefficient; gets the entire table
    var query = citiesRef.where("members", "array-contains", {name: firebase.auth().currentUser.displayName, uid: firebase.auth().currentUser.uid});
    var unsubscribe = query
    .onSnapshot(function(querySnapshot) {
      const rent = [];
      const flock = [];
      querySnapshot.forEach(function(doc) {
        console.log("FOUNDDDDDD");
        if (doc.data().completed === false) {
        flock.push({...doc.data(), id: doc.id});
        } else {
          rent.push({...doc.data(), id: doc.id});
        }
      });
      setFlockData(flock);
      setRentData(rent);
    });

    return () => {unsubscribe()};
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const Tab = createMaterialTopTabNavigator();

  console.log("MY USERNAME IS:", auth.currentUser.displayName);
  return (
    <Fragment><SafeAreaView style={{ flex: 0, backgroundColor: constants.TRANSLUCENT }} /><SafeAreaView style={{flex: 1, backgroundColor: constants.PINK_BACKGROUND}}>
      <AnimatedModal fade={false} upPercent="35%" visible={modalOpen} close={()=>setModalOpen(false)} content={<View>
        <Button
          title="Edit Profile"
          onPress={() => {
            navigation.navigate('Profile');
          }}
        />
        <Button
          title="logout"
          onPress={() => {
            firebase.auth().signOut();
            console.log('logout');
          }}
        />
      </View>}/>
      <View style={{height: 50, backgroundColor: constants.TRANSLUCENT}}>
      <View style={{position: 'absolute', left: 10, top: 0, zIndex: 400}}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
        <Icon name="chevron-left" size={40} color="#999" />
</TouchableOpacity>
        </View>
        <Text style={{alignSelf: 'center'}}>Profile</Text>
      </View>
      {/* <ImageBackground
        source={require('App/Assets/Images/Orange_Gradient_Small.png')}
        style={{
          flex: 1,
        }}> */}
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingBottom: 20,
            paddingRight: 30,
            alignItems: 'flex-start',
            paddingLeft: 40,
          }}>
          
          <View style={{flexDirection: 'row'}}>
            <ProfilePicture />
            <View style={{flex: 1, marginLeft: 10}}>
              <View style={{flexDirection: 'row',}}>
              <TouchableOpacity onPress={()=>{
                setModalOpen(true)
              //   fetch("http://localhost:5000/testAddBackend/", {
              //     method: 'POST',
              //     body: JSON.stringify({test:"test"}),
              //     headers: { 'Content-Type': 'application/json' }
              // }).then(res => res.json())
              //   .then(json => console.log(json));
                }}>
                <View style={{backgroundColor:'rgba(0,0,0,0.1)', padding: 5, borderRadius:40, flexDirection:'row'}}>
                <Text
                  style={{
                    marginRight: 10,
                    color: 'black',
                    fontFamily: 'Nunito',
                  }}>
                  {userInfo.username}
                </Text>
                
                
                <Icon name="chevron-down" size={15} color="#300" />
                
                </View>
                </TouchableOpacity>
                <Text
                  style={{
                    marginRight: 10,
                    color: 'white',
                    fontFamily: 'Nunito',
                  }}>
                  {userInfo.age}
                </Text>
                <Text style={{color: 'white', fontFamily: 'Nunito'}}>
                  {userInfo.gender}
                </Text>
              </View>
              <Text
                style={{
                  marginLeft: 5,
                  marginTop: 10,
                  color: 'black',
                  fontFamily: 'Nunito',
                }}>
                {userInfo.bio}
              </Text>
            </View>
          </View>
        </View>
      {/* </ImageBackground> */}
      <View style={{flex: 4}}>
        <Tab.Navigator>
          <Tab.Screen name="flocking" component={Test1} />
          <Tab.Screen name="flocked" component={Test3} />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    fontSize: 14,
    padding: 5,
    borderRadius: 3,
    borderWidth: 1,
  },
});

export default ProfileMain;
