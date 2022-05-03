import 'react-native-gesture-handler';
import React, {useState, useContext, useEffect} from 'react';
import { View, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Dimensions, Alert, Image } from 'react-native';
import * as firebase from 'firebase';
import 'firebase/firestore';
import 'firebase/auth';
import {styles} from './Styles/style'
import {IdContext, IdRestaurant} from './Context';
import { useRef } from "react";
import RBSheet from "react-native-raw-bottom-sheet";
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook';

const db = firebase.firestore();

const LoginApp = props => {

    const { width, height } = Dimensions.get('screen');
    const logInPic = (height / 2.5);
    const [Email, setEmail] = useState();
    const [Pass, setPass] = useState()
    const [idRest, setIdRest] = useContext(IdRestaurant)
    const [id, setId] = useContext(IdContext);

   const onSignIn = (googleUser) => {
      var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
        unsubscribe();
        // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          var credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
          );
          // Sign in with credential from the Google user.
          firebase.auth().signInWithCredential(credential)
          .then(() => {
            props.navigation.navigate('ChooseRole', {email: googleUser.user.email})
          })
        } else {
          db.collection('Clients').get().then(docUsers => {
            docUsers.docs.map(user => {
              if (user.data().email == googleUser.user.email) {
                setId(user.id);
                props.navigation.navigate('ClientNav');
              }
            })
          })
          db.collection('Restaurants').get().then(docUsers => {
            docUsers.docs.map(user => {
              if (user.data().email == googleUser.user.email) {
                setIdRest(user.id);
                props.navigation.navigate('RestNav');
              }
            })
          })
        }
      });
    }

    const isUserEqual = (googleUser, firebaseUser) => {
      if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
          if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
              providerData[i].email === googleUser.user.email) {
            // We don't need to reauth the Firebase connection.
            return true;
          }
        }
      }
      return false;
    }

    const signInWithFacebook = async() => {
      try {
        await Facebook.initializeAsync({
          appId: '850498482450069',
        });
        const {
          type,
          token,
          expirationDate,
          permissions,
          declinedPermissions,
        } = await Facebook.logInWithReadPermissionsAsync({
          permissions: ['public_profile', 'email'],
        });
        if (type === 'success') {
          const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`);
          const result = await response.json();
          var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
            unsubscribe();
          if (!FisUserEqual(result, firebaseUser)){
            var credential = firebase.auth.FacebookAuthProvider.credential(
              token
            );
            // Sign in with the credential from the Facebook user.
            firebase.auth().signInWithCredential(credential).then(() => {
              props.navigation.navigate('ChooseRole', {email: result.email})
            })
          } else {
            db.collection('Clients').get().then(docUsers => {
              docUsers.docs.map(user => {
                if (user.data().email == result.email) {
                  setId(user.id);
                  props.navigation.navigate('ClientNav');
                }
              })
            })
            db.collection('Restaurants').get().then(docUsers => {
              docUsers.docs.map(user => {
                if (user.data().email == result.email) {
                  setIdRest(user.id);
                  props.navigation.navigate('RestNav');
                }
              })
            })
          }
        })
        }
      } catch (error) {
          Alert.alert(error)
      }
    }

   
    
    const FisUserEqual = (facebookResponse, firebaseUser) => {
      if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
          if (providerData[i].providerId === firebase.auth.FacebookAuthProvider.PROVIDER_ID &&
              providerData[i].email === facebookResponse.email) {
            // We don't need to re-auth the Firebase connection.
            return true;
          }
        }
      }
      return false;
    }

    const signInWithGoogleAsync = async() => {
      try {
        const result = await Google.logInAsync({
          androidClientId: '483480006554-2q7nskjhke96cpbu48sg7qs7280bfg68.apps.googleusercontent.com',
          //iosClientId: YOUR_CLIENT_ID_HERE,
          scopes: ['profile', 'email'],
        });
        if (result.type === 'success') {
          onSignIn(result);
        } else {
          return { cancelled: true };
        }
      } catch (error) {
          Alert.alert(error)
      }      
    }

    const signIn = async() => {
      const ID = await getID(Email);
      if (ID == -1) {
        const IDRest = await getIDRest(Email);
      }
      firebase.auth()
      .signInWithEmailAndPassword(Email, Pass)
      .then(() => {
          db.collection('Clients').get().then(docUsers => {
            docUsers.docs.map(user => {
              if (user.data().email == Email) {
                setId(user.id);
                props.navigation.navigate('ClientNav');
              }
            })
          })
          db.collection('Restaurants').get().then(docUsers => {
            docUsers.docs.map(user => {
              if (user.data().email == Email) {
                setIdRest(user.id);
                props.navigation.navigate('RestNav');
              }
            })
          })
      })
      .catch(error => {
          if (error.code === 'auth/email-already-in-use') {
            Alert.alert('Invalid password')
          }
          if (error.code === 'auth/invalid-email') {
            Alert.alert('That email address is invalid')
          }
          if (error.code === 'auth/user-not-found') {
            Alert.alert('You are not registrated yet')
          }
          console.error(error);
      });
    }

    const getID = async (email) => {
      var x = -1;
      const a = await firebase.firestore().collection('Clients').get();
      const b = a.docs.map(doc => {
          const d = doc.data();
          if (d.Email == email){
            x = doc.id;
          }
        }); return x;
    }

    const getIDRest = async (email) => { 
      var x = -1;
      const a = await firebase.firestore().collection('Restaurants').get();
      const b = a.docs.map(doc => {
          const d = doc.data();
          if (d.Email == email){
            x = doc.id;
          }
        }); return x;
    }

    const createUser = async() => {

        firebase.auth()
        .createUserWithEmailAndPassword(Email, Pass)
        .then(() => {
            props.navigation.navigate('ChooseRole', {email: Email});
        })
        .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              Alert.alert('The email address is already in use')
            }

            if (error.code === 'auth/invalid-email') {
              Alert.alert('That email address is invalid')
            }

            console.error(error);
        });
    }

    const refRBSheetCreateUser = useRef();
    const refRBSheetSignIn = useRef();

    return(
      <View style={styles.container}>

      <Text style={{fontSize: 40}}>APPetito</Text>

      <Text style={styles.loginText}>Welcome to our app!</Text>
      <Text></Text>

      <View flexDirection="row">
      <TouchableOpacity  onPress={() => signInWithGoogleAsync()}>
        <Image style={{width: 65, height: 65}} source={require('./assets/IOS_Google_icon.png')}/>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => signInWithFacebook()}>
        <Image style={{width: 65, height: 65}} source={require('./assets/fb-icon-11.png')}/>
      </TouchableOpacity>

      </View>

      <TouchableOpacity  onPress={() =>refRBSheetSignIn.current.open()} style={styles.loginBtn}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity  onPress={() => refRBSheetCreateUser.current.open()} style={styles.loginBtn}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => props.navigation.navigate("ClientNav")}>
          <Text style={styles.skip}>Guest</Text>
      </TouchableOpacity>

      <Image style={{
      width: width/1.5,
      height: width/2.5,
      marginTop: 40}}
      source={require('./assets/login-concept-illustration.jpg')} />

      <RBSheet
        ref={refRBSheetCreateUser}
        height={height}
        width={width}
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{width: "100%", alignItems: "center", justifyContent: "center"}}>
                <View style={styles.loginFormVie}>
                <Text style={styles.logoText}>Sign Up</Text>
                  <TextInput placeholder="Email" placeholderColor="#c4c3cb"    onChangeText={text => setEmail(text)} style={styles.loginFormTextInput} />
                  <TextInput placeholder="Password" placeholderColor="#c4c3cb"   onChangeText={text => setPass(text)} style={styles.loginFormTextInput} secureTextEntry={true}/>

                  <View style={{ alignItems:"center" }}>
                  <TouchableOpacity   onPress={() => {refRBSheetCreateUser.current.close(); createUser()}} style={styles.loginBtn}>
                    <Text style={styles.buttonText}>Continue</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() =>refRBSheetCreateUser.current.close()}>
                  <Text style={styles.skip}>Back</Text>
                  </TouchableOpacity>
                  </View>

                </View>
              </View>
            </TouchableWithoutFeedback>
      </RBSheet>

      <RBSheet
        ref={refRBSheetSignIn}
        height={height}
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

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{width: "100%", alignItems: "center", justifyContent: "center"}}>
          <View style={styles.loginFormVie}>
          <Text style={styles.logoText}>Log in</Text>
            <TextInput placeholder="Email" placeholderColor="#c4c3cb"    onChangeText={text => setEmail(text)} style={styles.loginFormTextInput} />
            <TextInput placeholder="Password" placeholderColor="#c4c3cb"   onChangeText={text => setPass(text)} style={styles.loginFormTextInput} secureTextEntry={true}/>

            <View style={{ alignItems:"center" }}>
            <TouchableOpacity   onPress={() => {refRBSheetSignIn.current.close(); signIn()}} style={styles.loginBtn}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() =>refRBSheetSignIn.current.close()}>
            <Text style={styles.skip}>Back</Text>
            </TouchableOpacity>
            </View>

          </View>
        </View>
      </TouchableWithoutFeedback>

      </RBSheet>


      </View>

  );
}


export default LoginApp;
