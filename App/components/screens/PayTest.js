import React, {PureComponent} from 'react';
import stripe from 'tipsi-stripe';
import {
	View,
	Text,
	TouchableHighlight,
	ActivityIndicator,
	Platform,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';

class Button extends PureComponent {
	static propTypes = {
		text: PropTypes.string.isRequired,
		disabledText: PropTypes.string,
		loading: PropTypes.bool,
		disabled: PropTypes.bool,
		style: PropTypes.any,
		onPress: PropTypes.func.isRequired,
	};

	static defaultProps = {
		disabledText: '',
		loading: false,
		disabled: false,
		style: undefined,
	};

	handlePress = (event) => {
		const {loading, disabled, onPress} = this.props;

		if (loading || disabled) {
			return;
		}

		if (onPress) {
			onPress(event);
		}
	};

	render() {
		const {text, disabledText, loading, disabled, style, ...rest} = this.props;

		return (
			<TouchableHighlight
				{...rest}
				style={[styles.button, style]}
				underlayColor="rgba(0,0,0,0.5)"
				onPress={this.handlePress}>
				<View>
					{loading && <ActivityIndicator animating size="small" />}
					{!loading && !disabled && <Text>{text}</Text>}
					{!loading && disabled && <Text>{disabledText || text}</Text>}
				</View>
			</TouchableHighlight>
		);
	}
}

function testID(id) {
	return Platform.OS === 'android'
		? {accessible: true, accessibilityLabel: id}
		: {testID: id};
}

export default class CardFormScreen extends PureComponent {
	static title = 'Card Form';

	state = {
		loading: false,
		token: null,
	};

	handleCardPayPress = async () => {
		try {
			this.setState({loading: true, token: null});
			const token = await stripe.paymentRequestWithCardForm({
				// Only iOS support this options
				smsAutofillDisabled: true,
				requiredBillingAddressFields: 'full',
				prefilledInformation: {
					billingAddress: {
						name: 'Gunilla Haugeh',
						line1: 'Canary Place',
						line2: '3',
						city: 'Macon',
						state: 'Georgia',
						country: 'US',
						postalCode: '31217',
						email: 'ghaugeh0@printfriendly.com',
					},
				},
			});

			this.setState({loading: false, token});
		} catch (error) {
			this.setState({loading: false});
		}
	};

	render() {
		const {loading, token} = this.state;

		return (
			<View style={styles.container}>
				<Text style={styles.header}>Add Card</Text>
				<Text style={styles.instruction}>
					Click button to enter credit card and billing information. You'll only
					have to do this once. If you need to change your info, go to Profile.
				</Text>
				<Button
					text="Enter payment info"
					loading={loading}
					onPress={this.handleCardPayPress}
					{...testID('cardFormButton')}
				/>
				<View style={styles.token} {...testID('cardFormToken')}>
					{token && (
						<View>
							<TouchableOpacity
								onPress={() => {
									console.log(token);
									const title = this.props.route.params.title;
									const price = this.props.route.params.price;
									const useFlockPrice = this.props.route.params.useFlockPrice;
									const flockPrice = this.props.route.params.flockPrice;
									console.log(this.props.navigation);
									this.props.navigation.navigate('Payment', {
										title,
										price,
										token,
										useFlockPrice,
										flockPrice,
									});
								}}>
								<Text style={{color: '#2B60DE', justifyContent: 'center'}}>
									Continue
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	header: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instruction: {
		textAlign: 'center',
		color: '#333333',
		width: '70%',
		marginBottom: 5,
	},
	token: {
		height: 20,
	},
	button: {
		padding: 8,
		margin: 10,
		height: Platform.OS === 'ios' ? 35 : 40,
		minWidth: 160,
		overflow: 'hidden',
		borderWidth: 1,
		borderRadius: 4,
		backgroundColor: 'white',
		alignItems: 'center',
	},
});

stripe.setOptions({
	// publishableKey:
	// 	'pk_test_51HRYtCBCefwmKQicYNJlKwc3Rv6B8PhDItxUM2210aBt2eI5qZcm5AJTImMQf6zor7c98pP5kPO8WN0rhRtQzyPL00tG4jcyqq',
	publishableKey: 'pk_live_51HRYtCBCefwmKQic3Ydh5x9XYz2Ipv4Uam6O0KURXH9Db9270ZaiIaFxxk4MaudBer7ApMKmA3q2SgHaisdVMDZn00jUe8KTQo',
	//merchantId: 'MERCHANT_ID', // Optional
	//androidPayMode: 'test', // Android only
});
