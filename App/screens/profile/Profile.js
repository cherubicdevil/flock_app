import React, {useState, useEffect} from 'react';
import {
	View,
	Text,
	StyleSheet,
	Button,
	TextInput,
	TouchableOpacity,
	Image,
	Platform,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
//import Input from 'App/components/common/Input';
import {firebase} from 'App/firebase/config';

import NavBar from 'App/components/static/NavBar';
//import Base64 from 'base-64';

// global.atob = Base64.encode;

const user = firebase.auth().currentUser;

function urlToBlob(url) {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();
		xhr.onerror = reject;
		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				resolve(xhr.response);
			}
		};
		xhr.open('GET', url);
		xhr.responseType = 'blob'; // convert type
		xhr.send();
	});
}

const uploadImage = async ({data, filename, uri}) => {
	if (typeof global.atob === 'undefined') {
		global.atob = (a) => Buffer.from(a, 'base64').toString('binary');
	}

	const metadata = {
		contentType: 'image/jpeg',
	};
	const ext = uri.split('.').pop();
	const name = uri.split('/').pop();
	const path = `${user.uid}_${name}`;
	const storageRef = firebase.storage().ref(`profiles/${path}`);

	// var url = 'data:image/jpeg;base64,' + data;
	// var blob = Base64.decode(data, 0);
	// console.log(blob);
	// storageRef.put(blob, metadata);
	// fetch(url)
	// 	.then((res) => {
	// 		//console.log(res);
	// 		const blob = res.blob();
	// 		console.log(blob);
	// 		// for (i = 0; i < 10; i++) {
	// 		// 	console.log(blob[i]);
	// 		// }
	// 		const blob
	// 		storageRef.put(blob.__data);
	// 	})
	// 	.then(console.log);
	//console.log(data.substring(0, 20));
	const dataURL = 'data:image/jpeg;base64,' + data;
	urlToBlob(dataURL).then((blob) => {
		storageRef
			.put(blob)
			.then(function (snapshot) {
				const downloadURL = snapshot.ref.getDownloadURL().then((link) => {
					console.log('link: ', link);
					user.updateProfile({photoURL: link});
				});
			})
			.then(() => console.log('SUCESS'));
	});

	// storageRef
	// 	.putString(data.trim(), 'base64', metadata)
	// 	.then(function (snapshot) {
	// 		const downloadURL = snapshot.ref.getDownloadURL().then((link) => {
	// 			console.log('link: ', link);
	// 			user.updateProfile({photoURL: link});
	// 		});

	// 		//

	// 		console.log('SUCCESSSSS');
	// 	});
};

const Profile = ({navigation}) => {
	const options = {
		maxWidth: 512,
		maxHeight: 512,
	};

	const [username, setUserName] = useState(user.displayName || '');
	const [email, setEmail] = useState(user.email || '');
	console.log('photoURL', user.photoURL);
	const [avatar, setAvatar] = useState({
		//user.photoUrl,
		uri: user.photoURL,
	});
	useEffect(() => {}, []);
	return (
		<View style={{flex: 1, marginLeft: 40}}>
			<View style={{flex: 2, paddingTop: 40}}>
				<Text style={{fontSize: 24, marginBottom: 20}}>Update Info</Text>
				<TouchableOpacity
					onPress={() => {
						ImagePicker.showImagePicker(options, (response) => {
							//console.log('Response = ', response);

							if (response.didCancel) {
								console.log('User cancelled image picker');
							} else if (response.error) {
								console.log('ImagePicker Error: ', response.error);
							} else if (response.customButton) {
								console.log(
									'User tapped custom button: ',
									response.customButton,
								);
							} else {
								console.log(response.uri);
								uploadImage(response);

								setAvatar({uri: response.uri});
							}
						});
					}}>
					<Image
						style={{width: 120, height: 120, borderRadius: 60}}
						source={avatar}
					/>
				</TouchableOpacity>
				<View style={{margin: 5, marginTop: 20}}>
					<Text>Username</Text>
					<TextInput
						label="Username"
						placeholder={'John Doe'}
						onChangeText={(text) => {
							//console.log(text);
							setUserName(text);
						}}
						style={styles.inputStyle}
						value={username}
					/>
				</View>
				<View style={{margin: 5}}>
					<Text>Email</Text>
					<TextInput
						label="Email"
						placeholder={'email'}
						onChangeText={(text) => {
							//console.log(text);
							setEmail(text);
						}}
						style={styles.inputStyle}
						value={email}
					/>
				</View>
				<Button
					title="update"
					onPress={() => {
						user.updateProfile({displayName: username});
						user.updateEmail(email);
					}}
				/>
				<Button
					style={{position: 'absolute', right: 0}}
					onPress={() => firebase.auth().signOut()}
					title="logout"
				/>
			</View>
			{/*<NavBar style={{ flex: 3 }} navigation={navigation} />*/}
		</View>
	);
};

const styles = StyleSheet.create({
	inputStyle: {
		fontSize: 14,
		padding: 5,
		borderRadius: 3,
		borderWidth: 1,
	},
});

export default Profile;
