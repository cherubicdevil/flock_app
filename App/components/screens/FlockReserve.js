import React, {useState} from 'react';
import {View, Text, SafeAreaView, Image, Modal, Button} from 'react-native';


const FlockReserve = ({navigation, route}) => {
    const [modalOpen, setModalOpen] = useState(false);
    console.log(route.params);
    return <SafeAreaView>
        <Button title="back" onPress={()=>navigation.goBack()} style={{position: 'absolute', top: '10'}}/>
        <Image style = {{width: '100%', height: '80%', resizeMode: 'contain'}} source = {{uri: route.params.data.product.image}} />
        <Text>{route.params.data.product.title}</Text>
        <Button title="reserve" onPress={()=>{setModalOpen(!modalOpen)}}/>
        <Modal transparent animationType="slide" visible={modalOpen} style={{justifyContent: 'flex-end'}}>
            <View style={{width: '100%', height: '50%', position: 'absolute', bottom: 0, backgroundColor: 'white'}}><Text>Hi</Text><Text>Hi</Text>
        <Button title="close" onPress={()=>{setModalOpen(!modalOpen)}} />
        </View></Modal>
        </SafeAreaView>;
}

export default FlockReserve;