import React, {useState} from 'react';
import {
	Dimensions,
	View,
	Text,
	StyleSheet,
	Image,
	TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
//import Video from 'react-native-video';
import FastImage from 'react-native-fast-image';
//import AnimatedLoader from 'react-native-animated-loader';
import {increaseAction} from 'App/actions';
import {firebase} from 'App/firebase/config';
import Video from 'App/components/Video';
import RVideo from 'react-native-video';

const berryRate = 0.2;

const database = firebase.database();

const renderBerry = () => {
	const [berryVisible, setBerry] = useState(true);
	const ran = Math.random();
	const dispatch = useDispatch();
	if (ran < berryRate && berryVisible) {
		return (
			<TouchableOpacity
				style={{
					position: 'absolute',
					width: 64,
					height: 64,
					top: 0,
					left: 0,
					zIndex: 50,
				}}
				onPress={() => {
					const userId = firebase.auth().currentUser.uid;
					//const value = database.ref('users/'+userId).
					//database.ref('users/' + userId).set({eggs: 100});
					setBerry(false);
					dispatch({type: 'increase'});
				}}>
				<Image
					style={{width: 30, height: 30}}
					source={require('App/Assets/Images/Berry_Percent.png')}
				/>
			</TouchableOpacity>
		);
	} else {
		return <View />;
	}
};

const DynImage = ({
	mute,
	repeat,
	ar,
	index,
	style,
	source,
	title,
	type,
	video,
	navigation,
	data,
}) => {
	const [width, setWidth] = useState(Dimensions.get('window').width / 2 - 10);
	const [height, setHeight] = useState(0);
	const [vHeight, setVHeight] = useState(20);
	const [loading, setLoad] = useState(false);
	const maxWidth = Dimensions.get('window').width / 2 - 10;
	const maxHeight = Dimensions.get('window').height;
	if (data.type !== 'video') {
		Image.getSize(
			source.uri,
			(srcWidth, srcHeight) => {
				const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
				//console.log(source.uri, srcWidth, srcHeight);
				setWidth(srcWidth * ratio);
				setHeight(srcHeight * ratio);
				// console.log(`successful imageGet: ${srcWidth} ${srcHeight}`)
			},
			() => {
				//console.log(source.uri);
				setWidth(Dimensions.get('window').width / 2 - 10);
				setHeight(100);
			},
		);
	}
	//console.log(width, height);

	const renderMedia = () => {
		if (type !== null && type === 'video') {
			const dispatch = useDispatch();
			return (
				<TouchableOpacity
					onPress={() => {
						//console.log('DISPATCH PROBLEM?');
						dispatch({type: 'sendData', payload: data});
						dispatch({type: 'showVid'});
						navigation.navigate('Home', {vidVisible: true, scrollIndex: index});
					}}>
					<Video
						masonry={true}
						muted={true}
						paused={false}
						repeat={repeat}
						data={data}
						maxWidth={width}
					/>
				</TouchableOpacity>
			);
		} else {
			return (
				<FastImage
					style={[styles.mediaStyle, {width: width, height: height}]}
					source={{
						uri: source.uri,
					}}
				/>
			);
		}
	};
	return (
		<View style={{marginLeft: 5, width: width}}>
			{renderBerry()}
			{renderMedia()}
			<View
				style={{
					width: '100%',
					backgroundColor: 'rgba(0,0,0,0.8)',
					borderBottomLeftRadius: 15,
					borderBottomRightRadius: 15,
				}}>
				<Text style={{marginLeft: 10, color: '#fff'}}>{title}</Text>
			</View>
			<View style={{height: 10}} />
		</View>
	);
};

const styles = StyleSheet.create({
	textStyle: {
		color: '#fff',
		backgroundColor: 'rgba(0,0,0,0.3)',
	},
	mediaStyle: {
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,

		backgroundColor: 'rgba(0,0,0,0.3)',
	},
});

export default DynImage;
