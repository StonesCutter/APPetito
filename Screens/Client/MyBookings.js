import React, {useContext, useState, useEffect} from 'react';
import {Text, View, ScrollView,Alert, Dimensions, Image} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack'
import   {Feather}  from  "react-native-vector-icons";
import { IdContext, restNameContext } from '../../Context';
import { FontAwesome } from '@expo/vector-icons';
import * as firebase from 'firebase';
import { Button, Card, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import 'firebase/firestore';
import { styles } from '../../Styles/style';
const db = firebase.firestore();
const { width, height } = Dimensions.get('screen');

const MyBookings = () => {
    const Stack = createStackNavigator();
    return(
        <Stack.Navigator initialRouteName="MyBookingsPage">
          <Stack.Screen name="MyBookingsPage"component={MyBookingsPage}
            options={({navigation})=>({
              headerLeft:() =>(
                <Feather name='menu' size={25} style={{marginLeft:14}}
                color={'#F60875'}  onPress={()=>navigation.openDrawer()}></Feather>
              )
            })}/>
        </Stack.Navigator>
    )
}

const MyBookingsPage = ({navigation}) => {
    const [id, setID] = useContext(IdContext);
    const [booking, setBooking] = useState([]);
    const [no, setNo] = useState(false);
    const [branch, setBranch] = useState([]);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const favHeight= (windowHeight/6)
    const [restContext, setRestContext] = useContext(restNameContext);

    useEffect(() => {
      if (id) {
        db.collection('Clients').doc(id.toString()).get().then(user => {
          if (!user.data().FirstName) {
            Alert.alert(
              'You have to complete the registration first'
            ); navigation.navigate('UserNameSurname');
          } else if (!user.data().ID_Type) {
            Alert.alert(
              'You have to complete the registration first'
            ); navigation.navigate('ChooseCategory');
          } else if (!user.data().Photo) {
            Alert.alert(
              'You have to complete the registration first'
            ); navigation.navigate('UserProfilePicture');
          } else {
            query();
          }
      })
      } else {
        Alert.alert(    
          "Login needed",
          'You have to do the login first',  
          [  
              {  
                  text: 'Login', onPress: () => navigation.navigate("Login")
              },  
              {text: 'Go Back', onPress: () => navigation.goBack()},  
          ]  
      );  
      }
    }, []); 

    //controllare se fa il problema della duplicazione
    const query = () => {
         db.collection('Bookings').onSnapshot(bookingID => {
          let bookings = [];
          let branches = [];
             bookingID.docs.map(async(b) => {
              const book = b.data();
              const bookID = book.ID_Client;
              if (bookID == id) {
                const bra = await db.doc(book.ID_Branch).get();
                bookings.push(book);
                const branchData = bra.data();
                branches.push(branchData);
                setBooking(bookings);
              setBranch(branches);
              }
          })
         })
    }

    useEffect(() => {
      if (booking && branch) {
        console.log("booking state: " + booking)
        console.log("branch state: " + branch)
      }
    }, [booking, branch])

    useEffect(() => {
      if (booking.length == 0) {
          setNo(true);
      } else {
        setNo(false);
      }
    }, [booking])

    return (
        <ScrollView style={{backgroundColor: "white"}}>
          {no == true ? (
            <View style={{marginTop: 30, alignItems: "center"}}>
            <Text style={styles.loginText}>You have no reservations yet</Text>
            <Image style={{width:width/2, height: height/3, marginTop: height/6}} source={require('../../assets/lonely.jpg')} />
            </View>
          ) : (
            <View>
              <Text> {booking && booking.map((book, i) => {
                  return (
                    <View key={i}>
                  { branch[i] && (
                    <Card style={{width: windowWidth}} onPress={() => { setRestContext(book.ID_Branch); navigation.navigate("RestaurantPage")}}>

                    <View>
                        <Image style={{
                    width: windowWidth,
                    height: favHeight}}
                    source={{uri: branch[i].Photo}} />

                      <Card.Title title={branch[i].Name}
                      left={
                        () => {
                      let LeftContent
                       if (book.Status=='Completed') {
                        LeftContent = () => <Ionicons name="ios-bookmarks" size={40} color={"green"} />
                      } else if (book.Status=='Accepted') {
                        LeftContent = props => <Ionicons name="ios-bookmarks" size={40} color={"orange"} />
                        } else {
                          LeftContent = props => <Ionicons name="ios-bookmarks" size={40} color={"grey"}/>
                          }
                        return <LeftContent/>
                      } }
                      />
                      <Card.Content>
                      <Paragraph>
                      <Text style={{fontWeight: "bold"}}> <Feather name="map-pin" size={17} color="black" />   {branch[i].Address} </Text>
                      </Paragraph>
                      <Paragraph>
                      <Text style={{fontWeight: "bold"}}> <FontAwesome name="calendar" size={17} color="black" />   {book.BookingDate} </Text>
                      </Paragraph>
                      <Paragraph>
                      <Text style={{fontWeight: "bold"}}> Amount:  <FontAwesome name="euro" size={17} color="black" />  {book.Price} </Text>
                      </Paragraph>


                      { book.Status == ("Pending") ? (
                        <Image style={{
                        width: 100,
                        height: 100,
                      marginLeft: 220,
                      marginTop: -100}}
                        source={require('../../assets/pending.jpg')} />
                      ) : book.Status == ("Accepted") ? (
                        <Image style={{
                        width: 100,
                        height: 100,
                      marginLeft: 220,
                      marginTop: -100}}
                        source={require('../../assets/accepted.jpg')} />
                      ) :  book.Status == ("Completed") ? (
                        <Image style={{
                        width: 100,
                        height: 100,
                      marginLeft: 220,
                      marginTop: -100}}
                        source={require('../../assets/completed.jpg')} />
                      ) : null}
                      </Card.Content>

                      <Card.Actions>
                      <Button></Button>
                      </Card.Actions>
                    </View>
                    </Card>

                  )}
                  </View>
                  )
              })}
            </Text>

            </View>
          )}
      </ScrollView>
    );
}

export default MyBookings;
