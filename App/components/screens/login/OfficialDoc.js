import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const OfficialDoc = ({title, children, navigation}) => {
    return <><View style={{marginHorizontal: 20, marginVertical: 10}}>
        <Text style={{fontSize: 24, marginBottom: 30, marginTop: 30}}>{title}</Text>
        {children}

    </View>
    <TouchableOpacity style={{position:'absolute', alignSelf: 'center', bottom: '10%'}} onPress={()=>{
        navigation.goBack();
      }}>
        <View style={{justifyContent: 'center', alignItems: 'center', height:50, width: 50, backgroundColor: 'rgba(0,0,0,1)', borderRadius: 30,}}>
        <Icon name="times" size={30} color="rgba(255,255,255,0.6)" />
        </View>
      </TouchableOpacity>
    </>
}

export default OfficialDoc;