import * as React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from './Login';
import Logister from "./Logister";
import Logister2 from "./Logister2";
import Agree from './Agree';
import Result from './Result';
import Admin from './Admin';

const Stack = createNativeStackNavigator();

export default function Navi_Login() {
    return (
      <Stack.Navigator
        screenOptions={{headerShown: false}}
      >
        <Stack.Screen name={'Login'} component={Login}/>
        <Stack.Screen name={'Agree'} component={Agree}/>
        <Stack.Screen name={'Logister'} component={Logister}/>
        <Stack.Screen name={'Logister2'} component={Logister2}/>
        <Stack.Screen name={'Result'} component={Result}/>
        <Stack.Screen name={'Admin'} component={Admin}/>
      </Stack.Navigator>
    )
  }
  

