import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { StyleSheet, Platform } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import ChurchSearchMain from "./ChurchSearch/ChurchSearchMain";
import ChurchSearchDetail from "./ChurchSearch/ChurchSearchDetail";

const Stack = createNativeStackNavigator();

function Navi_ChurchSearch() {
  return (
    <Stack.Navigator
    screenOptions={{headerShown: false, contentStyle: Platform.OS === 'android' ? styles.android : styles.ios }}
     >
      <Stack.Screen name={'ChurchSearchMain'} component={ChurchSearchMain}/>
      <Stack.Screen name={'ChurchSearchDetail'} component={ChurchSearchDetail}/>
    </Stack.Navigator>
  );
}
export default Navi_ChurchSearch;

const styles = StyleSheet.create({
  android: {
    backgroundColor: '#000',
  },
  ios : {
    backgroundColor: '#000',
    paddingTop: getStatusBarHeight()
  },
});