const ProfileIcon = ({navigation, style}) => {
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate('ProfileMain');
      }}>
      <Image
        style={[
          {
            height: 50,
            width: 50,
            borderRadius: 4,
          },
          style,
        ]}
        source={require('App/Assets/Images/default-profile-picture.jpg')}
      />
    </TouchableWithoutFeedback>
  );
};

export default ProfileIcon;
