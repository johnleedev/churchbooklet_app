import React, { useState, useEffect } from 'react';
import { ImageBackground, Alert, Linking, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import MainURL from "./MainURL";
import NetInfo from "@react-native-community/netinfo";
import MainVersion from './MainVersion';

export default function SplashLoading (props: any) {

  const checkNet = () => {
    
    NetInfo.fetch().then(state => {
      if(state.isConnected) {
        // 인터넷이 연결되어 있는 경우
        fetchState();
      } else {
        // 인터넷이 연결되지 않는 경우
        Alert.alert('네트워크가 연결되어 있지 않습니다. 네트워크를 확인해주세요.');
      }
    });
  };

  const fetchState = () => {
    axios.get(`${MainURL}/getappstate`).then((res) => {
      let copy = res.data;
      if (copy[0].state === 'open') {
        const timer = setTimeout(() => {
          checkVersion(copy);
        }, 2000);
       return () => clearTimeout(timer);
      } else {
        Alert.alert(copy[0].notice);
      }
    });
  };

  const checkVersion = (data : any) => {
    if (data[1].notice === MainVersion || data[2].notice === MainVersion || data[3].notice === MainVersion) {
      checkToken();
    } else {
      Alert.alert(
          '앱 버전이 새롭게 업데이트 되었습니다. 업데이트 하시겠습니까?',
          '업데이트가 되지 않을 경우, 앱 사용에 제한이 있을 수 있습니다.',
          [
            { text: '무시', onPress: () => { checkToken() } },
            { text: '업데이트', onPress: ()=>{
              if (Platform.OS === 'ios') {
                Linking.openURL('https://apps.apple.com/kr/app/%EA%B5%90%ED%9A%8C%EC%88%98%EC%B2%A9/id6479247886');
              } else {
                Linking.openURL('https://play.google.com/store/apps/details?id=com.churchbooklet.app');
              }
            }},
          ]
        );
    }
  };

  const checkToken = () => {
    AsyncStorage.getItem('token').then((e)=>{
      // 토큰 검사하기
      {
        e === null ? 
        // 토큰이 없으면  
          props.navigation.replace("Navi_Login")
        : 
        // 토큰이 있으면 
        axios
          .post(`${MainURL}/login/verifytoken`, {  
            verifyToken : e
          })
          .then((res: any)=>{
            if (res.data.isUser === false) {
              Alert.alert('로그인이 다시 필요합니다.')
              props.navigation.replace("Navi_Login");
            } else if (res.data.isUser === true) {
              AsyncStorage.setItem('token', res.data.refreshToken);
              props.navigation.replace("Navi_Main");
            } else if (res.data === 'success') {
              props.navigation.replace("Navi_Main");
            }          
          }).catch((err : string)=>{
            console.log('verifyToken_Err', err);
            props.navigation.replace("Navi_Main");
          });
      }
    })
  }

  useEffect(() => {
   checkNet();
  }, []);


  return (
    <ImageBackground
      source={require("./src/images/mainsplash.png")}
      style={{width:"100%",height:"100%"}}>
    </ImageBackground>
  );

  
    
}