import 'react-native-gesture-handler';
import React, {useState} from 'react';
import './Firebase';
import { NavigationContainer } from '@react-navigation/native';
import 'firebase/firestore';
import ignoreWarnings from 'react-native-ignore-warnings';
import RestNav from './Navigation/RestaurantNavigator';
import {IdContext, restNameContext, IdRestaurant, IdFriend} from './Context';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './LoginAPIKEY'
import ChooseRole from './Screens/Registration/ChooseRoleScreen'
import ClientNav from './Navigation/ClientNavigation'

ignoreWarnings([
  'Setting a timer',
  'YellowBox has been replaced with LogBox. Please call LogBox.ignoreLogs() instead.',
  'Each child in a list',
  'componentWillReceiveProps has been renamed',
  'Can\'t perform a React'
]);

const Stack = createStackNavigator();

export default function App() {
  const [context, setContext] = useState();
  const [restContext, setRestContext] = useState();
  const [IdRestContext, setIdRestContext] = useState();
  const [Friend, setFriend] = useState();
    return (
      <IdContext.Provider value={[context, setContext]}>
        <restNameContext.Provider value={[restContext, setRestContext]}>
          <IdRestaurant.Provider value={[IdRestContext, setIdRestContext]}>
            <IdFriend.Provider value={[Friend, setFriend]}>
              <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                  <Stack.Screen name="Login" component={Login}/>
                  <Stack.Screen name="ChooseRole" component={ChooseRole} options={{headerShown: false}}/>
                  <Stack.Screen name="ClientNav" component={ClientNav} options={{headerShown: false}}/>
                  <Stack.Screen name="RestNav" component={RestNav} options={{headerShown: false}}/>
                </Stack.Navigator>
              </NavigationContainer>
            </IdFriend.Provider>            
          </IdRestaurant.Provider>
        </restNameContext.Provider>
      </IdContext.Provider>

    )
}
