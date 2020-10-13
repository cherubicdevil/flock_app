import React, {useState, useEffect} from 'react';
import {
	FlatList,
	TouchableWithoutFeedback,
	View,
	ScrollView,
	Text,
	StyleSheet,
	TextInput,
	Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {firebase} from 'App/firebase/config';
import {
	Header,
	Button,
	CardSection,
	Spinner,
	Input,
} from 'App/components/common';
import NavBar from 'App/components/static/NavBar';
import FeedList from 'App/components/masonry/FeedList';
import Brochures from 'App/components/masonry/Brochures';
import SideScroll from 'App/components/miscell/SideScroll';
import VideoPage from 'App/screens/VideoPage';
import VideoCarousel from 'App/screens/VideoCarousel';

import HomeHeader from './HomeHeader';

const Home = ({route, navigation}) => {
	const [myAr, setMyAr] = useState([]);
	const [productAr, setProductAr] = useState([]);
	//console.log('VIDVISIBLE: ', navigation.state.params.vidVisible);
	//	console.log('navigation params:', navigation.state.params);
	console.log('THIS IS NAVIGATION: ', route.params.vidVisible);
	let params;
	// if (navigation.state.params) {
	// 	console.log(navigation.state.params.vidVisible);
	// 	params = navigation.state.params.vidVisible;
	// } else {
	// 	params = false;
	// }
	console.log('PARAMS: ', route.params);
	const [vidVisible, setVidVisible] = useState(true);

	useEffect(() => {
		console.log('CHANGING');
		setVidVisible(route.params.vidVisible);
	});

	console.log('start of vidVisible:', vidVisible);
	const [index, setIndex] = useState(0);
	const dispatch = useDispatch();

	const fetchAlbums = () => {
		const ar = [];
		var counter = 0;
		firebase
			.firestore()
			.collection('posts')
			.where('type', '==', 'video')
			.limit(3)
			.get()
			.then((querySnapshot) => {
				//console.log(querySnapshot.getKey());
				const n = querySnapshot.size;

				querySnapshot.forEach((doc) => {
					//console.log('THIS IS TEH KEY', doc.id);

					const entity = {...doc.data(), id: doc.id};
					//console.log(Image.prefetch(entity.image))
					console.log('DFISL:KFJDSL:FJDS', entity);
					ar.push(entity);
					counter = counter + 1;
					//console.log(counter);
					if (counter == n) {
						//console.log(ar);
						setMyAr(ar);
						dispatch({type: 'sendData', payload: ar[0]});
						//console.log('HERE IS MY MAR', ar);
						// this.setState({
						// 	myAr: ar,
						// 	album1: ar.slice(0, ar.length / 2),
						// 	album2: ar.slice(ar.length / 2, ar.length),
						// });
					}
				});
			});

		const productAr = [];
		counter = 0;
		firebase
			.firestore()
			.collection('products')
			.limit(6)
			.get()
			.then((querySnapshot) => {
				const n = querySnapshot.size;
				querySnapshot.forEach((doc) => {
					const entity = doc.data();

					productAr.push(entity);
					counter = counter + 1;
					if (counter == n) {
						setProductAr(productAr);
					}
				});
			});
	};

	const renderOverview = () => {
		const vidIndex = useSelector((state) => state.videopage.vidIndex);
		const {vidData: vidData} = useSelector((state) => state.videopage);
		console.log('THIS IS VIDVISIBLE: ', vidVisible);
		//console.log(vidVisible, vidData, vidIndex);
		if (vidVisible) {
			//useDispatch()({type: 'hideVid'});
			return (
				<View
					style={{
						width: '100%',
						height: '100%',
						backgroundColor: '#000',
						position: 'absolute',
						bottom: 0,
						left: 0,
						zIndex: 200,
						flex: 1,
						backgroundColor: '#000',
						justifyContent: 'center',
					}}>
					<VideoCarousel
						route={route}
						navigation={navigation}
						array={myAr}
						index={index}
						data={vidData}
						style={{}}
					/>
				</View>
			);
		} else {
			return <View />;
		}
	};

	var user = firebase.auth().currentUser;
	//console.log(myAr);
	return (
		<View style={{flex: 1, backgroundColor: '#fff'}}>
			<View style={styles.sectionOneStyle}>
				<View style={styles.topBox}>
					<Image
						style={styles.iconStyle}
						source={require('App/Assets/Images/flockicon4.png')}
					/>
					<TextInput style={styles.textBoxStyle} />
					{/*<Button onPress={() => navigation.navigate('')} />*/}
				</View>
			</View>

			{/*<View style={styles.sectionTwoStyle}>
				<SideScroll />
			</View>*/}
			<View style={styles.sectionThreeStyle}>
				<FeedList
					fetchAlbums={fetchAlbums}
					array={myAr}
					productArray={productAr}
					navigation={navigation}
				/>
			</View>

			<NavBar route={route} navigation={navigation} />
			{renderOverview()}
		</View>
	);
};

const styles = StyleSheet.create({
	sectionOneStyle: {
		paddingLeft: 5,
		paddingBottom: 5,
		paddingRight: 5,
		width: '100%',
		flex: 3,
		flexDirection: 'row',
		marginTop: 35,
		//height: '20%',
		//shadowOffset: { width: 0, height: 2 },
		borderRadius: 3,
		backgroundColor: '#db9421',
		backgroundColor: '#FFF',
	},
	topBox: {
		flexDirection: 'row',
		flex: 8,
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 15,
		paddingRight: 15,
		backgroundColor: '#FFF',
		borderWidth: 2,
		borderColor: '#db9421',
		borderRadius: 15,
	},
	textBoxStyle: {
		flex: 8,
	},
	sectionTwoStyle: {
		flex: 1.5,
		marginBottom: 5,
	},
	sectionThreeStyle: {
		flex: 55,
	},
	twoColumnStyle: {
		flexDirection: 'row',
	},
	columnStyle: {
		flex: 1,
	},
	logout: {
		flex: 1,
		borderRadius: 2,
		backgroundColor: '#000',
	},
	sectionFourStyle: {
		marginTop: 10,
		flex: 7,

		//backgroundColor: '#000',
	},
	iconStyle: {
		marginLeft: 5,
		marginRight: 5,
		marginBottom: 15,
		flex: 1,
		resizeMode: 'cover',
		height: '100%',
		width: 24,
		borderRadius: 12,
	},
});

export default Home;
