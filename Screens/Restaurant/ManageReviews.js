import React, {useContext, useEffect, useState} from 'react';
import {Text, View, Dimensions, Image, Alert, ScrollView} from 'react-native';
import { Card, Paragraph} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack'
import   {Feather}  from  "react-native-vector-icons";
import {styles} from '../../Styles/stylePrincipalPages'
import * as firebase from 'firebase';
import 'firebase/firestore';
import { AntDesign } from '@expo/vector-icons';
import {IdRestaurant, IdFriend} from '../../Context';
const db = firebase.firestore();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const MyReviews = () => {
    const Stack = createStackNavigator();
    return(
        <Stack.Navigator initialRouteName="MyReviewsPage">
          <Stack.Screen name="MyReviewsPage"component={MyReviewsPage}
            options={({navigation})=>({
              headerLeft:() =>(
                <Feather name='menu' size={25} style={{marginLeft:14}}
                color={'#F60875'}  onPress={()=>navigation.openDrawer()}></Feather>
              )
            })}/>
        </Stack.Navigator>
    )
}

const MyReviewsPage = ({navigation}) => {
    const [reviews, setReviews] = useState([]);
    const [user, setUser] = useState([]);
    const [restContext, setRestContext] = useContext(IdRestaurant);
    const windowWidth = Dimensions.get('window').width;
    const [idUser, setIdUser] = useContext(IdFriend);
    const [userName, setUserName] = useState();
    const [p, setP] = useState();
    const [o, setO] = useState();
    const [no, setNo] = useState(false);


  useEffect(() => {
    start();
  }, []);

  const start = () => {
    db.collection('Restaurants').doc(restContext.toString()).collection('Branch').doc('1').collection('Payments').get().then(pay => {
      setP(pay.docs.length);
    });
    db.collection('Restaurants').doc(restContext.toString()).collection('Branch').doc('1').collection('OpeningHours').get().then(op => {
      setO(op.docs.length);
    })
  }

  useEffect(() => {
    if (p && o) {
      db.collection('Restaurants').doc(restContext.toString()).collection('Branch').doc('1').get().then(user => {
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
        } else if (p == 0){
          Alert.alert(
            'You have to complete the registration first'
          ); navigation.navigate('PaymentMethod');
        } else if (o == 0){
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
  }
}, [p,o]);

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


    const query = () => {
      setUser([]);
      setReviews([]);
        db.collection('Restaurants').doc(restContext.toString()).collection('Branch').doc('1').collection("Reviews").get().then(docRev =>{
            if (docRev.docs.length == 0) {
              setNo(true)
            } else {
              setNo(false);
              docRev.docs.map(rev => {
                setReviews(r => [...r, rev.data()]);
                db.collection('Clients').get().then(docUser => {
                  docUser.docs.map(us => {
                    if(rev.data().ID_Client == us.id){
                      setUser(u => [...u, us.data()]);
                    }
                  })
                })
              })
            }
        })
    }

    return (
        <ScrollView style={{backgroundColor: "white"}}>
        <View style={{alignItems: "center"}}>
          {no == true && (
            <View style={{marginTop: 30, alignItems: "center"}}>
                  <Text style={styles.loginText}>You have no reviews yet</Text>
                  <Image style={{width:windowWidth/2, height: windowHeight/3, marginTop: windowHeight/6}} source={require('../../assets/lonely.jpg')} />
                  </View>
          )}

                {reviews && user && reviews.map((rev,i) => {
                  return (
                    <View>
                      {user[i] && (
                      <Card style={{width: windowWidth/1.12, marginTop: "2%",height: 120}} onPress={() => setUserName(user[i].email)}>
                      <View  horizontal={true} pagingEnabled={false}>
                      <Card.Content>
                      <Image style = {{width:100, height:100, borderRadius: 5, marginTop:10, marginLeft: -5}} source = {{uri: user[i].Photo}}/>
                      <View style={{marginLeft: 110, marginTop: -100}}>
                      <Text style={{fontWeight: "bold", fontSize: 15}}>{user[i].FirstName} {user[i].LastName}</Text>
                      <Text style={{fontSize: 15}}>{rev.Description}</Text>
                      <Text style={{fontSize: 15, fontWeight: "bold", marginTop: 5}}>
                      <AntDesign name="star" size={17} color={rev.Score > 0 ? "orange" : "white"}/>
                      <AntDesign name="star" size={17} color={rev.Score > 1 ? "orange" : "white"}/>
                      <AntDesign name="star" size={17} color={rev.Score > 2 ? "orange" : "white"}/>
                      <AntDesign name="star" size={17} color={rev.Score > 3 ? "orange" : "white"}/>
                      <AntDesign name="star" size={17} color={rev.Score > 4 ? "orange" : "white"}/>
                      </Text>
                      </View>
                      <Paragraph style={{marginTop: "5%"}}>
                      </Paragraph>
                      </Card.Content>
                      </View>
                      </Card>
                      )}
                    </View>
                  )
                })}
        </View>
        </ScrollView>
    )
}
export default MyReviews;
