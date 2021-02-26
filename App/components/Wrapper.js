import React, {Fragment} from 'react';
import {View, SafeAreaView, Dimensions} from 'react-native';
import {constants} from 'App/constants';

const Wrapper = ({children}) =>{
    return     <View style={{backgroundColor: constants.MENU_COLOR, flex: 1}}>
    <View style={{borderBottomEndRadius: 50, borderBottomLeftRadius: 50, overflow: 'hidden', height: Dimensions.get('window').height - constants.NAVBARHEIGHT,}}>
    <Fragment><SafeAreaView style={{ flex: 0, backgroundColor: constants.TRANSLUCENT }} />
    <SafeAreaView style={{flex: 1, backgroundColor: constants.PINK_BACKGROUND_OPAQUE}}>
        {children}
    </SafeAreaView>
    </Fragment>
    </View>
    </View>
}

export default Wrapper;