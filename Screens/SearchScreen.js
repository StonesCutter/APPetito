import React, {useContext, useEffect, useState} from 'react';
import {Text, View, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack'
import   {Feather}  from  "react-native-vector-icons";
import {styles} from '../Styles/stylePrincipalPages'
import { restNameContext } from '../Context';
import firebase from 'firebase';
const db = firebase.firestore();
const { width, height } = Dimensions.get('screen');
import { Card, Paragraph } from 'react-native-paper';
import { AntDesign } from '@expo/vector-icons';

const SearchScreen = () => {
  const Stack = createStackNavigator();
  return(
      <Stack.Navigator initialRouteName="Search">
        <Stack.Screen name="Search"component={Search}
          //drawer button
          options={({navigation})=>({
            headerLeft:() =>(
              <Feather name='menu' size={25} style={{marginLeft:14}}
              color={'#F60875'}  onPress={()=>navigation.openDrawer()}></Feather>
            )
          })}/>
      </Stack.Navigator>
  )
}

const Search = props => {
  const [restContext, setRestContext] = useContext(restNameContext);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    queryRest();
  }, [])

  const queryRest = () => {
    setRestaurants([]);
    db.collection('Restaurants').get().then(docRest => {
      docRest.docs.map(rest => {
        db.collection('Restaurants').doc(rest.id).collection('Branch').get().then(docBranch => {
          docBranch.docs.map(branch => {
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

  const sortRating = () => {
    restaurants.sort(function(a,b) {return b.rate - a.rate} )
  }


  const sortPopularity = () => {
    restaurants.sort(function(a,b) {return b.length - a.length})
  }


  const findPath = (name) => {
    db.collection('Restaurants').get().then(docRest => {
      docRest.docs.map(rest => {
        if (rest.data().Name == name) {
          setRestContext('/Restaurants/' + rest.id + '/Branch/1');
          props.navigation.navigate('RestaurantPage');
        }
      })
    })
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => props.navigation.navigate("SearchTool")}>
      <Image style={{width:width/1.1, height: width/5.6,  marginLeft: -width/35, marginTop: -20, marginBottom: 20}} source={require('../assets/SearchBar.jpg')} />
      </TouchableOpacity>
<View style={{backgroundColor: "#fb5b5a", height: 30, alignItems: "center", justifyContent: "center", width: width}}>
<Text style={{fontSize: 17, color: "white", fontWeight: "bold"}}>Suggested for best Ratings</Text>
</View>
{restaurants && (
      <ScrollView horizontal={true} pagingEnabled={true} height={height/4} marginTop={"7%"}>
        {sortRating()}
             {restaurants.map((r,i) => {
                return (

              <Card style={{width: width-40, height: height/4.4, backgroundColor: "white", marginLeft: 20, marginRight: 20}} onPress={() => {findPath(r.Name)}}>
              <Image style={{
              width: width-40,
              height: height/6}}
              source={{uri: r.Photo}} />
              <View  horizontal={true} pagingEnabled={false}>
              <Card.Content>
                  <View style={{width: width}}>
                  <Text style={{fontSize: 17, marginLeft: 5, marginLeft: -5, marginTop: 10}}>
                  {r.Name}, {r.City}  <AntDesign name="star" size={20} color={r.rate > 0 ? "orange" : "transparent"}/>
                  <AntDesign name="star" size={20} color={r.rate > 1 ? "orange" : "transparent"}/>
                  <AntDesign name="star" size={20} color={r.rate > 2 ? "orange" : "transparent"}/>
                  <AntDesign name="star" size={20} color={r.rate > 3 ? "orange" : "transparent"}/>
                  <AntDesign name="star" size={20} color={r.rate > 4 ? "orange" : "transparent"}/></Text>
                  </View>
              </Card.Content>
              </View>
              </Card>
            )
          })}
      </ScrollView>
      )}
<View style={{backgroundColor: "#fb5b5a", height: 30, alignItems: "center", justifyContent: "center", width: width}}>
      <Text style={{fontSize: 17, color: "white", fontWeight: "bold"}}>Suggested for popularity</Text>
</View>

      {restaurants && (
            <ScrollView horizontal={true} pagingEnabled={true} height={height/4} pagingEnabled={true} marginTop={"7%"}>
              {sortPopularity()}
                   {restaurants.map((r,i) => {
                      return (

                        <Card style={{width: width-40, height: height/4.4, backgroundColor: "white", marginLeft: 20, marginRight: 20}} onPress={() => {findPath(r.Name)}}>
                        <Image style={{
                        width: width-40,
                        height: height/6}}
                        source={{uri: r.Photo}} />
                        <View  horizontal={true} pagingEnabled={false}>
                        <Card.Content>
                            <View style={{width: width}}>
                            <Text style={{fontSize: 17, marginLeft: 5, marginLeft: -5, marginTop: 10}}>
                            {r.Name}, {r.City}  <AntDesign name="star" size={20} color={r.rate > 0 ? "orange" : "transparent"}/>
                            <AntDesign name="star" size={20} color={r.rate > 1 ? "orange" : "transparent"}/>
                            <AntDesign name="star" size={20} color={r.rate > 2 ? "orange" : "transparent"}/>
                            <AntDesign name="star" size={20} color={r.rate > 3 ? "orange" : "transparent"}/>
                            <AntDesign name="star" size={20} color={r.rate > 4 ? "orange" : "transparent"}/></Text>
                            </View>
                        </Card.Content>
                        </View>
                        </Card>

                  )
                })}
            </ScrollView>
            )}


    </View>
    );
}


export default SearchScreen;
