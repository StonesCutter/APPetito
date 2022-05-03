import * as firebase from 'firebase';
import 'firebase/storage';
import * as Progress from 'react-native-progress';
import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Image, View, Platform, Text, TouchableOpacity, Alert, Dimensions} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {styles} from '../../Styles/style'
import {IdRestaurant} from '../../Context';

const { width, height } = Dimensions.get('screen');


export default function RestaurantProfilePictureScreen(props) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);
  const [idRest, setIdRest] = useContext(IdRestaurant);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert(
        'You have to choose an image first'
      );
    } else {
      const uri = image;
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      setUploading(true);
      setTransferred(0);
      const response = await fetch(uploadUri)
      const blob = await response.blob()
      const task = firebase.storage()
        .ref(filename)
        .put(blob);
      // set progress state
      task.on('state_changed', snapshot => {
        setTransferred(
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 10000
        );
      });
      try {
        await task;
        firebase.storage().ref(filename).getDownloadURL().then((url)=>{
          firebase.firestore().collection('Restaurants').doc(idRest.toString()).collection('Branch').doc('1').update({
              Photo: url
            })
            props.navigation.goBack();
        })
      } catch (e) {
        console.error(e);
      }
      setUploading(false);
      Alert.alert(
        'Photo uploaded!',
        'Your photo has been uploaded to Firebase Cloud Storage!'
      );
      setImage(null);
      }
};

  return (
      <SafeAreaView style={styles.containerUpload}>
        <View style={{marginTop: "30%"}}>
          <Text style={styles.loginText}>Change your profile picture</Text>
        </View>
        <View style={{marginTop: "5%"}}>
        <TouchableOpacity style={styles.selectButton} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick an image</Text>
        </TouchableOpacity></View>
        <View style={styles.imageContainer}>
          {image !== null ? (
            <Image source={{ uri: image }} style={styles.imageBox} />
          ) : null}
          <Text> </Text>
          {uploading ? (
            <View style={styles.progressBarContainer}>
              <Progress.Bar progress={transferred} width={300} />
            </View>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={() => uploadImage()}>
              <Text style={styles.buttonText}>Upload image</Text>
            </TouchableOpacity>

          )}

          <Image style={{width:width/2, height: height/3.2, marginTop: height/7}} source={require('../../assets/RestaurantPic.png')} />
        </View>
      </SafeAreaView>
  );
}
