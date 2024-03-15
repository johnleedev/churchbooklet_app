import * as React from "react";
import { KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PaperProvider } from 'react-native-paper';
import SplashLoading from "./SplashLoading";
import Main from "./src/Main";
import Navi_Login from './src/Login/Navi_Login'
import messaging from '@react-native-firebase/messaging';
import CodePush from "react-native-code-push";
import Toast, { BaseToast } from "react-native-toast-message";
import { AppRegistry } from 'react-native';
import Navi_Notifi from "./src/Navi_Notifi";
import { RecoilRoot } from "recoil";

const Stack = createNativeStackNavigator();

function App () {

  //FCM-background 알림 받기
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log(`${Platform.OS} [Background Message]`, remoteMessage);
  });
  AppRegistry.registerComponent('app', () => App);

  // react-native-toast-message 커스텀 디자인
  const toastConfig = {
    success: (props:any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#333' }}
        contentContainerStyle={{ padding: 15 }}
        text1Style={{
          fontSize: 14,
          fontWeight: '500',
          fontFamily: 'Pretendard-SemiBold'
        }}
        text2Style={{
          fontSize: 14,
          fontWeight: '400',
          fontFamily: 'Pretendard-SemiBold'
        }}
      />
    ),
  };


  return (
    <NavigationContainer>
      <RecoilRoot>
        <Stack.Navigator>
          <Stack.Screen name="SplashLoading" component={SplashLoading} options={{ headerShown: false }} />
          <Stack.Screen name="Navi_Main" component={Main} options={{ headerShown: false }} />
          <Stack.Screen name="Navi_Login" component={Navi_Login} options={{ headerShown: false }}/>
          <Stack.Screen name="Navi_Notifi" component={Navi_Notifi} options={{ headerShown: false }} />
          </Stack.Navigator>
        <Toast config={toastConfig}/>
      </RecoilRoot>
    </NavigationContainer>
  );

};

export default CodePush(App);