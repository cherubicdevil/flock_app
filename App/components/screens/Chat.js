import React, {useEffect, useState, useRef} from 'react';
import {constants} from 'App/constants';
import Collapsible from 'react-native-collapsible';
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
  TouchableWithoutFeedback,
} from 'react-native';
// import io from "socket.io-client";
import {GiftedChat} from 'react-native-gifted-chat';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
//import {firebase} from 'App/firebase/config';

const systemMessages = [];

var eventify = function (arr, callback) {
  arr.push = function (e) {
    Array.prototype.push.call(arr, e);
    callback(arr);
  };
};

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const formatMoney = (price, num) => {
  return formatter.format(price / num);
};
const user = {displayName: 'Qrowsaki'};
const data = {
  0: {
    flock: 'squad up',
    id: '0',
    buys: [
      {
        title: 'Game boy',
        url: null,
        price: '24.99',
        buyers: ['xxxHacker', 'jasonny'],
      },
      {
        title: 'Nintendo Switch',
        url: null,
        price: '300.99',
        buyers: [
          'xxxHacker',
          'jasonny',
          'danielpark',
          'Qrowsaki',
          'Me',
          'Hello',
        ],
      },
    ],
    boughts: [],
    friends: ['xxxHacker', 'stupidbro', 'jasonny', 'danielpark', 'Qrowsaki'],
    messages: [],
  },
  1: {
    flock: 'church friends',
    id: '1',
    buys: [],
    boughts: [],
    friends: ['Qrowsaki'],
    messages: [],
  },
};

const BuyInfo = ({route}) => {
  const [bigDummyState, setBigDummyState] = useState(false);
  return (
    <View style={{flex: 2}}>
      <View style={{maxHeight: '50%', marginTop: 20}}>
        <Text style={{marginBottom: 5, fontSize: 16, fontWeight: 'bold'}}>
          Ongoing Buys
        </Text>
        <FlatList
          style={{flexGrow: 0}}
          data={route.params.data.buys}
          keyExtractor={(item) => {
            return item.title + item.price;
          }}
          renderItem={(item) => {
            return (
              <Openable
                openId={item.item.title}
                route={route}
                messages={route.params.data.messages}
                moveFunc={(data) => {
                  const index = route.params.data.buys.indexOf(data);
                  const bought = route.params.data.buys.splice(index, 1);
                  route.params.data.boughts.splice(0, 0, bought[0]);
                  console.log(route.params.data.boughts);
                  setTimeout(() => {
                    setBigDummyState(!bigDummyState);
                  }, 500);
                }}
                data={item}
              />
            );
          }}></FlatList>
      </View>
      <View style={{marginTop: 20}}>
        <Text style={{fontSize: 16, fontWeight: 'bold'}}>
          Bought in the last 24 hours
        </Text>
        <FlatList
          style={{flexGrow: 0}}
          data={route.params.data.boughts}
          keyExtractor={(item) => {
            return item.title + item.price;
          }}
          renderItem={(item) => (
            <Openable
              openId={item.item.title}
              route={route}
              bought={true}
              data={item}
            />
          )}></FlatList>
      </View>
    </View>
  );
};
const Info = ({route, navigation}) => {
  const [bigDummyState, setBigDummyState] = useState(false);
  //const [buyData, setBuyData] = useState(route.params.data.buys);
  const renderFriends = (friends) => {
    if (friends === null) {
      return <Text>No friends in this chat</Text>;
    }
    return friends.map((friend) => (
      <View
        style={{
          backgroundColor: friend === user.displayName ? '#acf' : 'transparent',
          width: '100%',
          //marginBottom: 20,
          paddingBottom: 10,
          paddingTop: 10,
          flexDirection: 'row',
        }}>
        <Image
          style={{height: 50, width: 50, borderRadius: 100}}
          key={Math.random()}
          source={{uri: 'https://placeimg.com/140/140/any'}}
        />
        <Text style={{marginLeft: 10, marginTop: 10, fontSize: 14}}>
          {friend}
        </Text>
      </View>
    ));
  };
  return (
    <SafeAreaView style={{flex: 1, marginLeft: 30, marginRight: 20}}>
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row'}}>
            <View style={{alignSelf: 'center'}}>
              <Text
                style={{
                  fontSize: 16,
                  //marginTop: 10,
                  fontWeight: 'bold',
                }}>
                In This Chat
              </Text>
              <Text>{route.params.friends.length} Friends</Text>
            </View>
            <TouchableOpacity
              style={{
                marginTop: 15,
                marginLeft: 10,
                borderRadius: 20,
                borderWidth: 2,
                width: 25,
                height: 25,
                borderColor: '#cae',
                justifyContent: 'center',
                alignItems: 'center',
                paddingBottom: 2,
              }}
              onPress={() => {
                console.log('hi');
              }}>
              <Text style={{fontSize: 15, color: '#cae', fontWeight: 'bold'}}>
                +
              </Text>
            </TouchableOpacity>
          </View>
          <Button
            title="back"
            style={{
              width: '10%',
              alignSelf: 'flex-start',
            }}
            onPress={() => {
              navigation.goBack();
            }}
          />
        </View>
        <ScrollView>{renderFriends(route.params.friends)}</ScrollView>
      </View>
      <BuyInfo route={route} />
    </SafeAreaView>
  );
};

const sendSystemMessage = (message) => {
  systemMessages.push(message);
};

const Openable = ({data, moveFunc, bought, messages, openId, route}) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    console.log(openId, route.params.openId);
    return openId !== route.params.openId;
  });
  const [dummyState, setDummyState] = useState(false);

  const renderAdditionalPrice = (buyers, price) => {
    if (bought) return <View />;
    if (!buyers.includes(user.displayName)) {
      return (
        <Text style={{fontSize: 11}}>
          ${formatter.format(price / (buyers.length + 1))} if you join!
        </Text>
      );
    } else {
      return <View />;
    }
  };
  const renderSubmitButton = (buyers) => {
    if (bought) return <View />;
    if (!buyers.includes(user.displayName)) {
      return (
        <Button
          title="join"
          onPress={() => {
            buyers.push(user.displayName);
            setIsCollapsed(true);
            sendSystemMessage({
              _id: 1,
              text: `${user.displayName} joined the purchase for ${
                data.item.title
              }\nIndividual cost is now $${formatMoney(
                data.item.price,
                buyers.length,
              )}`,
              openId: openId,
              createdAt: new Date(),
              system: true,
              // Any additional custom parameters are passed through
            });

            //setDummyState(!dummyState);
          }}
        />
      );
    } else {
      return (
        <Button
          title="buy"
          onPress={() => {
            console.log('MY DATA');
            console.log(data);
            Alert.alert(
              'Confirm',
              `You are about to contribute $${formatMoney(
                data.item.price,
                buyers.length,
              )} to buy ${data.item.title}`,
              [
                {
                  text: 'Cancel',
                  onPress: () => console.log('Cancel Pressed'),
                  style: 'cancel',
                },
                {
                  text: 'Buy',
                  onPress: () => {
                    console.log('OK Pressed');
                    setIsCollapsed(true);
                    moveFunc(data.item);
                    //setBigDummyState(!dummyState);
                  },
                },
              ],
              {cancelable: false},
            );
          }}
        />
      );
    }
  };
  //console.log("THIS IS NOT NULL SHOULD BE");
  //console.log(data.item);
  return (
    <View
      style={{
        marginBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 10,
        borderTopEndRadius: 0,
        borderTopStartRadius: 0,
        backgroundColor: bought ? '#fc9' : '#aea',
      }}>
      <TouchableWithoutFeedback
        onPress={() => {
          setIsCollapsed(!isCollapsed);
        }}>
        <View
          style={{
            paddingTop: 5,
            paddingBottom: 5,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{flex: 3}}>{data.item.title}</Text>
          <View style={{flex: 1.6, flexDirection: 'row'}}>
            <Text style={{flex: 1.8, textAlign: 'right'}}>
              ${data.item.price}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <Collapsible collapsed={isCollapsed}>
        <View
          style={{
            paddingBottom: 10,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{flex: 3}}>
            <Text>
              {data.item.buyers.length} {bought ? 'bought' : 'pitching in'}
            </Text>
            <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {data.item.buyers.map((buyer) => (
                <View>
                  <Image
                    key={Math.random()}
                    style={{
                      height: buyer === user.displayName ? 50 : 46,
                      marginRight: 10,
                      marginTop: 10,
                      width: buyer === user.displayName ? 50 : 46,
                      borderWidth: 3,
                      borderColor:
                        buyer === user.displayName ? '#3cf' : 'transparent',
                      borderRadius: 50,
                    }}
                    source={{uri: 'https://placeimg.com/140/140/any'}}
                  />
                  <Text
                    numberOfLines={1}
                    style={{
                      fontWeight:
                        buyer === user.displayName ? 'bold' : 'normal',
                      color: buyer === user.displayName ? '#3cf' : 'black',
                      fontSize: 10,
                      width: 48,
                      textAlign: 'center',
                      overflow: 'hidden',
                    }}>
                    {buyer === user.displayName ? 'You' : buyer}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View style={{flex: 1.6}}>
            <Text style={{marginTop: 10, fontSize: 14}}>
              ${formatMoney(data.item.price, data.item.buyers.length)} each
            </Text>
            <View style={{}}>
              {renderAdditionalPrice(data.item.buyers, data.item.price)}
            </View>
            {renderSubmitButton(data.item.buyers)}
          </View>
        </View>
      </Collapsible>
    </View>
  );
};

const Stack = createStackNavigator();
const MyStack = ({route}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}>
      <Stack.Screen
        name="Chat"
        component={App}
        initialParams={{data: route.params.data}}
      />
      <Stack.Screen
        name="Info"
        component={Info}
        initialParams={{
          friends: route.params.data.friends,
          data: route.params.data,
        }}
      />
    </Stack.Navigator>
  );
};
const updateCache = (id, messages) => {
  data[id].messages = messages;
};

const testSystemMessage = {
  _id: 1,
  text: 'This is a system message',
  createdAt: new Date(Date.UTC(2016, 5, 11, 17, 20, 0)),
  system: true,
  // Any additional custom parameters are passed through
};

//var recvMessages = [testSystemMessage];
function App({route, navigation}) {
  const socket = useRef(null);
  const [recvMessages, setRecvMessages] = useState(route.params.data.messages);
  //const [recvMessages, setRecvMessages] = useState([testSystemMessage]);
  const [dummyState, setDummyState] = useState(false);
  //firebase.firestore().collection("posts").get();
  useEffect(function () {
    //firebase.firestore().collection("posts").get();
    eventify(systemMessages, (message) => {
      console.log('adding');
      setRecvMessages((prevState) => GiftedChat.append(prevState, message));
    });
    // socket.current = io('http://10.0.0.228:3001');
    // socket.current.on('message', (message) => {
    //   console.log(message);
    //   setRecvMessages((prevState) => GiftedChat.append(prevState, message));
    // });
  }, []);

  // const setRecvMessages = (messages) => {
  //   recvMessages = messages;
  //   setDummyState(!dummyState);
  // };
  const onSend = (messages) => {
    socket.current.emit('message', messages[0].text);
    console.log(route.params.data);
    updateCache(route.params.data.id, recvMessages);
    setRecvMessages((prevState) => GiftedChat.append(prevState, messages));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View
        style={{
          position: 'absolute',
          zIndex: 90,
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottomColor: '#efefef',
          borderBottomWidth: 1,
          height: 100,
          width: '100%',
          top: 0,
          paddingLeft: 20,
          paddingBottom: 20,
        }}>
        <Text style={{fontSize: 20}}>{route.params.data.flock}</Text>
        <Button
          title="
          ⓘ"
          onPress={() => {
            navigation.navigate('Info');
          }}
        />
      </View>
      <GiftedChat
        renderSystemMessage={(props) => {
          //console.log("SYSTEM MESSAGE PROPS", props);
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Info', {
                  openId: props.currentMessage.openId,
                });
              }}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  //borderWidth: 1,
                  shadowOpacity: 0.2,
                  shadowOffset: {height: 5, width: 2},
                  backgroundColor: '#22a',
                  borderRadius: 2,
                  paddingRight: 15,
                  paddingLeft: 15,
                  paddingTop: 10,
                  paddingBottom: 10,
                  alignSelf: 'center',
                  marginBottom: 10,

                  width: '75%',
                }}>
                <Text style={{textAlign: 'center', color: 'white'}}>
                  {props.currentMessage.text}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
        messages={recvMessages}
        onSend={onSend}
        user={{_id: 1}}
      />
    </SafeAreaView>
  );
}

const Drawer = createDrawerNavigator();

const MyDrawerItemList = ({descriptors, state, navigation}) => {
  console.log(state);
  return (
    <View style={{marginTop: 10}}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        return (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(route.name);
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
                  color: isFocused ? 'black' : constants.OFF_BLACK,

                  fontWeight: '500',
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

const Chat = () => {
  return (
    <Drawer.Navigator
      minSwipeDistance={30}
      edgeWidth={200}
      drawerContent={(props) => {
        return (
          <>
            <Image
              source={constants.BIRDS}
              style={{
                tintColor: constants.PURPLE,
                position: 'absolute',
                zIndex: 2,
                top: 200,
                left: 0,
                opacity: 0.4,
                width: 230,
                height: 200,
              }}
            />
            <DrawerContentScrollView style={{backgroundColor: constants.RED}}>
              <DrawerItem
                label="Kevin Gao"
                labelStyle={{
                  fontSize: 20,
                  fontFamily: constants.FONT,
                  paddingLeft: 10,
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
                    label="your flocks"
                    labelStyle={{
                      fontFamily: constants.FONT,
                      color: constants.OFF_BLACK,
                      fontSize: 15,
                      fontWeight: '600',
                    }}
                    style={{flex: 1}}
                  />
                  <View style={{justifyContent: 'center', paddingBottom: 5}}>
                    <TouchableOpacity
                      onPress={() => {
                        console.log('hi');
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
            </DrawerContentScrollView>
          </>
        );
      }}>
      {renderDrawers(data)}
    </Drawer.Navigator>
  );
};

const renderDrawers = (data) => {
  return Object.entries(data).map(([, item]) => {
    return (
      <Drawer.Screen
        key={Math.random()}
        name={item.flock}
        component={MyStack}
        initialParams={{data: item}}
      />
    );
  });
};
export default Chat;
