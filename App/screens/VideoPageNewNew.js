import React, {useState, useEffect, useRef} from 'react';
import {
	KeyboardAvoidingView,
	ScrollView,
	FlatList,
	Dimensions,
	Image,
	View,
	Text,
	StyleSheet,
	Modal,
	TouchableOpacity,
	TextInput,
	TouchableWithoutFeedback,
	Share,
} from 'react-native';
import CommentsModal from 'App/components/CommentsModal';
import Video from 'App/components/Video';
import StaticVideo from 'App/components/StaticVideo';
//import Share from 'react-native-share';
import AlbumDetail from 'App/screens/products/AlbumDetail';
import VideoDescription from 'App/components/VideoDescription';
import {firebase} from 'App/firebase/config';
import {useDispatch, useSelector} from 'react-redux';
import {constants} from 'App/constants';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
//import {useFocusEffect} from 'react-navigation-hooks';
import {useFocusEffect} from '@react-navigation/native';

const config = {
	velocityThreshold: 0.3,
	directionalOffsetThreshold: 80,
};

const renderProfile = () => {};
const renderProduct = (navigation, data) => {
	if (data && data.product) {
		return (
			<VideoDescription
				album={data.product}
				user={data.username}
				description={data.title}
				navigation={navigation}
				style={{
					position: 'absolute',
					bottom: constants.NAVBARHEIGHT + 20,
					width: '100%',
					zIndex: 20,
				}}
			/>
		);
	} else {
		return <View />;
	}
};

const VideoPageNewNew = ({navigation, array, index, data}) => {
	console.log("THIS IS THIS PAGE's ID", data.id);
	const selector = useSelector((state) => state);
	const dispatch = useDispatch();
	// console.log('NAVIGATION CONTEXT:', navigation);
	const [myData, setMyData] = useState(data);
	const [leavePage, setLeavePage] = useState(false);
	const [paused, setPaused] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

	var lastVisible = null;
	//setMyData(data);
	var db = firebase.firestore();
	//const {ar, data, index} = navigation.state.params;

	var first = db.collection('comments').orderBy('rating').limit(25);

	//fetchAlbums();
	//console.log('THIS IS WHAT A QUERY LOOKS LIKE,', first);

	useFocusEffect(
		React.useCallback(() => {
			setPaused(false);

			return () => setPaused(true);
		}),
	);

	const renderIcons = () => {
		return (
			<View
				style={{
					position: 'absolute',
					right: 10,
					width: 50,
					bottom: '30%',
					zIndex: 25,
				}}>
				<View style={{marginTop: 10}}>
					<Image
						style={{height: 50, width: 50}}
						source={require('App/Assets/Images/heart.png')}
					/>
					<Text style={styles.buttonText}>3</Text>
				</View>
				<View style={{marginTop: 10}}>
					<TouchableOpacity
						onPress={function () {
							dispatch({type: 'toggle'});
							setModalVisible(true);
							console.log('setting modal visible', selector.modal.visible);
						}}>
						<Image
							style={{height: 50, width: 50}}
							source={require('App/Assets/Images/comments-64.png')}
						/>
					</TouchableOpacity>
					<Text style={styles.buttonText}>5</Text>
				</View>
				<TouchableWithoutFeedback
					onPress={() => {
						Share.share({
							message: data.title,
							title: 'Flock Content',
							url: 'https://www.shopwithflock.com/videos/?id=' + data.id,
						});
					}}>
					<Image
						style={{height: 50, width: 50}}
						source={require('App/Assets/Images/arrow.png')}
					/>
				</TouchableWithoutFeedback>
			</View>
		);
	};
	const renderVid = () => {
		return (
			<View
				style={{
					height: '100%',
					backgroundColor: '#000',
					justifyContent: 'flex-start',
				}}>
				<Image
					style={{
						position: 'absolute',
						left: Dimensions.get('window').width / 2 - 50,
						bottom: Dimensions.get('window').height / 2,
						height: 100,
						width: 100,
						zIndex: -10,
					}}
					source={require('App/Assets/Images/flockicon4.png')}
				/>
				<Video
					style={{zIndex: 10}}
					masonry={false}
					paused={paused}
					muted={false || leavePage}
					navigation={navigation}
					data={data}
					index={index}
				/>
				{renderProduct(navigation, data)}
				{renderIcons()}
				<CommentsModal
					data={data}
					toggleFunc={() => {
						setModalVisible(false);
					}}
					modalVisible={modalVisible}
				/>
			</View>
		);
	};
	return <View>{renderVid()}</View>;
};

const styles = StyleSheet.create({
	buttonText: {textAlign: 'center', color: '#fff'},

	centeredView: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	modalView: {
		marginTop: 'auto',
		marginBottom: 0,
		height: '70%',
		width: '100%',
		backgroundColor: 'rgb(250,250,250)',
		borderRadius: 20,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		paddingTop: 30,
		paddingLeft: 0,
		//paddingLeft: 10,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	openButton: {
		backgroundColor: '#999',
		marginRight: 4,
		borderRadius: 20,
		padding: 5,
		paddingTop: 3,
		paddingBottom: 3,

		elevation: 2,
	},
	textStyle: {
		color: 'white',
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalText: {
		marginTop: -20,
		fontSize: 12,
		fontWeight: 'bold',
		marginBottom: 15,
		textAlign: 'center',
	},
	textBold: {
		fontWeight: 'bold',
		fontSize: 10,
		color: '#777',
	},
});

export default VideoPageNewNew;
