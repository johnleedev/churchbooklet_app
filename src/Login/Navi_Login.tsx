import * as React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Platform } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Login from './Login';
import Logister from "./Logister";
import Logister3 from "./Logister3";
import Agree from './Agree';
import Result from './Result';
import Admin from './Admin';
import Logister2 from './Logister2';

const Stack = createNativeStackNavigator();

export default function Navi_Login() {
    return (
      <Stack.Navigator
        screenOptions={{headerShown: false, contentStyle: Platform.OS === 'android' ? styles.android : styles.ios }}
      >
        <Stack.Screen name={'Login'} component={Login}/>
        <Stack.Screen name={'Agree'} component={Agree}/>
        <Stack.Screen name={'Logister'} component={Logister}/>
        <Stack.Screen name={'Logister2'} component={Logister2}/>
        <Stack.Screen name={'Logister3'} component={Logister3}/>
        <Stack.Screen name={'Result'} component={Result}/>
        <Stack.Screen name={'Admin'} component={Admin}/>
      </Stack.Navigator>
    )
  }
  
const styles = StyleSheet.create({
  android: {
    backgroundColor: '#000',
  },
  ios : {
    backgroundColor: '#000',
    paddingTop: getStatusBarHeight()
  },
});
