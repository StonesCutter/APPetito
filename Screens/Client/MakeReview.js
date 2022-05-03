import React, {useState, useContext, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, SafeAreaView, Image, ScrollView, Dimensions, TextInput, TouchableOpacity, Alert} from 'react-native'
import firebase from 'firebase';
import {styles} from '../../Styles/style'
import {IdContext, restNameContext} from '../../Context';
import RBSheet from "react-native-raw-bottom-sheet";
const db = firebase.firestore();
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import { AntDesign } from '@expo/vector-icons';

const MakeReview = props => {
    const [id, setId] = useContext(IdContext)
    const [restContext, setRestContext] = useContext(restNameContext);
    const [description, setDescription] = useState('');
    const refRBSheetMakeReview = useRef();
    const [defaultRating, setDefaultRating] = useState(2);
    const [count, setCount] = useState(0);
    const [sum, setSum] = useState(0);
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
    const starImageFilled ='https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_filled.png';
    const starImageCorner ='https://raw.githubusercontent.com/AboutReact/sampleresource/master/star_corner.png';


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
        })
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
    }, [])

    useEffect(() => {
      if (count && sum) {
        const avarage = parseInt(sum/count);
          db.doc(restContext).update({
            rate: avarage
          })
      }
    }, [count, sum])

    const push = async() => {
        var c = 0;
        var s = 0;
        const oldID = await getRevID();
        const newID = (oldID+1).toString();
        const rev = await db.doc(restContext).collection('Reviews').doc(newID);
        rev.set({
            ID_Client: parseInt(id),
            Description: description,
            Score: defaultRating
        })
        const totRev = await db.doc(restContext).collection('Reviews').get();
        await totRev.docs.map(rev => {
          const score = rev.data().Score;
          c = c+1;
          s = s + score;
          setCount(c);
          setSum(s);
        })
        props.navigation.navigate("MyReviews");
    }

    const getRevID = async() => {
        const snapshot = await db.doc(restContext).collection('Reviews').get();
        return snapshot.size;
    }

    const stars = () => {
      const CustomRatingBar = () => {
        return (
          <View style={style.customRatingBarStyle}>
            {maxRating.map((item, key) => {
              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  key={item}
                  onPress={() => setDefaultRating(item)}>
                  <Image
                    style={style.starImageStyle}
                    source={
                      item <= defaultRating
                        ? { uri: starImageFilled }
                        : { uri: starImageCorner }
                    }
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        );
      };
    
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.container}>
            <Text style={styles.textStyleSmall}>You can rate here</Text>
            <CustomRatingBar />
            <Text style={styles.textStyle}>
              {defaultRating} / {Math.max.apply(null, maxRating)}
            </Text>
          </View>
        </SafeAreaView>
      );
    };

    return (
        <ScrollView style={{ backgroundColor:"white"}}>
            <View style={styles.container}>
               <View style={{marginTop: "10%"}}>
                 <Text style={styles.loginText}> Write here your review </Text>
              </View>

                  <TextInput
                      style={{
                          height:200,
                          width:"80%",
                          color:"black",
                          textAlignVertical: "top",
                          backgroundColor:"#d9d9d9",
                          borderRadius:5,
                          padding:20,
                          marginTop: 30
                        }}
                      placeholder="Message...*"
                      placeholderTextColor="#003f5c"
                      onChangeText={text => setDescription(text)}
                      multiline={true}
                  />
                <Text> {stars()} </Text>
                <TouchableOpacity
                   onPress={() =>{
                    if (!description || description.length == 0) {
                      Alert.alert('You have to insert a description')
                    } else {
                      refRBSheetMakeReview.current.open()}}
                    }
                   style={styles.loginBtn}>
                  <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>



                <RBSheet
                  ref={refRBSheetMakeReview}
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
                <View style={styles.container}>
                <AntDesign name="checkcircle" size={100} color="green" />
                <Text style={{
                    fontSize:20,
                    fontWeight: "bold",
                    color:"green",
                    alignItems:"center",
                    textAlign: 'center',
                    marginTop: "10%"}}>Your review has been registrated!</Text>
                <TouchableOpacity
                   onPress={() => { push();}}
                   style={{
                     width:300,
                     backgroundColor:"green",
                     borderRadius:5,
                     height:50,
                     alignItems:"center",
                     justifyContent:"center",
                     marginTop:40,
                     marginBottom:10
                   }}>
                <Text style={styles.buttonText}>Continue</Text>
                </TouchableOpacity>
                </View>

                </RBSheet>

      </View>
</ScrollView>
    )
}

const style = StyleSheet.create({
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
    fontSize: 20,
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

export default MakeReview;
