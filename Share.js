import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  TextInput,
} from 'react-native';
import {ShareMenuReactView} from 'react-native-share-menu';
import {firebase} from 'App/firebase/config';

const fetchURL =
  'https://powerful-everglades-32172.herokuapp.com/find_product/';
const Button = ({onPress, title, style}) => (
  <Pressable onPress={onPress}>
    <Text style={[{fontSize: 16, margin: 16}, style]}>{title}</Text>
  </Pressable>
);
async function loadGraphicCards(url, page = 1) {
  try {
    const searchUrl = `https://www.amazon.de/s/?page=${page}&keywords=graphic+card`;
    const response = await fetch(searchUrl); // fetch page

    const htmlString = await response.text(); // get response text
    //const $ = cheerio.load(htmlString); // parse HTML string
    return 'HELLOWORLD';
    // return {
    //   // map to an list of objects
    //   asin: $(li).data('asin'),
    //   title: $('h2', li).text(),
    //   price: $('span.a-color-price', li).text(),
    //   rating: $('span.a-icon-alt', li).text(),
    //   imageUrl: $('img.s-access-image').attr('src'),
    // };
  } catch (err) {
    console.log(err);
  }
}

const Share = () => {
  const [sharedData, setSharedData] = useState('');
  const [sharedMimeType, setSharedMimeType] = useState('');
  const [sending, setSending] = useState(false);
  const [sendable, setSendable] = useState(false);
  const [myData, setMyData] = useState('');

  useEffect(() => {
    ShareMenuReactView.data().then(({mimeType, data}) => {
      setSharedData(data);
      setSharedMimeType(mimeType);
    });
  }, []);

  const getInfo = () => {
    fetch(fetchURL.concat(sharedData))
      .then((response) => response.json())
      .then((responseData) => {
        setMyData(responseData);
        setSendable(true);
      });
  };

  const sendInfo = () => {};
  const renderData = () => {
    if (myData) {
      return (
        <View style={{flex: 1, marginBottom: 20}}>
          <Image
            source={{uri: myData.image}}
            style={{
              borderColor: '#999',
              borderWidth: 1,
              width: 100,
              height: 100,
            }}
          />
          <TextInput
            multiline
            numberOfLines={4}
            style={styles.inputStyle}
            value={myData.title}
          />
          <TextInput
            style={styles.inputStyle}
            value={myData.price.substring(0, 5)}
          />
        </View>
      );
    } else {
      return <Text>Loading</Text>;
    }
  };
  getInfo();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          title="Cancel"
          onPress={() => {
            ShareMenuReactView.dismissExtension();
          }}
          style={styles.destructive}
        />
        <Button
          title={sending ? 'Sending...' : 'Send'}
          onPress={() => {
            //loadGraphicCards(sharedData);
            setSending(true);

            //console.log(newURL.stringify());
            var db = firebase.firestore();
            const data = {
              url: myData.url,
              title: myData.title,
              image: myData.image,
              price: myData.price,
            };
            db.collection('products')
              .add(data)
              .then(() => {})
              .catch((err) => {});
            setTimeout(() => {
              ShareMenuReactView.dismissExtension();
            }, 1000);
          }}
          disabled={sending || !sendable}
          style={sending || !sendable ? styles.sending : styles.send}
        />
      </View>
      <View style={{flex: 1, alignItems: 'center', padding: 20}}>
        {renderData()}
      </View>
      <View style={styles.buttonGroup}>
        {/*<Button
          title="Go to Flock"
          onPress={() => {
            ShareMenuReactView.continueInApp();
          }}
        />*/}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  destructive: {
    color: 'red',
  },
  send: {
    color: 'blue',
  },
  sending: {
    color: 'grey',
  },
  image: {
    width: '100%',
    height: 200,
  },
  buttonGroup: {
    flex: 1,
    alignItems: 'center',
  },
  inputStyle: {
    marginTop: 20,
    padding: 5,
    borderColor: '#999',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});

export default Share;
