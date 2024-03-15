import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeMain from './Home/HomeMain';

const Stack = createNativeStackNavigator();

function Navi_Home() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
     >
      <Stack.Screen name={'HomeMain'} component={HomeMain}/>
    </Stack.Navigator>
  );
}
export default Navi_Home;