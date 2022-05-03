import firebase from 'firebase';
import React, {useContext, useState, useEffect} from 'react';
import {Text, View, ScrollView, Dimensions, Image, Alert, TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack'
import   {Feather}  from  "react-native-vector-icons";
import { IdRestaurant, IdFriend } from '../../Context';
const db = firebase.firestore();
import {styles} from '../../Styles/style'
import { Card, Paragraph } from 'react-native-paper';

const ManageBookings = () => {
    const Stack = createStackNavigator();
    return(
        <Stack.Navigator initialRouteName="Bookings">
          <Stack.Screen name="Bookings"component={ManageBookingsScreen}
            options={({navigation})=>({
              headerLeft:() =>(
                <Feather name='menu' size={25} style={{marginLeft:14}}
                color={'#F60875'}  onPress={()=>navigation.openDrawer()}></Feather>
              )
            })}/>
        </Stack.Navigator>
    )
}

const ManageBookingsScreen = ({navigation}) => {
    const [idRest, setIdRest] = useContext(IdRestaurant);
    const [bookingsPend, setBookingsPend] = useState([]);
    const [bookingsCompl, setBookingsCompl] = useState([]);
    const [bookingsAccept, setBookingsAccept] = useState([]);
    const [userCompl, setUserCompl] = useState([]);
    const [userPend, setUserPend] = useState([]);
    const [userAccept, setUserAccept] = useState([]);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const [idUser, setIdUser] = useContext(IdFriend);
    const [userName, setUserName] = useState();
    const [p, setP] = useState();
    const [o, setO] = useState();

    useEffect(() => {
      start();
    }, []);

    const changeStatus = (bookID, stat) => {
      db.collection("Bookings").doc(bookID).update({
        Status: stat
      })
    }

    useEffect(() => {
      if (userName) {
        db.collection('Clients').get().then(doc => {
          doc.docs.map(user => {
            if (user.data().email == userName){
              setIdUser(user.id);
              navigation.navigate('UserProfile');
            }
          })
        })
      }
    }, [userName])

    const start = () => {
      db.collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('Payments').get().then(pay => {
        setP(pay.docs.length);
      });
      db.collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').collection('OpeningHours').get().then(op => {
        setO(op.docs.length);
      })
    }

    useEffect(() => {
        db.collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').get().then(user => {
          if (user.data().Name == undefined) {
            Alert.alert(
              'You have to complete the registration first'
            ); navigation.navigate('Restaurant');
          } else if (user.data().Address == undefined) {
            Alert.alert(
              'You have to complete the registration first'
            ); navigation.navigate('Email');
          } else if (user.data().Photo == undefined){
            Alert.alert(
              'You have to complete the registration first'
            ); navigation.navigate('RestaurantProfilePicture');
          } else if (p && p == 0){
            Alert.alert(
              'You have to complete the registration first'
            ); navigation.navigate('PaymentMethod');
          } else if (o && o == 0){
            Alert.alert(
              'You have to complete the registration first'
            ); navigation.navigate('OpeningDays');
          } else if (user.data().LinkInstagram == undefined) {
            Alert.alert(
              'You have to complete the registration first'
            ); navigation.navigate('InsertSocials');
          } else {
            query();
          }
      })
  }, [p,o]);

  const query = () => {
    db.collection("Bookings").onSnapshot((docBooks) => {
    let completed = [];
    let accepted = [];
    let pending = [];
    let userCompl = [];
    let userPend = [];
    let userAcc = [];
    docBooks.docs.map((bookData) => {
    db.collection("Bookings").doc(bookData.id).get().then(async (book) => {
      const x = book.data().ID_Branch;
      const y = x.charAt(13);
      if (y == idRest) {
      const userData = await db.collection("Clients").doc(book.data().ID_Client.toString()).get();
      if (book.data().Status == "Completed") {
        completed.push(book);
        userCompl.push(userData.data());
      } else if (book.data().Status == "Pending") {
        pending.push(book);
        userPend.push(userData.data());
      } else if (book.data().Status == "Accepted") {
        accepted.push(book);
        userAcc.push(userData.data())
      }
      }
      setBookingsCompl(completed);
      setBookingsPend(pending);
      setBookingsAccept(accepted);
      setUserPend(userPend);
      setUserCompl(userCompl);
      setUserAccept(userAcc);
      });
      });
      });
      };

        return (
          <ScrollView style={{backgroundColor: "white"}}>
          <View style={{marginTop: windowHeight/30, alignItems: "center"}}>
                <View>
                  <Text style={styles.loginText}> New reservations </Text>
                  {bookingsPend && userPend && bookingsPend.map((book,i) => {
                    return (
                      <View style={{alignItems: "center", justifyContent: "center"}}>

                        {userPend[i] && (
                        <Card style={{width: windowWidth/1.1, marginTop: 10, height: 112}} onPress={() => setUserName(userPend[i].email)}>
                          <Card.Content>
                            {userPend[i] && (
                              <Image style={{height: 100,  width: 100, borderRadius: 5, marginLeft: -10, marginTop: -10}} source={{uri: userPend[i].Photo}}/>
                            )}
                            <Paragraph style={{ fontWeight: "bold", marginTop: -95, marginLeft: 100}}>
                              <Text>{userPend[i] && userPend[i].FirstName} {userPend[i] && userPend[i].LastName}</Text>
                            </Paragraph>
                            <Paragraph style={{  marginLeft: 100}}>
                              <Text>When: {book.data().BookingDate}</Text>
                            </Paragraph>
                            <Paragraph style={{    marginLeft: 100}}>
                              <Text>Price: {book.data().Price}</Text>
                            </Paragraph>
                            <Paragraph style={{   marginLeft: 100}}>
                              <Text>People: {book.data().People}</Text>
                            </Paragraph>
                          </Card.Content>
                        </Card>
                        )}

                        <Card style={{width: windowWidth/1.1, marginTop: 10, height: 70}}>
                          <Card.Content>
                            <View flexDirection="row" style={{marginLeft: -8, marginTop: -6}}>
                              <TouchableOpacity
                                onPress={() => changeStatus(book.id, "Declined")}
                                style={{width:"50%",
                                backgroundColor:"#fb5b5a",
                                borderRadius:5,
                                height:50,
                                alignItems:"center",
                                justifyContent:"center",
                                marginBottom:10}}>
                                <Text style={styles.buttonText}>Decline</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => changeStatus(book.id, "Accepted")}
                                style={{width:"50%",
                                backgroundColor:"green",
                                borderRadius:5,
                                marginLeft: 5,
                                height:50,
                                alignItems:"center",
                                justifyContent:"center",
                                marginBottom:10}}>
                                <Text style={styles.buttonText}>Accept</Text>
                              </TouchableOpacity>
                            </View>
                          </Card.Content>
                        </Card>

                      </View>
                    )
                  })}
                  <View style={{marginTop: windowHeight/30, alignItems: "center"}}>
                    <Text style={styles.loginText}> Accepted </Text>
                  </View>
                  {bookingsAccept && userAccept && bookingsAccept.map((book,i) => {
                    return (
                      <View style={{alignItems: "center", justifyContent: "center"}}>

                        {userAccept[i] && (
                        <Card style={{width: windowWidth/1.1, marginTop: 10, height: 112}} onPress={() => setUserName(userPend[i].email)}>
                          <Card.Content>
                            {userAccept[i] && (
                              <Image style={{height: 100,  width: 100, borderRadius: 5, marginLeft: -10, marginTop: -10}} source={{uri: userAccept[i].Photo}}/>
                            )}
                            <Paragraph style={{ fontWeight: "bold", marginTop: -95, marginLeft: 100}}>
                              <Text>{userAccept[i] && userAccept[i].FirstName} {userAccept[i] && userAccept[i].LastName}</Text>
                            </Paragraph>
                            <Paragraph style={{  marginLeft: 100}}>
                              <Text>When: {book.data().BookingDate}</Text>
                            </Paragraph>
                            <Paragraph style={{    marginLeft: 100}}>
                              <Text>Price: {book.data().Price}</Text>
                            </Paragraph>
                            <Paragraph style={{   marginLeft: 100}}>
                              <Text>People: {book.data().People}</Text>
                            </Paragraph>
                          </Card.Content>
                        </Card>
                        )}

                        <Card style={{width: windowWidth/1.1, marginTop: 10, height: 70}}>
                          <Card.Content>
                            <View flexDirection="row" style={{marginLeft: -8, marginTop: -6}}>
                              <TouchableOpacity
                                onPress={() => changeStatus(book.id, "Deleted")}
                                style={{width:"50%",
                                backgroundColor:"#fb5b5a",
                                borderRadius:5,
                                height:50,
                                alignItems:"center",
                                justifyContent:"center",
                                marginBottom:10}}>
                                <Text style={styles.buttonText}>Delete</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => changeStatus(book.id, "Completed")}
                                style={{width:"50%",
                                backgroundColor:"green",
                                borderRadius:5,
                                marginLeft: 5,
                                height:50,
                                alignItems:"center",
                                justifyContent:"center",
                                marginBottom:10}}>
                                <Text style={styles.buttonText}>Complete</Text>
                              </TouchableOpacity>
                            </View>
                          </Card.Content>
                        </Card>

                      </View>
                    )
                  })}
                  <View style={{marginTop: windowHeight/30, alignItems: "center"}}>
                    <Text style={styles.loginText}> Already Completed </Text>
                  </View>
                 {bookingsCompl && bookingsCompl.map((book, i) => {
                   return (
                    <View style={{alignItems: "center", justifyContent: "center"}}>
                      {userCompl[i] && (
                      <Card style={{width: windowWidth/1.1, marginTop: 20, height: 112}} onPress={() => setUserName(userCompl[i].email)}>
                        <Card.Content>
                          {userCompl[i] && (
                            <Image style={{height: 100,  width: 100, borderRadius: 5, marginLeft: -10, marginTop: -10}} source={{uri: userCompl[i].Photo}}/>
                          )}
                          <Paragraph style={{  fontWeight: "bold", marginTop: -95, marginLeft: 100}}>
                            <Text>{userCompl[i] && userCompl[i].FirstName} {userCompl[i] && userCompl[i].LastName}</Text>
                          </Paragraph>
                          <Paragraph style={{    marginLeft: 100}}>
                            <Text>When: {book.data().BookingDate}</Text>
                          </Paragraph>
                          <Paragraph style={{    marginLeft: 100}}>
                            <Text>Price: {book.data().Price}</Text>
                          </Paragraph>
                          <Paragraph style={{    marginLeft: 100}}>
                            <Text>People: {book.data().People}</Text>
                          </Paragraph>
                        </Card.Content>
                      </Card>
                      )}
                    </View>
                   )
                 })}
                </View>
              </View>
          </ScrollView>
        )
    }

    export default ManageBookings;
