import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ListMain from "./List/ListMain";
import ListDetail from "./List/ListDetail";

const Stack = createNativeStackNavigator();

function Navi_List() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
     >
      <Stack.Screen name={'ListMain'} component={ListMain}/>
      <Stack.Screen name={'ListDetail'} component={ListDetail}/>
    </Stack.Navigator>
  );
}
export default Navi_List;