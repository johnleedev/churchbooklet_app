import React, { Component } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Notification from "./Notifi/Notification";
import NotificationSetting from "./Notifi/NotificationSetting";
import { StyleSheet, Platform } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Notice from "./Notifi/Notice";

const Stack = createNativeStackNavigator();

function Navi_Notifi() {
  return (
    <Stack.Navigator 
      screenOptions={{headerShown: false, contentStyle: Platform.OS === 'android' ? styles.android : styles.ios }}
    >
      <Stack.Screen name={'Notification'} component={Notification}/>
      <Stack.Screen name={'NotificationSetting'} component={NotificationSetting}/>
      <Stack.Screen name={'Notice'} component={Notice}/>
    </Stack.Navigator>
  );
}
export default Navi_Notifi;

const styles = StyleSheet.create({
  android: {
    backgroundColor: '#000',
  },
  ios : {
    backgroundColor: '#000',
    paddingTop: getStatusBarHeight()
  },
});