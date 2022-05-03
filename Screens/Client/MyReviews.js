import React, {useContext, useEffect, useState} from 'react';
import {Text, View, Dimensions, Image, ScrollView, Alert, StyleSheet } from 'react-native';
import { Card, Paragraph} from 'react-native-paper';
import {createStackNavigator} from '@react-navigation/stack'
import   {Feather}  from  "react-native-vector-icons";
import { IdContext, restNameContext } from '../../Context';
import * as firebase from 'firebase';
import 'firebase/firestore';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
const db = firebase.firestore();
const { width, height } = Dimensions.get('screen');

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

const MyReviewsPage = (props) => {
    const [id, setID] = useContext(IdContext);
    const [no, setNo] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [restaurants, setRestaurants] = useState([]);
    const [branch, setBranch] = useState([]);
    const [restContext, setRestContext] = useContext(restNameContext);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const favHeight= (windowHeight/6)
    const [test, setTest] = useState(0);

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
          } else {
          query();}})
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

    const query = () => {
         setReviews([]);
         setRestaurants([]);
         setBranch([]);
        db.collection('Restaurants').get().then(data => {
            data.docs.map(doc => {
                const restaurantId = doc.id;
                const branchRef = db.collection('Restaurants/' + restaurantId + '/Branch');
                branchRef.get().then(branchData => {
                    branchData.docs.map(branch => {
                        const branchId = branch.id;
                        const branchPath = '/Restaurants/'+restaurantId+'/Branch/'+branchId;
                        const branchData = branch.data();
                        const reviewsRef = db.collection('Restaurants/' + restaurantId + '/Branch/' + branchId + '/Reviews');
                        reviewsRef.onSnapshot(data => {
                            data.docChanges().map(doc => {
                              setTest(1);
                              const reviewData = doc.doc.data();
                              const reviewClientId = reviewData.ID_Client;
                              if (id == reviewClientId) {
                                  setTest(0);
                                  setBranch(br => [...br, branchPath]);
                                  setRestaurants(rvs => [...rvs, branchData]);
                                  setReviews(rvs => [...rvs, reviewData]);
                              }
                          });
                        });
                    });
                });
            });
        });
    }

    useEffect(() => {
      if (test && test==1) {
          setNo(true);
        } else {
          setNo(false);
      }
    }, [test])

    return (
        <ScrollView style={{backgroundColor: "white"}}>
          {no==true ? (
            <View style={{marginTop: 30, alignItems: "center"}}>
            <Text style={{fontSize: 20}}>You didn't write reviews yet</Text>
            <Image style={{width:width/2, height: height/3, marginTop: height/6}} source={require('../../assets/lonely.jpg')} />
            </View>
          ) : (
            <View>
              <Text> {reviews && branch && reviews.map((review, i) => {
                  return (

                    <Card style={{width: windowWidth}} onPress = {() =>{setRestContext(branch[i]); props.navigation.navigate('RestaurantPage')}}>
                    <View>
                    <View key={i}>
                    <Image style={{
                    width: windowWidth,
                    height: favHeight}}
                    source={{uri:restaurants[i].Photo}} />

                      <Card.Title title={restaurants[i].Name}
                      left={
                        () => {
                      let LeftContent = props => <MaterialIcons name="rate-review" size={40} color="green" />
                        return <LeftContent/>
                    } }
                      />
                      <Card.Content>
                      <Paragraph>
                      <Text>{review.Description}</Text>
                      </Paragraph>
                      <Paragraph style={{ marginTop: 10}}>
                      <Text style={{fontWeight: "bold", marginTop: 30}}> Rate: {review.Score} / 5 </Text>
                      </Paragraph>

                      <Text style={{fontSize: 15, marginTop: 10}}>
                      <AntDesign name="star" size={30} color={review.Score > 0 ? "orange" : "white"}/>
                      <AntDesign name="star" size={30} color={review.Score > 1 ? "orange" : "white"}/>
                      <AntDesign name="star" size={30} color={review.Score > 2 ? "orange" : "white"}/>
                      <AntDesign name="star" size={30} color={review.Score > 3 ? "orange" : "white"}/>
                      <AntDesign name="star" size={30} color={review.Score > 4 ? "orange" : "white"}/>
                      </Text>

                      </Card.Content>
                      <Card.Actions>
                      </Card.Actions>
                    </View>
                    </View>
                    </Card>

                  )
              })}
            </Text>
            </View>
          )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    justifyContent: 'center',
    textAlign: 'center',
  },
  titleText: {
    padding: 8,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 23,
    color: '#000',
    marginTop: 15,
  },
  textStyleSmall: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    marginTop: 15,
  },
  buttonStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
    padding: 15,
    backgroundColor: '#8ad24e',
  },
  buttonTextStyle: {
    color: '#fff',
    textAlign: 'center',
  },
  customRatingBarStyle: {
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 30,
  },
  starImageStyle: {
    width: 40,
    height: 40,
    resizeMode: 'cover',
  },
});

export default MyReviews;
