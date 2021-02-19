import React, {useState, Fragment, useContext, createContext} from 'react';
import {SafeAreaView, ScrollView, View, Text, TextInput,Image, TouchableOpacity, Dimensions} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import FeedList from 'App/components/screens/home/feed/FeedList';
import algoliasearch from 'algoliasearch';
import {constants} from "App/constants";
// import { Touchable } from 'react-native';
import ResizeableImage from 'App/components/ResizeableImage';
// import Icon from 'react-native-vector-icons/FontAwesome';
const KeyContext = createContext();

const InitialText = () => {
    return <View style={{alignSelf: 'center', width: 200,marginTop: 30,}}>
        <View style={{alignSelf: 'center', paddingBottom: 20}}>
        <Icon name="arrow-circle-o-up" size={25} color={constants.LAVENDER} />
        </View>
        <Text style={{color: constants.LAVENDER, textAlign: 'center'}}>Search for products and flocks within our app.</Text>
        <Text style={{color: constants.LAVENDER, textAlign: 'center', marginTop: 20}}>If you're looking for a specific flock, prepend "%" before the id.</Text>
        
    </View>
}

const NoResults = () => {
    return <View style={{alignSelf: 'center', width: 200,marginBottom: 100,}}>
        <Text style={{color: constants.LAVENDER, textAlign: 'center'}}>Can't find what you're looking for? Add it yourself!</Text>
        <View style={{alignSelf: 'center', paddingTop: 20}}>
        <Icon name="arrow-circle-o-down" size={25} color={constants.LAVENDER} />
        </View>
    </View>
}

const SearchPage = ({navigation, route}) => {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);


    console.log('no results', search!=="" && results.length ==0 )
    return <Fragment><SafeAreaView style={{ flex: 0, backgroundColor: constants.TRANSLUCENT }} /><SafeAreaView style={{ flex: 1, backgroundColor: constants.PINK_BACKGROUND_OPAQUE }}>
        <LinearGradient
    colors={[constants.TRANSLUCENT, 'white']}
    start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }}
    style={{
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      paddingTop: 10,
      paddingBottom: 20,
      borderBottomRightRadius:20,
      borderBottomLeftRadius: 20,
      paddingLeft: 20,
      paddingRight: 20,
      //shadowColor: "#ff7009", shadowOffset: {height: 10, width: 0}, shadowOpacity: 0.39, elevation: 13, shadowRadius: 28.30,
      //alignItems: 'center',
    }}>
        <View style={{alignItems: 'center', flexDirection:'row', paddingLeft: 20, paddingRight: 20, borderWidth: 1, height: 40, width: '100%', borderRadius: 30, borderWidth: 1, borderColor: constants.DARKGREY}}>
            <Icon name="search" size={20} color={constants.DARKGREY}/>
    <TextInput 
    selectTextOnFocus
    onSubmitEditing
    placeholder="Search"
    style={{marginLeft: 10, width: '100%'}}
     value={search} onChangeText={(text)=>{
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
        </View>
    </LinearGradient>
    
    <ScrollView scrollEnabled={true} style={{flex: 1}}>
        
            {/* {results.map((item)=> {
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
    })} */}
    {search === ""?<InitialText/>:<></> }
    <FeedList videoData={results} navigation={navigation} route={route} 
    feedItem={(item)=>{
        var dataType = item.type;
        
        return <FeedItemTemp item={item} navigation = {navigation} dataType={item.type} image={item.product.image} />;
    }}
    />
    </ScrollView>
    {search !== "" && results.length == 0?<NoResults />:<></>}
    </SafeAreaView></Fragment>
};

const FeedItemTemp = ({navigation, image, item, type}) => {
    const [width, setWidth] = useState(0);
    return <View onLayout={(event)=>{
        setWidth(event.nativeEvent.layout.width);
    }}
    style={{resizeMode: 'cover', width: '100%'}}>
        <TouchableOpacity onPress={()=>{
            console.log(item);
            if (type !== "rent") {
                navigation.navigate("Product", {album: item.product, flockId: item.objectID, data: item, id: item.objectID})
            } else {
                navigation.navigate("Home");
            }
            
        }}>
    <ResizeableImage source={{uri: image}} wLimit = {width} />
    </TouchableOpacity>
    </View>
}

export default SearchPage;