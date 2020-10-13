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
} from 'react-native';
import Video from 'App/components/Video';
import StaticVideo from 'App/components/StaticVideo';
import AlbumDetail from 'App/screens/products/AlbumDetail';
import VideoDescription from 'App/components/VideoDescription';
import {firebase} from 'App/firebase/config';
import {useDispatch, useSelector} from 'react-redux';
import {constants} from 'App/constants';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
//import {useFocusEffect} from 'react-navigation-hooks';
import {useFocusEffect} from '@react-navigation/native';

const renderPostTime = (nowDate, thenDate) => {
	//console.log(nowDate, thenDate);
	const milli = nowDate - thenDate;
	console.log(
		'THIS IS THE TIME: ',
		milli,
		nowDate.getTime(),
		thenDate.seconds * 1000,
	);
	const oneSecond = 1000;
	const oneMinute = 60 * oneSecond;
	const oneHour = 60 * oneMinute;
	const oneDay = 24 * oneHour;
	const oneWeek = 7 * oneDay;
	const oneMonth = 30 * oneDay;
	const oneYear = 365 * oneYear;

	const years = Math.floor(milli / oneYear);
	if (years > 0) {
		return `${years} years ago`;
	}

	const months = Math.floor(milli / oneMonth);
	if (months > 0) {
		return `${months} months ago`;
	}
	const weeks = Math.floor(milli / oneWeek);
	if (weeks > 0) {
		return `${weeks} weeks ago`;
	}
	const days = Math.floor(milli / oneDay);
	if (days > 0) {
		return `${days} days ago`;
	}
	const hours = Math.floor(milli / oneHour);
	if (hours > 0) {
		return `${hours} hours ago`;
	}
	const minutes = Math.floor(milli / oneMinute);
	if (minutes > 0) {
		return `${minutes} minutes ago`;
	}
	const seconds = Math.floor(milli / oneSecond);
	if (seconds > 0) {
		return `${seconds} seconds ago`;
	}
	return 'now';
};
const CommentsModal = ({modalVisible, data, toggleFunc}) => {
	const dispatch = useDispatch();
	console.log('WHY IS THIS NOT RERENDERING, ', modalVisible);
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState('');
	var replyText = 'Add comment...';
	const [replyPlaceholder, setReplyPlaceholder] = useState('Add comment...');
	const [editing, setEditing] = useState(false);

	console.log('STARTS OUT AS:', modalVisible);
	const [modalVis, setModalVis] = useState(modalVisible || true);
	const inputEl = useRef(null);
	const flatRef = useRef(null);
	const selector = useSelector((state) => state);
	var queryCursor;
	const fetchComments = () => {
		const ar = [];
		var counter = 0;
		console.log('HLELLOO');
		firebase
			.firestore()
			.collection('comments')
			.where('cluck', '==', `${data.id}`)
			//.orderBy('date', 'desc')
			.limit(10)
			.get()
			.then((querySnapshot) => {
				//console.log(querySnapshot.getKey());
				const n = querySnapshot.size;
				querySnapshot.forEach((doc) => {
					const entity = doc.data();
					console.log(entity.cluck, data.id);
					ar.push(entity);
					counter = counter + 1;
					if (counter == n - 1) {
					}
					if (counter == n) {
						//console.log('THIS IS ARRRRR', ar);
						//console.log('THIS IS TRUE ID: ', data.id);
						setComments(ar);
					}
				});
			});
	};

	useEffect(() => {
		fetchComments();
		//setSendFunction(() => sendOgComment);

		//setModalVis(modalVisible);
	}, []);

	const sendReply = (event) => {
		if (event.nativeEvent.text.trim() !== '') {
			const user = firebase.auth().currentUser;
			var db = firebase.firestore();
			const id = 'UbWIMWFCOGbs00S2ZcPN';
			const newReplies = this.replies + 1;
			console.log(this.replies, this.children);
			this.children.add({
				user: {
					name: user.displayName,
					photoURL: user.photoURL,
					userId: user.uid,
				},

				cluck: data.id,
				text: 'TESTING REPLY',
				likes: 2,
			});
			db.collection('comments').doc(id).update({
				replies: newReplies,
				children: newChildren,
			});
			//inputEl.value = '';
		}
	};
	const sendOgComment = (event) => {
		if (event.nativeEvent.text.trim() !== '') {
			const user = firebase.auth().currentUser;
			const db = firebase.firestore();
			const docId = db.collection('comments').doc().id;
			const commentData = {
				user: {
					name: user.displayName,
					photoURL: user.photoURL,
					userId: user.uid,
				},
				parent: null,
				date: new Date().getTime(),
				commentId: docId,
				cluck: data.id,
				text: event.nativeEvent.text,
				likes: 2,
				replies: 0,
				children: [],
			};
			db.collection('comments').doc(docId).set(commentData);
			console.log('success?');
			setComment('');
		}
	};

	var sendFunction = sendOgComment;
	console.log('sendfunction,', sendFunction);

	const MemImage = React.memo(({source}) => {
		return <Image source={source} style={styles.profileStyle} />;
	});
	const Comment = ({item}) => {
		return (
			<View key={item.text} style={styles.commentWrapperStyle}>
				<View style={{flex: 1, flexDirection: 'row'}}>
					<Image
						source={{
							uri: item.user.photoURL,
						}}
						style={styles.profileStyle}
					/>
					<View>
						<View style={{flex: 1, flexDirection: 'row'}}>
							<Text style={styles.textBold}>{item.user.name}</Text>
							<Text style={styles.textBold}>
								{renderPostTime(new Date(), item.date)}
							</Text>
						</View>
						<View
							onStartShouldSetResponder={() => true}
							onResponderGrant={() => {
								setReplyPlaceholder(`Reply to ${item.user.name}`);
								console.log(replyText);
								inputEl.current.focus();
								sendFunction = sendReply;
							}}>
							<Text style={styles.commentTextStyle}>{item.text}</Text>
						</View>
					</View>
				</View>
				<RepliesButton item={item} />
			</View>
		);
	};
	const RepliesButton = ({item}) => {
		const [showReplies, setShowReplies] = useState(false);
		const renderReplies = () => {
			if (showReplies) {
				console.log(item.children);
				return (
					<View>
						<FlatList
							keyExtractor={(item) => item.text}
							data={item.children}
							renderItem={(it) => {
								console.log(it.item.text);
								return <Comment item={it.item} />;
							}}
						/>
						<TouchableWithoutFeedback
							onPress={() => {
								setShowReplies(false);
							}}>
							<Text style={styles.textBoldHide}>Hide Replies</Text>
						</TouchableWithoutFeedback>
					</View>
				);
			} else {
				return (
					<TouchableWithoutFeedback
						onPress={() => {
							setShowReplies(true);
						}}>
						<Text style={styles.textBoldShow}>View Replies</Text>
					</TouchableWithoutFeedback>
				);
			}
		};
		if (item.replies > 0) {
			return <View>{renderReplies()}</View>;
		} else {
			return <View />;
		}
	};
	console.log('COMMENTS:', data.id, comments);
	return (
		<Modal animationType="slide" transparent={true} visible={modalVisible}>
			<KeyboardAvoidingView behavior="padding" style={styles.centeredView}>
				<View
					style={styles.modalView}
					onStartShouldSetResponderCapture={() => false}
					onMoveShouldSetResponder={() => false}
					onStartShouldSetResponder={() => {
						console.log('tapping');
						setReplyPlaceholder('Add comment...');
						return false;
					}}
					onResponderGrant={() => {
						console.log('tappingggg');
					}}
					onResponderReject={() => {
						console.log('nothing happening');
					}}
					onResponderTerminationRequest={(env) => true}
					onResponderTerminate={() => {
						console.log('lost responder');
					}}>
					<Text style={styles.modalText}>Comments</Text>
					<ScrollView
						showsVerticalScrollIndicator={false}
						onScrollEndDrag={(e) => {
							let paddingToBottom = 10;
							paddingToBottom += e.nativeEvent.layoutMeasurement.height;
							if (
								e.nativeEvent.contentOffset.y >=
								e.nativeEvent.contentSize.height - paddingToBottom
							) {
								console.log('reach end');
							}
						}}
						style={{width: '100%'}}>
						<View
							onMoveShouldSetResponder={(evt) => true}
							onResponderGrant={() => {
								console.log('scroll got it');
							}}>
							{(function () {
								return comments.map((item) => (
									<Comment key={item.text} item={item} />
								));
							})()}
						</View>
					</ScrollView>
					{/*<ScrollView showsVerticalScrollIndicator={false}>
							<Text>{lorem}</Text>
						</ScrollView>*/}
					<TextInput
						type="reset"
						elevation={2}
						placeholder={replyPlaceholder}
						placeholderTextColor="#777"
						ref={inputEl}
						onSubmitEditing={(event) => {
							sendFunction(event);
							fetchComments();
						}}
						style={styles.textInputStyle}
					/>
					<TouchableOpacity
						style={styles.openButton}
						onPress={() => {
							dispatch({type: 'toggle'});
							toggleFunc();
							//setModalVis(false);
						}}>
						<Text style={styles.textStyle}>X</Text>
					</TouchableOpacity>
				</View>
			</KeyboardAvoidingView>
		</Modal>
	);
};

const styles = StyleSheet.create({
	buttonText: {textAlign: 'center', color: '#fff'},

	centeredView: {
		flex: 1,
		flexDirection: 'column',
		justifyContent: 'flex-end',
		alignItems: 'flex-start',
	},
	modalView: {
		//marginTop: 'auto',
		//marginBottom: 0,
		height: '70%',
		width: '100%',
		backgroundColor: 'rgb(250,250,250)',
		borderRadius: 20,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 0,
		padding: 0,
		paddingTop: 30,
		alignItems: 'flex-start',
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
		position: 'absolute',
		right: 5,
		top: 5,
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
		alignSelf: 'center',
		textAlign: 'center',
	},
	textBold: {
		paddingRight: 10,
		fontWeight: 'bold',
		fontSize: 10,
		color: '#777',
	},
	textBoldShow: {
		paddingTop: 5,
		marginLeft: 40,
		fontWeight: 'bold',
		fontSize: 10,
		color: '#777',
	},
	textBoldHide: {
		marginTop: 5,
		marginLeft: 40,
		fontWeight: 'bold',
		fontSize: 10,
		color: '#777',
		marginTop: -5,
	},
	profileStyle: {
		marginRight: 10,
		width: 30,
		height: 30,
		borderRadius: 10,
	},
	commentTextStyle: {
		marginTop: 5,
		flexDirection: 'row',
		flexWrap: 'wrap',
		//width: '90%',
	},
	commentWrapperStyle: {paddingBottom: 10, paddingTop: 20, marginLeft: 20},
	textInputStyle: {
		paddingLeft: 10,
		paddingTop: 0,
		shadowColor: '#ddd',

		borderTopWidth: 0.2,
		borderColor: '#777',
		paddingBottom: 20,
		height: 60,
		width: '100%',
		backgroundColor: '#fff',
		position: 'absolute',
		bottom: 0,
	},
});

export default CommentsModal;
