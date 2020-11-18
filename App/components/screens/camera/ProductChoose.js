import React, {Component} from 'react';
import {
	TouchableHighlight,
	ScrollView,
	StyleSheet,
	FlatList,
	View,
	Button,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AlbumDetail from 'App/screens/products/AlbumDetail';
import {firebase} from 'App/firebase/config';

class ProductChoose extends Component {
	state = {albums: []};

	componentDidMount() {
		// fetch('http://rallycoding.herokuapp.com/api/music_albums')
		// 	.then((response) => response.json())
		// 	.then((responseData) => {
		// this.setState({
		// 	album1: responseData.slice(0, responseData.length / 2),
		// 	album2: responseData.slice(responseData.length / 2, responseData.length),
		// });
		// 		console.log(responseData);
		// 	});

		const ar = [];
		var counter = 0;
		firebase
			.firestore()
			.collection('products')
			.get()
			.then((querySnapshot) => {
				const n = querySnapshot.size;
				querySnapshot.forEach((doc) => {
					const entity = doc.data();

					ar.push(entity);
					counter = counter + 1;
					console.log(counter);
					if (counter == n) {
						this.setState({
							albums: ar,
						});
					}
				});
			});
	}

	renderAlbums(albums) {
		return albums.map((album) => (
			<TouchableOpacity
				key={album.title + Math.random()}
				onPress={() => {
					console.log('hello worllddd');
					this.props.setProduct(album);
					this.props.showFunc();
				}}>
				<AlbumDetail
					key={album.title}
					navigation={this.props.navigation}
					album={album}
				/>
			</TouchableOpacity>
		));
	}
	render() {
		//console.log(this.state);
		console.log('HELLOOO');
		return (
			<ScrollView>
				<View style={{height: 30}} />
				<View>{this.renderAlbums(this.state.albums)}</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({});

export default ProductChoose;
