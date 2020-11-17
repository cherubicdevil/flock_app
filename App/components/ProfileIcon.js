/* 
* Made by Kevin Gao, for Flock Shopping.
* All rights reserved.
* Flock © 2020
*
*
			 _______  ___        ______    ______   __   ___  
			/"     "||"  |      /    " \  /" _  "\ |/"| /  ") 
			(: ______)||  |     // ____  \(: ( \___)(: |/   /  
			\/    |  |:  |    /  /    ) :)\/ \     |    __/   
			// ___)   \  |___(: (____/ // //  \ _  (// _  \   
			(:  (     ( \_|:  \\        / (:   _) \ |: | \  \  
			\__/      \_______)\"_____/   \_______)(__|  \__)
*
*/
/*
 * ProfileIcon.js
 *
 * This file contains code for the default ProfileIcon of flock the app.
 * It shows on the Egg screen.
 *
 *
 */
import {constants} from 'App/constants';
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
        source={constants.DEFAULT_PROFILE_ICON1}
      />
    </TouchableWithoutFeedback>
  );
};

export default ProfileIcon;
