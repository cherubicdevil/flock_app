import React, {useState} from 'react';
import {
	Dimensions,
	View,
	Text,
	StyleSheet,
	ScrollView,
	Button,
	FlatList,
} from 'react-native';
import {useDispatch} from 'react-redux';
import VideoPageNewNew from 'App/screens/VideoPageNewNew';
import DynImage from 'App/components/masonry/DynImage';
import AlbumDetail from 'App/screens/products/AlbumDetail';
import NavBar from 'App/components/static/NavBar';

const renderArray = (navigation, array) => {
	//console.log('array is!: ', array);
	return array.map((data) => {
		<VideoPageNewNew navigation={navigation} data={data} array={array} />;
	});
};
const VideoCarousel = ({route, navigation, array, index = 0}) => {
	const dispatch = useDispatch();
	const {myArray, setArray} = useState(array);
	const {myIndex, setIndex} = useState(index);

	const renderAlbums = (albums) => {
		return array.map((al) => (
			<View key={al.id + Math.random()} style={styles.outer}>
				<VideoPageNewNew
					key={Math.random()}
					route={route}
					navigation={navigation}
					array={array}
					index={array.indexOf(al)}
					data={al}></VideoPageNewNew>
			</View>
		));
	};
	// console.log('array is: ', array);
	// return (
	// 	<ScrollView
	// 		style={{height: '100%', width: '100%'}}
	// 		horizontal={false}
	// 		pagingEnabled={true}>
	// 		<View>{renderAlbums(array)}</View>
	// 	</ScrollView>
	// );
	// return (
	// 	<View>
	// 		<ScrollView>
	// 			<View key="0" style={{flexDirection: 'row', flex: 1}}>
	// 				<View style={{flex: 1}}>{renderAlbums(array)}</View>
	// 				<View key="1" style={{flex: 1}}>
	// 					{renderAlbums(array)}
	// 				</View>
	// 			</View>
	// 		</ScrollView>
	// 	</View>
	// );

	return (
		<View>
			<ScrollView
				showsVerticalScrollIndicator={false}
				onScroll={function (event: Object) {
					dispatch({
						type: 'sendCarouselIndex',
						payload:
							event.nativeEvent.contentOffset.y /
							Dimensions.get('window').height,
					});
				}}
				horizontal={false}
				pagingEnabled={true}
				style={styles.container}>
				{renderAlbums(array)}
			</ScrollView>

			<NavBar route={route} navigation={navigation} />
		</View>
	);
};

const styles = StyleSheet.create({
	outer: {
		flex: 1,
		width: Dimensions.get('window').width,
		height: Dimensions.get('window').height,
	},
	innerText: {color: '#fff'},
});

export default VideoCarousel;
