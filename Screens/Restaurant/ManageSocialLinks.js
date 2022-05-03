import * as React from 'react';
import { Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import 'react-native-gesture-handler';
import {styles} from '../../Styles/style'
import * as firebase from 'firebase';
import 'firebase/firestore';
import {IdRestaurant} from '../../Context'

const InsertSocialsScreen = props => {
  const [FB, setFB] = React.useState('');
  const [Insta, setInsta] = React.useState('');
  const [idRest, setIdRest] = React.useContext(IdRestaurant);

  async function pushSocial(fb, insta) {
    const docRef = firebase.firestore().collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1');
    await docRef.update({
      LinkFB: fb,
      LinkInstagram: insta,
    });
  }

  return (

    <View style={styles.container}>
              <View style={{marginBottom: 40}}>
              <Text style={styles.loginText}>What are your socials?</Text>
              </View>

              <View style={{flexDirection: "row"}}>
              <Image source={require('../../assets/facebook.png')} />
              <Text style={{marginTop: 10, color: "black", fontSize: 20}}>  Facebook</Text>
              </View>

              <View style={styles.inputView} >
                <TextInput
                  style={styles.inputText}
                  placeholder="Insert here your FB page url"
                  placeholderTextColor="#003f5c"
                  onChangeText={text => setFB(text)}
                  />
              </View>

              <View style={{flexDirection: "row"}}>
              <Image source={require('../../assets/instagram-new.png')} />
              <Text style={{marginTop: 10, color: "black", fontSize: 20}}>  Instagram</Text>
              </View>

              <View style={styles.inputView} >
                <TextInput
                  style={styles.inputText}
                  placeholder="Insert here your Instagram url"
                  placeholderTextColor="#003f5c"
                  onChangeText={text => setInsta(text)}
                  />
              </View>

              <TouchableOpacity
                 onPress={() =>  {pushSocial(FB, Insta); props.navigation.goBack() }}
                 style={styles.loginBtn}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Text style={styles.skip}>Go Back</Text>
              </TouchableOpacity>

    </View>
  );
}


export default InsertSocialsScreen;
