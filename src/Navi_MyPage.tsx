import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { Component, useEffect, useCallback } from "react";
import MyPageMain from './MyPage/MyPageMain';
import Advertising from "./MyPage/Notice/Advertising";
import Policy from "./MyPage/Notice/Policy";
import Question from "./MyPage/Notice/Question";
import PersonInfo from "./MyPage/Notice/PersonInfo";
import DeleteAccount from "./MyPage/DeleteAccount";
import Report from "./MyPage/Notice/Report";
import BusinessInfo from "./MyPage/Notice/BusinessInfo";

const Stack = createNativeStackNavigator();

function Navi_MyPage() {
  return (
    <Stack.Navigator 
      screenOptions={{headerShown: false}}
    >
      <Stack.Screen name={'MyPageMain'} component={MyPageMain}/>
      <Stack.Screen name={'Question'} component={Question}/>
      <Stack.Screen name={'Advertising'} component={Advertising}/>
      <Stack.Screen name={'Policy'} component={Policy}/>
      <Stack.Screen name={'PersonInfo'} component={PersonInfo}/>
      <Stack.Screen name={'DeleteAccount'} component={DeleteAccount}/>
      <Stack.Screen name={'Report'} component={Report}/>
      <Stack.Screen name={'BusinessInfo'} component={BusinessInfo}/>
    </Stack.Navigator>
  );
}
export default Navi_MyPage;
