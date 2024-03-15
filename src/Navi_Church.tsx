import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ChurchMain from "./Church/ChurchMain";
import ChurchInfoInput from "./Church/ChurchInfoInput";
import ChurchSearch from "./Church/ChurchSearch";
import ChurchSearchDetail from "./Church/ChurchSearchDetail";
import ChurchNoticeDetail from "./Church/ChurchNoticeDetail";
import ChurchNoticePost from "./Church/ChurchNoticePost";
import ChurchImageRevise from "./Church/ChurchImageRevise";

const Stack = createNativeStackNavigator();

function Navi_Church() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
     >
      <Stack.Screen name={'ChurchMain'} component={ChurchMain}/>
      <Stack.Screen name={'ChurchNoticeDetail'} component={ChurchNoticeDetail}/>
      <Stack.Screen name={'ChurchNoticePost'} component={ChurchNoticePost}/>
      <Stack.Screen name={'ChurchSearch'} component={ChurchSearch}/>
      <Stack.Screen name={'ChurchSearchDetail'} component={ChurchSearchDetail}/>
      <Stack.Screen name={'ChurchInfoInput'} component={ChurchInfoInput}/>
      <Stack.Screen name={'ChurchImageRevise'} component={ChurchImageRevise}/>
    </Stack.Navigator>
  );
}
export default Navi_Church;