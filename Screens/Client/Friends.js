import firebase from 'firebase';
import React, {useContext, useState, useEffect} from 'react';
import {Text, View, ScrollView, Dimensions, Image, TextInput,TouchableOpacity, Alert} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack'
import   {Feather}  from  "react-native-vector-icons";
import { IdContext, IdFriend } from '../../Context';
const db = firebase.firestore();
import {styles} from '../../Styles/style'
import { Card, Paragraph } from 'react-native-paper';

const FriendsScreen = () => {
    const Stack = createStackNavigator();
    return(
        <Stack.Navigator initialRouteName="Friends">
          <Stack.Screen name="Friends"component={Friends}
            options={({navigation})=>({
              headerLeft:() =>(
                <Feather name='menu' size={25} style={{marginLeft:14}}
                color={'#F60875'}  onPress={()=>navigation.openDrawer()}></Feather>
              )
            })}/>
        </Stack.Navigator>
    )
}

const Friends = (props) => {
    const [id, setId] = useContext(IdContext);
    const [inv, setInv] = useState();
    const [idFriend, setIdFriend] = useContext(IdFriend);
    const [friends, setFriends] = useState([]);
    const [friendName, setFriendName] = useState();
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [email, setEmail] = useState();
    const [check, setCheck] = useState(false);

    useEffect(() => {
      if (id) {
        db.collection('Clients').doc(id.toString()).get().then(user => {
          if (!user.data().FirstName) {
            Alert.alert(
              'You have to complete the registration first'
            ); props.navigation.navigate('UserNameSurname');
          } else if (!user.data().ID_Type) {
            Alert.alert(
              'You have to complete the registration first'
            ); props.navigation.navigate('ChooseCategory');
          } else if (!user.data().Photo) {
            Alert.alert(
              'You have to complete the registration first'
            ); props.navigation.navigate('UserProfilePicture');
          }
          else {
          queryInv();
          queryFriends();}})
      } else {
        Alert.alert(    
          "Login needed",
          'You have to do the login first',  
          [  
              {  
                  text: 'Login', onPress: () => props.navigation.navigate("Login")
              },  
              {text: 'Go Back', onPress: () => props.navigation.goBack()},  
          ]  
      );  
      }
    }, []);

    const queryInv = () => {
        db.collection('Clients').doc(id.toString()).get().then(user => {
            if (user.data().ID_Friend){
                const friendDoc = user.data().ID_Friend; //chi ti ha invitato
                db.doc(friendDoc).get().then(upUser => {
                    setInv(upUser.data());
                })
            }
        })
    }

    const queryFriends = () => {
        setFriends([]);
        const idRef = '/Clients/'+id;
        db.collection('Clients').get().then(docUsers => {
            docUsers.docs.map(user => {
                if (user.data().ID_Friend && (user.data().ID_Friend === idRef)){ //chi è stato invitato da te
                    setFriends(fr => [...fr, user.data()]);
                }
            })
        })
    }

    useEffect(() => {
      if (friendName) {
        db.collection('Clients').get().then(doc => {
          doc.docs.map(user => {
            if (user.data().email == friendName){
              setIdFriend(user.id);
              props.navigation.navigate('FriendProfile');
            }
          })
        })
      }
    }, [friendName])

    useEffect(() => {
      if (email) {
        db.collection('Clients').get().then(docUsers => {
          docUsers.docs.map(user => {
            if (user.data().email == email) setCheck(true);
          })
        })
        db.collection('Restaurants').get().then(docRests => {
          docRests.docs.map(rest => {
            if (rest.data().email == email) setCheck(true);
          })
        })
      }
    }, [email])

    return (
      <ScrollView style={{backgroundColor: "white"}}>
      <View style={{marginTop: windowHeight/30, alignItems: "center"}}>
        <Text style={styles.loginText}> Who invited you </Text>
        </View>
            {inv && (

              <View style={{alignItems: "center", justifyContent: "center"}}>
              <Card style={{width: windowWidth/1.1, marginTop: 20, height: 112}} onPress={() => {setFriendName(inv.email)}}>
                <Card.Content>
                <Image style={{height: 100,  width: 100, borderRadius: 5, marginLeft: -10, marginTop: -10}} source={{uri: inv.Photo}}/>
                <Paragraph style={{ marginTop: 10,  fontSize: 20, fontWeight: "bold", marginTop: -60, marginLeft: 120}}>
                  <Text>{inv.FirstName}  {inv.LastName}</Text>
                </Paragraph>
                </Card.Content>
              </Card>
              </View>

            )}
            <View style={{marginTop: windowHeight/30, alignItems: "center"}}>
              <Text style={styles.loginText}>Who you invited </Text>
              </View>
            {friends && friends.map((fr,i) => {
                return (
                  <View style={{alignItems: "center", justifyContent: "center"}}>
                  <Card style={{width: windowWidth/1.1, marginTop: 20, height: 112}} onPress={() => {setFriendName(fr.email)}}>
                    <Card.Content>
                    <Image style={{height: 100,  width: 100, borderRadius: 5, marginLeft: -10, marginTop: -10}} source={{uri: fr.Photo}}/>
                    <Paragraph style={{ fontSize: 20, fontWeight: "bold", width: windowWidth, marginLeft: 120,
                                        marginTop: -60,  alignItems: "center", justifyContent: "center"}}>
                      <Text >{fr.FirstName}  {fr.LastName}</Text>
                    </Paragraph>
                    </Card.Content>
                  </Card>
                  </View>

                )
            })}
            <View style={{marginTop: windowHeight/30, alignItems: "center"}}>
              <Text style={styles.loginText}> Invite a friend </Text>
              </View>
            <View style={{alignItems: "center", justifyContent: "center"}}>
            <Card style={{width: windowWidth/1.1, marginTop: 20, height: 80}}>
              <Card.Content>
              <TextInput
                style={{
                    height:50,
                    color:"black",
                    backgroundColor: "#f2f2f2",
                    alignItems:"center",
                    justifyContent:"center",
                    borderRadius: 5,
                  padding: 10,
                  }}
                placeholder="Email of a friend... *"
                placeholderTextColor="#003f5c"
                onChangeText={(text) => setEmail(text)}
                />
              </Card.Content>
            </Card>
            <View style={{marginTop: -20}}>
            <TouchableOpacity
              style={styles.loginBtn} onPress={() => {
                if (!check) {
                  Alert.alert('Invite sent');
                } else if (check) {
                  Alert.alert('User already registrated')
                } else {
                  Alert.alert('Invalid email')
                }
              }}>
              <Text style={styles.buttonText}>Invite</Text>
            </TouchableOpacity>
            </View>
            </View>

        </ScrollView>
    )
}

export default FriendsScreen;
