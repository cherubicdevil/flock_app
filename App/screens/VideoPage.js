import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Video from 'App/components/Video';
import AlbumDetail from 'App/screens/products/AlbumDetail';
import {firebase} from 'App/firebase/config';
import {useDispatch, useSelector} from 'react-redux';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
const config = {
	velocityThreshold: 0.3,
	directionalOffsetThreshold: 80,
};
const renderProduct = (navigation, data) => {
	if (data && data.product) {
		return (
			<AlbumDetail
				album={data.product}
				navigation={navigation}
				style={{position: 'absolute', bottom: 0, width: '100%'}}
			/>
		);
	} else {
		return <View />;
	}
};

const VideoPage = ({navigation, array, index, vis, data}) => {
	const dispatch = useDispatch();
	const [myData, setMyData] = useState(data);
	//setMyData(data);
	console.log('THS IS MY DATA2');
	console.log(myData);
	const [visible, setVisible] = useState(vis);
	//const {ar, data, index} = navigation.state.params;
	const onSwipeUp = (state) => {
		console.log('SWIPING');
		index += 1;
		data = array[index];
		setMyData(array[index]);
		dispatch({type: 'sendData', payload: myData});
	};

	const renderVid = () => {
		if (true) {
			return (
				<View
					style={{
						height: '100%',
						backgroundColor: '#000',
					}}>
					<GestureRecognizer
						onSwipeUp={(state) => onSwipeUp(state)}
						onSwipeDown={(state) => {
							console.log('SWIPE DOWN');
							//console.log(useSelector((state) => state.vidVisible));
							dispatch({type: 'hideVid'});

							//console.log(useSelector((state) => state.vidVisible));
						}}
						config={config}
						style={{
							flex: 1,
							justifyContent: 'flex-start',
						}}>
						<Video data={data} />
						{renderProduct(navigation, data)}
					</GestureRecognizer>
				</View>
			);
		} else {
			return <View />;
		}
	};
	return <View>{renderVid()}</View>;
};

const styles = StyleSheet.create({});

export default VideoPage;
