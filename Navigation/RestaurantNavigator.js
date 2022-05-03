import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import InsertRestaurant from '../Screens/Registration/InsertRestaurantScreen'
import InsertEmailAddress from '../Screens/Registration/InsertEmailAddressScreen';
import OpeningDaysScreen from '../Screens/Registration/OpeningDaysScreen';
import InsertSocialsScreen from '../Screens/Registration/InsertSocialsScreen';
import InsertMenuScreen from '../Screens/Registration/InsertMenuScreen';
import ManageMenuScreen from '../Screens/Restaurant/ManageMenuRestaurant';
import PaymentMethodScreen from '../Screens/Registration/PaymentMethodScreen';
import InsertDishScreen from '../Screens/Registration/InsertDishScreen';
import ManageDishScreen from '../Screens/Restaurant/ManageDishScreen';
import RestaurantProfilePictureScreen from '../Screens/Registration/RestaurantProfilePictureScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer';
import SettingsScreen from '../Screens/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import RestaurantPage from '../Screens/Restaurant/RestaurantPage'
import ContactUs from '../Screens/ContactUsScreen';
import EmailFormat from '../Screens/EmailFormatScreen';
import ManageRestaurantPage from '../Screens/Restaurant/ManageRestaurantPage';
import ManageBookings from '../Screens/Restaurant/ManageBookings';
import ManagePhotoRest from '../Screens/Restaurant/ManagePhotoRest';
import ManageReview from '../Screens/Restaurant/ManageReviews';
import ManageAddr from '../Screens/Restaurant/ManageAddr';
import ManageOp from '../Screens/Restaurant/ManageOpeningHours';
import ManageLinks from '../Screens/Restaurant/ManageSocialLinks';
import ManagePaym from '../Screens/Restaurant/ManagePayments';
import FriendProfile from '../Screens/FriendProfile';
import StatScreen from '../Screens/StatsScreenRest';

const RestaurantNavigator = () => {
    const Stack = createStackNavigator(); 

    return(
        <Stack.Navigator initialRouteName="Skip">
          <Stack.Screen name="ManageOpeningHours"component={ManageOp}/>
          <Stack.Screen name="UserProfile"component={FriendProfile}/>
          <Stack.Screen name="ManagePaym"component={ManagePaym}/>
          <Stack.Screen name="ManageSocialLinks"component={ManageLinks}/>
          <Stack.Screen name="ManageAddr"component={ManageAddr}/>
          <Stack.Screen name="ManagePhotoRest"component={ManagePhotoRest}/>
          <Stack.Screen name="Email"component={InsertEmailAddress}/>
          <Stack.Screen name="ManageMenu"component={ManageMenuScreen} />
          <Stack.Screen name="Restaurant"component={InsertRestaurant} options={{headerShown: false}}/>
          <Stack.Screen name='Skip' component = {DrawerNavigator} options={{headerShown: false}}/>
          <Stack.Screen name="PaymentMethod"component={PaymentMethodScreen}/>
          <Stack.Screen name="OpeningDays"component={OpeningDaysScreen}/>
          <Stack.Screen name="InsertSocials"component={InsertSocialsScreen}/>
          <Stack.Screen name="InsertMenu"component={InsertMenuScreen}/>
          <Stack.Screen name="InsertDish"component={InsertDishScreen}/>
          <Stack.Screen name="ManageDish"component={ManageDishScreen}/>
          <Stack.Screen name="Settings"component={SettingsScreen}/>
          <Stack.Screen name="RestaurantProfilePicture"component={RestaurantProfilePictureScreen} />
          <Stack.Screen name="RestaurantPage"component={RestaurantPage} />
          <Stack.Screen name="EmailFormat"component={EmailFormat} />
          <Stack.Screen name="ManageRestaurant"component={ManageRestaurantPage} />
          <Stack.Screen name="ManageBookings"component={ManageBookings} />
        </Stack.Navigator>
    )
}

const TabNav = () => {
    const Tab = createBottomTabNavigator();
    return(
        <Tab.Navigator

        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
         let iconName;
         if (route.name === 'Menu') {
            iconName = focused
            ? 'ios-book'
            : 'ios-book';
          } else if (route.name === 'Reviews') {
            iconName = focused
            ? 'md-star'
            : 'md-star';
          }

          else if (route.name === 'Profile') {
            iconName = focused
            ? 'md-contact'
            : 'md-contact';
          }
          else if (route.name === 'Bookings') {
            iconName = focused
            ? 'md-calendar'
            : 'md-calendar';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
                  },
                })}
                tabBarOptions={{
                activeTintColor: 'tomato',
                inactiveTintColor: 'gray',
                }}

        initialRouteName="Profile">
          <Tab.Screen name="Profile"component={ManageRestaurantPage} />
          <Tab.Screen name="Bookings"component={ManageBookings}/>
          <Tab.Screen name="Reviews"component={ManageReview}/>
          <Tab.Screen name="Menu"component={ManageMenuScreen} />
        </Tab.Navigator>
    )
}

const DrawerNavigator = () => {
  const Drawer = createDrawerNavigator();
  return(
    <Drawer.Navigator>
    <Drawer.Screen name="HomeScreen"component={TabNav}/>
    <Drawer.Screen name="ContactUs"component={ContactUs}/>
    <Drawer.Screen name="Settings"component={SettingsScreen}/>
    <Drawer.Screen name="FutureDevelop" component={StatScreen}/>
  </Drawer.Navigator>
  )
}


export default RestaurantNavigator;
