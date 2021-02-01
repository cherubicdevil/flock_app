import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {constants} from 'App/constants';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';

const HeaderGradient = ({navigation, children, absolute=true}) => {
    return <View style={{width: '100%', height: absolute?100:50, position:absolute?'absolute':'relative', top: 0, zIndex: 500,backgroundColor: constants.TRANSLUCENT, borderBottomRightRadius: 30, borderBottomLeftRadius: 30}}>
          <LinearGradient
    colors={[constants.TRANSLUCENT, 'white']}
    start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
    style={{
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      paddingTop: 10,
      paddingBottom: 20,
      height:'100%',
      borderBottomRightRadius:20,
      borderBottomLeftRadius: 20,
      //shadowColor: "#ff7009", shadowOffset: {height: 10, width: 0}, shadowOpacity: 0.39, elevation: 13, shadowRadius: 28.30,
      //alignItems: 'center',
    }}>
          <TouchableOpacity style={{position: 'absolute', zIndex: 800, bottom: 25, left: 20}} onPress={()=>{
            navigation.goBack();
          }}>
        <Icon name="chevron-left" size={24} color="grey" />
        </TouchableOpacity>
        {children}
        </LinearGradient>
    </View>
}

export default HeaderGradient;