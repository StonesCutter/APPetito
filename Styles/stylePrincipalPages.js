import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingTop:40,
    alignItems:"center",
    flex:1,
    backgroundColor: "#FFFFFF"

  },
  listItem:{
      height:60,
      alignItems:"center",
      flexDirection:"row",
  },
  title:{
      fontSize:18,
      marginLeft:20
  },
  header:{
    width:"100%",
    height:60,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    paddingHorizontal:20
  },
  bottom:{
    width:"100%",
    height:60,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    paddingHorizontal:20,
    marginTop: 100
  },
  profileImg:{
    width:80,
    height:80,
    borderRadius:40,
    marginTop:20
  },
  sidebarDivider:{
    height:1,
    width:"100%",
    backgroundColor:"lightgray",
    marginVertical:10
  },
  //----------
  button: {
    width: 91,
    height: 70,
    backgroundColor: "rgba(1,42,59,1)"
  },
  icon: {
    color: "rgba(255,255,255,1)",
    fontSize: 40,
    height: 43,
    width: 40,
    marginTop: 15,
    marginLeft: 26
  },
  button2: {
    width: 90,
    height: 70,
    backgroundColor: "rgba(1,42,59,1)"
  },
  icon2: {
    color: "rgba(255,255,255,1)",
    fontSize: 40,
    height: 45,
    width: 40,
    marginTop: 12,
    marginLeft: 25
  },
  button3: {
    top: 0,
    left: 0,
    width: 90,
    height: 70,
    position: "absolute",
    backgroundColor: "rgba(1,42,59,1)"
  },
  icon3: {
    color: "rgba(255,255,255,1)",
    fontSize: 40,
    height: 45,
    width: 40,
    marginTop: 13,
    marginLeft: 25
  },
  button4: {
    top: 0,
    left: 88,
    width: 91,
    height: 70,
    position: "absolute",
    backgroundColor: "rgba(1,42,59,1)"
  },
  icon4: {
    color: "rgba(255,255,255,1)",
    fontSize: 40,
    height: 43,
    width: 30,
    marginTop: 14,
    marginLeft: 30
  },
  bar1: {
    height: 43,
    width: 300,
    marginTop: 200,
    marginLeft: 10
  },
  button3Stack: {
    width: 179,
    height: 70
  },
  loginBtn:{
    width:"80%",
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
    color:"black"
  },
  buttonRow: {
    height: 70,
    flexDirection: "row"//,
    //marginTop: 300
  }
});
