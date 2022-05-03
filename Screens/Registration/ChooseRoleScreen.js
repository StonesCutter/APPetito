import * as React from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import 'react-native-gesture-handler';
import {styles} from '../../Styles/style'
import {IdRestaurant, IdContext} from '../../Context'
import firebase from 'firebase'

const ChooseRoleScreen = ({route, navigation}) => {
  const [idClient, setIdClient] = React.useContext(IdContext); //client
  const [idRest, setIdRest] = React.useContext(IdRestaurant); //restaurant
  const [email, setEmail] = React.useState();

  React.useEffect(() => {
    if (route.params?.email){
      setEmail(route.params?.email);
    } else {
      setIdClient(1); //provvisori
      setIdRest(1); //provvisori
    }
  }, [route.params?.email])

  async function pushClient() {
    const size = await getNewID();
    const newID = (size + 1).toString();
    const docRef = firebase.firestore().collection('Clients').doc(newID);
    await docRef.set({
      email: email
    });
    setIdClient(newID);
  }

  async function getNewID(){
    const snapshot = await firebase.firestore().collection('Clients').get();
    return snapshot.size;
  }

  async function pushRest() {
    const size = await getNewIDRest();
    const newID = (size + 1).toString();
    const docRef = firebase.firestore().collection('Restaurants').doc(newID);
    await docRef.set({
      email: email
    });
    setIdRest(newID);
  }

  async function getNewIDRest(){
    const snapshot = await firebase.firestore().collection('Restaurants').get();
    return snapshot.size;
  }

    return (
      <View style={styles.container}>
        {email ? (
          <View style={{ alignItems: "center", justifyContent:"center"}}>
            <Image style={{width:250, height: 250, marginTop: "10%", marginBottom:"10%"}} source={require('../../assets/icona.png')} />
            <Text style={styles.loginText}>Welcome to our app!</Text>
            <Text style={styles.loginText}>Choose what do you want to do</Text>

            <TouchableOpacity onPress={() => {pushClient(); navigation.navigate("ClientNav", {screen: "UserNameSurname"})}} style={styles.loginBtn}>
              <Text style={styles.buttonText}>I eat food</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {pushRest(); navigation.navigate("RestNav", {screen: "Restaurant"})}} style={styles.loginBtn}>
              <Text style={styles.buttonText}>I sell food</Text>
            </TouchableOpacity>

          </View>
        )
      : (
        <View>
            <Text style={{fontSize: 60, marginBottom: 100}}>APPetito</Text>

            <Text style={styles.loginText}>Welcome to our app!</Text>
            <Text style={styles.loginText}>Choose what do you want to do</Text>

            <TouchableOpacity onPress={() => {navigation.navigate("ClientNav", {screen: "UserProfilePicture"})}} style={styles.loginBtn}>
              <Text style={styles.buttonText}>I eat food</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => {navigation.navigate("RestNav", {screen: "RestaurantProfilePicture"})}} style={styles.loginBtn}>
              <Text style={styles.buttonText}>I sell food</Text>
            </TouchableOpacity>

          </View>
      )}
      </View>
    );
}

export default ChooseRoleScreen;
