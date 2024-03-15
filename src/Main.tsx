import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet, Platform, StatusBar } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import Navi_Home from './Navi_Home';
import Navi_Church from './Navi_Church';
import Navi_List from './Navi_List';
import Navi_MyPage from './Navi_MyPage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {checkNotifications, requestNotifications} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import axios from "axios";
import MainURL from "../MainURL";
import AsyncGetItem from './AsyncGetItem'
import { useRoute } from '@react-navigation/native';
import MainVersion from '../MainVersion';


const Tab = createBottomTabNavigator();

export default function Main (props : any) {
  
  const route : any = useRoute();
  
  // checkNotificationPermission
  checkNotifications().then(({status, settings}) => {
    if (status === 'denied' || status === 'blocked'){
      requestNotifications(['alert', 'sound']);
    } else if (status === 'granted') {
      return
    } else {
      return
    }
  })

  // AsyncGetData
  const asyncFetchData = async () => {
    try {
      const data = await AsyncGetItem();
      takeFireBaseToken(data?.userAccount);
      versionCheck(data?.userAccount);
    } catch (error) {
      console.error(error);
    }
  };
  
  // firebase notification 토큰 발급 후 저장
  async function takeFireBaseToken(account : string | null | undefined) {
    const token = await messaging().getToken();    // fcm 토큰 저장하기
    axios
      .post(`${MainURL}/notification/savefirebasetoken`, {
        token : token, userAccount: account
      })
      .then((res) => {return})
      .catch((error) => {
        console.log(error);
      });
  }

  // 앱실행시 버전 확인
  function versionCheck (account : string | null | undefined) {
    axios
    .post(`${MainURL}/appversioncheck`, {
      userAccount: account, version: MainVersion,
    })
    .then((res) => {return})
    .catch((error) => {
      console.log(error);
    });
  }

  // 앱실행시 접속수 증가시키기
  const appUseCount = () => {
    const currentTime = new Date();
    const currentDate = currentTime.toISOString().slice(0, 10);
    axios
      .post(`${MainURL}/appusecount`, {
        date : currentDate
      })
      .then((res) => {return})
      .catch((error) => {
        console.log(error);
      });
  }
     
  useEffect(()=>{
    asyncFetchData();
    appUseCount();
  }, []); 

  return (
    <Tab.Navigator 
      sceneContainerStyle = {Platform.OS === 'android' ? styles.android : styles.ios}
      screenOptions={{
        headerShown : false,
        tabBarStyle: Platform.OS === 'android' ? styles.barStyle_android : styles.barStyle_ios,
        tabBarLabelStyle: { fontSize: 14 },
        tabBarActiveTintColor : '#1B1B1B',
        tabBarInactiveTintColor : '#8B8B8B',
        unmountOnBlur: true
      }}
    >
      <Tab.Screen name="홈" component={Navi_Home}
        options={{
          tabBarIcon:({focused})=> 
          <Ionicons name="home" size={24} color={ focused ? "#000" : "#BDBDBD" }/>
        }}
      />
      <Tab.Screen  name='내교회' component={Navi_Church}
        options={{
          tabBarIcon:({focused})=> 
          <FontAwesome5 name="church" size={24} color={ focused ? "#000" : "#BDBDBD" }/>
        }}
      />
      <Tab.Screen name='교인목록' component={Navi_List}
        options={{
          tabBarIcon:({focused})=> 
          <Ionicons name="list" size={24} color={ focused ? "#000" : "#BDBDBD" }/>
        }}
      />
      <Tab.Screen name='프로필' component={Navi_MyPage}
        options={{
          tabBarIcon:({focused})=> 
          <Ionicons name="person" size={24} color={ focused ? "#000" : "#BDBDBD" }/>
        }}
      />
    </Tab.Navigator>
  );
}


const styles = StyleSheet.create({
  android: {
    backgroundColor: '#000',
  },
  ios : {
    backgroundColor: '#000',
    paddingTop: getStatusBarHeight()
  },
  barStyle_android: {
    height: 85,
    padding: 5,
    backgroundColor: '#fff',
    elevation: 3,
    borderTopColor: '#8C8C8C',
    borderTopWidth: 0.5,
    paddingBottom: 20
  },
  barStyle_ios : {
    height: 85,
    padding: 5,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    paddingBottom: 20
  }
});



