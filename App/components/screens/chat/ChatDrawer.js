import React, {useEffect, useState, useRef} from 'react';
import {constants} from 'App/constants';
import Collapsible from 'react-native-collapsible';
import {useSelector, useDispatch} from 'react-redux';
import FlockJoinItem from './FlockJoinItem';
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
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
// import io from "socket.io-client";
import NavBar from 'App/components/common/NavBar';
import {GiftedChat} from 'react-native-gifted-chat';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  createDrawerNavigator,
  useIsDrawerOpen,
} from '@react-navigation/drawer';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import ChatGroup from './ChatGroup';
import {getChatsFromId} from 'App/utils';
import {fetchGlobalFlocks} from '../../../utils';

const Drawer = createDrawerNavigator();

const ChatDrawer = ({navigation, route}) => {
  const select = useSelector((state) => state);
  console.log(select.userInfo.chatIds);
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  useEffect(() => {
    getChatsFromId().then((dat) => {
      setData(dat);
      dispatch({type: 'UPDATE_DATA', payload: ["chatGroups", null, null, dat]});
    });

  }, []);

  // const data = select.userInfo.chatGroups;
  // data['self'] = {
  //   flock: 'Yourself',
  //   friends: [],
  //   id: 'self',
  //   buys: [],
  //   messages: [],
  // };
  // const data = {
  //   0: {
  //     flock: 'squad up',
  //     id: '0',
  //     buys: [
  //       {
  //         title: 'Game boy',
  //         url: null,
  //         price: '24.99',
  //         buyers: ['xxxHacker', 'jasonny'],
  //       },
  //       {
  //         title: 'Nintendo Switch',
  //         url: null,
  //         price: '300.99',
  //         buyers: [
  //           'xxxHacker',
  //           'jasonny',
  //           'danielpark',
  //           'Qrowsaki',
  //           'Me',
  //           'Hello',
  //         ],
  //       },
  //     ],
  //     boughts: [],
  //     friends: ['xxxHacker', 'stupidbro', 'jasonny', 'danielpark', 'Qrowsaki'],
  //     messages: [],
  //   },
  //   1: {
  //     flock: 'church friends',
  //     id: '1',
  //     buys: [],
  //     boughts: [],
  //     friends: ['Qrowsaki'],
  //     messages: [],
  //   },
  // };
  return (
    <Drawer.Navigator
      minSwipeDistance={30}
      edgeWidth={130}
      openByDefault={false}
      drawerType="slide"
      drawerContent={(props) => {
        return (
          <DrawerContentComponent
            {...props}
            navigation={navigation}
            route={route}
          />
        );
      }}>
      {renderDrawers(select.userInfo.chatGroups || [])}
      {/* <Drawer.Screen
        key={'Yourself 21345'}
        name={'Yourself'}
        component={ChatGroup}
        initialParams={{
          data: {
            flock: 'Yourself',
            friends: [],
            id: 'self',
            buys: [],
            messages: [],
          },
        }}
      /> */}
    </Drawer.Navigator>
  );
};

const renderDrawers = (data) => {
  console.log("data", data);
  return Object.entries(data).map(([, item]) => {
    console.log(item.flock);
    return (
      <Drawer.Screen
        key={Math.random()}
        name={item.flock || item.name}
        component={ChatGroup}
        initialParams={{data: item}}
      />
    );
  });
};

const DrawerContentComponent = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [recommendedFlocks, setRecommendedFlocks] = useState([]);
  const wasDrawerOpen = useIsDrawerOpen();
  const [dummyState, setDummyState] = useState(false);

  useEffect(() => {
    fetchGlobalFlocks().then((result) => {
      setRecommendedFlocks(result);
    });
  }, []);
  return (
    <>
      {/* <View
      style={{
        width: 700,
        height: 100,
        position: 'absolute',
        bottom: 70,
        zIndex: 900,
        backgroundColor: 'black',
      }}
    /> */}
      <Modal
        animationType="fade"
        transparent={true}
        style={{marginLeft: 20, marginRight: 20, padding: 50}}
        visible={modalVisible}>
        <View
          style={{
            flex: 1,
            zIndex: 50,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              width: '100%',
              height: '100%',
              zIndex: 2,
              backgroundColor: 'black',
              position: 'absolute',
              opacity: 0.4,
            }}
            onPress={() => {
              setModalVisible(false);
            }}
          />
          <View
            style={{
              zIndex: 40,
              marginTop: -300,
              borderRadius: 10,
              backgroundColor: constants.GREY,
              width: 300,
              marginLeft: 40,
              marginRight: 40,
              overflow: 'hidden',
              height: 400,
            }}>
            <View style={{backgroundColor: constants.RED}}>
              <Text
                style={{
                  marginBottom: 15,
                  color: 'white',
                  textAlign: 'center',
                  marginTop: 20,
                  fontFamily: constants.FONT_BOLD,
                  fontSize: 17,
                }}>
                Find a Flock
              </Text>
            </View>
            <ScrollView
              style={{
                //margin: 25,
                borderWidth: 0.5,
                flex: 1,
                borderColor: 'grey',
                borderOpacity: 0.1,
                backgroundColor: constants.GREY,
              }}>
              {recommendedFlocks.map((el) => {
                return <FlockJoinItem data={el} />;
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
      {!wasDrawerOpen ? null : (
        <NavBar navigation={props.navigation} route={props.route} />
      )}

      <DrawerContentScrollView style={{backgroundColor: constants.RED}}>
        <DrawerItem
          label="Kevin Gao"
          labelStyle={{
            fontSize: 20,
            fontFamily: constants.FONT,
            paddingLeft: 10,
            color: 'white',
            fontWeight: '800',
          }}
          style={{
            borderRadius: 25,
            backgroundColor: 'rgba(255,255,255,0.04)',
          }}
        />
        <View
          style={{
            marginTop: 10,
            marginLeft: 10,
            marginRight: 10,
            borderRadius: 20,
            backgroundColor: 'rgba(0,255,255,0.04)',
          }}>
          <View
            style={{
              marginBottom: -15,
              //backgroundColor: "red",
              flexDirection: 'row',
            }}>
            <DrawerItem
              label="Your Flocks"
              labelStyle={{
                fontFamily: constants.FONT,
                fontSize: 17,
                //color: constants.OFF_BLACK,
                color: 'white',
                fontWeight: '500',
              }}
              style={{flex: 1}}
            />
            <View style={{justifyContent: 'center', paddingBottom: 5}}>
              <TouchableOpacity
                onPress={() => {
                  console.log('adding');
                  setModalVisible(true);
                  // data[2] = {flock: 'Test'};
                  // setDummyState(!dummyState);
                  //console.log(data);
                }}>
                <Text style={{fontSize: 30, color: constants.DARK_BLUE}}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginLeft: 10}}>
            <MyDrawerItemList {...props} />
          </View>
        </View>
        <Image
          source={constants.BIRDS}
          style={{
            tintColor: constants.PURPLE,
            zIndex: 1,
            opacity: 0.4,
            width: 230,
            height: 200,
          }}
        />
      </DrawerContentScrollView>
    </>
  );
};

const MyDrawerItemList = ({descriptors, state, navigation}) => {
  return (
    <View style={{marginTop: 10}}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(route.name);
              console.log('navigating to', route.name);
            }}>
            <View
              style={{
                height: 30,
                marginLeft: 10,
                paddingLeft: 10,
                justifyContent: 'center',
                borderTopLeftRadius: 20,
                borderBottomLeftRadius: 20,
                backgroundColor: isFocused
                  ? constants.LIGHT_BLUE
                  : 'transparent',
                width: '100%',
              }}>
              <Text
                style={{
                  fontFamily: constants.FONT,
                  //color: isFocused ? 'black' : constants.OFF_BLACK,
                  color: 'white',

                  //fontWeight: '500',
                }}>
                {route.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ChatDrawer;
