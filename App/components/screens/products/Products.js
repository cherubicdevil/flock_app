import React, {Component} from 'react';
import {ScrollView, StyleSheet, FlatList, View, Button} from 'react-native';
import AlbumDetail from './AlbumDetail';
import {firebase} from 'App/firebase/config';

class Products extends Component {
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
			<AlbumDetail
				key={album.title}
				navigation={this.props.navigation}
				album={album}
			/>
		));
	}
	render() {
		console.log(this.state);

		return (
			<ScrollView>
				<View>{this.renderAlbums(this.state.albums)}</View>
			</ScrollView>
		);
	}
}

const styles = StyleSheet.create({});

export default Products;
