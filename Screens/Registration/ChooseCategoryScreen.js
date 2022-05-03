import React, {useState, useContext} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import 'react-native-gesture-handler';
import {styles} from '../../Styles/style'
import * as firebase from 'firebase';
import 'firebase/firestore';
import {IdContext} from '../../Context';
const db = firebase.firestore();

//TO TEST

const ChooseCategoryScreen = props => {
  const [idClient, setIdClient] = useContext(IdContext);
  var cont = 0;
  
  async function pushType(IDType) {
    var i = 0;
    const docRef = await db.collection('Clients').doc(idClient.toString());
    await docRef.update({
      ID_Type: IDType,
      Points: 0,
      Favourites: []
    });

    //set missions
    db.collection('Missions').get().then(docsMiss => {
      docsMiss.docs.map(miss => {
        if (miss.data().ID_Type == IDType || miss.data().ID_Type == 'ALL') {
          const x = '/Missions/'+miss.id;
          cont = cont+1;
          docRef.collection('Missions').doc(cont.toString()).set({
            ID_Mission: x,
            Status: 'To Do'
          })
        }
      })
    })
  }
  
    return (
      <View style={styles.container}>

      <Text style={styles.loginText}>Nice to meet you!</Text>
      <Text style={styles.loginText}>Tell us what do you prefer</Text>

      <TouchableOpacity  onPress={() => {pushType(1); props.navigation.navigate("UserProfilePicture")}} style={styles.loginBtn}>
        <Text style={styles.buttonText}>I like social networks</Text>
      </TouchableOpacity>
      <TouchableOpacity  onPress={() => {pushType(2); props.navigation.navigate("UserProfilePicture")}} style={styles.loginBtn}>
        <Text style={styles.buttonText}>I'm a food adventurer</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.navigate("Skip")}>
      <Text style={styles.skip}>Skip</Text>
      </TouchableOpacity>
      </View>
    );
}

export default ChooseCategoryScreen;
