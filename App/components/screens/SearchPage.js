import React, {useState} from 'react';
import {SafeAreaView, View, Text, TextInput,Image, TouchableOpacity} from 'react-native';

import algoliasearch from 'algoliasearch';
import {constants} from "App/constants";
import { Touchable } from 'react-native';

const SearchPage = ({navigation}) => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);
    return <SafeAreaView>
    <View style={{flex: 1}}>
        <TextInput style={{borderWidth: 1, height: 40}} value={search} onChangeText={(text)=>{
            setSearch(text);
        }}
        onSubmitEditing={(event)=>{
            var client = algoliasearch(constants.ALGOLIA_ID, constants.ALGOLIA_SEARCH);
            var index = client.initIndex('flocks');
          
            // Perform an Algolia search:
            // https://www.algolia.com/doc/api-reference/api-methods/search/
            return index
              .search(
                event.nativeEvent.text
              )
              .then(function(responses) {
                // Response from Algolia:
                // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
                console.log(responses.hits);
                setResults(responses.hits);
              });
        }}
        />
            {results.map((item)=> {
        return <View style={{height: 100, width: '100%'}}>
            <TouchableOpacity style={{flexDirection: 'row'}} onPress={()=>{navigation.navigate('Product',{album: item.product})}}>
            <Image source = {{uri: item.product.image}} style={{width: 70, height: 70}} />
            <View>
                <Text>
                    {item.product.title}
                </Text>
                <Text>
                    {item.product.price}
                </Text>
            </View>
            </TouchableOpacity>
        </View>
    })}
    </View>

    </SafeAreaView>
};

export default SearchPage;