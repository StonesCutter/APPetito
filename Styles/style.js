import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skip:{
    fontWeight:"bold",
    fontSize:20,
    color:"#fb5b5a",
    marginTop: "3%"
  },
  inputView:{
    width:"80%",
    height:"40%",
    backgroundColor:"#d9d9d9",
    borderRadius:5,
    height:50,
    marginBottom:20,
    marginTop:20,
    justifyContent:"center",
    padding:20
  },
  inputSocialView:{
    width:"80%",
    height:"40%",
    backgroundColor:"#d9d9d9",
    borderRadius:5,
    height:50,
    marginBottom:20,
    marginTop:20,
    justifyContent:"center",
    padding:20,
    flexDirection: "row"
  },
  inputText:{
    height:50,
    color:"black",
    alignItems:"center",
    justifyContent:"center"
  },
  inputSocialText:{
    height:50,
    color:"white",
    alignItems:"center",
    justifyContent:"center",
    marginTop: -20,
    marginLeft: 20
  },
  loginBtn:{
    width:300,
    backgroundColor:"#fb5b5a",
    borderRadius:5,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },
  loginText:{
    fontSize:20,
    color:"black",
    alignItems:"center",
    textAlign: 'center'
  },
  buttonText:{
    fontSize:15,
    color:"white",
    alignItems:"center",
    textAlign: 'center'
  },
  checkBoxExternal: {
    marginBottom:20,
    marginTop:20,
    justifyContent:"center",
  },
  checkbox: {
  color:"white"
  },
  itemStyle: {
    padding: 10,
  },
  textInputStyle: {
    height: 40,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: '#009688',
    backgroundColor: '#FFFFFF',
  },
  containerBar: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    marginTop: "5%"
  },
  titleText: {
    padding: 8,
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headingText: {
    padding: 8,
  },
  containerScroll: {
   flex: 0.2,
   marginTop: 10
 },
 scrollView: {
   //backgroundColor: 'white',
   marginHorizontal: 20,
 },
 chooseDays: {
width:"100%",
 height:"40%",
 backgroundColor:"#d9d9d9",
 borderRadius:5,
 height:50,
 marginBottom:20,
 marginTop:20,
 marginLeft: "5%",
 justifyContent:"center",
 padding:20
},
containerColumns: {
  flex: 1,
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'flex-start', // if you want to fill rows left to right
  marginLeft: "10%",
  marginTop: "10%"
},
itemColumns: {
  width: '50%' // is 50% of container width
},
////////// upload styles
containerUpload: {
  flex: 1,
  alignItems: 'center',
  backgroundColor: 'white'
},
selectButton: {
  borderRadius: 5,
  width: 150,
  height: 50,
  backgroundColor: '#00cc99',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: "7%"
},
uploadButton: {
  borderRadius: 5,
  width: 150,
  height: 50,
  backgroundColor: '#ff1a1a',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: "-2%"
},
buttonText: {
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold'
},
imageContainer: {
  marginTop: 30,
  marginBottom: 50,
  alignItems: 'center',
  marginTop: 12
},
progressBarContainer: {
  marginTop: 20
},
imageBox: {
  width: 300,
  height: 300
},
/////// altro
loginScreenContainer: {
  flex: 1,
},
logoText: {
  fontSize: 30,
  fontWeight: "800",
  marginTop: 150,
  marginBottom: 30,
  textAlign: 'center',
},
loginFormView: {
  flex: 1
},
loginFormTextInput: {
  height: 43,
  fontSize: 14,
  borderRadius: 5,
  borderWidth: 1,
  borderColor: '#eaeaea',
  backgroundColor: '#fafafa',
  paddingLeft: 10,
  marginLeft: 15,
  marginRight: 15,
  marginTop: 5,
  marginBottom: 5,
}

});
