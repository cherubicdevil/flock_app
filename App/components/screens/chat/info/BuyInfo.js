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
import NavBar from 'App/components/common/NavBar';
import {GiftedChat} from 'react-native-gifted-chat';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {formatMoney} from 'App/utils';
import {useDispatch} from 'react-redux';

const systemMessages = [];
const user = {displayName: 'Qrowsaki'};

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

const sendSystemMessage = (message) => {
  systemMessages.push(message);
};

const Openable = ({data, moveFunc, bought, messages, openId, route}) => {
  const dispatch = useDispatch();
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
          ${formatMoney(price, buyers.length + 1)} if you join!
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
            const message = {
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
            };
            sendSystemMessage(message);
            dispatch({type: 'updateSystemMessages', payload: message});

            //setDummyState(!dummyState);
          }}
        />
      );
    } else {
      return (
        <Button
          title="buy"
          onPress={() => {
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

export default BuyInfo;
