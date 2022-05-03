import * as React from 'react';
import { Text, View, TextInput, TouchableOpacity, Alert} from 'react-native';
import 'react-native-gesture-handler';
import {styles} from '../../Styles/style'
import * as firebase from 'firebase';
import {IdContext} from '../../Context';
import 'firebase/firestore';


const UserNameSurnameScreen = props => {
  const [name, setName] = React.useState();
  const [surname, setSurname] = React.useState();
  const [email, setEmail] = React.useState();
  const [idClient, setIdClient] = React.useContext(IdContext);
  const [checkFriend, setCheckFriend] = React.useState(false);
  const [idFriend, setIdFriend] = React.useState();

  async function pushName() {
    const docRef = await firebase.firestore().collection('Clients').doc(idClient.toString());
    //Cerca l'ID dell'amico, da testare
    if (checkFriend) {
      docRef.update({
        ID_Friend: idFriend
      })
    }
    docRef.update({
      FirstName: name,
      LastName: surname,
    });
  }

  React.useEffect(() => {
    firebase.firestore().collection('Clients').get().then(doc =>{
      doc.docs.map(user => {
        if (user.data().email == email) {
          setCheckFriend(true);
          const id = '/Clients/'+user.id
          setIdFriend(id);
        }
      })
    });
  }, [email])
  
    return (

      <View style={styles.container}>


                <Text style={styles.loginText}>Oh really?</Text>
                <Text style={styles.loginText}>And what is your name?</Text>
                <Text style={styles.loginText}></Text>
                <View style={styles.inputView}>

                  <TextInput
                    style={styles.inputText}
                    placeholder="Name... *"
                    placeholderTextColor="#003f5c"
                    onChangeText={text => setName(text)}
                    />


                </View>
                <View style={styles.inputView} >


                  <TextInput
                    style={styles.inputText}
                    placeholder="Surname... *"
                    placeholderTextColor="#003f5c"
                  onChangeText={text => setSurname(text)}
                    />
                </View>

                <Text style={styles.loginText}>A friend takes you here?</Text>
                <View style={styles.inputView} >


                  <TextInput
                    style={styles.inputText}
                    placeholder="Email..."
                    placeholderTextColor="#003f5c"
                    onChangeText={text => setEmail(text)}
                    />
                </View>

                <TouchableOpacity
                   onPress={() => {
                     if (!name || name.length == 0) {
                      Alert.alert("You have to choose a Name")
                     } else if (!surname || surname.length == 0) {
                      Alert.alert('You have to choose a Surname')
                     } else if (email && email.length!=0 && (!email.includes('@') || (!email.includes('.')))){
                      Alert.alert('Invalid friend\'s email')
                     } else if (email && email.length!=0 && !checkFriend) {
                       Alert.alert('Friend not found')
                     } else { pushName(); props.navigation.navigate("ChooseCategory")}}
                    } style={styles.loginBtn}>
                  <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => props.navigation.navigate("Skip")}>
                <Text style={styles.skip}>Skip</Text>
                </TouchableOpacity>

      </View>
    );
}


export default UserNameSurnameScreen;
