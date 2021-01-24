import React, {useState} from 'react';
import {SafeAreaView, View, Text, TextInput} from 'react-native';

const SearchPage = () => {
    const [search, setSearch] = useState("");
    return <SafeAreaView>
    <View style={{flex: 1}}>
        <TextInput style={{borderWidth: 1, height: 40}} value={search} onChangeText={(text)=>{
            setSearch(text);
        }}/>
    </View>
    </SafeAreaView>
};

export default SearchPage;