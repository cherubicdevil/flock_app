import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Video from 'App/components/Video';
import AlbumDetail from 'App/screens/products/AlbumDetail';
import {firebase} from 'App/firebase/config';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
const config = {
	velocityThreshold: 0.3,
	directionalOffsetThreshold: 80,
};
const renderProduct = (navigation) => {
	if (navigation.state.params.data.product) {
		return (
			<AlbumDetail
				album={navigation.state.params.data.product}
				navigation={navigation}
				style={{position: 'absolute', bottom: 0, width: '100%'}}
			/>
		);
	} else {
		return <View />;
	}
};

const VideoPage = ({navigation}) => {
	const [myAr, setMyAr] = useState(navigation.state.params.ar || []);
	const [myIndex, setMyIndex] = useState(navigation.state.params.index || 0);
	const fetchAlbums = () => {
		const arr = [];
		var counter = 0;
		firebase
			.firestore()
			.collection('posts')
			//.where()
			.limit(7)
			.get()
			.then((querySnapshot) => {
				const n = querySnapshot.size;
				querySnapshot.forEach((doc) => {
					const entity = doc.data();
					//console.log(Image.prefetch(entity.image))
					arr.push(entity);
					counter = counter + 1;
					//console.log(counter);
					if (counter == n) {
						//console.log(ar);
						setMyAr(arr);
						setMyIndex(0);
						// this.setState({
						// 	myAr: ar,
						// 	album1: ar.slice(0, ar.length / 2),
						// 	album2: ar.slice(ar.length / 2, ar.length),
						// });
					}
				});
			});
	};
	//const {ar, data, index} = navigation.state.params;
	const ar = navigation.state.params.ar;
	const index = (navigation.state.params.index || 0) + 1;
	const data = myAr[index];
	if (ar === null || ar === undefined) fetchAlbums();
	const onSwipeUp = (state) => {
		console.log('SWIPING');
		navigation.navigate('VideoPage', {myAr, index, data});
	};
	return (
		<View style={{flex: 1, backgroundColor: '#000', justifyContent: 'center'}}>
			<GestureRecognizer
				onSwipeUp={(state) => onSwipeUp(state)}
				onSwipeDown={(state) => navigation.navigate('Home')}
				config={config}
				style={{
					flex: 1,
					justifyContent: 'center',
				}}>
				<Video data={navigation.state.params.data} />
				{renderProduct(navigation)}
			</GestureRecognizer>
		</View>
	);
};

const styles = StyleSheet.create({});

export default VideoPage;
