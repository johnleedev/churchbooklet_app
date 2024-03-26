import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, ScrollView, 
        Alert, Linking, KeyboardAvoidingView, Platform, RefreshControl, ImageBackground } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';


import { Typography } from '../Components/Typography';
import AsyncGetItem from '../AsyncGetItem'
import Swiper from 'react-native-swiper'
import MainImageURL from "../../MainImageURL";
import axios from 'axios';
import MainURL from "../../MainURL";
import {checkNotifications, requestNotifications} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import Toast from 'react-native-toast-message';
import { Divider } from '../Components/Divider';
import Clipboard from '@react-native-clipboard/clipboard';
import RegisterBoard from './RegisterBoard';


function HomeMain(props : any) {

  // 스크롤뷰 리프레쉬
  const [refresh, setRefresh] = useState<boolean>(false);

  // AsyncGetData
  const [asyncGetData, setAsyncGetData] = useState<any>({});
  const asyncFetchData = async () => {
    try {
      const data = await AsyncGetItem();
      setAsyncGetData(data);
    } catch (error) {
      console.error(error);
    }
  };

  const [advs, setAdvs] = useState<any>([]);
  const fetchPosts = async () => {
    axios.get(`${MainURL}/home/getadvertise`).then((res) => {
      let copy: any = [...res.data];
      copy.reverse();
      setAdvs(copy);
    });
   };
  
  useEffect(() => {
    asyncFetchData();
    fetchPosts();
  }, [refresh]);


  // 알림 허용 여부 확인
  const handleCheckNotifications = async () => {
    const check = await checkNotifications();
    if (check.status === 'denied' || check.status === 'blocked'){
      requestNotifications(['alert', 'sound']).then(()=>{
        if (check.status === 'denied' || check.status === 'blocked') {
          Alert.alert('알림을 허용해주세요', '', [
            { text: '취소', onPress: () => {return }},
            { text: '허용', onPress: () => Linking.openSettings() }
          ]);
        }
      })
    } else if (check.status === 'granted') {
      props.navigation.navigate("Navi_Notifi", {screen:"Notification", params: { userAccount: asyncGetData.userAccount }});
    } else {
      return
    }
  }  
  
  // background 상태일 때, 알림 받기
  useEffect(()=>{
    messaging().onNotificationOpenedApp(remoteMessage => {
      if (remoteMessage) {
        props.navigation.navigate("Navi_Home", {screen:"Notification"});
      }
    });;
  }, []); 

  // quit 상태일 때, 알림 받기
  useEffect(()=>{
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        props.navigation.navigate("Navi_Home", {screen:"Notification"});
      }
    });;
  }, []); 

  // forground 상태일 때, 알림 받기
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage) {
        Toast.show({
          type: 'success',
          text1: remoteMessage.notification?.title,
          text2: remoteMessage.notification?.body,
          onPress() {
            props.navigation.navigate("Navi_Home", {screen:"Notification"});
          }
        })
      }
    });;
    return unsubscribe
  }, []);

  return (
    <View style={styles.container}>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 100}
        style={{flex:1}}
      >
      <ScrollView 
        style={{flex:1}}
      >
        <View style={{height:250, backgroundColor:'#fff', padding:20}}>
          <View style={{width:'100%', height:70, flexDirection: 'row', justifyContent:'flex-end', marginBottom:5}}>
            <TouchableOpacity 
              hitSlop={{ top: 15, bottom: 15 }}
              onPress={handleCheckNotifications}
            >
              <AntDesign name="bells" size={24} color="#000" style={{width: 30, marginRight: 5}}/>
            </TouchableOpacity>
          </View>  
          <View style={{position:'absolute', top:50, left:20, zIndex:9}}>
            <Typography color='#000' fontSize={20} marginBottom={5} fontWeightIdx={1}>이제 보다 쉽고 편하게</Typography>
            <Typography color='#000' fontSize={20} marginBottom={10} fontWeightIdx={1}>교회수첩을 사용하세요</Typography>
          </View>
          <View style={{width:'100%', flexDirection: 'row', justifyContent:'flex-end', }}>
            <Image
              source={require("../images/mainimage.png")}
              style={{width:150,height:150, resizeMode:'contain'}}>
            </Image>
          </View>
        </View>

        <Divider height={5} />

        {/* 광고란 */}
        <Divider height={2} />
          <View style={styles.advBox}>
            <Swiper 
                showsPagination={true}
                paginationStyle={{bottom:0}}
            >
              {
                advs?.map((item:any, index:any)=>{
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={()=>Linking.openURL(item.url)}
                    >
                      <View style={styles.advslide}>
                        <Image style={styles.advimg} source={{uri: `${MainImageURL}/images/advertise/${item.imageName}`}} />
                      </View>
                    </TouchableOpacity>
                  )
                })
              }
            </Swiper>
          </View>

    
        <Divider height={5} />

        <View style={{padding:20, alignItems:'center'}}>
          <Typography fontSize={18} marginBottom={10} fontWeightIdx={1}>NOTICE</Typography>
          <View style={{width:'100%', padding:15, backgroundColor:'rgba(215, 111, 35, 0.10)', alignItems:'center', marginBottom:10}}>
            <Typography marginBottom={5}>교회수첩에 오신 여러분들을 환영합니다.</Typography>
            <Typography marginBottom={5}>앱이 시작되고 한번 꺼졌다가 다시 켜지는 것은</Typography>
            <Typography marginBottom={5}>오류가 아니라 자동 업데이트 되는 것입니다.</Typography>
            <Typography marginBottom={5}>그외 다른 불편하신 사항이 있으시면,</Typography>
            <Typography>아래 문의하기나 카카오채널을 이용해주세요.</Typography>
          </View>
          <TouchableOpacity
            style={{width:250, flexDirection:'row', justifyContent:'space-between', alignItems:'center', 
                      borderWidth:1, borderRadius:10, borderColor:'#EAEAEA', padding:10, marginBottom:10}}
            onPress={()=>{
              Linking.openURL("http://pf.kakao.com/_yUxmWG");
            }}
             >
            <View style={{width:30, alignItems:'center'}}>
              <Image
                source={require("../images/login/kakao.png")}
                style={{width:25, height:25, resizeMode:'contain'}}>
              </Image>
            </View>
            <Typography>카카오채널로 문의하기</Typography>
            <AntDesign name='right' size={16} color='#333'/>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={()=>{
              props.navigation.navigate('SuggestionBoard')
            }}
            style={{width:250, flexDirection:'row', justifyContent:'space-between', alignItems:'center', 
                    borderWidth:1, borderRadius:10, borderColor:'#EAEAEA', padding:10}}
             >
            <View style={{width:30, alignItems:'center'}}>
              <AntDesign name='filetext1' size={22} color='#333'/>
            </View>
            <Typography>문의하기 게시판</Typography>
            <AntDesign name='right' size={16} color='#333'/>
          </TouchableOpacity>
        </View>

        <Divider height={5} />
          <View style={{padding:20, alignItems:'center'}}>
            <Typography fontSize={18} marginBottom={10} fontWeightIdx={1}>교회수첩 사용설명서</Typography>
            
            <View style={{width:'100%', flexDirection:'row', justifyContent:'space-between', alignItems:'center'}}>
              <TouchableOpacity
                style={{width:'48%', justifyContent:'center', alignItems:'center', 
                          borderWidth:1, borderRadius:10, borderColor:'#EAEAEA', padding:10,}}
                onPress={()=>{
                  props.navigation.navigate("Navi_Notifi", {screen : "AppNoticePastor"})
                }}
                >
                <Typography>담당 목회자용</Typography>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={()=>{
                  props.navigation.navigate("Navi_Notifi", {screen : "AppNotice"})
                }}
                style={{width:'48%', justifyContent:'center', alignItems:'center', 
                        borderWidth:1, borderRadius:10, borderColor:'#EAEAEA', padding:10}}
                >
                <Typography>일반성도용</Typography>
              </TouchableOpacity>
            </View>
          </View>

        <Divider height={5} />

        {/* 새로등록된교회 */}
        <RegisterBoard navigation={props.navigation}/>

        <Divider height={5} />

        <View style={{padding:20, marginBottom:20}}>
          <View style={{padding:15, backgroundColor:'rgba(215, 111, 35, 0.10)', alignItems:'center'}}>
            <Typography marginBottom={10}>교회수첩 후원계좌</Typography>
            <Typography>676301-04-297651 국민은행 이요한</Typography>
          </View>
        </View>      
    
      </ScrollView>
      </KeyboardAvoidingView>
     
    </View> 
   );
}
export default HomeMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding:20
  },
  topmenu: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  mainlogo: {
    width: 100,
    height: 50,
    resizeMode:'contain',
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    height: 30,
    margin: 12,
    borderWidth: 1,
    padding: 5,
    borderRadius: 5
  },
  noticeBox : {
    height: 270,
    paddingVertical: 20,
  },
  slide: {
    alignItems: 'center',
  },
  img: {
    width: 320,
    height: 210,
    resizeMode:'contain',
  },
  advBox : {
    height: 95,
  },
  advslide: {
    alignItems: 'center',
  },
  advimg: {
    height: '100%',
    width: '100%',
    resizeMode:'contain',
  },
  button: {
    borderWidth:1,
    borderColor: '#8C8C8C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
});

const contents = StyleSheet.create({
  box: {
    width: '95%',
    backgroundColor: '#fff',
    marginVertical : 10,
    padding: 15
  },
  titlebox: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 35,
    height: 60,
    color: 'black'
  },
  title2: {
    fontSize: 18,
    letterSpacing: -0.3
  },
  imgbox: {
    height: 500,
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    flex: 1,
    width: '100%',
    resizeMode: "cover",
    overflow: 'hidden',
    borderRadius : 10
  },
  contentBox: {
    backgroundColor: '#fff'
  },
  contentTitleBox : {
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

