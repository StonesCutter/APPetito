import React, {useContext, useState} from 'react';
import { Text, View, TextInput, TouchableOpacity, ScrollView, Dimensions, Alert } from 'react-native';
import 'react-native-gesture-handler';
import {styles} from '../../Styles/style'
import { RadioButton } from 'react-native-paper';
import * as firebase from 'firebase';
import 'firebase/firestore';
import {IdRestaurant} from '../../Context'

const InsertRestaurant = props => {
  const [name, setName] = useState();
  const [checked, setChecked] = useState('first');
  const [idRest, setIdRest] = useContext(IdRestaurant);

  async function pushName(name, act) {
    const docRef = firebase.firestore().collection('Restaurants').doc(idRest.toString());
    await docRef.update({
      Name: name,
      Activity: act,
    });
    const branchRef = docRef.collection('Branch').doc('1');
    await branchRef.set({
      Name: name
    })
    props.navigation.navigate('Email', name)
  }

  return (
    <ScrollView style={{ marginTop: "30%"}}>
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
    <View style={{height: "100%" ,alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
              <Text style={styles.loginText}>Let's start then!</Text>
              <Text style={styles.loginText}>Insert the name of the restaurant</Text>
              <View style={styles.inputView} >

                <TextInput
                  style={styles.inputText}
                  placeholder="Name of the restaurant... *"
                  placeholderTextColor="#003f5c"
                  onChangeText={text => setName(text)}
                  //onSubmitEditing={ () => this.state.navigate('InsertEmailAddress', name)}
                  />
              </View>

              <Text style={styles.loginText}> What kind of restaurant is it?</Text>



                <View style={{justifyContent: "center", marginTop: 20, marginBottom: 230}}>

                <View style={{flexDirection: "row"}}>
                <RadioButton
                  value="first"
                  status={ checked === 'FastFood' ? 'checked' : 'unchecked' }
                  onPress={() => setChecked('FastFood')}
                />
                <Text style={{margin: 8,  color:"black"}}>Fast Food</Text>
                </View>

                <View style={{flexDirection: "row"}}>
                <RadioButton
                  value="first"
                  status={ checked === 'Ristorante' ? 'checked' : 'unchecked' }
                  onPress={() => setChecked('Ristorante')}
                />
                <Text style={{margin: 8,  color:"black"}}>Ristorante</Text>
                </View>

                <View style={{flexDirection: "row"}}>
                <RadioButton
                  value="first"
                  status={ checked === 'Pizzeria' ? 'checked' : 'unchecked' }
                  onPress={() => setChecked('Pizzeria')}
                />
                <Text style={{margin: 8,  color:"black"}}>Pizzeria</Text>
                </View>

                <View style={{flexDirection: "row"}}>
                <RadioButton
                  value="first"
                  status={ checked === 'Sushi' ? 'checked' : 'unchecked' }
                  onPress={() => setChecked('Sushi')}
                />
                <Text style={{margin: 8,  color:"black"}}>Sushi</Text>
                </View>

                <View style={{flexDirection: "row"}}>
                <RadioButton
                  value="first"
                  status={ checked === 'Vegetarian' ? 'checked' : 'unchecked' }
                  onPress={() => setChecked('Vegetarian')}
                />
                <Text style={{margin: 8,  color:"black"}}>Vegetarian</Text>
                </View>

                <View style={{flexDirection: "row"}}>
                <RadioButton
                  value="first"
                  status={ checked === 'TavolaCalda' ? 'checked' : 'unchecked' }
                  onPress={() => setChecked('TavolaCalda')}
                />
                <Text style={{margin: 8,  color:"black"}}>Tavola Calda</Text>
                </View>

              </View>

        </View>
        <View style={{marginTop: -200 }}>
        <TouchableOpacity
          onPress={() => {
            if (!name) {
              Alert.alert("You have to choose a Name")
            } else if (checked == "first") {
              Alert.alert("You have to choose one activity")
            } else {
              pushName(name, checked);}}
            }
             style={styles.loginBtn}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{alignItems: "center"}}onPress={() => props.navigation.navigate("Skip")}>
        <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
        </View>
        </View>
        </ScrollView>
  );
}

export default InsertRestaurant;
