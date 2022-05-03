import * as React from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert, ScrollView} from 'react-native';
import 'react-native-gesture-handler';
import { CheckBoxDynamic } from '../../CheckBoxDynamic';
import {styles} from '../../Styles/style'
import * as firebase from 'firebase';
import 'firebase/firestore';
import {IdRestaurant} from '../../Context'

const InsertEmailAddress = props => {
  const [PIVA, setPIVA] = React.useState('');
  const [addr, setAddr] = React.useState('');
  const [idRest, setIdRest] = React.useContext(IdRestaurant);
  const [city, setCity] = React.useState('');

  async function pushTempAddr(addr){
    const docRef = firebase.firestore().collection('Restaurants').doc(idRest.toString());
    await docRef.update({
      Address: addr
    });
  }

  async function pushMail() {
    const docRef = firebase.firestore().collection('Restaurants').doc(idRest.toString());
    docRef.update({
      PIVA: PIVA,
    });
    docRef.collection('Branch').doc('1').update({
      City: city,
      Address: addr
    })
  }

  return (
    <ScrollView style={{backgroundColor: "white"}}>
    <View style={styles.container}>
    <View style={{marginTop: "10%"}}>
              <Text style={styles.loginText}>So, where are you?</Text>
        </View>
              <Text>{props.route.params}</Text>
              <View style={{    width:"80%",
                  height:"40%",
                  backgroundColor:"#d9d9d9",
                  borderRadius:5,
                  height:50,
                  marginBottom:10,
                  marginTop:10,
                  justifyContent:"center",
                  padding:20}} >

                <TextInput
                  style={styles.inputText}
                  placeholder="City...*"
                  placeholderTextColor="#003f5c"
                  onChangeText={text => setCity(text)}
                  />
              </View>
              <Text style={styles.loginText}>And what is your P.IVA?</Text>
              <View style={{    width:"80%",
                  height:"40%",
                  backgroundColor:"#d9d9d9",
                  borderRadius:5,
                  height:50,
                  marginBottom:10,
                  marginTop:10,
                  justifyContent:"center",
                  padding:20}} >

                <TextInput
                  style={styles.inputText}
                  placeholder="P.IVA...*"
                  placeholderTextColor="#003f5c"
                  onChangeText={text => setPIVA(text)}
                  />
              </View>

              <Text style={styles.loginText}>Insert the address</Text>
              <View style={{    width:"80%",
                  height:"40%",
                  backgroundColor:"#d9d9d9",
                  borderRadius:5,
                  height:50,
                  marginBottom:10,
                  marginTop:10,
                  justifyContent:"center",
                  padding:20}} >

                <TextInput
                    style={styles.inputText}
                    placeholder="Address...*"
                    placeholderTextColor="#003f5c"
                    onChangeText={text => {setAddr(text);
                      if (text.length > 0) pushTempAddr(text)}}
                />
              </View>

              <View style={{ flexDirection: 'column', marginTop: 10, alignItems: "center", width: 295, marginBottom: -20}}>
                 <View style={{ flexDirection: 'row' }}>
                 <CheckBoxDynamic/>
                 </View>
              </View>

              <TouchableOpacity
                 onPress={() => {
                   if (!city || city.length==0){
                     Alert.alert("You have to insert the City")
                   } else if (!PIVA || PIVA.length != 11) {
                     Alert.alert("Invalid P.IVA")
                   } else if (!addr || addr.length == 0 ) {
                     Alert.alert("You have to insert the address")
                   } else {
                    pushMail(); props.navigation.navigate("RestaurantProfilePicture"); }}
                   }
                 style={styles.loginBtn}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => props.navigation.navigate("Skip")}>
              <Text style={styles.skip}>Skip</Text>
              </TouchableOpacity>

    </View>
        </ScrollView>
  );
}


export default InsertEmailAddress;
