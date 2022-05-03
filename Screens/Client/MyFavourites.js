import React, {useContext, useState, useEffect} from 'react';
import {Text, View, ScrollView, Dimensions, Image, Alert } from 'react-native';
import {createStackNavigator} from '@react-navigation/stack'
import   {Feather}  from  "react-native-vector-icons";
import { IdContext, restNameContext } from '../../Context';
import * as firebase from 'firebase';
import 'firebase/firestore';
const db = firebase.firestore();
import { Button, Card, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import {styles} from '../../Styles/stylePrincipalPages';
const { width, height } = Dimensions.get('screen');

const MyFavourites = () => {
    const Stack = createStackNavigator();
    return(
        <Stack.Navigator initialRouteName="MyFavouritesPage">
          <Stack.Screen name="MyFavouritesPage"component={MyFavouritesPage}
            options={({navigation})=>({
              headerLeft:() =>(
                <Feather name='menu' size={25} style={{marginLeft:14}}
                color={'#F60875'}  onPress={()=>navigation.openDrawer()}></Feather>
              )
            })}/>
        </Stack.Navigator>
    )
}

const MyFavouritesPage = ({navigation, route}) => {
    const [id, setID] = useContext(IdContext);
    const [favorites, setFavorites] = useState([]);
    const [favoritesData, setFavoritesData] = useState([]);
    const [branch, setBranch] = useState([]);
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    const favHeight= (windowHeight/6)
    const [no, setNo] = useState(false);
    const [restContext, setRestContext] = useContext(restNameContext);

    useEffect(() => {
      if (id) {
        db.collection('Clients').doc(id.toString()).get().then(user => {
          if (user.data().FirstName == undefined) {
            Alert.alert(
              'You have to complete the registration first'
            ); navigation.navigate('UserNameSurname');
          } else if (user.data().ID_Type == undefined) {
            Alert.alert(
              'You have to complete the registration first'
            ); navigation.navigate('ChooseCategory');
          } else if (user.data().Photo == undefined) {
            Alert.alert(
              'You have to complete the registration first'
            ); navigation.navigate('UserProfilePicture');
          } else {
          query();}})
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

    useEffect(() => {
      setFavoritesData([]);
      setBranch([]);
      if (favorites.length==0){
        setNo(true);
      } else {
        setNo(false);
        setFavoritesData([]);
        favorites.map(link => {
          db.doc(link).get().then(data => {
            setFavoritesData(all => [...all, data.data()]);
            setBranch(br => [...br, link]);
          });
        });
      }
    }, [favorites]);

    const query = () => {
        setFavorites([]);
        setBranch([]);
        setFavoritesData([]);
        const clientDoc = db.doc('Clients/' + id.toString());
        return (
            clientDoc.onSnapshot((client) => {
              const fav = client.data().Favourites;
              if (fav) setFavorites(client.data().Favourites)
              else (setFavorites([]))
              //setFavorites(client.data().Favourites);
            })
        )
    }


    //TODO MEDIA VOTI DEL RISTORANTE, FOTO
    return (
        <ScrollView style={{backgroundColor: "white"}}>
          {no == true ? (
            <View style={{marginTop: 30, alignItems: "center"}}>
            <Text style={styles.loginText}>You have no favourites yet</Text>
            <Image style={{width:width/2, height: height/3, marginTop: height/6}} source={require('../../assets/lonely.jpg')} />
            </View>
          ) : (
            <View>
              <Text> {favoritesData && branch && favoritesData.map((fav, i) => {
                  return (
                    <Card style={{width: windowWidth}} onPress={() => {setRestContext(branch[i]); navigation.navigate('RestaurantPage')}}>
                      <View>
                        <View key={i}>

                          <Image style={{
                          width: windowWidth,
                          height: favHeight}}
                          source={{uri: fav.Photo}} />

                          <Card.Title title={fav.Name}
                            left={
                              () => {
                            let LeftContent = props => <Ionicons name="ios-heart" size={35} color={"red"} />
                              return <LeftContent/>
                            }}/>
                            <Card.Content>
                              <Paragraph>
                                <Text style={{fontWeight: "bold"}}> <Feather name="map-pin" size={17} color="black" />    {fav.Address} </Text>
                              </Paragraph>
                              <Paragraph>
                                <Text> <Feather name="instagram" size={20} color="black" />   {fav.LinkInstagram} </Text>
                              </Paragraph>
                            </Card.Content>
                            <Card.Actions>
                              <Button></Button>
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

export default MyFavourites;
