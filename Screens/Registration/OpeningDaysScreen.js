import * as React from 'react';
import { Text, View, TouchableOpacity, SafeAreaView, ScrollView, Alert} from 'react-native';
import 'react-native-gesture-handler';
import { CheckBoxOpenings } from '../../CheckBoxOpenings';
import {styles} from '../../Styles/style'
import firebase from 'firebase'
import {IdRestaurant} from '../../Context'
const db = firebase.firestore();

const InsertEmailAddress = props => {
  const [idRest, setIdRest] = React.useContext(IdRestaurant);

  return (

    <SafeAreaView style={styles.container}>
    <ScrollView style={ styles.boxOne }>


              <View style={{marginTop:40}}>
              <Text style={styles.loginText}>Tell us when would you like to open</Text>
              </View>

                 <CheckBoxOpenings/>

              <View style={{justifyContent:"center",alignItems:"center",}}>
              <TouchableOpacity
                 onPress={() => { 
                   db.collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('OpeningHours').get().then(op => {
                     const x = op.docs.length;
                     if (x <= 1) {
                       Alert,alert("You have to choose at least one opening day and hour")
                     } else {
                      props.navigation.navigate("InsertSocials");
                     }
                   })}}
                 style={styles.loginBtn}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => props.navigation.navigate("Skip")}>
              <Text style={styles.skip}>Skip</Text>
              </TouchableOpacity>
              </View>

    </ScrollView>
    </SafeAreaView>
  );
}


export default InsertEmailAddress;
