import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ChurchMain from "./Church/ChurchMain";
import ChurchNoticeDetail from "./Church/ChurchNoticeDetail";
import ChurchNoticePost from "./Church/ChurchNoticePost";
import ChurchImageRevise from "./Church/ChurchImageRevise";
import ChurchInfoInput from "./Church/ChurchInfoInput";
import ChurchProfileRevise from "./Church/ChurchProfileRevise";

const Stack = createNativeStackNavigator();

function Navi_Church() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
     >
      <Stack.Screen name={'ChurchMain'} component={ChurchMain}/>
      <Stack.Screen name={'ChurchNoticeDetail'} component={ChurchNoticeDetail}/>
      <Stack.Screen name={'ChurchNoticePost'} component={ChurchNoticePost}/>
      <Stack.Screen name={'ChurchImageRevise'} component={ChurchImageRevise}/>
      <Stack.Screen name={'ChurchProfileRevise'} component={ChurchProfileRevise}/>
      <Stack.Screen name={'ChurchInfoInput'} component={ChurchInfoInput}/>
    </Stack.Navigator>
  );
}
export default Navi_Church;