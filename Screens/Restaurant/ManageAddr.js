import React, {useContext, useState} from 'react';
import { Text, View, TextInput, TouchableOpacity } from 'react-native';
import 'react-native-gesture-handler';
import {styles} from '../../Styles/style'
import * as firebase from 'firebase';
import 'firebase/firestore';
import {IdRestaurant} from '../../Context'

const InsertRestaurant = props => {
  const [name, setName] = useState();
  const [addr, setAddr] = useState();
  const [idRest, setIdRest] = useContext(IdRestaurant);

  async function pushName() {
    const docRef = firebase.firestore().collection('Restaurants').doc(idRest.toString());
    await docRef.update({
      Name: name,
      Address: addr
    });
  }

  return (

    <View style={styles.container}>
    <View style={{height: "100%" ,alignItems: 'center', justifyContent: 'center'}}>
              <Text style={styles.loginText}>Modify the name</Text>
              <View style={styles.inputView} >

                <TextInput
                  style={styles.inputText}
                  placeholder="Name of the restaurant..."
                  placeholderTextColor="#003f5c"
                  onChangeText={text => setName(text)}
                  //onSubmitEditing={ () => this.state.navigate('InsertEmailAddress', name)}
                  />
              </View>

              <Text style={styles.loginText}> Modify the address</Text>
              <View style={styles.inputView} >

                <TextInput
                style={styles.inputText}
                placeholder="Name of the restaurant..."
                placeholderTextColor="#003f5c"
                onChangeText={text => setAddr(text)}
                //onSubmitEditing={ () => this.state.navigate('InsertEmailAddress', name)}
                />
                </View>

                <TouchableOpacity onPress={() => {pushName(); props.navigation.goBack()}}>
              <Text style={styles.skip}>Confirm</Text>
              </TouchableOpacity>

             <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <Text style={styles.skip}>Go Back</Text>
              </TouchableOpacity>
                <Text></Text>
        </View>
        </View>

  );
}

export default InsertRestaurant;
