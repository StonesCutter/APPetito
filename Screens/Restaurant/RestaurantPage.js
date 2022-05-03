import 'react-native-gesture-handler';
import { Text, View, Image, TouchableOpacity, ScrollView, Dimensions, Alert} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import * as firebase from 'firebase';
import 'firebase/firestore';
import React, { useEffect, useState, useContext } from 'react';
import   {Feather}  from  "react-native-vector-icons";
import { restNameContext } from '../../Context';
import {styles} from '../../Styles/style'
import { Block, Button as GaButton, } from 'galio-framework';
import { Card, Paragraph } from 'react-native-paper';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import {IdContext} from '../../Context'

const db = firebase.firestore();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const RestaurantScreen = (props) => {
  const Stack = createStackNavigator();
  return(
      <Stack.Navigator initialRouteName="Restaurant">
        <Stack.Screen name="Restaurant"component={RestaurantPage}
          //drawer button
          options={({navigation})=>({
            headerLeft:() =>(
              <Feather name='menu' size={25} style={{marginLeft:14}}
              color={'#F60875'}  onPress={()=>navigation.openDrawer()}></Feather>
            )
          })}/>
        {/*<Stack.Screen name="Menu"component={Menu}/>*/}
      </Stack.Navigator>
  )
}


const RestaurantPage = ({navigation}) => {
  const [restContext, setRestContext] = useContext(restNameContext);
  const [id, setId] = useContext(IdContext);
  const [restaurant, setRestaurant] = useState();
  const [photo, setPhoto] = useState();
  const [user, setUser] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [mon, setMon] = useState();
  const [tue, setTue] = useState();
  const [wed, setWed] = useState();
  const [thu, setThu] = useState();
  const [fri, setFri] = useState();
  const [sat, setSat] = useState();
  const [sun, setSun] = useState();
  const [creditCard, setCreditCard] = useState(false);
  const [paypal, setPaypal] = useState(false);
  const [tickets, setTickets] = useState(false);
  const [satispay, setSatispay] = useState(false);
  const [checkFav, setCheckFav] = useState(false);
  const [checkRev, setCheckRev] = useState(false);

  useEffect(() => {
      handlClick();
  }, []);

  const pushFav = async() => {
    if (id) {
      var temp;
      if (restContext.length < 23){
        temp = restContext + "/Branch/1";
      } else {
        temp = restContext;
      }
      const user = await db.collection('Clients').doc(id.toString())
      user.get().then(usData => {
        const array = usData.data().Favourites;
        if (array) {
          if (array.includes(temp)){
            const index = array.indexOf(temp);
            array.splice(index, 1);
          } else {
            array.push(temp);
          }
          user.update({
            Favourites: array
          });
          navigation.navigate("MyFavourites");
        } else {
          Alert.alert("Unexpected error");
        }
    })
    } else {
      Alert.alert("Please do the login first")
      navigation.goBack();
    }
  }

  const handlClick = () => {
    var i = 0;
    setRestaurant([]);
    setPhoto();
    setUser([]);
    setReviews([]);
    if (id) {
      db.collection('Clients').doc(id.toString()).get().then(usData => {
        const array = usData.data().Favourites;
        if (array) {
          if (array.includes(restContext)){
            setCheckFav(true);
          } else {
            setCheckFav(false);
          }
        } else {
          Alert.alert("Unexpected error");
        }
      })
    }
    db.doc(restContext).onSnapshot((data) => {
        const branchData = data.data();
        setRestaurant(branchData);
        const ph = branchData.Photo;
        setPhoto(ph);
        db.doc(restContext).collection('OpeningHours').get().then(doc => {
          doc.docs.map(op => {
            if (op.id == 'Mon') setMon(op.data());
            if (op.id == 'Tue') setTue(op.data());
            if (op.id == 'Wen') setWed(op.data());
            if (op.id == 'Thu') setThu(op.data());
            if (op.id == 'Fri') setFri(op.data());
            if (op.id == 'Sat') setSat(op.data());
            if (op.id == 'Sun') setSun(op.data());
          })
        })
        db.doc(restContext).collection("Reviews").get().then(docRev =>{
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
        })
        db.doc(restContext).collection('Payments').get().then(paym => {
          paym.docs.map(p => {
            if (p.id == 'Paypal') setPaypal(true);
            if (p.id == 'Satispay') setSatispay(true);
            if (p.id == 'CartaDiCreditoDebito') setCreditCard(true);
            if (p.id == 'TicketRestaurant') setTickets(true);
          })
        })
    })
  }

  const resetContextWithRestID = () => {
    const x = restContext.substring(0,14);
    setRestContext(x);
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'rgba(52, 52, 52, 0.0)' }} >
    <ScrollView>
    <ScrollView  horizontal={true} pagingEnabled={true}>
    {photo && (
        <Image
        style={{
          height: windowHeight/4,
          width: windowWidth
        }}
        source={{uri: photo }}/>
      )
    }
    </ScrollView>

    <Block flex={0.5} row middle space="between" style={{ marginLeft: windowWidth/1.3, marginTop: -35}}>
      {checkFav && checkFav ? (
        <GaButton
        round
        onlyIcon
        shadowless
        icon="heart"
        iconFamily="Font-Awesome"
        iconColor={"red"}
        iconSize={20}
        color={"white"}
        onPress={() => pushFav()}
      />
      ) : (
        <GaButton
        round
        onlyIcon
        shadowless
        icon="heart-o"
        iconFamily="Font-Awesome"
        iconColor={"red"}
        iconSize={20}
        color={"white"}
        onPress={() => pushFav()}
      />
      )}      
    </Block>
      <View style={{marginLeft: windowWidth/19, marginTop: -20}}>
        <Text style={{fontSize: 30}}>{restaurant && restaurant.Name} </Text>
        <Text style={{fontSize: 15}}><Feather name="map-pin" size={17} color="black" />  {restaurant && restaurant.Address} </Text>


        <Card style={{width: windowWidth/1.12, marginTop: "5%", backgroundColor: "#fb5b5a"}}
         onPress={() => {resetContextWithRestID(); navigation.navigate('Menu', {restName: restaurant.Name})}}>
        <View>
        <Card.Title title="" titleStyle="white"/>
        <Card.Content>
        <Paragraph style={{marginTop: -30}}>
        <Text style={{fontSize: 20, fontWeight: "bold", color: "white"}}>Check the menu   </Text>
        <Ionicons name="ios-paper" size={20} color="white"/>
        </Paragraph>
        <Paragraph style={{marginTop: -5}}>
        </Paragraph>
        </Card.Content>
        </View>
        </Card>
 
        <ScrollView horizontal={true} style={{marginLeft: -40}} pagingEnabled={true} marginTop={"7%"}>
                {reviews && user && reviews.map((rev,i) => {
                  return (
                <Card style={{width: windowWidth/1.12, marginLeft: 40, marginRight: 20, height: 170}}
                onPress={() => { navigation.navigate('MakeReview') }}
                >
                <View  horizontal={true} pagingEnabled={false}>
                <Card.Title title="Best reviews"/>
                {user[i] && (
                <Card.Content>
                    <Image style = {{width:100, height:100, borderRadius: 5, marginTop:1}} source = {{uri: user[i].Photo}}/>
                    <View style={{marginLeft: 120, marginTop: -100}}>
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
                </Card.Content>

                 )}
                </View>
                </Card>
              )
            })}
        </ScrollView>



        {restaurant && restaurant.rate > 0 && (
        <Card style={{width: windowWidth/1.12, marginTop: "2%" }}>
        <View>
        <Card.Title title="Average rate"/>
        <Card.Content>
        <View style={{marginTop: -5}}>
        <Text style={{fontSize: 15, fontWeight: "bold"}}>
        <AntDesign name="star" size={25} color={restaurant.rate > 0 ? "orange" : "white"}/>
        <AntDesign name="star" size={25} color={restaurant.rate > 1 ? "orange" : "white"}/>
        <AntDesign name="star" size={25} color={restaurant.rate > 2 ? "orange" : "white"}/>
        <AntDesign name="star" size={25} color={restaurant.rate > 3 ? "orange" : "white"}/>
        <AntDesign name="star" size={25} color={restaurant.rate > 4 ? "orange" : "white"}/>
        </Text>
        </View>
        <View style={{marginBottom: 10}}></View>
        </Card.Content>
        </View>
        </Card>

        )}

        <Card style={{width: windowWidth/1.12, marginTop: "2%" }}>
        <View>
        <Card.Title title="Average price"/>
        <Card.Content>
        <Paragraph style={{marginTop: -32.5}}>
        <Text style={{fontSize: 15}}>                                   </Text>
        <FontAwesome name="euro" size={15} color="black" /><Text style={{fontSize: 15}}> {restaurant && restaurant.price}</Text>
        </Paragraph>
        <Paragraph style={{marginTop: -5}}>
        </Paragraph>
        </Card.Content>
        </View>
        </Card>

        <Card style={{width: windowWidth/1.12, marginTop: "2%" }}>
        <View>
        <Card.Title title="Opening hours"/>
        <Card.Content>
        <View style={{marginBottom: -20, marginLeft: -5}}><FontAwesome name="clock-o" size={17} color="black" /></View>
        {mon && (
          <View>
            {mon.MidOpening && (
              <View flexDirection="row">

                 <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
                 <Text style={{fontSize: 15}}>Monday:</Text>
                 </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 6}}>
              <Text style={{fontSize: 15}}>{mon.Opening} - {mon.MidClosing}</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 90}}>
              <Text style={{fontSize: 15}}>{mon.MidOpening} - {mon.Closing}</Text>
              </View>

              </View>
            )}
            {!mon.MidOpening && (

            <View flexDirection="row">

               <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
               <Text style={{fontSize: 15}}>Monday:</Text>
               </View>

            <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 7}}>
            <Text style={{fontSize: 15}}>{mon.Opening} - {mon.Closing}</Text>
            </View>

            </View>
            )}
          </View>
        )}{tue && (
          <View>
            {tue.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Tuesday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 7}}>
              <Text style={{fontSize: 15}}>{tue.Opening} - {tue.MidClosing}</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 90}}>
              <Text style={{fontSize: 15}}>{tue.MidOpening} - {tue.Closing}</Text>
              </View>

              </View>
            )}
            {!tue.MidOpening && (

              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Tuesday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100, marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{tue.Opening} - {tue.Closing}</Text>
              </View>

              </View>
            )}
          </View>
        )}
        {wed && (
          <View>
            {wed.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Wednesday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{wed.Opening} - {wed.MidClosing}</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 90}}>
              <Text style={{fontSize: 15}}>{wed.MidOpening} - {wed.Closing}</Text>
              </View>

              </View>
            )}
            {!wed.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Wednesday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100, marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{wed.Opening} - {wed.Closing}</Text>
              </View>

              </View>
            )}
          </View>
        )}
        {thu && (
          <View>
            {thu.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Thursday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{thu.Opening} - {thu.MidClosing}</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 90}}>
              <Text style={{fontSize: 15}}>{thu.MidOpening} - {thu.Closing}</Text>
              </View>

              </View>
            )}
            {!thu.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Thursday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{thu.Opening} - {thu.Closing}</Text>
              </View>

              </View>
            )}
          </View>
        )}
        {fri && (
          <View>
            {fri.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Friday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{fri.Opening} - {fri.MidClosing}</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 90}}>
              <Text style={{fontSize: 15}}>{fri.MidOpening} - {fri.Closing}</Text>
              </View>

              </View>
            )}
            {!fri.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Friday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{fri.Opening} - {fri.Closing}</Text>
              </View>

              </View>
            )}
          </View>
        )}
        {sat && (
          <View>
            {sat.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Saturday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{sat.Opening} - {sat.MidClosing}</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 90}}>
              <Text style={{fontSize: 15}}>{sat.MidOpening} - {sat.Closing}</Text>
              </View>

              </View>
            )}
            {!sat.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Saturday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{sat.Opening} - {sat.Closing}</Text>
              </View>

              </View>
            )}
          </View>
        )}
        {sun && (
          <View>
            {sun.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Sunday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{sun.Opening} - {sun.MidClosing}</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 90}}>
              <Text style={{fontSize: 15}}>{sun.MidOpening} - {sun.Closing}</Text>
              </View>

              </View>
            )}
            {!sun.MidOpening && (
              <View flexDirection="row">

              <View style={{backgroundColor: "white", height: 20, width: 80, marginLeft: 20}}>
              <Text style={{fontSize: 15}}>Sunday:</Text>
              </View>

              <View style={{backgroundColor: "white", height: 20, width: 100,  marginLeft: 8}}>
              <Text style={{fontSize: 15}}>{sun.Opening} - {sun.Closing}</Text>
              </View>

              </View>
            )}
          </View>
        )}

        <Paragraph>
        </Paragraph>
        </Card.Content>
        </View>
        </Card>

        <Card style={{width: windowWidth/1.12, marginTop: "2%" }}>
        <View>
        <Card.Content>
        <Paragraph style={{marginTop: 25 }}>
        <FontAwesome name="instagram" size={21} color="black" /> <Text style={{fontSize: 15}}> {restaurant && restaurant.LinkInstagram}</Text>
        </Paragraph>
        <Paragraph>
        </Paragraph>
        </Card.Content>
        </View>
        </Card>

        <Card style={{width: windowWidth/1.12, marginTop: "2%", height: 100 }}>
        <View>
        <Card.Title title="Payment Methods"/>
        <Card.Content>
        <View style={{marginTop: -5, flexDirection: "row"}}>

          {paypal && paypal && (
          <Text><FontAwesome name="paypal" size={24} color="darkblue" />    </Text>
          )}
          {creditCard && creditCard && (
          <Text><FontAwesome name="credit-card" size={24} color="black" />    </Text>
          )}
          {tickets && tickets && (
          <Text><FontAwesome name="ticket" size={24} color="black" />    </Text>
          )}
          {satispay && satispay && (
            <Image style={{width:25, height:25}} source={require('../../assets/satispay.png')} />
          )}

        </View>
        <View style={{marginBottom: 10}}></View>
        </Card.Content>
        </View>
        </Card>

        <View style={{ height: 80 }}></View>
        </View>
        </ScrollView>
      <View style={{flexDirection: 'row',
        backgroundColor: 'rgba(52, 52, 52, 0.0)',
        alignItems: 'center',
        justifyContent: 'center',
        height:50}}>
        <TouchableOpacity
          onPress={() => { navigation.navigate("MakeReservation"); }}
          style={{width:300,
          backgroundColor:"#fb5b5a",
          borderRadius:5,
          height:50,
          alignItems:"center",
          justifyContent:"center",
          marginBottom:30}}>
          <Text style={styles.buttonText}>Make a reservation</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}


export default RestaurantScreen;
