import * as React from 'react';
import { useRef } from "react";
import { StyleSheet, Image, Text, View, TouchableOpacity, Dimensions, Slider, CheckBox, ScrollView } from 'react-native';
import 'react-native-gesture-handler';
import {styles} from '../../Styles/stylePrincipalPages'
import { useState, useEffect } from "react";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RBSheet from "react-native-raw-bottom-sheet";
import Constants from 'expo-constants';
import { Card , Paragraph} from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import firebase from 'firebase';
import { restNameContext } from '../../Context';
const db = firebase.firestore();

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Booking1Screen = ({route, navigation}) => {

const refRBSheet = useRef();
const refRBSheet1 = useRef();

const [restActivity, setRestActivity] = useState(false);
const [pizzActivity, setPizzActivity] = useState(false);
const [fastFoodActivity, setFastFoodActivity] = useState(false);
const [vegetarianActivity, setVegetarianActivity] = useState(false);
const [etnicActivity, setEtnicActivity] = useState(false);
const [tavCaldaActivity, setTavCaldaActivity] = useState(false);

const [creditCard, setCreditCard] = useState(false);
const [paypal, setPaypal] = useState(false);
const [satispay, setSatispay] = useState(false);
const [ticket, setTicket] = useState(false);

const [checkPrice, setCheckPrice] = useState(false);
const [checkRate, setCheckRate] = useState(false);
const [checkPop, setCheckPop] = useState(false);

const [restaurants, setRestaurants] = useState([]);
const [restPaym , setRestPaym] = useState([]);
const [activityRest, setActivityRest] = useState([]);
const [restDay, setRestDay] = useState([]);

const [day, setDay] = useState();
const [hour, setHour] = useState();
const [date, setDate] = useState();

const [price, setPrice] = useState();
const [rate, setRate] = useState();
const [backgroundFilters, setBackgroundFilters] = useState(['white', 'white', 'white']);
const [fontFilters, setFontFilters] = useState(['black', 'black', 'black']);

const [restContext, setRestContext] = React.useContext(restNameContext);

useEffect(() => {
  if (route.params?.filter){
    db.collection('Restaurants').get().then(docRest => {
      docRest.docs.map(rest => {
        db.collection('Restaurants').doc(rest.id).collection('Branch').get().then(docBranch => {
          docBranch.docs.map(branch => {
            if (branch.data().Name == route.params?.filter.name || branch.data().Address == route.params?.filter.name){
                setRestaurants(b => [...b,branch.data()]);
            }
          })
        })
      })
    })
  } else {
    if (restaurants.length==0){
      console.log("rest = 0")
      restQuery();
    }
  }
}, [route.params?.filter]);

useEffect(() => {
  setRestaurants([]);
  const array = [];
  if (restPaym && activityRest) {
    for (let i = 0; i < restPaym.length; ++i) {
      for (let j = 0; j < activityRest.length; ++j) {
        if (price) {
          if (rate) {
            if (restPaym[i].Name == activityRest[j].Name && restPaym[i].price <= price && restPaym[i].rate == rate) {
              array.push(restPaym[i]);
                if (checkPrice == true){
                  array.sort(function(a,b) {return a.price - b.price} ) //dal meno costoso al più costoso
                  setRestaurants(array);
                } else if (checkRate == true) {
                  array.sort(function(a,b) {return b.rate - a.rate} ) //dal più votato al meno votato
                  setRestaurants(array);
                } else if (checkPop == true) {
                  array.sort(function(a,b) {return b.length - a.length}) //da quello con più prenotazioni a quello con meno
                  setRestaurants(array);
                } else {
                  setRestaurants(array);
                }
            }
          } else {
            if (restPaym[i].Name == activityRest[j].Name && restPaym[i].price <= price) {
              array.push(restPaym[i]);
                if (checkPrice == true){
                  array.sort(function(a,b) {return a.price - b.price} ) //dal meno costoso al più costoso
                  setRestaurants(array);
                } else if (checkRate == true) {
                  array.sort(function(a,b) {return b.rate - a.rate} ) //dal più votato al meno votato
                  setRestaurants(array);
                } else if (checkPop == true) {
                  array.sort(function(a,b) {return b.length - a.length}) //da quello con più prenotazioni a quello con meno
                  setRestaurants(array);
                } else {
                  setRestaurants(array);
                }
            }
          }
        } else {
          if (rate) {
            if (restPaym[i].Name == activityRest[j].Name && restPaym[i].rate == rate) {
                array.push(restPaym[i]);
                if (checkPrice == true){
                  array.sort(function(a,b) {return a.price - b.price} ) //dal meno costoso al più costoso
                  setRestaurants(array);
                } else if (checkRate == true) {
                  array.sort(function(a,b) {return b.rate - a.rate} ) //dal più votato al meno votato
                  setRestaurants(array);
                } else if (checkPop == true) {
                  array.sort(function(a,b) {return b.length - a.length}) //da quello con più prenotazioni a quello con meno
                  setRestaurants(array);
                } else {
                  setRestaurants(array);
                }
            }
          } else {
            if (restPaym[i].Name == activityRest[j].Name) {
              array.push(restPaym[i]);
              if (checkPrice == true){
                array.sort(function(a,b) {return a.price - b.price} ) //dal meno costoso al più costoso
                setRestaurants(array);
              } else if (checkRate == true) {
                array.sort(function(a,b) {return b.rate - a.rate} ) //dal più votato al meno votato
                setRestaurants(array);
              } else if (checkPop == true) {
                array.sort(function(a,b) {return b.length - a.length}) //da quello con più prenotazioni a quello con meno
                setRestaurants(array);
              } else {
                setRestaurants(array);
              }
            }
          }
        }
        
      }
    }
  }
}, [restPaym, activityRest, checkPrice, checkRate, checkPop]);

const findPath = (name) => {
  db.collection('Restaurants').get().then(docRest => {
    docRest.docs.map(rest => {
      if (rest.data().Name == name) {
        setRestContext('/Restaurants/' + rest.id + '/Branch/1');
        navigation.navigate('RestaurantPage');
      }
    })
  })
}

useEffect(() => {
  restaurants && restaurants.forEach(obj => {
  })
  if (restaurants) {
    if (checkPrice == true){
      restaurants.sort(function(a,b) {return a.price - b.price} ) //dal meno costoso al più costoso
    } else if (checkRate == true) {
      restaurants.sort(function(a,b) {return b.rate - a.rate} ) //dal più votato al meno votato
    } else if (checkPop == true) {
      restaurants.sort(function(a,b) {return b.length - a.length}) //da quello con più prenotazioni a quello con meno
    }
  }
}, [restaurants]);

const restQuery = () => { //prendo TUTTI i ristoranti (caso in cui non schiaccio sui filtri)
  setRestaurants([]);
  db.collection('Restaurants').get().then(docRest => {
      docRest.docs.map(rest => {
          db.collection('Restaurants').doc(rest.id).collection('Branch').get().then(docBranch => {
          docBranch.docs.forEach(branch => {
            db.collection('Restaurants').doc(rest.id).collection('Branch').doc(branch.id).collection('Bookings').get().then(docBook => {
              const branchData = branch.data();
              const l = docBook.docs.length;
              const res = {...branchData, length: l};
              setRestaurants(br => [...br, res]);
            })
          })
        })
      })
  })
}

const paymentQuery = () => {
  setRestPaym([]);
  if (creditCard || paypal || satispay || ticket) {
    db.collection('Restaurants').get().then(docRest => {
      docRest.docs.map(rest => {
        db.collection('Restaurants').doc(rest.id).collection('Branch').get().then(docBranch => {
          docBranch.docs.map(branch => {
            db.collection('Restaurants').doc(rest.id).collection('Branch').doc(branch.id).collection('Bookings').get().then(docBook => {
            const branchData = branch.data();
            const l = docBook.docs.length;
            const res = {...branchData, length: l};
              db.collection('Restaurants').doc(rest.id).collection('Branch').doc(branch.id).collection('Payments').get().then(docPay => {
                docPay.docs.map(pay => {
                  if ((creditCard && pay.id == 'CartaDiCreditoDebito') || (paypal && pay.id == 'Paypal') || (satispay && pay.id == 'Satispay') || (ticket && pay.id == 'TicketRestaurant')) {
                    setRestPaym(b => [...b, res]);
                }
              })
            })
          })
          })
        })
      })
    })
  } else {
    setRestPaym(restaurants);
  }
}

const activityQuery = () => {
  setActivityRest([]);
  if (restActivity || pizzActivity || fastFoodActivity || etnicActivity || vegetarianActivity || tavCaldaActivity) {
    db.collection('Restaurants').get().then(docRest => {
      docRest.docs.map(rest => {
        if ((restActivity && rest.data().Activity == 'Ristorante') || (pizzActivity && rest.data().Activity == 'Pizzeria') || (fastFoodActivity && rest.data().Activity == 'FastFood') || (etnicActivity && rest.data().Activity == 'Etnico') || (vegetarianActivity && rest.data().Activity == 'Vegetarian') || (tavCaldaActivity && rest.data().Activity == 'Tavola Calda')){
          db.collection('Restaurants').doc(rest.id).collection('Branch').get().then(docBranch => {
            docBranch.docs.map(branch => {
              db.collection('Restaurants').doc(rest.id).collection('Branch').doc(branch.id).collection('Bookings').get().then(docBook => {
                const branchData = branch.data();
                const l = docBook.docs.length;
                const res = {...branchData, length: l};
                setActivityRest(b => [...b, res]);
              })
            })
          })
        }
      })
    })
  } else {
    setActivityRest(restaurants);
  }
}

useEffect(() => {
  if (checkPrice) {
    restaurants.sort(function(a,b) {return b.price - a.price} )
  }
}, [checkPrice])

const changeStatus = (id) => {
    switch(id){
        case 1: setBackgroundFilters(['#fb5b5a', 'white', 'white']); setFontFilters(['white', 'black', 'black']); setCheckPop(true); setCheckPrice(false); setCheckRate(false); break;
        case 2: setBackgroundFilters(['white', '#fb5b5a', 'white']); setFontFilters(['black', 'white', 'black']); setCheckPop(false); setCheckPrice(true); setCheckRate(false); break;
        case 3: setBackgroundFilters(['white', 'white', '#fb5b5a']); setFontFilters(['black', 'black', 'white']); setCheckPop(false); setCheckPrice(false); setCheckRate(true); break;
    }

}

useEffect(() => {
  setRestaurants(restDay);
},[restDay])

const HourDate = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    const d = new Date(date);
    var weekday = new Array(7);
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tue";
    weekday[3] = "Wen";
    weekday[4] = "Thu";
    weekday[5] = "Fri";
    weekday[6] = "Sat";
    const x = weekday[d.getDay()];
    setDay(x);
    var y = date.toString();
    y = y.substring(4, 15)
    setDate(y);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm1 = (time) => {
    const d = new Date(time);
    const x = d.getHours();
    const y = d.getMinutes();
    const t = x + ':' + y;
    console.log(x+":"+y)
    var s = time.toString();
    s = s.substring(16,21);
    setHour(s);
    setRestDay([]);
    db.collection('Restaurants').get().then(docRest => {
      docRest.docs.map(rest => {
        db.collection('Restaurants').doc(rest.id).collection('Branch').get().then(docBranch => {
          docBranch.docs.map(branch => {
            db.collection('Restaurants').doc(rest.id).collection('Branch').doc(branch.id).collection('OpeningHours').get().then(docOp => {
              docOp.docs.map(op => {
                if (op.id == day) {
                  //esiste il giorno
                  const open = op.data().Opening;
                  const openHour = parseInt(open); //ora
                  const openMin = parseInt(open.substring(3)) //minute
                  const close = op.data().Closing;
                  const closeHour = parseInt(close); //ora
                  const closeMin = parseInt(close.substring(3)) //minute
                  if (op.data().MidOpening){
                    const midOpen = op.data().MidOpening;
                    const midOpenHour = parseInt(midOpen); //ora
                    const midOpenMin = parseInt(midOpen.substring(3)) //minute
                    const midClose = op.data().MidClosing;
                    const midCloseHour = parseInt(midClose); //ora
                    const midCloseMin = parseInt(midClose.substring(3)) //minute
                    if ((x >= openHour && x <= midCloseHour && y>=openMin && y<=midCloseMin) || (x>=midOpenHour && x<=closeHour && y>=midOpenMin && y<=closeMin) ) {
                      setRestDay(b => [...b, branch.data()])
                    }
                  } else if (x>openHour && x < closeHour){
                    setRestDay(b => [...b, branch.data()])
                  } else if (x == openHour && y >= openMin) {
                    setRestDay(b => [...b, branch.data()])
                  } else if (x == closeHour && y <= closeMin) {
                    setRestDay(b => [...b, branch.data()])
                  }
                }
              })
            })
          })
        })
      })
      hideTimePicker();
    })
  };

  return (
    <View style={styles.container}>

    <View flexDirection="row" style={{marginLeft: -windowWidth/3}}>
    <TouchableOpacity
        onPress={showDatePicker}
        style={{backgroundColor: "#fb5b5a",
        width:windowWidth/2.4,
        borderRadius:50,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        }}>
        <Text style={{ fontWeight: "bold", fontSize: 15, color: "white", alignItems: "center" }}>Pick a date</Text>
    </TouchableOpacity>
    <FontAwesome name="calendar" size={30} color="black" style={{marginTop:10, marginLeft: 20}}/>
    </View>
    <Text style={{ fontWeight: "bold", fontSize: 15, color: "black", marginTop: -35, marginLeft:  windowWidth/1.8 }}>{date}
    </Text>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <View flexDirection="row"  style={{marginLeft: -windowWidth/3}}>
      <TouchableOpacity
          onPress={showTimePicker}
          style={{backgroundColor: "#fb5b5a",
          width:windowWidth/2.4,
          borderRadius:50,
          height:50,
          alignItems:"center",
          justifyContent:"center",
          marginTop: 20,
          }}>
          <Text style={{ fontWeight: "bold", fontSize: 15, color: "white", alignItems: "center" }}>Pick a hour</Text>
      </TouchableOpacity>
     <FontAwesome name="clock-o" size={30} color="black" style={{marginTop:30, marginLeft: 20}}/>
     </View>
        <Text style={{ fontWeight: "bold", fontSize: 15, color: "black", marginTop: -35, marginLeft:  windowWidth/1.8 }}>{hour}</Text>

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirm1}
        onCancel={hideTimePicker}
      />
    </View>
  );
};


  return (
    <View style={styles.container}>
    <View flexDirection="row" style={{alignItems: "center"}}>
    <Card style={{width: windowWidth/1.1, marginTop: -20, height: 70, borderRadius: 60}}>
      <Card.Content>
     <View flexDirection="row" style={{marginTop: -5, alignItems: "center"}}>
     <TouchableOpacity
         onPress={() => refRBSheet.current.open()}
         style={{backgroundColor: "#fb5b5a",
         width:"50%",
         borderRadius:50,
         height:50,
         alignItems:"center",
         justifyContent:"center",
         marginLeft: "-1%"
         }}>
         <Text style={{ fontWeight: "bold", fontSize: 15, color: "white"}}>Choose Hour</Text>
     </TouchableOpacity>
     <TouchableOpacity
         onPress={() => refRBSheet1.current.open()}
         style={{backgroundColor: "#fb5b5a",
         width:"50%",
         borderRadius:50,
         height:50,
         marginLeft: "2%",
         alignItems:"center",
         justifyContent:"center",
         }}>
         <Text style={{ fontWeight: "bold", fontSize: 15, color: "white"}}>Filters</Text>
     </TouchableOpacity>
      </View>
      </Card.Content>

    </Card>
    </View>
    <ScrollView style={{backgroundColor: "f2f2f2"}} >
      <Text>{restaurants && restaurants.map((rest,i) => {
        return (

  <View style={{alignItems: "center"}}>
          <Card style={{width: windowWidth/1.12, height: 160, marginTop: 20, marginLeft: windowWidth/20}}
          onPress={() => findPath(rest.Name)}
          >
          <View  horizontal={true} pagingEnabled={false}>
          <Card.Title title={ rest.Name }/>
          <Card.Content>
              <Image style = {{width:100, height:100, borderRadius: 5, marginTop:-3}} source = {{uri: rest.Photo}}/>
              <View style={{marginLeft: 120, marginTop: -100}}>
              <Text style={{ fontSize: 15}}>Address: {rest.Address}</Text>
              <Text style={{ fontSize: 15}}>Average price: {rest.price}€</Text>
              <Text style={{ fontSize: 15}}>Average rate: {rest.rate}/5</Text>
              <Text style={{ marginTop: 10}}><AntDesign name="star" size={17} color={rest.rate > 0 ? "orange" : "white"}/>
                    <AntDesign name="star" size={17} color={rest.rate > 1 ? "orange" : "white"}/>
                    <AntDesign name="star" size={17} color={rest.rate > 2 ? "orange" : "white"}/>
                    <AntDesign name="star" size={17} color={rest.rate > 3 ? "orange" : "white"}/>
                    <AntDesign name="star" size={17} color={rest.rate > 4 ? "orange" : "white"}/>
              </Text>
              </View>
              <Paragraph style={{marginTop: "5%"}}>
          </Paragraph>
          </Card.Content>
          </View>
          </Card>
    </View>

        )
      })}</Text>
    </ScrollView>


      <RBSheet
        ref={refRBSheet}
        height={350}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
          backgroundColor: 'rgba(52, 52, 52, 0.8)'
          },
          draggableIcon: {
            backgroundColor: "#000"
          }
        }}
      >
      <View style={styles.container}>
      <Text>{HourDate()}</Text>
      <TouchableOpacity
          onPress={() => refRBSheet.current.close()}
        style={styles.loginBtn}>
        <Text style={{ fontWeight: "bold", fontSize: 15, color: "white", alignItems: "center" }}>Choose a hour</Text>
      </TouchableOpacity>
      </View>
      </RBSheet>

      <RBSheet
        ref={refRBSheet1}
        height={windowHeight}
        closeOnDragDown={true}
        closeOnPressMask={false}
        customStyles={{
          wrapper: {
          backgroundColor: 'rgba(52, 52, 52, 0.8)'
          },
          draggableIcon: {
            backgroundColor: "#000"
          }
        }}
      >
      <View style={styles1.container}>
          <View style={{alignItems: "center"}}>
          <Text style={{fontSize:20, marginTop: 10}}>Order By</Text>
          <Card style={{width: windowWidth/1.1, marginTop: 10, height: 70, borderRadius: 60}}>
            <Card.Content style={{alignItems: "center"}}>
           <View flexDirection="row" style={{marginTop: -5}}>
           <TouchableOpacity
               onPress={()=>changeStatus(1)}
               style={{backgroundColor: backgroundFilters[0],
               width:windowWidth/3.5,
               borderRadius:50,
               height:50,
               alignItems:"center",
               justifyContent:"center",
               }}>
               <Text style={{ fontWeight: "bold", fontSize: 15, color: fontFilters[0], alignItems: "center" }}>Popularity</Text>
           </TouchableOpacity>
           <TouchableOpacity
               onPress={()=>changeStatus(2)}
               style={{backgroundColor: backgroundFilters[1],
               width:windowWidth/3.5,
               borderRadius:50,
               height:50,
               alignItems:"center",
               justifyContent:"center",
               }}>
               <Text style={{ fontWeight: "bold", fontSize: 15, color: fontFilters[1], alignItems: "center" }}>Price</Text>
           </TouchableOpacity>
           <TouchableOpacity
               onPress={()=>changeStatus(3)}
               style={{backgroundColor: backgroundFilters[2],
               width:windowWidth/3.5,
               borderRadius:50,
               height:50,
               alignItems:"center",
               justifyContent:"center",
               }}>
               <Text style={{ fontWeight: "bold", fontSize: 15, color: fontFilters[2], alignItems: "center" }}>Ratings</Text>
           </TouchableOpacity>
            </View>
            </Card.Content>

          </Card>
          </View>
          <View style={{alignItems: "center"}}>
          <Text style={{fontSize:20, marginTop: 10}}>Filter By</Text>

          <Card style={{width: windowWidth/1.1, marginTop: 10, height: 130}}>
            <Card.Content>
           <View style={{marginTop: -5, marginLeft: -windowWidth/45}}>
           <Text style={styles1.text}>Price: {String(price)}€</Text>
           <Slider
               step={1}
               maximumValue={100}
               onValueChange={p => setPrice(p)}
               value={price}
           />
           <Text style={styles1.text}>Ratings {String(rate)}</Text>
           <View style={{alignItems: "center", marginTop: 5, marginBottom: 5}}>
                 <Text>
                 <AntDesign name="star" size={20} color={String(rate) > 0 ? "orange" : "white"}/>
                 <AntDesign name="star" size={20} color={String(rate) > 1 ? "orange" : "white"}/>
                 <AntDesign name="star" size={20} color={String(rate) > 2 ? "orange" : "white"}/>
                 <AntDesign name="star" size={20} color={String(rate) > 3 ? "orange" : "white"}/>
                 <AntDesign name="star" size={20} color={String(rate) > 4 ? "orange" : "white"}/>
                 </Text>
                 </View>
           <Slider
               step={1}
               maximumValue={5}
               onValueChange={r => setRate(r)}
               value={rate}
           />
            </View>
            </Card.Content>
          </Card>

          <Card style={{width: windowWidth/1.1, marginTop: 20, height: 125}}>
            <Card.Content>
           <View flexDirection="row" style={{marginTop: -5, marginLeft: -windowWidth/45}}>

           <View style={{marginTop:20, flexDirection: 'column', marginTop: -1, marginLeft: 10, marginRight: 80}}>
               <View style={{flexDirection: "row", alignItems:"center"}}>
                   <CheckBox
                       value={restActivity}
                       onValueChange={() => setRestActivity(!restActivity)}
                   />
                   <Text style={{margin: 8,  color:"black"}}>Restaurant</Text>
               </View>
               <View style={{flexDirection: "row", alignItems:"center"}}>
                   <CheckBox
                       value={pizzActivity}
                       onValueChange={() => setPizzActivity(!pizzActivity)}
                   />
                   <Text style={{margin: 8,  color:"black"}}>Pizzeria</Text>
               </View>
               <View style={{flexDirection: "row", alignItems:"center"}}>
                   <CheckBox
                       value={fastFoodActivity}
                       onValueChange={() => setFastFoodActivity(!fastFoodActivity)}
                   />
                   <Text style={{margin: 8,  color:"black"}}>Fast Food</Text>
               </View>
               <View style={{marginTop:20, flexDirection: 'column', marginTop: -105, marginLeft: 140}}>
               <View style={{flexDirection: "row", alignItems:"center"}}>
                   <CheckBox
                       value={vegetarianActivity}
                       onValueChange={() => setVegetarianActivity(!vegetarianActivity)}
                   />
                   <Text style={{margin: 8,  color:"black"}}>Vegetarian</Text>
               </View>
               <View style={{flexDirection: "row", alignItems:"center"}}>
                   <CheckBox
                       value={etnicActivity}
                       onValueChange={() => setEtnicActivity(!etnicActivity)}
                   />
                   <Text style={{margin: 8,  color:"black"}}>Etnic</Text>
               </View>
               <View style={{flexDirection: "row", alignItems:"center"}}>
                   <CheckBox
                       value={tavCaldaActivity}
                       onValueChange={() => setTavCaldaActivity(!tavCaldaActivity)}
                   />
                   <Text style={{margin: 8,  color:"black"}}>Tavola Calda</Text>
               </View>
               </View>
</View>


            </View>
            </Card.Content>
          </Card>

          <Card style={{width: windowWidth/1.1, marginTop: 20, height: 90}}>
            <Card.Content>
           <View flexDirection="row" style={{marginTop: -5, marginLeft: -windowWidth/45}}>

           <View style={{marginTop:20, flexDirection: 'column', marginTop: -1, marginLeft: 10, marginRight: 80}}>
               <View style={{flexDirection: "row", alignItems:"center"}}>
                   <CheckBox
                       value={paypal}
                       onValueChange={() => setPaypal(!paypal)}
                   />
                   <Text style={{margin: 8,  color:"black"}}>PayPal</Text>
               </View>
               <View style={{flexDirection: "row", alignItems:"center"}}>
                   <CheckBox
                       value={satispay}
                       onValueChange={() => setSatispay(!satispay)}
                   />
                   <Text style={{margin: 8,  color:"black"}}>Satispay</Text>
               </View>
               <View style={{marginTop:20, flexDirection: 'column', marginTop: -70, marginLeft: 140}}>
               <View style={{flexDirection: "row", alignItems:"center"}}>
                   <CheckBox
                       value={creditCard}
                       onValueChange={() => setCreditCard(!creditCard)}
                   />
                   <Text style={{margin: 8,  color:"black"}}>Credit card</Text>
               </View>
               <View style={{flexDirection: "row", alignItems:"center"}}>
                   <CheckBox
                       value={ticket}
                       onValueChange={() => setTicket(!ticket)}
                   />
                   <Text style={{margin: 8,  color:"black"}}>Bonus ticket</Text>
               </View>
               </View>
          </View>


            </View>
            </Card.Content>
          </Card>


          <TouchableOpacity
             onPress={() => {paymentQuery(); activityQuery(); refRBSheet1.current.close()}}
             style={{width:300,
             backgroundColor:"#fb5b5a",
             borderRadius:5,
             height:50,
             alignItems:"center",
             justifyContent:"center",
             marginTop:20,
             marginBottom:10}}>
            <Text style={{color: "white", fontWeight: "bold", fontSize: 17}}>Apply filters</Text>
          </TouchableOpacity>
          </View>
      </View>
      </RBSheet>

      </View>
    );
  }



const styles1 = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center'
    },
    text: {
      fontSize: 15,
      textAlign: 'center'
    },
    containerScroll: {
     flex: 0.2,
     marginTop: Constants.statusBarHeight,
   },
   scrollView: {
     //backgroundColor: 'white',
     marginHorizontal: 20,
   },


  });


export default Booking1Screen;
