import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Slider, ScrollView, TouchableOpacity, CheckBox, Dimensions  } from 'react-native';
import { useState } from "react";
import Constants from 'expo-constants';
import * as firebase from 'firebase';
const db = firebase.firestore();
import { Card } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';

const FiltersScreen = () => {
    const [price, setPrice] = useState();
    const [rate, setRate] = useState();
    const [restaurants, setRestaurants] = useState([]);
    const [checkActivity, setCheckActivity] = useState([false, false, false, false, false, false]);
    const [checkPayment, setCheckPayment] = useState([false, false, false, false]);
    const [backgroundFilters, setBackgroundFilters] = useState(['white', 'white', 'white']);
    const [fontFilters, setFontFilters] = useState(['white', 'white', 'white']);
    const windowWidth = Dimensions.get('window').width;

    useEffect(() => {
        queryRestaurants
    }, [])


    const changeStatus = (id) => {
        switch(id){
            case 1: setBackgroundFilters(['#fb5b5a', 'white', 'white']); setFontFilters(['white', 'black', 'black']); break;
            case 2: setBackgroundFilters(['white', '#fb5b5a', 'white']); setFontFilters(['black', 'white', 'black']); break;
            case 3: setBackgroundFilters(['white', 'white', '#fb5b5a']); setFontFilters(['black', 'black', 'white']); break;
        }

    }

    const queryRestaurants = () => {
        setRestaurants([]);
        db.collection('Restaurants').get().then(docRest => {
            docRest.docs.map(rest => {
                db.collection('Restaurants').doc(rest.id).collection('Branch').get().then(docBranch => {
                docBranch.docs.forEach(branch => {
                    const branchData = branch.data();
                    setRestaurants(br => [...br, branchData]);
                })
                })
            })
        })
    }

    const priceOrder = () => {
        restaurants.sort(function(a,b) {return a.price - b.price} ) //dal meno costoso al più costoso
    }

    const rateOrder = () => {
        restaurants.sort(function(a,b) {return b.rate - a.rate} ) //dal più votato al meno votato
    }

    const popOrder = () => {
        restaurants.sort(function(a,b) {return b.rate - a.rate} ) //temporary, wait the bookings
    }

    /*const maxPrice = () => {
        restaurants.filter(function(a) {return a.price < price}) //to test
    }

    const correctRate = () => {
        restaurants.filter(function(a) {return a.rate == rate}) //to test
    }

    const activityFilter = () => {
        //AHAHAHHAHAHA BHOOOO è sul ristorante questo, non sul branch! Copiare l'activity anche sul branch?
    }

    //TO TEST, in the checkbox: setRestaurants(tempRest)
    const paymentFilter = (method) => {
        db.collection('Restaurants').get().then(docRest => {
            docRest.docs.map(rest => {
                db.collection('Restaurants').doc(rest.id).collection('Branch').get().then(docBranch => {
                docBranch.docs.map(branch => {
                    if (restaurants.includes(branch.data())){
                        db.collection('Restaurants').doc(rest.id).collection('Branch').doc(branch.id).collection('PaymentMethods').get().then(brDoc => {
                            brDoc.docs.map(br => {
                                if (br.id == method) {
                                    setTempRest(b => [...b, br.data()])
                                }
                            })
                        })
                    }
                })
                })
            })
        })
    }*/

    const maxiQuery = () => {
        setRestaurants([]);
        const a = null;
        db.collection('Restaurants').get().then(docRest => {
            docRest.docs.map(rest => {
                if (checkActivity.includes(true)){
                    const i = checkActivity.indexOf(true)
                    switch(i) {
                        case 0: //Restaurant
                            a = 'Ristorante'; break;
                        case 1: //Pizzeria
                            a = "Pizzeria"; break;
                        case 2: //fast food
                            a = 'FastFood'; break;
                        case 3: //vegetarian
                            a = "Vegetarian"; break;
                        case 4: //etnic
                            a = "Etnic"; break;
                        case 5: //tavola calda
                            a = "Tavola Calda"; break;
                        default: a = null; break;
                    }
                    if (rest.data().Activity == a) {
                        db.collection('Restaurants').doc(rest.id).collection('Branch').get().then(docBranch => {
                            docBranch.docs.map(branch => {
                                if (price && (branch.data().price <= price)) {
                                    if (rate && (branch.data().rate == rate)) {
                                        if (checkPayment.includes(true)){
                                            for (var b = 0; b < checkPayment.length; b++){
                                                if (checkPayment[i] == true){
                                                    db.collection('Restaurants').doc(rest.id).collection('Branch').doc(branch.id).collection('PaymentMethods').get().then(docPaym => {
                                                        docPaym.docs.map(paym => {
                                                            if (paym.id == checkPayment[i]){
                                                                setRestaurants(r => [...r, branch.data()]);
                                                            }
                                                        })
                                                    })
                                                }
                                            }
                                        }
                                    }
                                }
                            })
                        })
                    }
                } 
            })
        })
    }


    return(
        <ScrollView style={ styles.boxOne }>
            <View style={styles.container}>
                <View style={{alignItems: "center"}}>
                <Text style={{fontSize:20, marginTop: 10}}>Order By</Text>
                <Card style={{width: windowWidth/1.1, marginTop: 10, height: 70, borderRadius: 60}}>
                  <Card.Content>
                 <View flexDirection="row" style={{marginTop: -5, marginLeft: -windowWidth/45}}>
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

                <Card style={{width: windowWidth/1.1, marginTop: 10, height: 110}}>
                  <Card.Content>
                 <View style={{marginTop: -5, marginLeft: -windowWidth/45}}>
                 <Text style={styles.text}>Price: {String(price)}€</Text>
                 <Slider
                     step={1}
                     maximumValue={100}
                     onValueChange={p => setPrice(p)}
                     value={price}
                 />
                 <Text style={styles.text}>Ratings {String(rate)} <AntDesign name="star" size={15} color="orange" /></Text>
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
                             value={checkActivity[0]}
                             onValueChange={() => setCheckActivity([!checkActivity[0], checkActivity[1], checkActivity[2], checkActivity[3], checkActivity[4], checkActivity[5]])}
                         />
                         <Text style={{margin: 8,  color:"black"}}>Restaurant</Text>
                     </View>
                     <View style={{flexDirection: "row", alignItems:"center"}}>
                         <CheckBox
                             value={checkActivity[1]}
                             onValueChange={() => setCheckActivity([checkActivity[0], !checkActivity[1], checkActivity[2], checkActivity[3], checkActivity[4], checkActivity[5]])}
                         />
                         <Text style={{margin: 8,  color:"black"}}>Pizzeria</Text>
                     </View>
                     <View style={{flexDirection: "row", alignItems:"center"}}>
                         <CheckBox
                             value={checkActivity[2]}
                             onValueChange={() => setCheckActivity([checkActivity[0], checkActivity[1], !checkActivity[2], checkActivity[3], checkActivity[4], checkActivity[5]])}
                         />
                         <Text style={{margin: 8,  color:"black"}}>Fast Food</Text>
                     </View>
                     <View style={{marginTop:20, flexDirection: 'column', marginTop: -105, marginLeft: 140}}>
                     <View style={{flexDirection: "row", alignItems:"center"}}>
                         <CheckBox
                             value={checkActivity[3]}
                             onValueChange={() => setCheckActivity([checkActivity[0], checkActivity[1], checkActivity[2], !checkActivity[3], checkActivity[4], checkActivity[5]])}
                         />
                         <Text style={{margin: 8,  color:"black"}}>Vegetarian</Text>
                     </View>
                     <View style={{flexDirection: "row", alignItems:"center"}}>
                         <CheckBox
                             value={checkActivity[4]}
                             onValueChange={() => setCheckActivity([checkActivity[0], checkActivity[1], checkActivity[2], checkActivity[3], !checkActivity[4], checkActivity[5]])}
                         />
                         <Text style={{margin: 8,  color:"black"}}>Etnic</Text>
                     </View>
                     <View style={{flexDirection: "row", alignItems:"center"}}>
                         <CheckBox
                             value={checkActivity[5]}
                             onValueChange={() => setCheckActivity([checkActivity[0], checkActivity[1], checkActivity[2], checkActivity[3], checkActivity[4], !checkActivity[5]])}
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
                             value={checkActivity[0]}
                             onValueChange={() => setCheckActivity([!checkActivity[0], checkActivity[1], checkActivity[2], checkActivity[3], checkActivity[4], checkActivity[5]])}
                         />
                         <Text style={{margin: 8,  color:"black"}}>PayPal</Text>
                     </View>
                     <View style={{flexDirection: "row", alignItems:"center"}}>
                         <CheckBox
                             value={checkActivity[1]}
                             onValueChange={() => setCheckActivity([checkActivity[0], !checkActivity[1], checkActivity[2], checkActivity[3], checkActivity[4], checkActivity[5]])}
                         />
                         <Text style={{margin: 8,  color:"black"}}>Satispay</Text>
                     </View>
                     <View style={{marginTop:20, flexDirection: 'column', marginTop: -70, marginLeft: 140}}>
                     <View style={{flexDirection: "row", alignItems:"center"}}>
                         <CheckBox
                             value={checkActivity[3]}
                             onValueChange={() => setCheckActivity([checkActivity[0], checkActivity[1], checkActivity[2], !checkActivity[3], checkActivity[4], checkActivity[5]])}
                         />
                         <Text style={{margin: 8,  color:"black"}}>Credit card</Text>
                     </View>
                     <View style={{flexDirection: "row", alignItems:"center"}}>
                         <CheckBox
                             value={checkActivity[4]}
                             onValueChange={() => setCheckActivity([checkActivity[0], checkActivity[1], checkActivity[2], checkActivity[3], !checkActivity[4], checkActivity[5]])}
                         />
                         <Text style={{margin: 8,  color:"black"}}>Bonus ticket</Text>
                     </View>
                     </View>
                </View>


                  </View>
                  </Card.Content>
                </Card>


                <TouchableOpacity
                   onPress={() =>  {pushSocial(FB, Insta); props.navigation.navigate("InsertMenu") }}
                   style={{width:300,
                   backgroundColor:"#fb5b5a",
                   borderRadius:5,
                   height:50,
                   alignItems:"center",
                   justifyContent:"center",
                   marginTop:20,
                   marginBottom:10}}>
                  <Text style={{color: "white", fontWeight: "bold", fontSize: 17}}>continue</Text>
                </TouchableOpacity>
                </View>

            {/* <Text style={styles.text}> Fast filters</Text>

                <View style={{marginTop:20, flexDirection: 'column', marginTop: 20, marginLeft: 120, marginRight: 80}}>
                <View style={{flexDirection: "row", alignItems:"center"}}>
                <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={()=>setToggle([!toggle[0], toggle[1]])}
                        value={toggle[0]}
                    />
                <Text style={{margin: 8,  color:"black"}}>Show only restaurants with bonus</Text>
                </View>

                <View style={{flexDirection: "row"}}>
                <Switch
                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={()=>setToggle([toggle[0], !toggle[1]])}
                        value={toggle[1]}
                    />
                <Text style={{margin: 8,  color:"black"}}>Show only restaurants with covid protections</Text>
                </View>
                </View>*/}
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
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

export default FiltersScreen;
