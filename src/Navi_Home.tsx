import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import HomeMain from './Home/HomeMain';
import SuggestionBoard from "./Home/SuggestionBoard";

const Stack = createNativeStackNavigator();

function Navi_Home() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
     >
      <Stack.Screen name={'HomeMain'} component={HomeMain}/>
      <Stack.Screen name={'SuggestionBoard'} component={SuggestionBoard}/>
    </Stack.Navigator>
  );
}
export default Navi_Home;